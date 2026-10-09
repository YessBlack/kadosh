import { ItemsInput, UpdateItemsInput } from '@/schemas/inventory/items.schema'
import { Item } from '@/types/inventory/items.type'

export interface IInventoryService {
  getAllItems: () => Promise<Item[]>
  getItemById: (id: string) => Promise<Item | null>
  searchProducts: (query: string) => Promise<Item[]>
  createItem: (input: ItemsInput) => Promise<Item>
  updateItem: (id: string, input: UpdateItemsInput) => Promise<Item>
  updateItemImage: (id: string, file: Blob, fileName: string) => Promise<Item>
  deleteItem: (id: string) => Promise<void>
}
