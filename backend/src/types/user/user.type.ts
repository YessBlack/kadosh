import { createUserSchema, updateUserSchema } from '@/schemas/user/user.schema'
import { z } from 'zod'

export type User = {
  id: string
  email: string
  name: string
  lastname: string
  avatar?: string
}

export type CreateUserInput = z.infer<typeof createUserSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>

export interface IUserModel {
  getAll: () => Promise<User[]>
  getById: (id: string) => Promise<User | null>
  create: (input: CreateUserInput) => Promise<User>
  update: (id: string, input: UpdateUserInput) => Promise<User>
  delete: (id: string) => Promise<void>
}
