import { ROLES } from '@/types/user/permissions/role.type'
import { z } from 'zod'

const roleEnum = z.enum([ROLES.ADMIN, ROLES.VENDEDOR, ROLES.INVENTARIO])

const userEmailSchema = z.string().email({ message: 'Invalid email' }).refine(
  email => !email.toLowerCase().endsWith('@deleted.invalid'),
  { message: 'This email domain is reserved' }
)

const baseUserSchema = z.object({
  email: userEmailSchema,
  name: z.string().min(1, { message: 'Name is required' }),
  lastname: z.string().min(1, { message: 'Lastname is required' }),
  avatar: z.string().optional(),
  isActive: z.boolean().optional(),
  phone: z.string().optional()
})

export const createUserSchema = baseUserSchema.extend({
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
  passwordConfirm: z.string().min(8),
  isActive: z.boolean().optional().default(true),
  role: roleEnum
}).refine(data => data.password === data.passwordConfirm, {
  message: 'Passwords do not match',
  path: ['passwordConfirm']
})

export const updateUserSchema = baseUserSchema
  .extend({ role: roleEnum })
  .omit({ email: true })
  .partial()

export const validateCreateUser = (data: unknown) => createUserSchema.safeParse(data)
export const validateUpdateUser = (data: unknown) => updateUserSchema.safeParse(data)
