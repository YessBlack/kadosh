import { ItemsInput, UpdateItemsInput } from '@/schemas/inventory/items.schema'
import { PocketBaseClientFactory } from '@/types/dependencies/pocketbase.type'
import { IInventoryItemRepository } from '@/types/inventory/item.repository.type'
import { Item, ItemType } from '@/types/inventory/items.type'
import { translatePocketBaseError } from '@/utils/pocketbase.error'
import PocketBase, { RecordModel } from 'pocketbase'

export class InventoryItemRepository implements IInventoryItemRepository {
  private readonly pb: PocketBase

  constructor (createClient: PocketBaseClientFactory) {
    this.pb = createClient()
  }

  async findAll (): Promise<Item[]> {
    const records = await this.pb.collection('inventory_items').getFullList()
    return records.map(record => this.toItem(record))
  }

  async findById (id: string): Promise<Item | null> {
    const result = await this.pb.collection('inventory_items').getOne(id)
    return result ? this.toItem(result) : null
  }

  async create (input: ItemsInput): Promise<Item> {
    try {
      const record = await this.pb.collection('inventory_items').create(input)
      return this.toItem(record)
    } catch (error: unknown) {
      throw this.translateError(error)
    }
  }

  async update (id: string, input: UpdateItemsInput): Promise<Item> {
    try {
      const record = await this.pb.collection('inventory_items').update(id, input)
      return this.toItem(record)
    } catch (error: unknown) {
      throw this.translateError(error)
    }
  }

  async updateImage (id: string, file: Blob, fileName: string): Promise<Item> {
    const formatData = new FormData()
    formatData.append('image', file, fileName)

    try {
      const record = await this.pb.collection('inventory_items').update(id, formatData)
      const image = this.pb.files.getURL(record, record.image)
      return this.toItem(record, image)
    } catch (error: unknown) {
      throw this.translateError(error)
    }
  }

  async delete (id: string): Promise<void> {
    try {
      await this.pb.collection('inventory_items').delete(id)
    } catch (error: unknown) {
      throw this.translateError(error)
    }
  }

  private translateError (error: unknown): unknown {
    return translatePocketBaseError(error, 'Item not found')
  }

  private toItem (record: RecordModel, image?: string): Item {
    const base = {
      id: record.id,
      sku: record.sku,
      name: record.name,
      description: record.description || undefined,
      category: record.category || undefined,
      salesPrice: record.salesPrice,
      isActive: record.isActive,
      image: image || '',
      createdAt: record.createdAt ?? record.created,
      updatedAt: record.updatedAt ?? record.updated
    }

    if (record.type === ItemType.PRODUCT) {
      return {
        ...base,
        type: ItemType.PRODUCT,
        barcode: record.barcode || undefined,
        unit: record.unit,
        unitCost: record.unitCost,
        initialStock: record.initialStock,
        minStock: record.minStock
      }
    }

    return {
      ...base,
      type: ItemType.SERVICE,
      priceMode: record.priceMode,
      estimatedCost: record.estimatedCost || undefined,
      durationMin: record.durationMin || undefined
    }
  }
}
