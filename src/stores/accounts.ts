import type { Account, AccountErrors, AccountForm } from '@/types/account'
import { defineStore } from 'pinia'

export const useAccountsStore = defineStore('accounts', () => {
  const accounts = ref<AccountForm[]>([])
  const errors = ref<Map<string, AccountErrors>>(new Map())

  const addAccount = () => {
    const newAccount: AccountForm = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      label: '',
      type: null,
      login: '',
      password: '',
    }
    accounts.value.push(newAccount)
  }

  const getAccounts = () => {
    const savedAccounts: Account[] = JSON.parse(
      localStorage.getItem('accounts') || '[]',
    )
    // Преобразуем Account[] в AccountForm[]
    accounts.value = savedAccounts.map(({ labels, ...a }) => ({
      ...a,
      label: labels.length > 0 ? labels.map((l) => l.text).join(';') : '',
    }))
  }

  const removeAccount = (id: string) => {
    accounts.value = accounts.value.filter((a) => a.id !== id)
    saveToStorage(id)
  }

  // сохранение в localStorage
  function saveToStorage(id: string, account?: Account): void {
    const savedAccounts: Account[] = JSON.parse(
      localStorage.getItem('accounts') || '[]',
    )

    if (!account) {
      // удаление
      const index = savedAccounts.findIndex((a) => a.id === id)
      if (index !== -1) savedAccounts.splice(index, 1)
    } else {
      // обновление / добавление
      const index = savedAccounts.findIndex((a) => a.id === account.id)
      if (index !== -1) {
        savedAccounts[index] = account
      } else {
        savedAccounts.push(account)
      }
    }

    localStorage.setItem('accounts', JSON.stringify(savedAccounts))
  }

  const saveAccount = (id: string) => {
    const account = accounts.value.find((a) => a.id === id)
    if (!account) return

    const errors = validate(account)
    if (Object.keys(errors).length) return

    const savedAccount: Account = {
      id: account.id,
      labels: [],
      type: account.type,
      login: account.login,
      // Для LDAP пароль должен быть null, для Локальная - сохраняем значение
      password: account.type === 'LDAP' ? null : account.password,
    }

    // Преобразуем метку в массив объектов
    if (account.label.trim() !== '') {
      savedAccount.labels = account.label
        .split(';')
        .map((text) => text.trim())
        .filter((text) => text !== '')
        .map((text) => ({ text }))
    }

    saveToStorage(id, savedAccount)
  }

  const validate = (account: AccountForm): AccountErrors => {
    const errorsAccount: AccountErrors = {}

    // валидация логина
    if (account.login.trim() === '' || account.login.length > 100) {
      errorsAccount.login = true
    }

    // валидация пароля
    if (account.type === 'Локальная') {
      if (
        !account.password ||
        account.password.trim() === '' ||
        account.password.length > 100
      ) {
        errorsAccount.password = true
      }
    }

    // валидация метки
    if (account.label.length > 50) {
      errorsAccount.label = true
    }

    // запись ошибок
    if (Object.keys(errorsAccount).length) {
      errors.value.set(account.id, errorsAccount)
    } else {
      errors.value.delete(account.id)
    }

    return errorsAccount
  }

  return {
    getAccounts,
    accounts,
    errors,
    addAccount,
    removeAccount,
    saveAccount,
    validate,
  }
})
