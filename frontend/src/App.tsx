import { RouterProvider } from 'react-router-dom'
import { router } from '@/router/router'
import { useEffect } from 'react'
import { useAuthStore } from './store/auth.store'

export const App = () => {
  useEffect(() => {
    useAuthStore.getState().initialize()
  }, [])

  return (
    <>
      <div className='fixed right-4 top-4 z-50'></div>
      <RouterProvider router={router} />
    </>
  )
}
