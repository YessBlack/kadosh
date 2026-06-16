import { AuthResponse, LoginInput } from '@/types/user/auth.type'
import { isPocketBaseError } from '@/utils/pocketbase.error'
import PocketBase from 'pocketbase'

const pb = new PocketBase(process.env.POCKETBASE_URL)

export class AuthModel {
  async login ({ email, password }: LoginInput): Promise<AuthResponse> {
    try {
      const result = await pb
        .collection('users')
        .authWithPassword(email, password)

      return {
        token: result.token,
        user: {
          id: result.record.id,
          email: result.record.email,
          name: result.record.name
        }
      }
    } catch (error: unknown) {
      if (isPocketBaseError(error) && error.status === 400) {
        throw new Error('Invalid credentials')
      }
      throw new Error('Server error')
    }
  }

  async logout (): Promise<void> {
    pb.authStore.clear()
  }

  async me (token: string): Promise<AuthResponse> {
    try {
      pb.authStore.save(token, null)

      const result = await pb.collection('users').authRefresh()

      return {
        token: result.token,
        user: {
          id: result.record.id,
          email: result.record.email,
          name: result.record.name
        }
      }
    } catch (error: unknown) {
      if (isPocketBaseError(error) && error.status === 401) {
        throw new Error('Invalid session')
      }
      throw new Error('Server error')
    }
  }
}
