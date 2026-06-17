import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/auth.store'
import { useNavigate } from 'react-router-dom'

export const DashboardPage = () => {
  const navigate = useNavigate()
  const { logout } = useAuthStore()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className='h-full flex flex-col items-center justify-center'>
      <h1>Dashboard</h1>
      <Button onClick={handleLogout}>Cerrar sesión</Button>
    </div>
  )
}
