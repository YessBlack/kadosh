import { UserForm } from '@/features/users/components/UserForm'
import { useUserForm } from '@/features/users/hooks/useUserForm'
import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/features/users/hooks/useUserForm')

const mockUseUserForm = vi.mocked(useUserForm)

const baseValues = {
  name: '',
  lastname: '',
  email: '',
  password: '',
  passwordConfirm: '',
  isActive: true,
  createdBy: ''
}

const defaultMock = {
  values: baseValues,
  isSubmitting: false,
  isDeleting: false,
  isCompleted: false,
  handleChange: vi.fn(),
  handleSubmit: vi.fn(),
  setIsDeleting: vi.fn(),
  handleDelete: vi.fn(),
  setValues: vi.fn()
}

describe('UserForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Mode - creation (selectedUser = null)', () => {
    it('should show email, password fields and submit button', () => {
      mockUseUserForm.mockReturnValue(defaultMock)

      render(<UserForm selectedUser={null} onSuccess={vi.fn()} />)

      expect(screen.getByText('Correo Electrónico')).toBeInTheDocument()
      expect(screen.getByText('Contraseña')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Crear Usuario' }))
    })

    it('should not display button delete', () => {
      mockUseUserForm.mockReturnValue(defaultMock)

      render(<UserForm selectedUser={null} onSuccess={vi.fn()} />)

      expect(screen.queryByRole('button', { name: 'Eliminar' })).not.toBeInTheDocument()
    })
  })

  describe('Mode - edit (selectedUser)', () => {
    const selectedUser = {
      id: '1',
      email: 'john.doe@example.com',
      name: 'John',
      lastname: 'Doe',
      isActive: true,
      createdBy: 'admin',
      lastLogin: '2024-06-01T12:00:00Z',
      createdAt: '2024-05-01T12:00:00Z',
      updatedAt: '2024-06-01T12:00:00Z'

    }

    it('should hide email and password fields', () => {
      mockUseUserForm.mockReturnValue({
        ...defaultMock,
        values: { ...baseValues, name: 'Jhon', lastname: 'Doe' }
      })
      render(<UserForm selectedUser={selectedUser} onSuccess={vi.fn()} />)

      expect(screen.queryByText('Correo Electrónico')).not.toBeInTheDocument()
      expect(screen.queryByText('Contraseña')).not.toBeInTheDocument()
    })

    it('should show delete and edit buttons', () => {
      mockUseUserForm.mockReturnValue(defaultMock)

      render(<UserForm selectedUser={selectedUser} onSuccess={vi.fn()} />)

      expect(screen.getByRole('button', { name: 'Eliminar' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Actualizar' })).toBeInTheDocument()
    })

    it('should call IsDeleting when delete button is clicked', () => {
      mockUseUserForm.mockReturnValue(defaultMock)

      render(<UserForm selectedUser={selectedUser} onSuccess={vi.fn()} />)

      const deleteButton = screen.getByRole('button', { name: 'Eliminar' })
      deleteButton.click()

      expect(defaultMock.setIsDeleting).toHaveBeenCalledWith(true)
    })

    it('should show confirmation alert when isDeleting is true', () => {
      mockUseUserForm.mockReturnValue({ ...defaultMock, isDeleting: true })

      render(<UserForm selectedUser={selectedUser} onSuccess={vi.fn()} />)

      expect(screen.getByText('¿Estás seguro?')).toBeInTheDocument()
    })
  })
})
