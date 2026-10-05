import { businessApi } from '@/features/myBusiness/api/business.api'
import type { Business } from '@/features/myBusiness/types/Business'
import api from '@/lib/axios'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/lib/axios')

const mockApi = vi.mocked(api)

const business: Business = {
  id: 'business-1',
  name: 'Kadosh',
  nit: '900123456',
  companyType: 'SAS',
  industry: 'Retail',
  description: 'Business description',
  email: 'contact@kadosh.com',
  phone: '+573001234567',
  city: 'Bogota',
  logo: 'https://files.example.com/logo.png'
}

describe('businessApi', () => {
  beforeEach(() => vi.clearAllMocks())

  it('gets the business record', async () => {
    mockApi.get.mockResolvedValue({ data: business })

    await expect(businessApi.get()).resolves.toEqual(business)
    expect(mockApi.get).toHaveBeenCalledWith('business')
  })

  it('updates business information', async () => {
    const payload = { name: 'Kadosh Store', city: 'Medellin' }
    const updatedBusiness = { ...business, ...payload }
    mockApi.patch.mockResolvedValue({ data: updatedBusiness })

    await expect(businessApi.update(business.id, payload)).resolves.toEqual(updatedBusiness)
    expect(mockApi.patch).toHaveBeenCalledWith(`/business/${business.id}`, payload)
  })

  it('uploads a logo as multipart form data', async () => {
    const file = new File(['logo'], 'logo.png', { type: 'image/png' })
    mockApi.patch.mockResolvedValue({ data: { ...business, logo: 'new-logo.png' } })

    await expect(businessApi.updateLogo(business.id, file)).resolves.toEqual({
      ...business,
      logo: 'new-logo.png'
    })

    expect(mockApi.patch).toHaveBeenCalledWith(
      `business/${business.id}/logo`,
      expect.any(FormData),
      { headers: { 'Content-Type': 'multipart/form-data' } }
    )
    const formData = mockApi.patch.mock.calls[0][1] as FormData
    expect(formData.get('logo')).toBe(file)
  })
})
