import { Modal } from '@/components/common/Modal/Modal'
import { Button } from '@/components/ui/button'
import { catalogApi } from '@/features/inventory/api/catalog.api'
import { CatalogForm } from '@/features/inventory/components/catalog/CatalogForm'
import { CategoryTable } from '@/features/inventory/components/catalog/CategoryTable'
import type { Item } from '@/features/inventory/types/catalog.types'
import { ROLES } from '@/features/roles/roles'
import { useFetch } from '@/hooks/useFetch'
import { useAuthStore } from '@/store/auth.store'
import { Plus } from 'lucide-react'
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
       {(user?.role === ROLES.ADMIN || user?.role === ROLES.INVENTARIO) && (
        <Button variant={'primary'} className='w-fit' onClick={() => openForm()}>
          <Plus className='w-4 h-4 mr-2' />
          Agregar Item
        </Button>
      )}
      <CategoryTable
        data={data}
        isLoading={isLoading}
        canWrite={user?.role === ROLES.ADMIN || user?.role === ROLES.INVENTARIO}
        onEdit={openForm}
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
