import type { LoginData } from '@/features/users/types/auth.types'
import { useAuthStore } from '@/store/auth.store'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

type FormErrors = Partial<LoginData & { server: string }>

export const useLoginForm = () => {
  const login = useAuthStore(state => state.login)
  const navigate = useNavigate()

  const [values, setValues] = useState<LoginData>({ email: '', password: '' })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isFormFilled = () => {
    return values.email.trim() !== '' && values.password.trim() !== ''
  }

  const validate = (): boolean => {
    const newErrors: FormErrors = {}

    if (!values.email) {
      newErrors.email = 'El email es requerido'
    }

    if (
      !newErrors.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)
    ) {
      newErrors.email = 'Debe ser un email válido'
    }

    if (!values.password) {
      newErrors.password = 'La contraseña es requerida'
    }

    if (values.password && values.password.length < 8) {
      newErrors.password = 'Mínimo 8 caracteres'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setErrors(prev => ({ ...prev, [e.target.name]: undefined }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)
    try {
      await login(values)
      navigate('/dashboard')
    } catch {
      setErrors({ server: 'Credenciales incorrectas' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return { values, errors, isSubmitting, handleChange, handleSubmit, isFormFilled, setValues }
}
