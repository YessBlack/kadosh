import { InventoryItemController } from '@/controllers/inventory/items.controller'
import { RequestHandler, Router } from 'express'

interface InventoryRouterDeps {
  inventoryItemController: InventoryItemController
  authMiddleware: RequestHandler
}

export const createInventoryRouter = ({ inventoryItemController, authMiddleware }: InventoryRouterDeps) => {
  const router = Router()

  router.get('/', authMiddleware, inventoryItemController.getAll)
  router.get('/:id', authMiddleware, inventoryItemController.getById)
  router.post('/', authMiddleware, inventoryItemController.create)
  router.patch('/:id', authMiddleware, inventoryItemController.update)
  router.patch('/:id/image', authMiddleware, inventoryItemController.updateImage)
  router.delete('/:id', authMiddleware, inventoryItemController.delete)

  return router
}
