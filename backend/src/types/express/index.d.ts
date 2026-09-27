import { User } from '@/types/user/user/user.type'

declare global {
  namespace Express {
    interface Request {
      user?: User
    }
  }
}
