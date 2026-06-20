import { IAuthModel } from '@/types/user/auth.type'
import { IUserModel } from '@/types/user/user.type'

export interface AppDependencies {
  authModel: IAuthModel,
  userModel: IUserModel
}
