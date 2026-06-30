import { LoginForm } from '@/features/users/components/LoginForm'
import { useLoginForm } from '@/features/users/hooks/useLoginForm'
import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'

vi.mock('@/features/hooks/useLoginForm')

const mockUseLoginForm = vi.mocked(useLoginForm)

describe('LoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should disable button when fields are empty', () => {
    mockUseLoginForm.mockReturnValue({
      values: { email: '', password: '' },
      errors: {},
      isSubmitting: false,
      handleChange: vi.fn(),
      handleSubmit: vi.fn(),
      isFormFilled: () => false,
      setValues: vi.fn()
    })

    render(<LoginForm />)
    const button = screen.getByRole('button', { name: /ingresar/i })
    expect(button).toBeDisabled()
  })

  it('should show error if email is invalid', () => {
    mockUseLoginForm.mockReturnValue({
      values: { email: 'invalid-email', password: 'password123' },
      errors: { email: 'Debe ser un email válido' },
      isSubmitting: false,
      handleChange: vi.fn(),
      handleSubmit: vi.fn(),
      isFormFilled: () => true,
      setValues: vi.fn()
    })

    render(<LoginForm />)
    expect(screen.getByText('Debe ser un email válido')).toBeInTheDocument()
  })

  it('should call onSubmit when form is valid', async () => {
    const handleSubmitMock = vi.fn()
    const user = userEvent.setup()

    mockUseLoginForm.mockReturnValue({
      values: { email: 'test@example.com', password: 'password123' },
      errors: {},
      isSubmitting: false,
      handleChange: vi.fn(),
      handleSubmit: handleSubmitMock,
      isFormFilled: () => true,
      setValues: vi.fn()
    })

    render(<LoginForm />)

    const button = screen.getByRole('button', { name: /ingresar/i })
    await user.click(button)

    expect(handleSubmitMock).toHaveBeenCalled()
  })
})
