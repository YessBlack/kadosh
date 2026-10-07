import { Field, FieldGroup, FieldSet } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { ItemType, PriceMode, UNIT_LABELS, Unit, type Item } from '@/features/inventory/types/catalog.types'
import { useCatalogForm } from '@/features/inventory/hooks/useCatalogForm'
import { AppAlert } from '@/components/common/Alert/Alert'
import { ALERT_VARIANT } from '@/components/common/Alert/alert.type'

interface CatalogFormProps {
  selectedItem: Item | null
  onSuccess: () => void
  onClose: () => void
}

export const CatalogForm = ({ selectedItem, onSuccess, onClose }: CatalogFormProps) => {
  const {
    data,
    isProduct,
    isCompleted,
    isSubmitting,
    handleChange,
    handleSubmit,
    setData,
    handleBarcodeKeyDown,
    isDeleting,
    setIsDeleting,
    handleDelete
  } = useCatalogForm({ selectedItem, onSuccess, onClose })

  const renderDeleteConfirmation = () => {
    if (!isDeleting) return null

    return (
      <div className='mt-5'>
        <AppAlert
          title='¿Estás seguro?'
          description='Esta acción es irreversible: el usuario se eliminará por completo y no podrá recuperarse. Los reportes, ventas o movimientos ya registrados que lo referencian podrían mostrar datos incompletos o inconsistentes.'
          variant={ALERT_VARIANT.ERROR}
        />
        <div className='mt-4 flex justify-end gap-2'>
          <Button variant='outline' onClick={() => setIsDeleting(false)}>
            Cancelar
          </Button>
          <Button variant='destructive' onClick={handleDelete}>
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
              <Label htmlFor='item-type' required>Tipo</Label>
              <select
                id='item-type'
                aria-label='Tipo'
                name='type'
                className='h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus-visible:border-violet-500 focus-visible:ring-3 focus-visible:ring-violet-400/35 dark:border-[#1E1B4B] dark:bg-[#151b2C]/70 dark:text-[#E5E7EB]'
                value={data.type}
                onChange={handleChange}
              >
                <option value={ItemType.PRODUCT}>Producto</option>
                <option value={ItemType.SERVICE}>Servicio</option>
              </select>
            </Field>

            <Field className='flex flex-col gap-1'>
              <Label required>SKU</Label>
              <Input
                placeholder='PRD-001'
                required
                name='sku'
                value={data.sku}
                onChange={handleChange}
              />
            </Field>

            <Field className='flex flex-col gap-1'>
              <Label required>Nombre</Label>
              <Input
                placeholder='Nombre del ítem'
                required
                name='name'
                value={data.name}
                onChange={handleChange}
              />
            </Field>

            <Field className='flex flex-col gap-1'>
              <Label>Descripción</Label>
              <Input
                placeholder='Opcional'
                name='description'
                value={data.description}
                onChange={handleChange}
              />
            </Field>

            <Field className='flex flex-col gap-1'>
              <Label>Categoría</Label>
              <Input
                placeholder='Opcional'
                name='category'
                value={data.category}
                onChange={handleChange}
              />
            </Field>

            <Field className='flex flex-col gap-1'>
              <Label required>Precio de venta</Label>
              <Input
                type='number'
                min={0}
                step='0.01'
                required
                name='salesPrice'
                value={data.salesPrice}
                onChange={handleChange}
              />
            </Field>

            {isProduct && (
              <>
                <Field className='flex flex-col gap-1'>
                  <Label>Código de barras</Label>
                  <Input
                    placeholder='Escanea o escribe el código'
                    name='barcode'
                    value={data.barcode}
                    onChange={handleChange}
                    onKeyDown={handleBarcodeKeyDown}
                  />
                </Field>

                <Field className='flex flex-col gap-1'>
                  <Label htmlFor='item-unit' required>Unidad</Label>
                  <select
                    id='item-unit'
                    aria-label='Unidad'
                    required
                    name='unit'
                    className='h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus-visible:border-violet-500 focus-visible:ring-3 focus-visible:ring-violet-400/35 dark:border-[#1E1B4B] dark:bg-[#151b2C]/70 dark:text-[#E5E7EB]'
                    value={data.unit}
                    onChange={handleChange}
                  >
                    <option value=''>Selecciona unidad</option>
                    {data.unit !== '' && !Object.values(Unit).includes(data.unit as Unit) && (
                      <option value={data.unit}>{data.unit} (unidad actual)</option>
                    )}
                    {Object.values(Unit).map(unit => (
                      <option key={unit} value={unit}>{UNIT_LABELS[unit]}</option>
                    ))}
                  </select>
                </Field>

                <Field className='flex flex-col gap-1'>
                  <Label required>Costo unitario</Label>
                  <Input
                    type='number'
                    min={0}
                    step='0.01'
                    required
                    name='unitCost'
                    value={data.unitCost}
                    onChange={handleChange}
                  />
                </Field>

                <Field className='flex flex-col gap-1'>
                  <Label required>Stock inicial</Label>
                  <Input
                    type='number'
                    min={0}
                    required
                    name='initialStock'
                    value={data.initialStock}
                    onChange={handleChange}
                  />
                </Field>

                <Field className='flex flex-col gap-1'>
                  <Label required>Stock mínimo</Label>
                  <Input
                    type='number'
                    min={0}
                    required
                    name='minStock'
                    value={data.minStock}
                    onChange={handleChange}
                  />
                </Field>
              </>
            )}

            {!isProduct && (
              <>
                <Field className='flex flex-col gap-2'>
                  <Label htmlFor='item-price-mode' required>Modo de precio</Label>
                  <select
                    id='item-price-mode'
                    aria-label='Modo de precio'
                    name='priceMode'
                    className='h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus-visible:border-violet-500 focus-visible:ring-3 focus-visible:ring-violet-400/35 dark:border-[#1E1B4B] dark:bg-[#151b2C]/70 dark:text-[#E5E7EB]'
                    value={data.priceMode}
                    onChange={handleChange}
                  >
                    <option value={PriceMode.FIXED}>Fijo</option>
                    <option value={PriceMode.VARIABLE}>Variable</option>
                  </select>
                </Field>

                <Field className='flex flex-col gap-1'>
                  <Label>Costo estimado</Label>
                  <Input
                    type='number'
                    min={0}
                    step='0.01'
                    name='estimatedCost'
                    value={data.estimatedCost}
                    onChange={handleChange}
                  />
                </Field>

                <Field className='flex flex-col gap-1'>
                  <Label>Duración (minutos)</Label>
                  <Input
                    type='number'
                    min={0}
                    name='durationMin'
                    value={data.durationMin}
                    onChange={handleChange}
                  />
                </Field>
              </>
            )}

            <Field className='flex flex-col gap-1'>
              <Label required className='text-sm font-medium'>Estado</Label>
              <RadioGroup
                value={data.isActive ? 'true' : 'false'}
                className='w-fit'
                onValueChange={value => setData(prev => ({ ...prev, isActive: value === 'true' }))}
              >
                <div className='flex items-center gap-3'>
                  <RadioGroupItem value='true' id='r1' />
                  <Label htmlFor='r1'>Activo</Label>
                </div>
                <div className='flex items-center gap-3'>
                  <RadioGroupItem value='false' id='r2' />
                  <Label htmlFor='r2'>Inactivo</Label>
                </div>
              </RadioGroup>
            </Field>
          </FieldGroup>
        </FieldSet>
        <Field orientation='horizontal' className='flex items-center justify-end'>
          {selectedItem && !isDeleting && (
            <Button variant='destructive' onClick={() => setIsDeleting(true)}>
              Eliminar
            </Button>
          )}
          {!isDeleting &&
            <Button type='submit' variant={'primary'} disabled={!isCompleted || isSubmitting}>
              {selectedItem ? 'Actualizar' : 'Crear Ítem'}
            </Button>
          }
        </Field>
      </form>
      {renderDeleteConfirmation()}
    </div>
  )
}
