import { DataTable } from '@/components/common/Table/DataTable'
import { Badge } from '@/components/ui/badge'
import { ItemType, UNIT_LABELS, type Item } from '@/features/inventory/types/catalog.types'
import { formatDate } from '@/utils/dateUtils'
import { formatPrice } from '@/utils/stringUtils'
import { Edit } from 'lucide-react'

interface CategoryTableProps {
  data: Item[]
  isLoading: boolean
  canWrite: boolean
  onEdit: (item: Item) => void
}

export const CategoryTable = ({
  data,
  isLoading,
  canWrite,
  onEdit
}: CategoryTableProps) => {
  return (
     <DataTable
        data={data ?? []}
        isLoading={isLoading}
        actions={
          canWrite
          ? [
              {
                icon: <Edit className='w-4 h-4' />,
                onClick: (item: Item) => onEdit(item),
                className: 'text-violet-500 hover:text-violet-600'
              }
            ]
          : undefined
        }
        columns={[
          { key: 'sku', label: 'Código' },
          { key: 'name', label: 'Nombre' },
          {
            key: 'type',
            label: 'Tipo',
            render: value => value === ItemType.PRODUCT ? 'Producto' : 'Servicio'
          },
          {
            key: 'unit',
            label: 'Unidad',
            render: (_value, item) => item.type === ItemType.PRODUCT ? UNIT_LABELS[item.unit] : '—'
          },
          { key: 'category', label: 'Categoría', render: value => value || '—' },
          { key: 'salesPrice', label: 'Precio de venta', render: value => formatPrice(value) },
          { key: 'unitCost', label: 'Costo unitario', render: value => formatPrice(value) },
          { key: 'initialStock', label: 'Stock inicial', render: value => value ?? '—' },
          { key: 'minStock', label: 'Stock mínimo', render: value => value ?? '—' },
          {
            key: 'isActive',
            label: 'Estado',
            render: value => (
              <Badge variant={value ? 'success' : 'destructive'}>
                {value ? 'Activo' : 'Inactivo'}
              </Badge>
            )
          },
          {
            key: 'createdAt',
            label: 'Fecha de Creación',
            render: (value) => formatDate(value)
          },
          {
            key: 'updatedAt',
            label: 'Fecha de Actualización',
            render: (value) => formatDate(value)
          }
        ]}
        pageSize={10}
      />
  )
}
