import { z } from 'zod'

export const businessSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  nit: z.string().min(1, { message: 'NIT is required' }),
  companyType: z.string().min(1, { message: 'Company type is required' }),
  industry: z.string().min(1, { message: 'Industry is required' }),
  description: z.string().min(1, { message: 'Description is required' }),
  email: z.string().email({ message: 'Invalid email address' }).min(1, { message: 'Email is required' }),
  phone: z.string().min(1, { message: 'Phone number is required' }),
  city: z.string().min(1, { message: 'City is required' })
})

export const updateBusinessSchema = businessSchema.partial()
