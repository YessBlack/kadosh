import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email({ message: 'Email inválido' }),
  password: z.string().min(8, { message: 'Mínimo 8 caracteres' })
})

export const validateLogin = (data: unknown) => {
  return loginSchema.safeParse(data)
}
