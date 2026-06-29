import { PersonalInfoForm } from '@/features/myProfile/components/PersonalInfoForm'
import { ProfileCard } from '@/features/myProfile/components/ProfileCard'
import { SecurityCard } from '@/features/myProfile/components/SecurityCard'

export const ProfilePage = () => {
  return (
    <div className='flex flex-col gap-5 p-2'>
      <div>
        <h1 className='font-bold text-2xl m-0'>Mi Perfil</h1>
        <p className='text-muted-foreground m-0 text-sm italic'>
          Consulta y actualiza tu información personal, administra los datos de tu cuenta y cambia tu contraseña para mantener tu acceso seguro y actualizado.
        </p>
      </div>
      <div className='grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6'>
        <ProfileCard />
        <div>
          <PersonalInfoForm />
          <SecurityCard />
        </div>
      </div>
    </div>
  )
}
