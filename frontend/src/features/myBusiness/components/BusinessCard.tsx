import { UploadPicture } from '@/components/shared/UploadPicture'
import { Badge } from '@/components/ui/badge'
import { useBusinessStore } from '@/store/business.store'
import { showToast } from '@/utils/toast.utils'
import { Mail, MapPin, Phone } from 'lucide-react'
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

export const BusinessCard = () => {
  const { business, updateLogo } = useBusinessStore()

  const [isUploading, setIsUploading] = useState(false)

  const handleUploadLogo = async (file: File) => {
    if (!business) return
    setIsUploading(true)

    try {
      await updateLogo(business.id, file)
      showToast.success('Exito', 'Información Actualizada')
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      showToast.error('Error', 'No se pudo actualizar el logo')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className='rounded-2xl border border-border bg-background shadow-xs'>
      <div
        className='h-30 w-full rounded-t-[14px]'
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%238b5cf6\' fill-opacity=\'0.12\'%3E%3Ccircle cx=\'20\' cy=\'20\' r=\'10\'/%3E%3Ccircle cx=\'0\' cy=\'0\' r=\'10\'/%3E%3Ccircle cx=\'40\' cy=\'0\' r=\'10\'/%3E%3Ccircle cx=\'0\' cy=\'40\' r=\'10\'/%3E%3Ccircle cx=\'40\' cy=\'40\' r=\'10\'/%3E%3C/g%3E%3C/svg%3E")',
          backgroundColor: 'oklch(var(--violet-50) / 0.7)'
        }}
      />

      <div className='flex flex-col items-center gap-3 px-5 pb-6 -mt-15'>
        <UploadPicture
          isLoading={isUploading}
          imageUrl={business?.logo || ''}
          name={business?.name || 'K'}
          lastname='D'
          onGetImage={handleUploadLogo}
        />

        <div className='text-center'>
          <p className='text-xl font-medium leading-tight'>{business?.name || 'Kadosh'}</p>
          <p className='mt-1 text-xs text-muted-foreground'>NIT: {business?.nit || '123456789-1'}</p>
        </div>

        <div className='flex flex-wrap justify-center gap-2'>
          <Badge variant={'success'} className='rounded-full'>{business?.companyType || 'Enterprise'}</Badge>
          <Badge variant={'destructive'} className='rounded-full'>{business?.industry || 'Software'}</Badge>
        </div>

        <p className='text-balance text-center text-sm leading-relaxed text-muted-foreground'>
          {business?.description || '—'}
        </p>
      </div>

      <div className='divide-y divide-border border-t border-border px-5 py-2'>
        <InfoRow icon={<Mail size={15} />} label='Correo' value={business?.email || 'kadosh@example.com'} />
        <InfoRow icon={<Phone size={15} />} label='Teléfono' value={business?.phone || '123-456-7890'} />
        <InfoRow icon={<MapPin size={15} />} label='Ciudad' value={business?.city || 'Bogotá'} />
      </div>
    </div>
  )
}
