import { Navigate, Outlet } from 'react-router-dom'

export const AuthGuard = () => {
  const isAuthenticated = false
  const isLoading = false

  if (isLoading) {
    return <div>Cargando sesion...</div>
  }

  return isAuthenticated ? <Outlet /> : <Navigate to='/login' />
}
