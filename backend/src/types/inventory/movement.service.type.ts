import { movementInput, UpdateMovementInput } from '@/schemas/inventory/movement.schema'
import { Movement } from '@/types/inventory/movement.type'

export interface IInventoryMovementService {
  getAllMovements: () => Promise<Movement[]>
  getMovementById: (id: string) => Promise<Movement | null>
  createMovement: (input: movementInput) => Promise<Movement>
  updateMovement: (id: string, input: UpdateMovementInput) => Promise<Movement>
  deleteMovement: (id: string) => Promise<void>
}
