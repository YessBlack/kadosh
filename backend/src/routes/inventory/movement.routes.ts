import { InventoryMovementController } from '@/controllers/inventory/movements.controller'
import { RequestHandler, Router } from 'express'

interface InventoryMovementDeps {
  inventoryMovementController: InventoryMovementController
   authMiddleware: RequestHandler
}

export const createInventoryMovementRouter = ({ inventoryMovementController, authMiddleware }: InventoryMovementDeps) => {
  const router = Router()

  router.get('/', authMiddleware, inventoryMovementController.getAll)
  router.get('/:id', authMiddleware, inventoryMovementController.getById)
  router.post('/', authMiddleware, inventoryMovementController.create)
  router.patch('/:id', authMiddleware, inventoryMovementController.update)
  router.delete('/:id', authMiddleware, inventoryMovementController.delete)

  return router
}
