import { createPocketBaseClient } from '@/config/pocketbase'
import { InventoryItemController } from '@/controllers/inventory/items.controller'
import { InventoryItemRepository } from '@/repositories/inventory/item.repository'
import { InventoryService } from '@/services/inventory/items.service'

const inventoryRepository = new InventoryItemRepository(createPocketBaseClient)
const inventoryService = new InventoryService(inventoryRepository)

export const inventoryItemController = new InventoryItemController(inventoryService)
