import { movementInput, UpdateMovementInput } from '@/schemas/inventory/movement.schema'
import { PocketBaseClientFactory } from '@/types/dependencies/pocketbase.type'
import { IInventoryMovementRepository } from '@/types/inventory/movement.repository.type'
import { Movement, MovementType } from '@/types/inventory/movement.type'
import { AppError, ERROR_CODES } from '@/utils/app-error'
import { isPocketBaseError } from '@/utils/pocketbase.error'
import PocketBase, { RecordModel } from 'pocketbase'

export class InventoryMovementRepository implements IInventoryMovementRepository {
  private readonly pb: PocketBase

  constructor (createClient: PocketBaseClientFactory) {
    this.pb = createClient()
  }

  async findAll (): Promise<Movement[]> {
    const records = await this.pb.collection('inventory_movements').getFullList({ expand: 'item_id,createdBy' })
    return await Promise.all(records.map(record => this.toMovement(record)))
  }

  async findById (id: string): Promise<Movement | null> {
    try {
      const record = await this.pb.collection('inventory_movements').getOne(id, { expand: 'item_id,createdBy' })
      return await this.toMovement(record)
    } catch (error) {
      if (isPocketBaseError(error) && error.status === 404) {
        return null
      }

      throw error
    }
  }

  async create (input: movementInput): Promise<Movement> {
    const record = await this.pb.collection('inventory_movements').create(input, { expand: 'item_id,createdBy' })
    return await this.toMovement(record)
  }

  async update (id: string, input: UpdateMovementInput): Promise<Movement> {
    const record = await this.pb.collection('inventory_movements').update(id, input, { expand: 'item_id,createdBy' })
    return await this.toMovement(record)
  }

  async delete (id: string) {
    await this.pb.collection('inventory_movements').delete(id)
  }

  async getTotals (itemId: string, excludeId?: string): Promise<{ totalIn: number, totalOut: number }> {
    const filter = excludeId
      ? this.pb.filter('item_id = {:itemId} && id != {:excludeId}', { itemId, excludeId })
      : this.pb.filter('item_id = {:itemId}', { itemId })

    const records = await this.pb.collection('inventory_movements').getFullList({
      filter,
      fields: 'type,quantity'
    })

    return records.reduce(
      (acc, r) => {
        if (r.type === MovementType.IN) acc.totalIn += r.quantity
        else acc.totalOut += r.quantity
        return acc
      },
      { totalIn: 0, totalOut: 0 }
    )
  }

  private async toMovement (record: RecordModel): Promise<Movement> {
    let itemRecord = record.expand?.item_id as RecordModel | undefined
    let userRecord = record.expand?.createdBy as RecordModel | undefined

    if (!itemRecord && typeof record.item_id === 'string' && record.item_id) {
      try {
        itemRecord = await this.pb.collection('inventory_items').getOne(record.item_id)
      } catch {
        itemRecord = undefined
      }
    }

    if (!userRecord && typeof record.createdBy === 'string' && record.createdBy) {
      try {
        userRecord = await this.pb.collection('users').getOne(record.createdBy)
      } catch {
        userRecord = undefined
      }
    }

    if (!itemRecord || !userRecord) {
      throw new AppError(
        ERROR_CODES.INTERNAL,
        `Movement ${record.id}: missing expanded relations (check expand and API rules)`
      )
    }

    const itemDTO = { id: itemRecord?.id, name: itemRecord?.name, unitCost: itemRecord?.unitCost }
    const userDTO = { id: userRecord?.id, name: [userRecord?.name, userRecord?.lastname].filter(Boolean).join(' ') }

    return {
      id: record.id,
      item_id: record.item_id,
      item: itemDTO,
      createdBy: userDTO,
      type: record.type,
      quantity: record.quantity,
      date: new Date(record.date),
      source: record.source,
      note: record.note || '',
      createdAt: new Date(record.createdAt),
      updatedAt: new Date(record.updatedAt)
    }
  }
}
