import PocketBase, { RecordModel } from 'pocketbase'
import { CreateUserInput, User, UpdateUserInput } from '@/types/user/user.type'
import { isPocketBaseError } from '@/utils/pocketbase.error'

const pb = new PocketBase(process.env.POCKETBASE_URL)

export class UserModel {
  private toUser (record: RecordModel): User {
    return {
      id: record.id,
      email: record.email,
      name: record.name,
      lastname: record.lastname,
      avatar: pb.files.getURL(record, record.avatar),
      isActive: record.isActive,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      createdBy: record.createdBy,
      isDeleted: record.isDeleted
    }
  }

  async getAll (): Promise<User[]> {
    try {
      const result = await pb.collection('users').getFullList({
        filter: 'isDeleted=false'
      })
      return result.map((record) => this.toUser(record))
    } catch (error) {
      throw new Error('Server error')
    }
  }

  async getById (id: string): Promise<User> {
    try {
      const record = await pb.collection('users').getOne(id)
      if (!record || record.isDeleted) {
        throw new Error('User not found')
      }

      return this.toUser(record)
    } catch (error: unknown) {
      if (isPocketBaseError(error) && error.status === 404) {
        throw new Error('User not found')
      }
      throw new Error('Server error')
    }
  }

  async create (input: CreateUserInput): Promise<User> {
    try {
      const existing = await pb
        .collection('users')
        .getFirstListItem(`email="${input.email}"`)
        .catch(() => null)

      if (existing) {
        throw new Error('User already exists')
      }

      const result = await pb.collection('users').create({
        ...input,
        emailVisibility: true,
        avatar: '',
        isDeleted: false
      })

      return this.toUser(result)
    } catch (error: unknown) {
      if (error instanceof Error && error.message === 'User already exists') {
        throw error
      }
      throw new Error('Server error')
    }
  }

  async update (id: string, input: UpdateUserInput): Promise<User> {
    try {
      const result = await pb.collection('users').update(id, input)
      return this.toUser(result)
    } catch (error: unknown) {
      if (isPocketBaseError(error) && error.status === 404) {
        throw new Error('User not found')
      }
      throw new Error('Server error')
    }
  }

  async updateAvatar (id: string, file: Blob): Promise<User> {
    const formData = new FormData()
    formData.append('avatar', file)

    const record = await pb.collection('users').update(id, formData)
    return this.toUser(record)
  }

  async delete (id: string): Promise<void> {
    try {
      await pb.collection('users').update(id, { isDeleted: true })
    } catch (error: unknown) {
      if (isPocketBaseError(error) && error.status === 404) {
        throw new Error('User not found')
      }
      throw new Error('Server error')
    }
  }
}
