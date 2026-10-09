import { catalogApi } from '@/features/inventory/api/catalog.api'
import { ItemType, type Item } from '@/features/inventory/types/catalog.types'
import { cleanBarcode } from '@/utils/stringUtils'
import { useState } from 'react'
import {
  INITIAL_DATA,
  formToPayload,
  hasFormChanged,
  isFormValid,
  itemToForm,
  type CatalogFormData
} from '@/features/inventory/utils/catalogForm.utils'
import { showToast } from '@/utils/toast.utils'

interface UseCatalogFormProps {
  selectedItem: Item | null
  onSuccess: () => void
  onClose: () => void
}

const SAVE_ERROR_MESSAGE = 'Ocurrió un error al guardar el ítem. Por favor, inténtalo nuevamente.'

const getSaveErrorMessage = (error: unknown) => {
  if (typeof error !== 'object' || error === null || !('response' in error)) {
    return SAVE_ERROR_MESSAGE
  }

  const response = error.response
  if (typeof response !== 'object' || response === null || !('data' in response)) {
    return SAVE_ERROR_MESSAGE
  }

  const responseData = response.data
  if (typeof responseData === 'object' && responseData !== null && 'message' in responseData && typeof responseData.message === 'string') {
    return responseData.message
  }

  return SAVE_ERROR_MESSAGE
}

export const useCatalogForm = ({ selectedItem, onSuccess, onClose }: UseCatalogFormProps) => {
  const [initialData] = useState(() => (selectedItem ? itemToForm(selectedItem) : INITIAL_DATA))
  const [data, setData] = useState<CatalogFormData>(initialData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const isEditing = selectedItem !== null
  const isProduct = data.type === ItemType.PRODUCT
  const isCompleted = isFormValid(data) && (!isEditing || hasFormChanged(data, initialData))

  const setField = <K extends keyof CatalogFormData>(key: K, value: CatalogFormData[K]) => {
    setData(prev => ({ ...prev, [key]: value }))
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target
    setField(name as keyof CatalogFormData, value as never)
  }

  const handleBarcodeKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return
    event.preventDefault()
    setField('barcode', cleanBarcode(data.barcode))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!isCompleted || isSubmitting) return

    setIsSubmitting(true)

    try {
      const payload = formToPayload(data)

      if (selectedItem) {
        await catalogApi.updateItem(selectedItem.id, payload)
      } else {
        await catalogApi.createItem(payload)
      }

      showToast.success('Ítem guardado exitosamente.')
      onSuccess()
      onClose()
    } catch (error) {
      showToast.error(getSaveErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedItem || isSubmitting) return

    setIsSubmitting(true)

    try {
      await catalogApi.deleteItem(selectedItem.id)
      showToast.success('Ítem eliminado exitosamente.')
      onSuccess()
      onClose()
    } catch {
      showToast.error('Ocurrió un error al eliminar el ítem. Por favor, inténtalo nuevamente.')
    } finally {
      setIsSubmitting(false)
      setIsDeleting(false)
      onClose()
    }
  }

  return {
    data,
    isProduct,
    isEditing,
    isCompleted,
    isSubmitting,
    handleChange,
    setField,
    handleSubmit,
    handleBarcodeKeyDown,
    setData,
    isDeleting,
    setIsDeleting,
    handleDelete
  }
}
