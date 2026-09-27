import { IUserRepository } from '@/types/user/user/user.repository.type'
import { IUserService } from '@/types/user/user/user.service.type'
import { User, CreateUserInput, UpdateUserInput } from '@/types/user/user/user.type'
import { AppError } from '@/utils/app-error'
import { MAX_AVATAR_SIZE_BYTES } from '@/config/upload'

const ALLOWED_AVATAR_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_AVATAR_SIZE_MB = MAX_AVATAR_SIZE_BYTES / (1024 * 1024)

export class UserService implements IUserService {
  private readonly repo: IUserRepository

  constructor (repo: IUserRepository) {
    this.repo = repo
  }

  async getAll (): Promise<User[]> {
    return this.repo.findAll()
  }

  async getById (id: string): Promise<User> {
    const user = await this.repo.findById(id)

    if (!user || user.isDeleted) {
      throw new AppError('USER_NOT_FOUND', 'User not found')
    }

    return user
  }

  async create (input: CreateUserInput): Promise<User> {
    const existing = await this.repo.findByEmail(input.email)

    if (existing) {
      throw new AppError('USER_ALREADY_EXISTS', 'User already exists')
    }

    return this.repo.create(input)
  }

  async update (id: string, input: UpdateUserInput): Promise<User> {
    return this.repo.update(id, input)
  }

  async updateAvatar (id: string, file: Blob, fileName: string): Promise<User> {
    if (!ALLOWED_AVATAR_TYPES.includes(file.type)) {
      throw new AppError('INVALID_FILE_TYPE', 'Invalid file type')
    }
    if (file.size > MAX_AVATAR_SIZE_BYTES) {
      throw new AppError('FILE_TOO_LARGE', `La imagen supera el límite de ${MAX_AVATAR_SIZE_MB} MB`)
    }

    return this.repo.updateAvatar(id, file, fileName)
  }

  async delete (id: string): Promise<void> {
    await this.repo.delete(id)
  }
}
