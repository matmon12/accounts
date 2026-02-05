export type AccountType = 'LDAP' | 'Локальная'

export interface AccountLabel {
  text: string
}

export interface AccountForm {
  id: string
  label: string
  type: AccountType | null
  login: string
  password: string | null
}

export interface Account {
  id: string
  labels: AccountLabel[]
  type: AccountType | null
  login: string
  password: string | null
}

export interface AccountErrors {
  label?: boolean
  login?: boolean
  password?: boolean
}
