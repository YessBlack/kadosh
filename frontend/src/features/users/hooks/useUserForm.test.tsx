import { useLoginForm } from '@/features/users/hooks/useLoginForm'
import { useUserForm } from '@/features/users/hooks/useUserForm'
import type { User } from '@/features/users/types/auth.types'
import { useAuthStore } from '@/store/auth.store'
import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/features/users/api/user.api')
vi.mock('@/utils/toast.utils')

const mockNavigate = vi.fn()

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate
}))

const mockLogin = vi.fn()

describe('useUserForm', () => {
  beforeEach(() => {
    useAuthStore.setState({ user: { id: '1', name: 'Test User', lastname: 'User' } as User })
    useAuthStore.setState({ login: mockLogin })
    vi.clearAllMocks()
  })

  describe('isCompleted - creation mode', () => {
    it('should be false when required fields are empty', () => {
      const { result } = renderHook(() =>
        useUserForm({ selectedUser: null, onSuccess: vi.fn() })
      )

      expect(result.current.isCompleted).toBe(false)
    })

    it('should be false with invalid email', () => {
      const { result } = renderHook(() =>
        useUserForm({ selectedUser: null, onSuccess: vi.fn() })
      )

      expect(result.current.isCompleted).toBe(false)
    })
  })

  it('should be false with invalid email', () => {
    const { result } = renderHook(() =>
      useUserForm({ selectedUser: null, onSuccess: vi.fn() })
    )

    act(() => {
      result.current.setValues(prev => ({
        ...prev,
        name: 'John',
        lastname: 'Doe',
        email: 'not-an-email',
        password: 'password123',
        passwordConfirm: 'password123'
      }))
    })

    expect(result.current.isCompleted).toBe(false)
  })

  it('should be false when password do not match', () => {
    const { result } = renderHook(() =>
      useUserForm({ selectedUser: null, onSuccess: vi.fn() })
    )

    act(() => {
      result.current.setValues(prev => ({
        ...prev,
        name: 'John',
        lastname: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
        passwordConfirm: 'differentPassword'
      }))
    })

    expect(result.current.isCompleted).toBe(false)
  })

  it('should be true when all required fields are valid and passwords match', () => {
    const { result } = renderHook(() =>
      useUserForm({ selectedUser: null, onSuccess: vi.fn() })
    )

    act(() => {
      result.current.setValues(prev => ({
        ...prev,
        name: 'John',
        lastname: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
        passwordConfirm: 'password123'
      }))
    })

    expect(result.current.isCompleted).toBe(true)
  })

  describe('isFormFilled', () => {
    it('should be false when both fields are empty', () => {
      const { result } = renderHook(() => useLoginForm())
      expect(result.current.isFormFilled()).toBe(false)
    })

    it('should be false when only email is filled', () => {
      const { result } = renderHook(() => useLoginForm())

      act(() => {
        result.current.setValues({ email: 'test@test.com', password: '' })
      })

      expect(result.current.isFormFilled()).toBe(false)
    })

    it('should be true when both fields have content', () => {
      const { result } = renderHook(() => useLoginForm())

      act(() => {
        result.current.setValues({ email: 'test@test.com', password: '12345678' })
      })

      expect(result.current.isFormFilled()).toBe(true)
    })
  })

  describe('handleChange', () => {
    it('should update the value for that field', () => {
      const { result } = renderHook(() => useLoginForm())

      act(() => {
        result.current.handleChange({
          target: { name: 'email', value: 'new@test.com' }
        } as React.ChangeEvent<HTMLInputElement>)
      })

      expect(result.current.values.email).toBe('new@test.com')
    })

    it('should clear the error for that field when the user types', async () => {
      const { result } = renderHook(() => useLoginForm())

      await act(async () => {
        await result.current.handleSubmit({ preventDefault: vi.fn() } as unknown as React.FormEvent)
      })

      expect(result.current.errors.email).toBeDefined()

      act(() => {
        result.current.handleChange({
          target: { name: 'email', value: 'a' }
        } as React.ChangeEvent<HTMLInputElement>)
      })

      expect(result.current.errors.email).toBeUndefined()
    })
  })

  describe('handleSubmit - validation', () => {
    it('should set email required error and not call login', async () => {
      const { result } = renderHook(() => useLoginForm())

      act(() => {
        result.current.setValues({ email: '', password: 'password123' })
      })

      await act(async () => {
        await result.current.handleSubmit({ preventDefault: vi.fn() } as unknown as React.FormEvent)
      })

      expect(result.current.errors.email).toBe('El email es requerido')
      expect(mockLogin).not.toHaveBeenCalled()
    })

    it('should set invalid email format error', async () => {
      const { result } = renderHook(() => useLoginForm())

      act(() => {
        result.current.setValues({ email: 'not-an-email', password: 'password123' })
      })

      await act(async () => {
        await result.current.handleSubmit({ preventDefault: vi.fn() } as unknown as React.FormEvent)
      })

      expect(result.current.errors.email).toBe('Debe ser un email válido')
    })

    it('should set password required error', async () => {
      const { result } = renderHook(() => useLoginForm())

      act(() => {
        result.current.setValues({ email: 'test@test.com', password: '' })
      })

      await act(async () => {
        await result.current.handleSubmit({ preventDefault: vi.fn() } as unknown as React.FormEvent)
      })

      expect(result.current.errors.password).toBe('La contraseña es requerida')
    })

    it('should set min length error when password is too short', async () => {
      const { result } = renderHook(() => useLoginForm())

      act(() => {
        result.current.setValues({ email: 'test@test.com', password: '123' })
      })

      await act(async () => {
        await result.current.handleSubmit({ preventDefault: vi.fn() } as unknown as React.FormEvent)
      })

      expect(result.current.errors.password).toBe('Mínimo 8 caracteres')
    })
  })

  describe('handleSubmit - success', () => {
    it('should call login with values and navigate to dashboard', async () => {
      mockLogin.mockResolvedValue(undefined)
      const { result } = renderHook(() => useLoginForm())

      act(() => {
        result.current.setValues({ email: 'test@test.com', password: 'password123' })
      })

      await act(async () => {
        await result.current.handleSubmit({ preventDefault: vi.fn() } as unknown as React.FormEvent)
      })

      expect(mockLogin).toHaveBeenCalledWith({ email: 'test@test.com', password: 'password123' })
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard')
    })
  })

  describe('handleSubmit - server error', () => {
    it('should set server error and not navigate when login rejects', async () => {
      mockLogin.mockRejectedValue(new Error('Invalid credentials'))
      const { result } = renderHook(() => useLoginForm())

      act(() => {
        result.current.setValues({ email: 'test@test.com', password: 'password123' })
      })

      await act(async () => {
        await result.current.handleSubmit({ preventDefault: vi.fn() } as unknown as React.FormEvent)
      })

      expect(result.current.errors.server).toBe('Credenciales incorrectas')
      expect(mockNavigate).not.toHaveBeenCalled()
      expect(result.current.isSubmitting).toBe(false)
    })
  })
})
