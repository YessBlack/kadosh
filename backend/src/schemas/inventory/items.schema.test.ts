import { itemsSchema, updateItemsSchema } from '@/schemas/inventory/items.schema'
import { ItemType, PriceMode, Unit } from '@/types/inventory/items.type'

const commonFields = {
  sku: 'PRD-001',
  name: 'Catalog item',
  salesPrice: 100,
  isActive: true
}

describe('inventory item schemas', () => {
  it('accepts a product with a supported unit', () => {
    expect(itemsSchema.safeParse({
      ...commonFields,
      type: ItemType.PRODUCT,
      unit: Unit.KILOGRAM,
      unitCost: 50,
      initialStock: 1,
      minStock: 0
    }).success).toBe(true)
  })

  it('rejects a product with a unit outside the enum', () => {
    expect(itemsSchema.safeParse({
      ...commonFields,
      type: ItemType.PRODUCT,
      unit: 'kg',
      unitCost: 50,
      initialStock: 1,
      minStock: 0
    }).success).toBe(false)
  })

  it('accepts service fields without product inventory fields', () => {
    expect(itemsSchema.safeParse({
      ...commonFields,
      type: ItemType.SERVICE,
      priceMode: PriceMode.FIXED
    }).success).toBe(true)
  })

  it('validates units in partial updates', () => {
    expect(updateItemsSchema.safeParse({ unit: Unit.LITER }).success).toBe(true)
    expect(updateItemsSchema.safeParse({ unit: 'lt' }).success).toBe(false)
  })
})