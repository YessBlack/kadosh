import { AuthResponse, LoginInput } from '@/types/user/auth.type'
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
    } catch (error) {
      console.log(error)
      throw new Error('Login failed')
    }
  }

  async logout (): Promise<void> {
    pb.authStore.clear()
  }
}
