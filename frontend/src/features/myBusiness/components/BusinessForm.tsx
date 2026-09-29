import { AppAlert } from '@/components/common/Alert/Alert'
import { ALERT_VARIANT } from '@/components/common/Alert/alert.type'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { Business } from '@/features/myBusiness/types/Business'
import { useBusinessStore } from '@/store/business.store'
import { showToast } from '@/utils/toast.utils'
import { BriefcaseBusiness } from 'lucide-react'
import { useMemo, useState } from 'react'

export const BusinessForm = () => {
  const { business, updateBusiness } = useBusinessStore()
  const [businessData, setBusinessData] = useState<Business>({ ...business } as Business)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const { isChanged, hasEmpty } = useMemo(() => {
    const fields = ['name', 'nit', 'companyType', 'industry', 'description'] as const

    return {
      isChanged: fields.some(
        (f) => (businessData[f] ?? '').trim() !== (business?.[f] ?? '').trim()
      ),
      hasEmpty: fields.some((f) => !(businessData[f] ?? '').trim())
    }
  }, [businessData, business])

  const canSubmit = isChanged && !hasEmpty && !isSubmitting

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!businessData || !businessData.id) {
      return showToast.error('Error', 'No existe información del usuario')
    }

    const payload = {
      name: businessData.name,
      nit: businessData.nit,
      companyType: businessData.companyType,
      industry: businessData.industry,
      description: businessData.description
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
        <h1 className='font-bold text-lg m-0'>Información del Negocio</h1>
        <BriefcaseBusiness size={18} />
      </div>
      <div className='p-4 flex flex-col gap-4'>
        <AppAlert
          title='Actualiza la información del negocio'
          description='Puedes editar la información de tu negocio, incluyendo nombre, NIT, tipo de empresa, industria y descripción, según sea necesario.'
          variant={ALERT_VARIANT.PURPLE}
        />
        <form onSubmit={handleSubmit} className='w-full flex flex-col gap-4'>
          <div className='flex flex-col gap-3 w-full sm:flex-row'>
            <div className='flex flex-col gap-1 w-full'>
              <Label required>
                Nombre del Negocio
              </Label>
              <Input
                placeholder='Kadosh'
                required
                name='name'
                value={businessData.name || ''}
                onChange={(e) => setBusinessData({ ...businessData, name: e.target.value })}
              />
            </div>
            <div className='flex flex-col gap-1  w-full'>
              <Label required>
                Identificación / NIT
              </Label>
              <Input
                placeholder='19283948329-2'
                required
                name='nit'
                value={businessData.nit || ''}
                onChange={(e) => setBusinessData({ ...businessData, nit: e.target.value })}
              />
            </div>
          </div>

          <div className='flex flex-col gap-3 w-full sm:flex-row'>
            <div className='flex flex-col gap-1  w-full'>
              <Label required>
                Tipo de Empresa o Segmento
              </Label>
              <Input
                placeholder='Enterprise'
                required
                name='companyType'
                value={businessData.companyType || ''}
                onChange={(e) => setBusinessData({ ...businessData, companyType: e.target.value })}
              />
            </div>
            <div className='flex flex-col gap-1  w-full'>
              <Label required>
                Categoría o Industria
              </Label>
              <Input
                placeholder='Software'
                required
                name='industry'
                value={businessData.industry || ''}
                onChange={(e) => setBusinessData({ ...businessData, industry: e.target.value })}
              />
            </div>
          </div>

          <div className='flex flex-col gap-3 w-full sm:flex-row'>

            <div className='flex flex-col gap-1  w-full'>
              <Label required>
                Descripción del Negocio
              </Label>
               <Textarea
                  placeholder='Descripción del negocio'
                  required
                  name='businessDescription'
                  value={businessData.description || ''}
                  onChange={(e) => setBusinessData({ ...businessData, description: e.target.value })}
                />
            </div>
          </div>

          <div className='flex flex-col items-end'>
            <Button type='submit' variant={'primary'} className='w-fit' disabled={!canSubmit}>
              Actualizar Información
            </Button>
          </div>
        </form >
      </div>
    </div>
  )
}
