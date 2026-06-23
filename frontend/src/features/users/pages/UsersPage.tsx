import { DataTable } from '@/components/common/DataTable'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { userApi } from '@/features/users/api/user.api'
import type { User } from '@/features/users/types/auth.types'
import { formatDate } from '@/utils/dateUtils'
import { Edit, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'

export const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    const getUsers = async () => {
      const users = await userApi.getAllUsers()
      setUsers(users)
    }
    getUsers()
  }, [])

  return (
    <div className='flex flex-col gap-5 p-2'>
      <div>
        <h1 className='font-bold text-2xl m-0'>Gestión de Usuarios</h1>
        <p className='text-muted-foreground m-0 text-sm italic'>
          Administra los usuarios que tienen acceso al sistema, asigna roles y controla su actividad para garantizar la seguridad y eficiencia de tu negocio.
        </p>
      </div>
      <Button variant={'primary'} className='w-fit' onClick={() => { }}>
        <Plus className='w-4 h-4 mr-2' />
        Agregar Usuario
      </Button>
      <DataTable
        data={users}
        actions={[
          {
            icon: <Button variant={'outline'} size={'sm'}>
              <Edit className='w-3 h-3' />
            </Button>,
            onClick: (user) => { },
            className: 'text-violet-500 hover:text-violet-600'
          }
        ]}
        columns={[
          { key: 'name', label: 'Nombre' },
          { key: 'lastname', label: 'Apellido' },
          { key: 'email', label: 'Email' },
          {
            key: 'isActive', label: 'Estado', render: (value) => (
              <Badge variant={value ? 'success' : 'destructive'}>
                {value ? 'Activo' : 'Inactivo'}
              </Badge>
            )
          },
          {
            key: 'createdBy',
            label: 'Creado Por',
            render: (value) => value || 'Sistema'
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
    </div>
  )
}
