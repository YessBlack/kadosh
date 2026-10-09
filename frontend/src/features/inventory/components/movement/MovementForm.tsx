import { Field, FieldGroup, FieldSet } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { AppAlert } from '@/components/common/Alert/Alert'
import { ALERT_VARIANT } from '@/components/common/Alert/alert.type'
import {
  MOVEMENT_TYPE_LABELS,
  MovementType,
  type InventoryMovement
} from '@/features/inventory/types/movement.types'
import { useMovementForm } from '@/features/inventory/hooks/useMovementForm'
import { ItemSearchInput } from '@/features/inventory/components/shared/ItemSearchInput'

const SELECT_CLASS =
  'h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus-visible:border-violet-500 focus-visible:ring-3 focus-visible:ring-violet-400/35 dark:border-[#1E1B4B] dark:bg-[#151b2C]/70 dark:text-[#E5E7EB]'

interface MovementFormProps {
  selectedMovement: InventoryMovement | null
  onSuccess: () => void
  onClose: () => void
}

export const MovementForm = ({ selectedMovement, onSuccess, onClose }: MovementFormProps) => {
  const {
    data,
    selectedItem,
    isEditing,
    isCompleted,
    isSubmitting,
    isDeleting,
    setIsDeleting,
    handleSelectItem,
    handleChange,
    handleSubmit,
    handleDelete
  } = useMovementForm({ selectedMovement, onSuccess, onClose })

  const renderInputSearch = () => {
    if (isEditing) {
      return <Input value={selectedMovement?.item?.name ?? 'Ítem no disponible'} disabled readOnly />
    }

    return <ItemSearchInput selected={selectedItem} onSelect={handleSelectItem} />
  }

  const renderDeleteConfirmation = () => {
    if (!isDeleting) return null

    return (
      <div className='mt-5'>
        <AppAlert
          title='¿Estás seguro?'
          description='Esta acción es irreversible: el movimiento se eliminará y el stock del ítem se recalculará. Si es una entrada, podría dejar el stock en negativo y la operación será rechazada.'
          variant={ALERT_VARIANT.ERROR}
        />
        <div className='mt-4 flex justify-end gap-2'>
          <Button type='button' variant='outline' onClick={() => setIsDeleting(false)}>
            Cancelar
          </Button>
          <Button type='button' variant='destructive' onClick={handleDelete} disabled={isSubmitting}>
            Eliminar
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className='w-full'>
      <form onSubmit={handleSubmit} className='w-full'>
        <FieldSet>
          <FieldGroup className='flex flex-col gap-3'>
            <Field className='flex flex-col gap-2'>
              <Label required>Ítem</Label>
              {renderInputSearch()}
            </Field>

            <Field className='flex flex-col gap-2'>
              <Label htmlFor='movement-type' required>Tipo</Label>
              <select
                id='movement-type'
                aria-label='Tipo'
                name='type'
                className={SELECT_CLASS}
                value={data.type}
                onChange={handleChange}
              >
                {Object.values(MovementType).map(type => (
                  <option key={type} value={type}>{MOVEMENT_TYPE_LABELS[type]}</option>
                ))}
              </select>
            </Field>

            <Field className='flex flex-col gap-1'>
              <Label required>Cantidad</Label>
              <Input
                type='number'
                min={0}
                step='any'
                required
                name='quantity'
                value={data.quantity}
                onChange={handleChange}
              />
            </Field>

            <Field className='flex flex-col gap-1'>
              <Label required>Fecha</Label>
              <Input
                type='date'
                required
                name='date'
                value={data.date}
                onChange={handleChange}
              />
            </Field>

            <Field className='flex flex-col gap-1'>
              <Label>Nota</Label>
              <Input
                placeholder='Opcional'
                name='note'
                value={data.note}
                onChange={handleChange}
              />
            </Field>
          </FieldGroup>
        </FieldSet>

        <Field orientation='horizontal' className='mt-4 flex items-center justify-end'>
          {selectedMovement && !isDeleting && (
            <Button type='button' variant='destructive' onClick={() => setIsDeleting(true)}>
              Eliminar
            </Button>
          )}
          {!isDeleting && (
            <Button type='submit' variant='primary' disabled={!isCompleted || isSubmitting}>
              {selectedMovement ? 'Actualizar' : 'Registrar Movimiento'}
            </Button>
          )}
        </Field>
      </form>
      {renderDeleteConfirmation()}
    </div>
  )
}
