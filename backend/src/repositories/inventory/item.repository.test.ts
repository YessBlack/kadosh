import { InventoryItemRepository } from '@/repositories/inventory/item.repository'
import { ItemsInput } from '@/schemas/inventory/items.schema'
import { PocketBaseClientFactory } from '@/types/dependencies/pocketbase.type'
import { ItemType, PriceMode, Unit } from '@/types/inventory/items.type'

describe('InventoryItemRepository', () => {
  const productInput: ItemsInput = {
    type: ItemType.PRODUCT,
    sku: '',
    name: 'Generated product',
    salesPrice: 100,
    isActive: true,
    unit: Unit.UNIT,
    unitCost: 50,
    initialStock: 1,
    minStock: 0
  }

  const createRepository = (existingRecords: Array<Record<string, unknown>>) => {
    const collection = {
      getFullList: jest.fn().mockResolvedValue(existingRecords),
      create: jest.fn().mockImplementation(async (input: Record<string, unknown>) => ({
        id: 'new-item',
        ...input
      }))
    }
    const repository = new InventoryItemRepository((() => ({
      collection: jest.fn().mockReturnValue(collection)
    })) as unknown as PocketBaseClientFactory)

    return { collection, repository }
  }

  it('generates the next product SKU when it is empty', async () => {
    const { collection, repository } = createRepository([
      { id: '1', sku: 'PRD-001' },
      { id: '2', sku: 'PRD-002' },
      { id: '3', sku: 'PRD-003' },
      { id: '4', sku: 'SRV-001' }
    ])

    await repository.create(productInput)

    expect(collection.create).toHaveBeenCalledWith({ ...productInput, sku: 'PRD-004' })
  })

  it('keeps a custom SKU unchanged when it is available', async () => {
    const { collection, repository } = createRepository([{ id: '1', sku: 'PRD-001' }])

    await repository.create({ ...productInput, sku: 'LIB-DAN-BROWN' })

    expect(collection.create).toHaveBeenCalledWith({ ...productInput, sku: 'LIB-DAN-BROWN' })
  })

  it('rejects a custom SKU that is already in use', async () => {
    const { collection, repository } = createRepository([{ id: '1', sku: 'LIB-DAN-BROWN' }])

    await expect(repository.create({ ...productInput, sku: 'LIB-DAN-BROWN' })).rejects.toMatchObject({
      message: 'Ese SKU ya está en uso'
    })
    expect(collection.create).not.toHaveBeenCalled()
  })

  it('translates a PocketBase unique-index conflict to the SKU message', async () => {
    const { collection, repository } = createRepository([])
    collection.create.mockRejectedValue({
      status: 400,
      response: {
        data: {
          data: {
            sku: { code: 'validation_not_unique', message: 'Value must be unique.' }
          }
        }
      }
    })

    await expect(repository.create({ ...productInput, sku: 'LIB-DAN-BROWN' })).rejects.toMatchObject({
      message: 'Ese SKU ya está en uso'
    })
  })

  it('generates the next service SKU when it is empty', async () => {
    const { collection, repository } = createRepository([{ id: '1', sku: 'SRV-001' }])

    await repository.create({
      type: ItemType.SERVICE,
      sku: '',
      name: 'Generated service',
      salesPrice: 100,
      isActive: true,
      priceMode: PriceMode.FIXED
    })

    expect(collection.create).toHaveBeenCalledWith(expect.objectContaining({ sku: 'SRV-002' }))
  })

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