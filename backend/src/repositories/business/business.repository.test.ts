import { BusinessRepository } from '@/repositories/business/business.repository'
import { PocketBaseClientFactory } from '@/types/dependencies/pocketbase.type'
import { AppError, ERROR_CODES } from '@/utils/app-error'

describe('BusinessRepository', () => {
  const record = {
    id: 'business-1',
    name: 'Kadosh',
    nit: '900123456',
    companyType: 'SAS',
    industry: 'Retail',
    description: 'Business description',
    email: 'contact@kadosh.com',
    phone: '+573001234567',
    city: 'Bogota',
    logo: 'stored-logo.png',
    created: '2026-01-01 00:00:00.000Z',
    updated: '2026-01-02 00:00:00.000Z'
  }

  let collection: { getList: jest.Mock, update: jest.Mock }
  let getURL: jest.Mock
  let repository: BusinessRepository

  beforeEach(() => {
    collection = {
      getList: jest.fn(),
      update: jest.fn()
    }
    getURL = jest.fn().mockReturnValue('https://files.example.com/logo.png')
    const client = {
      collection: jest.fn().mockReturnValue(collection),
      files: { getURL }
    }
    repository = new BusinessRepository((() => client) as unknown as PocketBaseClientFactory)
  })

  it('maps the first business record returned by PocketBase', async () => {
    collection.getList.mockResolvedValue({ items: [record] })

    await expect(repository.find()).resolves.toEqual({
      id: record.id,
      name: record.name,
      nit: record.nit,
      companyType: record.companyType,
      industry: record.industry,
      description: record.description,
      email: record.email,
      phone: record.phone,
      city: record.city,
      logo: '',
      createdAt: record.created,
      updatedAt: record.updated
    })
    expect(collection.getList).toHaveBeenCalledWith(1, 1)
  })

  it('returns null when no business record exists', async () => {
    collection.getList.mockResolvedValue({ items: [] })

    await expect(repository.find()).resolves.toBeNull()
  })

  it('updates a business record and maps the result', async () => {
    collection.update.mockResolvedValue({ ...record, name: 'Kadosh Store' })

    await expect(repository.update(record.id, { name: 'Kadosh Store' })).resolves.toMatchObject({
      id: record.id,
      name: 'Kadosh Store',
      logo: '',
      createdAt: record.created,
      updatedAt: record.updated
    })
    expect(collection.update).toHaveBeenCalledWith(record.id, { name: 'Kadosh Store' })
  })

  it('translates PocketBase 404 errors into NOT_FOUND', async () => {
    collection.update.mockRejectedValue({ status: 404 })

    await expect(repository.update(record.id, { name: 'Kadosh Store' })).rejects.toMatchObject({
      code: ERROR_CODES.NOT_FOUND,
      message: 'Business not found'
    })
  })

  it('translates PocketBase validation errors', async () => {
    collection.update.mockRejectedValue({
      status: 400,
      response: { data: { name: { message: 'Name is already in use' } } }
    })

    await expect(repository.update(record.id, { name: 'Kadosh Store' })).rejects.toMatchObject({
      code: ERROR_CODES.VALIDATION_ERROR,
      message: 'Name is already in use'
    } satisfies Partial<AppError>)
  })

  it('uploads a logo as multipart data and resolves its public URL', async () => {
    collection.update.mockResolvedValue(record)
    const file = new Blob(['logo'], { type: 'image/png' })

    await expect(repository.updateFile(record.id, file, 'logo.png')).resolves.toMatchObject({
      id: record.id,
      logo: 'https://files.example.com/logo.png'
    })

    const [, formData] = collection.update.mock.calls[0]
    expect(formData).toBeInstanceOf(FormData)
    expect((formData as FormData).get('logo')).toBeInstanceOf(File)
    expect(getURL).toHaveBeenCalledWith(record, record.logo)
  })
})
