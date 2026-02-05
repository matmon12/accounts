<template>
  <div class="accounts">
    <div class="accounts__header">
      <h1 class="accounts-title">Учетные записи</h1>
      <Button
        label="Добавить"
        icon="pi pi-plus"
        class="accounts__header-btn"
        @click="accountsStore.addAccount"
      />
    </div>

    <div class="hint">
      <i class="pi pi-question-circle hint-icon" />
      <span class="hint-text">
        Для указания нескольких меток для одной пары логин/пароль используйте
        разделитель ;
      </span>
    </div>

    <div class="accounts__table-container">
      <table class="accounts__table">
        <thead>
          <tr>
            <th>Метки</th>
            <th>Тип записи</th>
            <th>Логин</th>
            <th v-if="passwordVisible">Пароль</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="accounts.length === 0">
            <td colspan="5">
              <div class="empty">
                <img
                  src="@/assets/images/empty.svg"
                  alt="empty"
                  class="empty-image"
                />
                <p class="empty-text">
                  Нет учетных записей. Нажмите кнопку "+" для добавления.
                </p>
              </div>
            </td>
          </tr>
          <template v-else>
            <tr
              v-for="account in accounts"
              :key="account.id"
              class="account__table-row"
            >
              <td>
                <InputText
                  v-model="account.label"
                  :maxlength="50"
                  placeholder="Введите метки через ;"
                  fluid
                  :invalid="errors.get(account.id)?.label"
                  @blur="accountsStore.saveAccount(account.id)"
                />
              </td>
              <td>
                <Select
                  v-model="account.type"
                  :options="accountTypes"
                  option-label="label"
                  option-value="value"
                  placeholder="Выберите тип"
                  fluid
                  @change="handleTypeChange(account.id)"
                />
              </td>
              <td :colspan="account.type === 'Локальная' ? 1 : 2">
                <InputText
                  v-model="account.login"
                  :maxlength="100"
                  placeholder="Введите логин"
                  fluid
                  :invalid="errors.get(account.id)?.login"
                  @blur="accountsStore.saveAccount(account.id)"
                />
              </td>
              <td v-if="account.type === 'Локальная'">
                <Password
                  v-model="account.password"
                  :maxlength="100"
                  placeholder="Введите пароль"
                  :feedback="false"
                  toggle-mask
                  fluid
                  :invalid="errors.get(account.id)?.password"
                  @blur="accountsStore.saveAccount(account.id)"
                />
              </td>
              <td class="actions-cell">
                <Button
                  icon="pi pi-trash"
                  severity="danger"
                  text
                  rounded
                  class="actions-btn"
                  @click="accountsStore.removeAccount(account.id)"
                />
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAccountsStore } from '@/stores/accounts'
import { storeToRefs } from 'pinia'

const accountsStore = useAccountsStore()
const { accounts, errors } = storeToRefs(accountsStore)

const accountTypes = ref([
  { label: 'Локальная', value: 'Локальная' },
  { label: 'LDAP', value: 'LDAP' },
])

const passwordVisible = computed(() =>
  accounts.value.some((a) => a.type === 'Локальная'),
)

const handleTypeChange = (id: string) => {
  const account = accounts.value.find((a) => a.id === id)
  if (account) {
    // При смене типа на LDAP очищаем пароль и ошибку
    if (account.type === 'LDAP') {
      account.password = null

      const errorsAccount = errors.value.get(id)
      if (errorsAccount) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...restErrors } = errorsAccount
        if (Object.keys(restErrors).length > 0) {
          errors.value.set(id, restErrors)
        } else {
          errors.value.delete(id)
        }
      }
    }
  }
  accountsStore.saveAccount(id)
}

onMounted(() => {
  accountsStore.getAccounts()
})
</script>

<style scoped lang="scss">
.accounts {
  max-width: 900px;
  margin: 0 auto;
}
.accounts__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  gap: 20px;
}
.accounts-title {
  font-size: 28px;
  font-weight: 600;
}
.hint {
  background-color: var(--neutral-800);
  padding: 10px 15px;
  border-radius: var(--border-radius-lg);
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
}

.hint-icon {
  color: var(--violet-400);
  font-size: 24px;
}
.hint-text {
}
.accounts__table-container {
  background-color: var(--neutral-900);
  border-radius: var(--border-radius-lg);
  border: 1px solid var(--neutral-800);
  overflow: hidden;
  padding: 5px;
  display: flex;
}

.accounts__table {
  border-collapse: collapse;
  max-width: 100%;
  flex: 1;
  table-layout: fixed;

  th {
    padding: 10px 15px;
    font-weight: 400;
    text-align: start;
    color: var(--neutral-400);
  }

  td {
    padding: 7px 7px;

    &.actions-cell {
      width: 45px;
      padding: 0;
      text-align: center;
    }
  }
}

.account__table-row {
}

.empty {
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: center;
  padding: 10px 0;

  &-image {
    width: 200px;
  }

  &-text {
    font-size: 16px;
    color: var(--neutral-400);
  }
}
</style>
