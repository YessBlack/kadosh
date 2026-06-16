export interface User {
  id: string
  name: string
  email: string
  createdAt: string
  updatedAt: string
  avatar: string
  isActive: boolean
}

export interface LoginData {
  email: string
  password: string
}
