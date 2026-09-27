import { createUserSchema, updateUserSchema } from '@/schemas/user/user.schema'
import { Role } from '@/types/user/permissions/role.type'
import { z } from 'zod'

export type User = {
  id: string
  email: string
  name: string
  lastname: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  createdBy: string
  avatar: string
  isDeleted: boolean
  phone?: string
  lastLogin?: string
  role: Role
}

// request DTO
export type CreateUserInput = z.infer<typeof createUserSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>
