import { ItemType, PriceMode, UNIT_LABELS, Unit, type Item } from '@/features/inventory/types/catalog.types'
import { cleanBarcode } from '@/utils/stringUtils'

export const INITIAL_DATA = {
  type: ItemType.PRODUCT,
  sku: '',
  name: '',
  description: '',
  category: '',
  salesPrice: '',
  isActive: true,

  // producto
  barcode: '',
  unit: '',
  unitCost: '',
  initialStock: '0',
  minStock: '0',

  // servicio
  priceMode: PriceMode.FIXED,
  estimatedCost: '',
  durationMin: ''
}

export type CatalogFormData = typeof INITIAL_DATA

const optionalString = (value: string) => value.trim() || undefined
const optionalNumber = (value: string) => (value.trim() === '' ? undefined : Number(value))
const isNonNegative = (value: string) =>
  value.trim() !== '' && Number.isFinite(Number(value)) && Number(value) >= 0
const isEmptyOrNonNegative = (value: string) => value.trim() === '' || isNonNegative(value)
const legacyUnitValues = Object.fromEntries(
  Object.entries(UNIT_LABELS).map(([unit, label]) => [label.toLowerCase(), unit])
) as Record<string, Unit>

const normalizeUnit = (value: string) => {
  if (Object.values(Unit).includes(value as Unit)) return value
  return legacyUnitValues[value.toLowerCase()] ?? value
}

// Item del backend -> valores (strings) del formulario
export const itemToForm = (item: Item): CatalogFormData => ({
  ...INITIAL_DATA,
  type: item.type,
  sku: item.sku,
  name: item.name,
  description: item.description ?? '',
  category: item.category ?? '',
  salesPrice: String(item.salesPrice),
  isActive: item.isActive,
  ...(item.type === ItemType.PRODUCT
    ? {
        barcode: item.barcode ?? '',
        unit: normalizeUnit(item.unit),
        unitCost: String(item.unitCost),
        initialStock: String(item.initialStock),
        minStock: String(item.minStock)
      }
    : {
        priceMode: item.priceMode,
        estimatedCost: String(item.estimatedCost ?? ''),
        durationMin: String(item.durationMin ?? '')
      })
})

// Valores del formulario -> payload para la API
export const formToPayload = (data: CatalogFormData) => {
  const base = {
    sku: data.sku.trim(),
    name: data.name.trim(),
    description: optionalString(data.description),
    category: optionalString(data.category),
    salesPrice: Number(data.salesPrice),
    isActive: data.isActive
  }

  if (data.type === ItemType.PRODUCT) {
    return {
      ...base,
      type: ItemType.PRODUCT,
      barcode: optionalString(cleanBarcode(data.barcode)),
      unit: data.unit.trim(),
      unitCost: Number(data.unitCost),
      initialStock: Number(data.initialStock),
      minStock: Number(data.minStock)
    }
  }

  return {
    ...base,
    type: ItemType.SERVICE,
    priceMode: data.priceMode,
    estimatedCost: optionalNumber(data.estimatedCost),
    durationMin: optionalNumber(data.durationMin)
  }
}

export const isFormValid = (data: CatalogFormData): boolean => {
  const isCommonValid =
    data.sku.trim() !== '' &&
    data.name.trim() !== '' &&
    isNonNegative(data.salesPrice)

  if (data.type === ItemType.PRODUCT) {
    return (
      isCommonValid &&
      Object.values(Unit).includes(data.unit as Unit) &&
      isNonNegative(data.unitCost) &&
      isNonNegative(data.initialStock) &&
      isNonNegative(data.minStock)
    )
  }

  return (
    isCommonValid &&
    isEmptyOrNonNegative(data.estimatedCost) &&
    isEmptyOrNonNegative(data.durationMin)
  )
}

export const hasFormChanged = (current: CatalogFormData, original: CatalogFormData): boolean =>
  (Object.keys(current) as Array<keyof CatalogFormData>).some(
    key => current[key] !== original[key]
  )
