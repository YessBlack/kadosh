import { AppAlert } from '@/components/common/Alert/Alert'
import { ALERT_VARIANT } from '@/components/common/Alert/alert.type'
import { PasswordInput } from '@/components/common/PasswordInput/PasswordInput'
import { Button } from '@/components/ui/button'
import { authApi } from '@/features/users/api/auth.api'
import { useAuthStore } from '@/store/auth.store'
import { showToast } from '@/utils/toast.utils'
import { LockKeyhole } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export const SecurityCard = () => {
  const navigate = useNavigate()

  const { user, setUser, logout } = useAuthStore()

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isPasswordValid = useMemo(() => {
    if (currentPassword.length < 8 || newPassword.length < 8) return false
    if (currentPassword === newPassword) return false
    if (newPassword !== passwordConfirm) return false
    return true
  }, [newPassword, currentPassword, passwordConfirm])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user || !user.id) {
      return showToast.error('Error', 'No existe información del usuario')
    }

    try {
      setIsSubmitting(true)

      await authApi.changePassword({
        currentPassword,
        newPassword,
        newPasswordConfirm: passwordConfirm
      })

      showToast.success('Exito', 'Información Actualizada')
      setIsSubmitting(false)
      await logout()
      setUser(null)
      navigate('/login')
    } catch {
      setIsSubmitting(false)
      showToast.error('Error', 'Ocurrio un error al actualizar la información')
    }
  }

  return (
    <div className='border rounded-2xl flex flex-col overflow-hidden shadow-xs'>
      <div className='flex justify-between items-center bg-slate-100 px-4 py-3 rounded-t-2xl border-b'>
        <h1 className='font-bold text-lg m-0'>Seguridad</h1>
        <LockKeyhole size={18} />
      </div>
      <div className='p-4 flex flex-col gap-4'>
        <AppAlert
          title='Cambia tu contraseña'
          description='Puedes cambiar la contraseña que utilizas para acceder al sistema. Si olvidaste tu contraseña y no puedes iniciar sesión, contacta al administrador para solicitar el restablecimiento de tu acceso.'
          variant={ALERT_VARIANT.PURPLE}
        />
        <form onSubmit={handleSubmit} className='w-full flex flex-col gap-4'>
          <PasswordInput
            name='password'
            label='Contraseña'
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
          <PasswordInput
            name='password'
            label='Contraseña'
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />

          <PasswordInput
            name='password'
            label='Contraseña'
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            required
          />
          <span className='text-xs text-slate-500/70 italic'>
            Recuerda que tu nueva contraseña debe tener al menos 8 caracteres, ser diferente de tu contraseña actual y coincidir con la contraseña de confirmación.
          </span>
          <div className='flex flex-col items-end'>
            <Button type='submit' variant={'primary'} className='w-fit' disabled={!isPasswordValid || isSubmitting}>
              Actualizar Contraseña
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
