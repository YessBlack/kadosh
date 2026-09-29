export interface Business {
  id: string
  name: string
  nit: string
  companyType: string
  industry: string
  description: string,
  email: string,
  phone: string,
  city: string
  logo: string
}

export type UpdateBusinessData = Partial<Omit<Business, 'id'>>
