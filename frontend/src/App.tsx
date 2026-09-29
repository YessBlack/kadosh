import { RouterProvider } from 'react-router-dom'
import { router } from '@/router/router'
import { useEffect } from 'react'
import { useAuthStore } from './store/auth.store'
import { ThemeToggle } from '@/components/shared/ThemeToggle'
import { useBusinessStore } from '@/store/business.store'

export const App = () => {
  const { initialize } = useAuthStore()
  const { getBusiness } = useBusinessStore()

  useEffect(() => {
    initialize()
    getBusiness()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <div className='fixed right-4 top-4 z-50'>
        <ThemeToggle />
      </div>
      <RouterProvider router={router} />
    </>
  )
}
