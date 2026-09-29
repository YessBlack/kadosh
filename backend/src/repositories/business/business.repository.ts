import { IBusinessRepository } from '@/types/business/business.repository.type'
import { Business, UpdateBusinessRequestDTO } from '@/types/business/business.type'
import { PocketBaseClientFactory } from '@/types/dependencies/pocketbase.type'
import { AppError, ERROR_CODES } from '@/utils/app-error'
import { extractPocketBaseValidationMessage, isPocketBaseError } from '@/utils/pocketbase.error'
import PocketBase, { RecordModel } from 'pocketbase'

export class BusinessRepository implements IBusinessRepository {
  private readonly pb: PocketBase

  constructor (createClient: PocketBaseClientFactory) {
    this.pb = createClient()
  }

  async find (): Promise<Business | null> {
    const result = await this.pb.collection('business').getList(1, 1)
    const record = result.items[0] || null
    return record ? this.mapperToBusiness(record) : null
  }

  async update (id: string, data: UpdateBusinessRequestDTO): Promise<Business> {
    try {
      const record = await this.pb.collection('business').update(id, data)
      return this.mapperToBusiness(record)
    } catch (error: unknown) {
      throw this.translateError(error)
    }
  }

  async updateFile (id: string, file: Blob, fileName: string): Promise<Business> {
    const formData = new FormData()
    formData.append('logo', file, fileName)

    try {
      const record = await this.pb.collection('business').update(id, formData)
      const logoUrl = this.pb.files.getURL(record, record.logo)
      return this.mapperToBusiness(record, logoUrl)
    } catch (error: unknown) {
      throw this.translateError(error)
    }
  }

  private translateError (error: unknown): unknown {
    if (isPocketBaseError(error) && error.status === 404) {
      return new AppError(ERROR_CODES.NOT_FOUND, 'Business not found', { cause: error })
    }

    const validationMessage = extractPocketBaseValidationMessage(error)

    if (validationMessage) {
      return new AppError(ERROR_CODES.VALIDATION_ERROR, validationMessage, { cause: error })
    }

    return error
  }

  private mapperToBusiness (record: RecordModel, logo?: string): Business {
    return {
      id: record.id,
      name: record.name,
      nit: record.nit,
      companyType: record.companyType,
      industry: record.industry,
      description: record.description,
      email: record.email,
      phone: record.phone,
      city: record.city,
      logo: logo || '',
      createdAt: record.created,
      updatedAt: record.updated
    }
  }
}
