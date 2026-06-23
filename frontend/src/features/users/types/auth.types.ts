export type User = {
  id: string
  email: string
  name: string
  lastname: string
  avatar?: string
  isActive: boolean
  createdBy: string
  readonly createdAt: string
  readonly updatedAt: string
}

export interface LoginData {
  email: string
  password: string
}
