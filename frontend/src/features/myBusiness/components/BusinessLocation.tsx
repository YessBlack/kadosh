import { MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AppAlert } from '@/components/common/Alert/Alert'
import { ALERT_VARIANT } from '@/components/common/Alert/alert.type'
import type { Business } from '@/features/myBusiness/types/Business'
import { useMemo, useState } from 'react'
import { showToast } from '@/utils/toast.utils'
import { useBusinessStore } from '@/store/business.store'

export const BusinessLocation = () => {
  const { business, updateBusiness } = useBusinessStore()

  const [businessData, setBusinessData] = useState<Business>({ ...business } as Business)
  const [isSubmitting, setIsSubmitting] = useState(false)

    const { isChanged, hasEmpty } = useMemo(() => {
      const fields = ['city', 'email', 'phone'] as const

      return {
        isChanged: fields.some(
          (f) => (businessData[f] ?? '').trim() !== (business?.[f] ?? '').trim()
        ),
        hasEmpty: fields.some((f) => !(businessData[f] ?? '').trim())
      }
    }, [businessData, business])

    const canSubmit = isChanged && !hasEmpty && !isSubmitting

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()

    const payload = {
      city: businessData.city,
      email: businessData.email,
      phone: businessData.phone
    }

    setIsSubmitting(true)

    try {
      await updateBusiness(businessData.id, payload)
      showToast.success('Exito', 'Información Actualizada')
    } catch (error: unknown) {
      const message = (error as { response?: { data?: { message?: unknown } } })?.response?.data?.message
      showToast.error('Error', typeof message === 'string' ? message : 'Ocurrio un error al actualizar la información')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='border rounded-2xl flex flex-col overflow-hidden shadow-xs'>
      <div className='flex justify-between items-center bg-slate-100 px-4 py-3 rounded-t-2xl border-b dark:bg-slate-800/70'>
        <h1 className='font-bold text-lg m-0'>Datos de Contacto y Ubicación</h1>
        <MapPin size={18} />
      </div>

      <div className='p-4 flex flex-col gap-4'>
        <AppAlert
          title='Mantén tus datos de contacto al día'
          description='En esta sección puedes actualizar la información de contacto y la ubicación de tu negocio, asegurando que tus clientes siempre tengan los datos correctos.'
          variant={ALERT_VARIANT.PURPLE}
        />

        <form className='w-full flex flex-col gap-4' onSubmit={handleUpdate}>
          <div className='flex flex-col gap-3 w-full sm:flex-row'>
            <div className='flex flex-col gap-1 w-full'>
              <Label required>Correo Corporativo</Label>
              <Input
                type='email'
                placeholder='contacto@kadosh.com'
                required
                name='email'
                value={businessData.email || ''}
                onChange={(e) => setBusinessData({ ...businessData, email: e.target.value })}
              />
            </div>

            <div className='flex flex-col gap-1 w-full'>
              <Label required>Teléfono</Label>
              <Input
                type='tel'
                placeholder='+57 300 123 4567'
                required
                name='phone'
                value={businessData.phone || ''}
                onChange={(e) => setBusinessData({ ...businessData, phone: e.target.value })}
              />
            </div>
          </div>

          <div className='flex flex-col gap-3 w-full sm:flex-row'>
            <div className='flex flex-col gap-1 w-full sm:w-[calc(50%-0.375rem)]'>
              <Label required>Ciudad</Label>
              <Input
                placeholder='Bogotá'
                required
                name='city'
                value={businessData.city || ''}
                onChange={(e) => setBusinessData({ ...businessData, city: e.target.value })}
              />
            </div>
          </div>

          <div className='flex flex-col items-end'>
            <Button type='submit' variant='primary' className='w-fit' disabled={!canSubmit}>
              Actualizar Información
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
