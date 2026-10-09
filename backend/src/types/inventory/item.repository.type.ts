import { Item } from '@/types/inventory/items.type'
import { ItemsInput, UpdateItemsInput } from '@/schemas/inventory/items.schema'

export interface IInventoryItemRepository {
  findAll: () => Promise<Item[]>
  findById: (id: string) => Promise<Item | null>
  searchProducts: (query: string, limit?: number) => Promise<Item[]>
  create: (input: ItemsInput) => Promise<Item>
  update: (id: string, input: UpdateItemsInput) => Promise<Item>
  updateImage: (id: string, file: Blob, fileName: string) => Promise<Item>
  delete: (id: string) => Promise<void>
}
