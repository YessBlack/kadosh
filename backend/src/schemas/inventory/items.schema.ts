import { ItemType, PriceMode, Unit } from '@/types/inventory/items.type'
import { z } from 'zod'

const commonFields = {
  sku: z.string().min(1, { message: 'SKU is required' }),
  name: z.string().min(1, { message: 'Name is required' }),
  description: z.string().optional(),
  category: z.string().optional(),
  salesPrice: z.number().min(0, { message: 'Sales price must be a positive number' }),
  isActive: z.boolean(),
  image: z.string().optional()
}

const productSchema = z.object({
  ...commonFields,
  type: z.literal(ItemType.PRODUCT),
  barcode: z.string().optional(),
  unit: z.nativeEnum(Unit, { message: 'Unit must be a supported unit' }),
  unitCost: z.number().min(0, { message: 'Unit cost must be a positive number' }),
  initialStock: z.number().min(0, { message: 'Initial stock must be a positive number' }),
  minStock: z.number().min(0, { message: 'Minimum stock must be a positive number' })
})

const serviceSchema = z.object({
  ...commonFields,
  type: z.literal(ItemType.SERVICE),
  priceMode: z.nativeEnum(PriceMode, { message: 'Price mode must be either FIXED or VARIABLE' }),
  estimatedCost: z.number().min(0, { message: 'Estimated cost must be a positive number' }).optional(),
  durationMin: z.number().min(0, { message: 'Duration must be a positive number' }).optional()
})

export const itemsSchema = z.discriminatedUnion('type', [productSchema, serviceSchema])

export const updateItemsSchema = z.object({
  ...commonFields,
  type: z.nativeEnum(ItemType).optional(),
  barcode: z.string().optional(),
  unit: z.nativeEnum(Unit, { message: 'Unit must be a supported unit' }).optional(),
  unitCost: z.number().min(0).optional(),
  initialStock: z.number().min(0).optional(),
  minStock: z.number().min(0).optional(),
  priceMode: z.nativeEnum(PriceMode).optional(),
  estimatedCost: z.number().min(0).optional(),
  durationMin: z.number().min(0).optional()
}).partial()

export type ItemsInput = z.infer<typeof itemsSchema>
export type UpdateItemsInput = z.infer<typeof updateItemsSchema>
