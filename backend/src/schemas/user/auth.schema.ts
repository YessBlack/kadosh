import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email' }),
  password: z.string().min(8, { message: 'Minimum 8 characters' })
})

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(8),
  newPassword: z.string().min(8),
  newPasswordConfirm: z.string().min(8)
}).refine(data => data.newPassword === data.newPasswordConfirm, {
  message: 'Passwords do not match',
  path: ['newPasswordConfirm']
})

export const validateChangePassword = (data: unknown) => changePasswordSchema.safeParse(data)

export const validateLogin = (data: unknown) => {
  return loginSchema.safeParse(data)
}
