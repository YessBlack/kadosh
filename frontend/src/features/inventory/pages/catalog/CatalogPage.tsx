import { Modal } from '@/components/common/Modal/Modal'
import { DataTable } from '@/components/common/Table/DataTable'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { catalogApi } from '@/features/inventory/api/catalog.api'
import { CatalogForm } from '@/features/inventory/components/catalog/CatalogForm'
import { ItemType, UNIT_LABELS, type Item } from '@/features/inventory/types/catalog.types'
import { ROLES } from '@/features/roles/roles'
import { useFetch } from '@/hooks/useFetch'
import { useAuthStore } from '@/store/auth.store'
import { formatDate } from '@/utils/dateUtils'
import { formatPrice } from '@/utils/stringUtils'
import { Edit, Plus } from 'lucide-react'
import { useCallback, useState } from 'react'

export const CatalogPage = () => {
  const fetchItems = useCallback(() => catalogApi.getItems(), [])
  const { user } = useAuthStore(state => state)
  const { data, isLoading, refetch } = useFetch(fetchItems)

  const [modalOpen, setModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)

  const openForm = (item?: Item) => {
    setModalOpen(true)
    setSelectedItem(item ?? null)
  }

  return (
    <section className='flex flex-col gap-5' aria-labelledby='inventory-catalog-title'>
       {user?.role === ROLES.ADMIN && (
        <Button variant={'primary'} className='w-fit' onClick={() => openForm()}>
          <Plus className='w-4 h-4 mr-2' />
          Agregar Item
        </Button>
      )}
      <DataTable
        data={data ?? []}
        isLoading={isLoading}
        actions={user?.role === ROLES.ADMIN ? [
          {
            icon: <Edit className='w-4 h-4' />,
            onClick: (item: Item) => openForm(item),
            className: 'text-violet-500 hover:text-violet-600'
          }
        ] : undefined}
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
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedItem ? 'Editar Item' : 'Agregar Item'}
      >
        <CatalogForm
          key={selectedItem?.id ?? 'new'}
          selectedItem={selectedItem}
          onSuccess={refetch}
          onClose={() => setModalOpen(false)}
        />
      </Modal>
    </section>
  )
}
