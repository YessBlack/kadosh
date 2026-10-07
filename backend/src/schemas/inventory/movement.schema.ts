import { MovementSource, MovementType, SOURCE_ALLOWED_TYPES } from '@/types/inventory/movements.type'
import { z } from 'zod'

const baseMovementSchema = z.object({
  item_id: z.string().min(1, { message: 'Item ID is required' }),
  type: z.nativeEnum(MovementType, { message: 'Type must be either IN or OUT' }),
  quantity: z.number().min(1, { message: 'Quantity must be a positive number' }),
  date: z.date({ message: 'Date is required' }),
  source: z.nativeEnum(MovementSource).optional(),
  unitCostSnapshot: z.number().min(0, { message: 'Unit cost snapshot must be a positive number' }),
  note: z.string().optional(),
  createdBy: z.string().min(1, { message: 'Created by is required' })
})

const validateSourceType = (
  data: { source?:MovementSource; type?:MovementType },
  ctx: z.RefinementCtx
) => {
  if (!data.source || !data.type) return

  const allowed = SOURCE_ALLOWED_TYPES[data.source]

  if (!allowed.includes(data.type)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['type'],
      message: `Type ${data.type} is not allowed for source ${data.source}`
    })
  }
}

export const movementSchema = baseMovementSchema.superRefine(validateSourceType)
export const updateMovementSchema = baseMovementSchema.partial().superRefine(validateSourceType)
