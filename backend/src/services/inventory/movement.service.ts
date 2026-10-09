import { InventoryItemRepository } from '@/repositories/inventory/item.repository'
import { movementInput, UpdateMovementInput } from '@/schemas/inventory/movement.schema'
import { ItemType } from '@/types/inventory/items.type'
import { IInventoryMovementRepository } from '@/types/inventory/movement.repository.type'
import { IInventoryMovementService } from '@/types/inventory/movement.service.type'
import { Movement, MovementType, SOURCE_ALLOWED_TYPES } from '@/types/inventory/movement.type'
import { AppError, ERROR_CODES } from '@/utils/app-error'

export class InventoryMovementService implements IInventoryMovementService {
  private readonly repo: IInventoryMovementRepository
  private readonly itemRepo: InventoryItemRepository

  constructor (repo: IInventoryMovementRepository, itemRepo: InventoryItemRepository) {
    this.repo = repo
    this.itemRepo = itemRepo
  }

  async getAllMovements (): Promise<Movement[]> {
    try {
      const items = await this.repo.findAll()
      return items
    } catch (error: unknown) {
      if (error instanceof AppError) throw error
      throw new AppError(ERROR_CODES.INTERNAL, 'Server error')
    }
  }

  async getMovementById (id: string): Promise<Movement | null> {
    try {
      const record = await this.repo.findById(id)

      if (!record) throw new AppError(ERROR_CODES.NOT_FOUND, 'Item not found')

      return record
    } catch (error) {
      if (error instanceof AppError) throw error
      throw new AppError(ERROR_CODES.INTERNAL, 'Server error')
    }
  }

  async createMovement (input: movementInput): Promise<Movement> {
    try {
      const item = await this.itemRepo.findById(input.item_id)

      if (!item) throw new AppError(ERROR_CODES.NOT_FOUND, 'Item not found')

      if (!item.isActive) throw new AppError(ERROR_CODES.VALIDATION_ERROR, 'Item is inactive')

      if (item.type !== ItemType.PRODUCT) {
        throw new AppError(ERROR_CODES.VALIDATION_ERROR, 'Only products can have inventory movements')
      }

      if (input.source && !SOURCE_ALLOWED_TYPES[input.source].includes(input.type)) {
        throw new AppError(ERROR_CODES.VALIDATION_ERROR, 'Source is not compatible with movement type')
      }

      if (input.type === MovementType.OUT) {
        const { totalIn, totalOut } = await this.repo.getTotals(item.id)
        const stock = (item.initialStock ?? 0) + totalIn - totalOut

        if (input.quantity > stock) {
          throw new AppError(ERROR_CODES.VALIDATION_ERROR, `Insufficient stock. Available: ${stock}`)
        }
      }

      return await this.repo.create(input)
    } catch (error) {
      if (error instanceof AppError) throw error
      throw new AppError(ERROR_CODES.INTERNAL, 'Server error', { cause: error })
    }
  }

  async updateMovement (id: string, input: UpdateMovementInput): Promise<Movement> {
    try {
    // 1. El movimiento debe existir
      const current = await this.repo.findById(id)
      if (!current) throw new AppError(ERROR_CODES.NOT_FOUND, 'Movement not found')

      // 2. Estado final = existente + cambios (sin tocar costo ni autor originales)
      const { createdBy: _author, ...changes } = input

      const next = {
        item_id: changes.item_id ?? current.item_id,
        type: changes.type ?? current.type,
        quantity: changes.quantity ?? current.quantity,
        source: changes.source ?? current.source
      }

      // 3. Compatibilidad origen / tipo sobre el estado final
      if (next.source && !SOURCE_ALLOWED_TYPES[next.source].includes(next.type)) {
        throw new AppError(ERROR_CODES.VALIDATION_ERROR, 'Source is not compatible with movement type')
      }

      // 4. El ítem destino debe ser válido
      const item = await this.itemRepo.findById(next.item_id)
      if (!item) throw new AppError(ERROR_CODES.NOT_FOUND, 'Item not found')
      if (!item.isActive) throw new AppError(ERROR_CODES.VALIDATION_ERROR, 'Item is inactive')
      if (item.type !== ItemType.PRODUCT) {
        throw new AppError(ERROR_CODES.VALIDATION_ERROR, 'Only products can have inventory movements')
      }

      // 5. Stock del ítem destino sin este movimiento + el efecto del nuevo
      const baseStock = await this.getStock(item.id, item.initialStock ?? 0, id)
      const effect = next.type === MovementType.IN ? next.quantity : -next.quantity

      if (baseStock + effect < 0) {
        throw new AppError(ERROR_CODES.VALIDATION_ERROR, `Insufficient stock. Available: ${baseStock}`)
      }

      // 6. Si cambió de ítem, el ítem anterior no puede quedar en negativo
      if (next.item_id !== current.item_id) {
        const oldItem = await this.itemRepo.findById(current.item_id)
        if (oldItem?.type === ItemType.PRODUCT) {
          const oldStock = await this.getStock(oldItem.id, oldItem.initialStock, id)
          if (oldStock < 0) {
            throw new AppError(ERROR_CODES.VALIDATION_ERROR, 'Change would leave the previous item with negative stock')
          }
        }
      }

      // 7. Guardar. Si cambió de ítem, el costo se toma del nuevo
      return await this.repo.update(id, {
        ...changes,
        ...(next.item_id !== current.item_id && { unitCostSnapshot: item.unitCost })
      })
    } catch (error) {
      if (error instanceof AppError) throw error
      throw new AppError(ERROR_CODES.INTERNAL, 'Server error')
    }
  }

  async deleteMovement (id: string): Promise<void> {
    try {
    // 1. El movimiento debe existir
      const current = await this.repo.findById(id)

      if (!current) throw new AppError(ERROR_CODES.NOT_FOUND, 'Movement not found')

      // 2. Si es una entrada, el stock sin ella no puede quedar negativo
      if (current.type === MovementType.IN) {
        const item = await this.itemRepo.findById(current.item_id)

        if (item?.type === ItemType.PRODUCT) {
          const stockWithout = await this.getStock(item.id, item.initialStock, id)

          if (stockWithout < 0) {
            throw new AppError(
              ERROR_CODES.VALIDATION_ERROR,
              'Cannot delete: it would leave the item with negative stock'
            )
          }
        }
      }

      // 3. Eliminar
      await this.repo.delete(id)
    } catch (error) {
      if (error instanceof AppError) throw error
      throw new AppError(ERROR_CODES.INTERNAL, 'Server error')
    }
  }

  private async getStock (itemId: string, initialStock: number, excludeId?: string): Promise<number> {
    const { totalIn, totalOut } = await this.repo.getTotals(itemId, excludeId)
    return initialStock + totalIn - totalOut
  }
}
