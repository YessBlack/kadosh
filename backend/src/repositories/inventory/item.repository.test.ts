import { InventoryItemRepository } from '@/repositories/inventory/item.repository'
import { PocketBaseClientFactory } from '@/types/dependencies/pocketbase.type'
import { ItemType } from '@/types/inventory/items.type'

describe('InventoryItemRepository', () => {
  it('maps current and legacy PocketBase autodate fields', async () => {
    const records = [
      {
        id: 'item-current',
        type: ItemType.PRODUCT,
        sku: 'PRD-001',
        name: 'Current item',
        salesPrice: 100,
        isActive: true,
        unit: 'und',
        unitCost: 50,
        initialStock: 1,
        minStock: 0,
        createdAt: '2026-10-06T10:00:00.000Z',
        updatedAt: '2026-10-06T11:00:00.000Z'
      },
      {
        id: 'item-legacy',
        type: ItemType.PRODUCT,
        sku: 'PRD-002',
        name: 'Legacy item',
        salesPrice: 100,
        isActive: true,
        unit: 'und',
        unitCost: 50,
        initialStock: 1,
        minStock: 0,
        created: '2026-10-05T10:00:00.000Z',
        updated: '2026-10-05T11:00:00.000Z'
      }
    ]
    const collection = { getFullList: jest.fn().mockResolvedValue(records) }
    const repository = new InventoryItemRepository((() => ({
      collection: jest.fn().mockReturnValue(collection)
    })) as unknown as PocketBaseClientFactory)

    await expect(repository.findAll()).resolves.toMatchObject([
      {
        id: 'item-current',
        createdAt: records[0].createdAt,
        updatedAt: records[0].updatedAt
      },
      {
        id: 'item-legacy',
        createdAt: records[1].created,
        updatedAt: records[1].updated
      }
    ])
  })
})