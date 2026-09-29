import { z } from 'zod'
import { updateBusinessSchema } from '@/schemas/business/business.schemas'

export interface Business {
  id: string
  name: string
  nit: string
  companyType: string
  industry: string
  description: string
  email: string
  phone: string
  city: string
  logo: string
  createdAt: string
  updatedAt: string
}

export type UpdateBusinessRequestDTO = z.infer<typeof updateBusinessSchema>
