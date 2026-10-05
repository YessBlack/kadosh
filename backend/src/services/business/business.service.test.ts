import { BusinessService } from '@/services/business/business.service'
import { IBusinessRepository } from '@/types/business/business.repository.type'
import { Business } from '@/types/business/business.type'
import { AppError, ERROR_CODES } from '@/utils/app-error'

describe('BusinessService', () => {
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
    logo: '',
    createdAt: '2026-01-01 00:00:00.000Z',
    updatedAt: '2026-01-01 00:00:00.000Z'
  }

  let repository: jest.Mocked<IBusinessRepository>
  let service: BusinessService

  beforeEach(() => {
    repository = {
      find: jest.fn(),
      update: jest.fn(),
      updateFile: jest.fn()
    }
    service = new BusinessService(repository)
  })

  it('returns the business record', async () => {
    repository.find.mockResolvedValue(business)

    await expect(service.get()).resolves.toEqual(business)
    expect(repository.find).toHaveBeenCalledTimes(1)
  })

  it('returns NOT_FOUND when no business record exists', async () => {
    repository.find.mockResolvedValue(null)

    await expect(service.get()).rejects.toMatchObject({
      code: ERROR_CODES.NOT_FOUND,
      message: 'Business not found'
    })
  })

  it('updates the existing business record by its id', async () => {
    const input = { name: 'Kadosh Store' }
    const updatedBusiness = { ...business, ...input }
    repository.find.mockResolvedValue(business)
    repository.update.mockResolvedValue(updatedBusiness)

    await expect(service.update(input)).resolves.toEqual(updatedBusiness)
    expect(repository.update).toHaveBeenCalledWith(business.id, input)
  })

  it('does not update when the business record is missing', async () => {
    repository.find.mockResolvedValue(null)

    await expect(service.update({ name: 'Kadosh Store' })).rejects.toMatchObject({
      code: ERROR_CODES.NOT_FOUND
    })
    expect(repository.update).not.toHaveBeenCalled()
  })

  it('updates the business logo', async () => {
    const file = new Blob(['logo'], { type: 'image/png' })
    const updatedBusiness = { ...business, logo: 'logo.png' }
    repository.updateFile.mockResolvedValue(updatedBusiness)

    await expect(service.updateLogo(business.id, file, 'logo.png')).resolves.toEqual(updatedBusiness)
    expect(repository.updateFile).toHaveBeenCalledWith(business.id, file, 'logo.png')
  })

  it('converts unexpected repository failures into INTERNAL errors', async () => {
    repository.find.mockRejectedValue(new Error('database unavailable'))

    await expect(service.get()).rejects.toBeInstanceOf(AppError)
    await expect(service.get()).rejects.toMatchObject({
      code: ERROR_CODES.INTERNAL,
      message: 'Server error'
    })
  })
})
