import { AppAlert } from '@/components/common/Alert/Alert'
import { ALERT_VARIANT } from '@/components/common/Alert/alert.type'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { userApi } from '@/features/users/api/user.api'
import { useAuthStore } from '@/store/auth.store'
import { showToast } from '@/utils/toast.utils'
import { Edit } from 'lucide-react'
import { useMemo, useState } from 'react'
import { isMobilePhone } from 'validator'

export const PersonalInfoForm = () => {
  const { user, setUser } = useAuthStore()

  const [name, setName] = useState(user?.name || '')
  const [lastname, setLastname] = useState(user?.lastname || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const hasChanges = useMemo(() => {
    const nameChanged = name !== (user?.name || '')
    const lastnameChanged = lastname !== (user?.lastname || '')
    const phoneChanged = phone !== (user?.phone?.toString() || '')
    const phoneIsNumber = isMobilePhone(phone, 'any')

    return (nameChanged || lastnameChanged || phoneChanged) && phoneIsNumber
  }, [name, lastname, phone, user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user || !user.id) {
      return showToast.error('Error', 'No existe información del usuario')
    }

    const userData = {
      name,
      lastname,
      phone
    }

    setIsSubmitting(true)
    const response = await userApi.updateUser(user?.id, userData)

    if (response) {
      setUser({ ...user, ...response })
      setIsSubmitting(false)
      return showToast.success('Exito', 'Información Actualizada')
    }

    setIsSubmitting(false)
    showToast.error('Error', 'Ocurrio un error al actualizar la información')
  }

  return (
    <div className='border rounded-2xl flex flex-col overflow-hidden shadow-xs'>
      <div className='flex justify-between items-center bg-slate-100 px-4 py-3 rounded-t-2xl border-b'>
        <h1 className='font-bold text-lg m-0'>Información Personal</h1>
        <Edit size={18} />
      </div>
      <div className='p-4 flex flex-col gap-4'>
        <AppAlert
          title='Actualiza tu información'
          description='Puedes editar tu nombre y teléfono libremente. Si necesitas cambiar tu correo u otros datos, contacta a un administrador.'
          variant={ALERT_VARIANT.PURPLE}
        />
        <form onSubmit={handleSubmit} className='w-full flex flex-col gap-4'>
          <div className='flex flex-col gap-3 w-full sm:flex-row'>
            <div className='flex flex-col gap-1 w-full'>
              <Label required>
                Nombre del Usuario
              </Label>
              <Input
                placeholder='Jhon'
                required
                name='name'
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className='flex flex-col gap-1  w-full'>
              <Label required>
                Apellido del Usuario
              </Label>
              <Input
                placeholder='Doe'
                required
                name='lastname'
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
              />
            </div>
          </div>

          <div className='flex flex-col gap-3 w-full sm:flex-row'>
            <div className='flex gap-1 flex-col w-full'>
              <Label required>
                Telefono
              </Label>
              <Input
                placeholder='+57 317 XXX XXXX'
                type='text'
                required
                name='text'
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className='flex flex-col gap-1 w-full'>
              <Label required>
                Correo Electrónico
              </Label>
              <Input
                placeholder='doe@email.com'
                type='email'
                required
                name='email'
                value={user?.email || ''}
                disabled={true}
                onChange={() => { }}
              />
            </div>
          </div>

          <div className='flex flex-col items-end'>
            <Button type='submit' variant={'primary'} className='w-fit' disabled={!hasChanges || isSubmitting}>
              Actualizar Información
            </Button>
          </div>
        </form >
      </div>
    </div>
  )
}
