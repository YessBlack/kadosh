import { MovementSource, MovementType, SOURCE_ALLOWED_TYPES } from '@/types/inventory/movement.type'
import { z } from 'zod'

const baseMovementSchema = z.object({
  item_id: z.string().min(1, { message: 'Item ID is required' }),
  type: z.nativeEnum(MovementType, { message: 'Type must be either IN or OUT' }),
  quantity: z.number().min(1, { message: 'Quantity must be a positive number' }),
  date: z.iso.datetime({ error: 'Date is required' }),
  source: z.nativeEnum(MovementSource).optional(),
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

export type movementInput = z.infer<typeof movementSchema>
export type UpdateMovementInput = z.infer<typeof updateMovementSchema>
