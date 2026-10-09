import { useState, type ChangeEvent, type FormEvent } from 'react'
import { movementApi } from '@/features/inventory/api/movement.api'
import {
  MovementSource,
  MovementType,
  type InventoryMovement
} from '@/features/inventory/types/movement.types'
import { ItemType, type Item } from '@/features/inventory/types/catalog.types'
import { useAuthStore } from '@/store/auth.store'
import { showToast } from '@/utils/toast.utils'

interface UseMovementFormProps {
  selectedMovement: InventoryMovement | null
  onSuccess: () => void
  onClose: () => void
}

export const useMovementForm = ({
  selectedMovement,
  onSuccess,
  onClose
}: UseMovementFormProps) => {
  const user = useAuthStore(state => state.user)

  const [data, setData] = useState(() => ({
    item_id: selectedMovement?.item_id ?? '',
    type: selectedMovement?.type ?? MovementType.IN,
    quantity: selectedMovement ? String(selectedMovement.quantity) : '',
    date: selectedMovement?.date.slice(0, 10) ?? new Date().toISOString().slice(0, 10),
    note: selectedMovement?.note ?? ''
  }))

  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const isEditing = selectedMovement !== null

  const isCompleted =
    data.item_id !== '' && Number(data.quantity) > 0 && data.date !== ''

  const handleSelectItem = (item: Item | null) => {
    setSelectedItem(item)
    setData(prev => ({ ...prev, item_id: item?.id ?? '' }))
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!isCompleted) return

    if (!user?.id) {
      showToast.error('No se pudo identificar al usuario de la sesión')
      return
    }

    setIsSubmitting(true)

    try {
      const base = {
        type: data.type,
        quantity: Number(data.quantity),
        date: new Date(data.date),
        note: data.note || undefined
      }

      if (selectedMovement) {
        await movementApi.updateMovement(selectedMovement.id, base)
        showToast.success('Movimiento editado exitosamente.')
        onSuccess()
        setIsSubmitting(false)
        onClose()
        return
      }

      if (
        !selectedItem ||
        selectedItem.id !== data.item_id ||
        selectedItem.type !== ItemType.PRODUCT
      ) {
        showToast.error('Selecciona nuevamente el ítem del movimiento')
        setIsSubmitting(false)
        return
      }

      await movementApi.createMovement({
        ...base,
        item_id: data.item_id,
        source: MovementSource.MANUAL,
        createdBy: user.id
      })

      showToast.success('Se ha creado el movimiento exitosamente.')
      onSuccess()
      setIsSubmitting(false)
      onClose()
    } catch {
      showToast.error('Ha surgido un error al guardar la información')
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedMovement) return

    setIsSubmitting(true)

    try {
      await movementApi.deleteMovement(selectedMovement.id)
      onSuccess()
      onClose()
      setIsSubmitting(false)

      showToast.success('Se ha eliminado el movimiento')
    } catch {
      showToast.error('Ha ocurrido un error al eliminar el movimiento')
    }
  }

  return {
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
  }
}
