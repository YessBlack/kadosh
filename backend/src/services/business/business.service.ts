import { IBusinessRepository } from '@/types/business/business.repository.type'
import { IBusinessService } from '@/types/business/business.service.type'
import { Business, UpdateBusinessRequestDTO } from '@/types/business/business.type'
import { AppError, ERROR_CODES } from '@/utils/app-error'

export class BusinessService implements IBusinessService {
  private readonly repo: IBusinessRepository

  constructor (repo: IBusinessRepository) {
    this.repo = repo
  }

  private async getRecord (): Promise<Business> {
    const record = await this.repo.find()
    if (!record) throw new AppError(ERROR_CODES.NOT_FOUND, 'Business not found')
    return record
  }

  async get (): Promise<Business> {
    try {
      const record = await this.getRecord()
      return record
    } catch (error: unknown) {
      if (error instanceof AppError) throw error
      throw new AppError(ERROR_CODES.INTERNAL, 'Server error')
    }
  }

  async update (input: UpdateBusinessRequestDTO): Promise<Business> {
    try {
      const record = await this.getRecord()
      const updated = await this.repo.update(record.id, input)
      return updated
    } catch (error: unknown) {
      if (error instanceof AppError) throw error
      throw new AppError(ERROR_CODES.INTERNAL, 'Server error')
    }
  }

  async updateLogo (id:string, file: Blob, fileName: string): Promise<Business> {
    try {
      const updated = await this.repo.updateFile(id, file, fileName)
      return updated
    } catch (error: unknown) {
      if (error instanceof AppError) throw error
      throw new AppError(ERROR_CODES.INTERNAL, 'Server error')
    }
  }
}
