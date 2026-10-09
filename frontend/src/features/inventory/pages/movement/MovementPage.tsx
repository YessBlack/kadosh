import { Modal } from '@/components/common/Modal/Modal'
import { Button } from '@/components/ui/button'
import { movementApi } from '@/features/inventory/api/movement.api'
import { MovementForm } from '@/features/inventory/components/movement/MovementForm'
import { MovementTable } from '@/features/inventory/components/movement/MovementTable'
import type { InventoryMovement } from '@/features/inventory/types/movement.types'
import { ROLES } from '@/features/roles/roles'
import { useFetch } from '@/hooks/useFetch'
import { useAuthStore } from '@/store/auth.store'
import { Plus } from 'lucide-react'
import { useCallback, useState } from 'react'

export const MovementPage = () => {
  const fetchItems = useCallback(() => movementApi.getMovements(), [])

  const { user } = useAuthStore()
  const { data, isLoading, refetch } = useFetch(fetchItems)

  const [modalOpen, setModalOpen] = useState(false)
  const [selectedMovement, setSelectedMovement] = useState<InventoryMovement | null>(null)

  const openForm = (movement?: InventoryMovement) => {
    setModalOpen(true)
    setSelectedMovement(movement ?? null)
  }

  return (
    <section className='flex flex-col gap-5' aria-labelledby='inventory-catalog-title'>
       {user?.role === ROLES.ADMIN && (
        <Button variant={'primary'} className='w-fit' onClick={() => openForm()}>
          <Plus className='w-4 h-4 mr-2' />
          Agregar Movimiento
        </Button>
      )}
      <MovementTable
        data={data}
        isLoading={isLoading}
        canWrite={user?.role === ROLES.ADMIN || user?.role === ROLES.INVENTARIO}
        onEdit={openForm}
      />
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedMovement ? 'Editar Movimiento' : 'Agregar Movimiento'}
      >
        <MovementForm
          selectedMovement={selectedMovement}
          onSuccess={refetch}
          onClose={() => setModalOpen(false)}
        />
      </Modal>
    </section>
  )
}
