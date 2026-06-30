export type User = {
  id: string
  email: string
  name: string
  lastname: string
  avatar?: string
  isActive: boolean
  createdBy: string
  lastLogin: string
  phone?: string
  readonly createdAt: string
  readonly updatedAt: string
}

export interface LoginData {
  email: string
  password: string
}

export interface ChangePasswordData {
  currentPassword: string
  newPassword: string
  newPasswordConfirm: string
}
