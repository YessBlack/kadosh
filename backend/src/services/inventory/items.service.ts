import { ItemsInput, UpdateItemsInput } from '@/schemas/inventory/items.schema'
import { IInventoryItemRepository } from '@/types/inventory/item.repository.type'
import { IInventoryService } from '@/types/inventory/item.service.type'
import { Item } from '@/types/inventory/items.type'
import { AppError, ERROR_CODES } from '@/utils/app-error'

export class InventoryService implements IInventoryService {
  private readonly repo: IInventoryItemRepository

  constructor (repo: IInventoryItemRepository) {
    this.repo = repo
  }

  async getAllItems (): Promise<Item[]> {
    try {
      const items = await this.repo.findAll()
      return items
    } catch (error: unknown) {
      if (error instanceof AppError) throw error
      throw new AppError(ERROR_CODES.INTERNAL, 'Server error')
    }
  }

  async getItemById (id: string): Promise<Item | null> {
    try {
      const record = await this.repo.findById(id)

      if (!record) throw new AppError(ERROR_CODES.NOT_FOUND, 'Item not found')

      return record
    } catch (error) {
      if (error instanceof AppError) throw error
      throw new AppError(ERROR_CODES.INTERNAL, 'Server error')
    }
  }

  async searchProducts (query: string): Promise<Item[]> {
    const q = query.trim()
    if (q.length < 2) return []

    try {
      return await this.repo.searchProducts(q)
    } catch (error) {
      if (error instanceof AppError) throw error
      throw new AppError(ERROR_CODES.INTERNAL, 'Server error')
    }
  }

  async createItem (input: ItemsInput): Promise<Item> {
    try {
      const record = await this.repo.create(input)
      return record
    } catch (error: unknown) {
      if (error instanceof AppError) throw error
      throw new AppError(ERROR_CODES.INTERNAL, 'Server error')
    }
  }

  async updateItem (id: string, input: UpdateItemsInput): Promise<Item> {
    try {
      const record = await this.repo.update(id, input)
      return record
    } catch (error: unknown) {
      if (error instanceof AppError) throw error
      throw new AppError(ERROR_CODES.INTERNAL, 'Server error')
    }
  }

  async updateItemImage (id: string, file: Blob, fileName: string): Promise<Item> {
    try {
      const record = await this.repo.updateImage(id, file, fileName)
      return record
    } catch (error: unknown) {
      if (error instanceof AppError) throw error
      throw new AppError(ERROR_CODES.INTERNAL, 'Server error')
    }
  }

  async deleteItem (id: string): Promise<void> {
    try {
      await this.repo.delete(id)
    } catch (error: unknown) {
      if (error instanceof AppError) throw error
      throw new AppError(ERROR_CODES.INTERNAL, 'Server error')
    }
  }
}
