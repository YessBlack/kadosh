import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useLoginForm } from './useLoginForm'

const navigateMock = vi.fn()
vi.mock('react-router-dom', () => ({
  useNavigate: () => navigateMock
}))

const loginMock = vi.fn()
vi.mock('@/store/auth.store', () => ({
  useAuthStore: (selector: (state: { login: typeof loginMock }) => unknown) =>
    selector({ login: loginMock })
}))

describe('useLoginForm', () => {
  describe('initial state', () => {
    it('should initialize with empty values and no errors', () => {
      const { result } = renderHook(() => useLoginForm())
      expect(result.current.values).toEqual({ email: '', password: '' })
      expect(result.current.errors).toEqual({})
      expect(result.current.isSubmitting).toBe(false)
    })
  })

  describe('validation', () => {
    it('should validate email and password fields', async () => {
      const { result } = renderHook(() => useLoginForm())

      act(() => {
        result.current.setValues({ email: 'invalid-email', password: 'short' })
      })

      await act(async () => {
        await result.current.handleSubmit({ preventDefault: () => { } } as React.FormEvent)
      })

      expect(result.current.errors.email).toBeDefined()
    })

    it('should set errors when validation fails', async () => {
      const { result } = renderHook(() => useLoginForm())

      await act(async () => {
        await result.current.handleSubmit({ preventDefault: () => { } } as React.FormEvent)
      })

      expect(result.current.errors.email).toBe('El email es requerido')
      expect(result.current.errors.password).toBe('La contraseña es requerida')
    })
  })

  describe('handleSubmit', () => {
    it('should call login and navigate on successful submission', async () => {
      loginMock.mockResolvedValueOnce(undefined)

      const { result } = renderHook(() => useLoginForm())

      act(() => {
        result.current.setValues({ email: 'test@example.com', password: 'password123' })
      })

      await act(async () => {
        await result.current.handleSubmit({ preventDefault: () => { } } as React.FormEvent)
      })

      expect(loginMock).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password123' })
      expect(navigateMock).toHaveBeenCalledWith('/dashboard')
    })

    it('should set server error on failed login', async () => {
      loginMock.mockRejectedValueOnce(new Error('Login failed'))

      const { result } = renderHook(() => useLoginForm())

      act(() => {
        result.current.setValues({ email: 'test@example.com', password: 'password123' })
      })

      await act(async () => {
        await result.current.handleSubmit({ preventDefault: () => { } } as React.FormEvent)
      })

      expect(result.current.errors.server).toBe('Credenciales incorrectas')
    })
  })
})
