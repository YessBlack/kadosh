import { BusinessCard } from '@/features/myBusiness/components/BusinessCard'
import { BusinessForm } from '@/features/myBusiness/components/BusinessForm'
import { BusinessLocation } from '@/features/myBusiness/components/BusinessLocation'
import { useBusinessStore } from '@/store/business.store'

export const MyBusinessPage = () => {
  const { business, isLoading } = useBusinessStore()

  if (isLoading) return <p>Loading...</p>

  return (
    <div className='flex flex-col gap-5 p-2'>
      <div>
        <h1 className='font-bold text-2xl m-0'>Mi Negocio</h1>
        <p className='text-muted-foreground m-0 text-sm italic'>
          Aquí puedes gestionar la información de tu negocio, actualizar detalles y mantener todo al día.
        </p>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6 items-start'>
        <BusinessCard />
        <div className='flex flex-col gap-3'>
          {business && <BusinessForm />}
          {business && <BusinessLocation/>}
        </div>
      </div>
    </div>
  )
}
