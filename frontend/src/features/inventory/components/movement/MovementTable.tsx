import { DataTable } from '@/components/common/Table/DataTable'
import { Badge } from '@/components/ui/badge'
import { MOVEMENT_SOURCE_LABELS, MOVEMENT_TYPE_LABELS, MovementSource, MovementType, type InventoryMovement } from '@/features/inventory/types/movement.types'
import { formatDate, formatDateOnly } from '@/utils/dateUtils'
import { formatPrice } from '@/utils/stringUtils'
import { Edit } from 'lucide-react'

interface MovementTableProps {
  data: InventoryMovement[]
  isLoading: boolean
  canWrite: boolean
  onEdit: (movement: InventoryMovement) => void
}

export const MovementTable = ({
  data,
  isLoading,
  canWrite,
  onEdit
}: MovementTableProps) => {
  return (
     <DataTable
        data={data ?? []}
        isLoading={isLoading}
        actions={
          canWrite
          ? [
              {
                icon: <Edit className='w-4 h-4' />,
                onClick: (movement: InventoryMovement) => onEdit(movement),
                className: 'text-violet-500 hover:text-violet-600'
              }
            ]
          : undefined
        }
        columns={[
          {
            key: 'date',
            label: 'Fecha',
            render: (_, movement) => formatDateOnly(movement.date)
          },
          {
            key: 'item',
            columnKey: 'item-name',
            label: 'Ítem',
            render: (_, movement) => movement.item?.name ?? 'Ítem no disponible'
          },
          {
            key: 'type',
            label: 'Tipo',
            render: value => (
              <Badge variant={value === MovementType.IN ? 'success' : 'destructive'}>
                {MOVEMENT_TYPE_LABELS[value as MovementType]}
              </Badge>
            )
          },
          {
            key: 'source',
            label: 'Origen',
            render: value => value ? MOVEMENT_SOURCE_LABELS[value as MovementSource] : '—'
          },
          {
            key: 'quantity',
            label: 'Cantidad',
            render: (value, movement) => (
              <span className={movement.type === MovementType.IN ? 'text-green-600' : 'text-red-600'}>
                {movement.type === MovementType.IN ? '+' : '-'}{String(value)}
              </span>
            )
          },
          {
            key: 'item',
            columnKey: 'item-unit-cost',
            label: 'Costo unitario',
            render: (_, movement) => movement.item ? formatPrice(movement.item.unitCost) : '—'
          },
          {
            key: 'note',
            label: 'Nota',
            render: value => String(value ?? '—')
          },
          {
            key: 'createdBy',
            label: 'Creado por',
            render: (_, movement) => movement.createdBy?.name ?? '—'
          },
          {
            key: 'createdAt',
            label: 'Fecha de Creación',
            render: (_, movement) => formatDate(movement.createdAt)
          },
          {
            key: 'updatedAt',
            label: 'Fecha de Actualización',
            render: (_, movement) => formatDate(movement.updatedAt)
          }
        ]}
        pageSize={10}
      />
  )
}
