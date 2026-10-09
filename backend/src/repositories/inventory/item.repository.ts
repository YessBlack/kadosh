import { ItemsInput, UpdateItemsInput } from '@/schemas/inventory/items.schema'
import { PocketBaseClientFactory } from '@/types/dependencies/pocketbase.type'
import { IInventoryItemRepository } from '@/types/inventory/item.repository.type'
import { Item, ItemType } from '@/types/inventory/items.type'
import { translatePocketBaseError } from '@/utils/pocketbase.error'
import { AppError, ERROR_CODES } from '@/utils/app-error'
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

  async searchProducts (query: string, limit = 10): Promise<Item[]> {
    const filter = this.pb.filter(
      'type = {:type} && isActive = true && (name ~ {:q} || sku ~ {:q} || barcode ~ {:q})',
      { type: ItemType.PRODUCT, q: query }
    )

    const result = await this.pb.collection('inventory_items').getList(1, limit, {
      filter,
      sort: 'name'
    })

    return result.items.map(record => this.toItem(record))
  }

  async create (input: ItemsInput): Promise<Item> {
    try {
      const sku = await this.resolveSku(input.type, input.sku)
      const record = await this.pb.collection('inventory_items').create({ ...input, sku })
      return this.toItem(record)
    } catch (error: unknown) {
      throw this.translateError(error)
    }
  }

  async update (id: string, input: UpdateItemsInput): Promise<Item> {
    try {
      let payload = input
      if (input.sku !== undefined) {
        const collection = this.pb.collection('inventory_items')
        const current = await collection.getOne(id)
        const type = (input.type ?? current.type) as ItemType
        const sku = await this.resolveSku(type, input.sku, id)
        payload = { ...input, sku }
      }

      const record = await this.pb.collection('inventory_items').update(id, payload)
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

  private async resolveSku (type: ItemType, requestedSku: string, excludedId?: string): Promise<string> {
    const records = await this.pb.collection('inventory_items').getFullList({ fields: 'id,type,sku' })
    const otherRecords = records.filter(record => record.id !== excludedId)
    const normalizedSku = requestedSku.trim()

    if (normalizedSku) {
      const isDuplicate = otherRecords.some(record =>
        String(record.sku ?? '').trim().toLowerCase() === normalizedSku.toLowerCase()
      )

      if (isDuplicate) {
        throw new AppError(ERROR_CODES.VALIDATION_ERROR, 'Ese SKU ya está en uso')
      }

      return normalizedSku
    }

    const prefix = type === ItemType.PRODUCT ? 'PRD' : 'SRV'
    const skuPattern = new RegExp(`^${prefix}-(\\d+)$`, 'i')
    const existingSkus = new Set(otherRecords.map(record => String(record.sku ?? '').trim().toLowerCase()))
    let nextNumber = otherRecords.reduce((highest, record) => {
      const match = String(record.sku ?? '').trim().match(skuPattern)
      return match ? Math.max(highest, Number(match[1])) : highest
    }, 0) + 1

    let candidate = `${prefix}-${String(nextNumber).padStart(3, '0')}`
    while (existingSkus.has(candidate.toLowerCase())) {
      nextNumber += 1
      candidate = `${prefix}-${String(nextNumber).padStart(3, '0')}`
    }

    return candidate
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
