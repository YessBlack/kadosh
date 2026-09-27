import { User, CreateUserInput, UpdateUserInput } from '@/types/user/user/user.type'

export interface IUserService {
  getAll: () => Promise<User[]>
  getById: (id: string) => Promise<User>
  create: (input: CreateUserInput) => Promise<User>
  update: (id: string, input: UpdateUserInput) => Promise<User>
  updateAvatar: (id: string, file: Blob) => Promise<User>
  delete: (id: string) => Promise<void>
}
