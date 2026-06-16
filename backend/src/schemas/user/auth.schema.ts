import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email' }),
  password: z.string().min(8, { message: 'Minimum 8 characters' })
})

export const validateLogin = (data: unknown) => {
  return loginSchema.safeParse(data)
}
