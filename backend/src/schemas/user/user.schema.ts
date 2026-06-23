import { z } from 'zod'

const baseUserSchema = z.object({
  email: z.string().email({ message: 'Invalid email' }),
  name: z.string().min(1, { message: 'Name is required' }),
  lastname: z.string().min(1, { message: 'Lastname is required' }),
  avatar: z.string().optional(),
  isActive: z.boolean().optional()
})

export const createUserSchema = baseUserSchema.extend({
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
  passwordConfirm: z.string().min(8),
  isActive: z.boolean().optional().default(true)
}).refine(data => data.password === data.passwordConfirm, {
  message: 'Passwords do not match',
  path: ['passwordConfirm']
})

export const updateUserSchema = baseUserSchema.omit({ email: true }).partial()

export const validateCreateUser = (data: unknown) => createUserSchema.safeParse(data)
export const validateUpdateUser = (data: unknown) => updateUserSchema.safeParse(data)
