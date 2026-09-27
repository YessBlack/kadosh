import { CreateUserInput, UpdateUserInput, User } from '@/types/user/user/user.type'

export interface IUserRepository {
  findAll: () => Promise<User[]>
  findById: (id: string) => Promise<User | null>
  findByEmail: (email: string) => Promise<User | null>
  create: (input: CreateUserInput) => Promise<User>
  update: (id: string, input: UpdateUserInput) => Promise<User>
  updateAvatar: (id: string, file: Blob, fileName: string) => Promise<User>
  delete: (id: string) => Promise<void>
}
