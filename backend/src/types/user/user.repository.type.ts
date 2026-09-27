import { CreateUserInput, UpdateUserInput, User } from '@/types/user/user.type'

export interface IUserRepository {
  findAll: () => Promise<User[]>
  findById: (id: string) => Promise<User | null>
  findByEmail: (email: string) => Promise<User | null>
  create: (input: CreateUserInput) => Promise<User>
  update: (id: string, input: UpdateUserInput) => Promise<User>
  updateAvatar: (id: string, file: Blob) => Promise<User>
  softDelete: (id: string) => Promise<void>
}
