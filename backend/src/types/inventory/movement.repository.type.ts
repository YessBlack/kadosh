import { Movement } from '@/types/inventory/movement.type'
import { movementInput, UpdateMovementInput } from '@/schemas/inventory/movement.schema'

export interface MovementTotals {
  totalIn: number
  totalOut: number
}

export interface IInventoryMovementRepository {
  findAll: () => Promise<Movement[]>
  findById: (id: string) => Promise<Movement | null>
  create: (input: movementInput) => Promise<Movement>
  update: (id: string, input: UpdateMovementInput) => Promise<Movement>
  delete: (id: string) => Promise<void>
  getTotals: (itemId: string, excludeId?: string) => Promise<MovementTotals>
}
