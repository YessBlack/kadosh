import { InventoryMovementRepository } from '@/repositories/inventory/movement.repository'
import { createPocketBaseClient } from '@/config/pocketbase'
import { InventoryMovementService } from '@/services/inventory/movement.service'
import { InventoryItemRepository } from '@/repositories/inventory/item.repository'
import { InventoryMovementController } from '@/controllers/inventory/movements.controller'

const inventoryMovementRepository = new InventoryMovementRepository(createPocketBaseClient)
const inventoryRepository = new InventoryItemRepository(createPocketBaseClient)
const inventoryMovementService = new InventoryMovementService(inventoryMovementRepository, inventoryRepository)

export const inventoryMovementController = new InventoryMovementController(inventoryMovementService)
