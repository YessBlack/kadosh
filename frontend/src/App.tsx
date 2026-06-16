import { RouterProvider } from 'react-router-dom'
import { router } from '@/router/router'

export const App = () => {
  return (
    <>
      <div className='fixed right-4 top-4 z-50'></div>
      <RouterProvider router={router} />
    </>
  )
}
