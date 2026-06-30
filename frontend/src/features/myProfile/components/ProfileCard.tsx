import { UploadPicture } from '@/components/shared/UploadPicture'
import { Badge } from '@/components/ui/badge'
import { profileApi } from '@/features/myProfile/api/profile.api'
import { useAuthStore } from '@/store/auth.store'
import { formatDate } from '@/utils/dateUtils'
import { showToast } from '@/utils/toast.utils'
import { Calendar1Icon, Clock, Mail, Phone } from 'lucide-react'
import { useState } from 'react'

interface InfoRowProps {
  icon: React.ReactNode
  label: string
  value?: string
}

const InfoRow = ({ icon, label, value }: InfoRowProps) => (
  <div className='flex items-center gap-3 py-2.5'>
    <div className='flex h-8.5 w-8.5 shrink-0 items-center justify-center rounded-[9px] border border-border bg-muted text-violet-600 dark:text-violet-400'>
      {icon}
    </div>
    <div className='min-w-0'>
      <p className='text-[11px] text-muted-foreground'>{label}</p>
      <p className='truncate text-sm font-medium text-foreground'>{value ?? '—'}</p>
    </div>
  </div>
)

export const ProfileCard = () => {
  const { user, setUser } = useAuthStore()

  const [isUploading, setIsUploading] = useState<boolean>(false)

  const handleUpdateAvatar = async (image: File) => {
    if (!user || !user.id) {
      return showToast.error('Error', 'No existe información del usuario')
    }

    setIsUploading(true)
    const response = await profileApi.updateUserAvatar(user?.id, image)

    if (response) {
      setUser({ ...user, ...response })
      setIsUploading(false)
      return showToast.success('Exito', 'Foto de Perfil Actualizada')
    }

    setIsUploading(false)
    return showToast.error('Error', 'Ocurrio un error al actualizar la foto de perfil')
  }

  return (
    <div className='rounded-2xl border border-border bg-background shadow-xs'>

      <div
        className='h-30 w-full rounded-t-[14px]'
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%238b5cf6\' fill-opacity=\'0.12\'%3E%3Ccircle cx=\'20\' cy=\'20\' r=\'10\'/%3E%3Ccircle cx=\'0\' cy=\'0\' r=\'10\'/%3E%3Ccircle cx=\'40\' cy=\'0\' r=\'10\'/%3E%3Ccircle cx=\'0\' cy=\'40\' r=\'10\'/%3E%3Ccircle cx=\'40\' cy=\'40\' r=\'10\'/%3E%3C/g%3E%3C/svg%3E")',
          backgroundColor: 'oklch(var(--violet-50) / 0.5)'
        }}
      />

      <div className='flex flex-col items-center gap-3 px-5 pb-6 -mt-15'>
        <UploadPicture
          isLoading={isUploading}
          imageUrl={user?.avatar}
          name={user?.name}
          lastname={user?.lastname}
          onGetImage={handleUpdateAvatar}
        />

        <div className='text-center'>
          <p className='text-xl font-medium leading-tight'>
            {user?.name} {user?.lastname}
          </p>
        </div>

        <div className='flex gap-2'>
          <Badge className='rounded-full bg-violet-100 text-violet-800 hover:bg-violet-100 dark:bg-violet-900/40 dark:text-violet-300'>
            Administrador
          </Badge>
          <Badge
            variant={user?.isActive ? 'success' : 'destructive'}
            className='rounded-full'
          >
            {user?.isActive ? 'Activo' : 'Inactivo'}
          </Badge>
        </div>
      </div>

      <div className='divide-y divide-border px-5 pb-4'>
        <InfoRow icon={<Mail size={15} />} label='Correo' value={user?.email} />
        <InfoRow icon={<Phone size={15} />} label='Teléfono' value='23423424' />
        <InfoRow icon={<Calendar1Icon size={15} />} label='Miembro desde' value={formatDate(user?.createdAt)} />
        <InfoRow icon={<Clock size={15} />} label='Último acceso' value={formatDate(user?.lastLogin)} />
      </div>
    </div>
  )
}
