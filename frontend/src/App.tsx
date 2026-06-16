import { RouterProvider } from 'react-router-dom'
import { router } from '@/router/router'
import { useEffect, useState } from 'react'
import { useAuthStore } from './store/auth.store'

export const App = () => {
  const { initialize, login } = useAuthStore()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    initialize()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLogin = () => {
    login({ email: username, password })
  }

  return (
    <>
      <div className='fixed right-4 top-4 z-50'></div>
      <RouterProvider router={router} />
      <div>
        <input
          type='text'
          placeholder='username'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type='password'
          placeholder='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
      </div>
    </>
  )
}
