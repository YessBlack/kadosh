import { userApi } from '@/features/users/api/user.api'
import type { User } from '@/features/users/types/auth.types'
import { useAuthStore } from '@/store/auth.store'
import { showToast } from '@/utils/toast.utils'
import { useCallback, useMemo, useState } from 'react'
import { isEmail } from 'validator'

interface UseUserFormProps {
  selectedUser: User | null
  onSuccess: () => void
}

export const useUserForm = ({ selectedUser, onSuccess }: UseUserFormProps) => {
  const { user } = useAuthStore()

  const [values, setValues] = useState({
    name: selectedUser?.name ?? '',
    lastname: selectedUser?.lastname ?? '',
    email: selectedUser?.email ?? '',
    isActive: selectedUser?.isActive ?? true,
    password: '',
    passwordConfirm: '',
    createdBy: user?.id ?? ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const isPasswordValid = useMemo(() => {
    if (selectedUser) return true
    return values.password.length >= 8 && values.password === values.passwordConfirm
  }, [values.password, values.passwordConfirm, selectedUser])

  const isCompleted = useMemo(() => {
    if (!values.name.trim() || !values.lastname.trim() || !values.email.trim()) return false
    if (!isEmail(values.email)) return false
    return isPasswordValid
  }, [values.name, values.lastname, values.email, isPasswordValid])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setValues(prev => ({ ...prev, [name]: value }))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isCompleted) return

    setIsSubmitting(true)
    try {
      if (selectedUser) {
        await userApi.updateUser(selectedUser.id, values)
      } else {
        await userApi.createUser(values)
      }
      onSuccess()
    } catch {
      showToast.error('Error', 'No se pudo realizar la acción, intentalo de nuevo')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedUser) return

    setIsSubmitting(true)
    try {
      await userApi.deleteUser(selectedUser.id)
      onSuccess()
    } catch {
      showToast.error('Error', 'No se pudo eliminar el usuario, intentalo de nuevo')
    } finally {
      setIsSubmitting(false)
      setIsDeleting(false)
    }
  }

  return {
    values,
    isSubmitting,
    isDeleting,
    isCompleted,
    handleChange,
    handleSubmit,
    setIsDeleting,
    handleDelete,
    setValues
  }
}
