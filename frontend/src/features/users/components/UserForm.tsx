import { AppAlert } from '@/components/common/Alert/Alert'
import { ALERT_VARIANT } from '@/components/common/Alert/alert.type'
import { PasswordInput } from '@/components/common/PasswordInput/PasswordInput'
import { Button } from '@/components/ui/button'
import {
  Field,
  FieldGroup,
  FieldSet
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useUserForm } from '@/features/users/hooks/useUserForm'
import type { User } from '@/features/users/types/auth.types'

interface UserFormProps {
  selectedUser: User | null
  onSuccess: () => void
}

export const UserForm = ({ selectedUser, onSuccess }: UserFormProps) => {
  const {
    values,
    isSubmitting,
    isDeleting,
    isCompleted,
    handleChange,
    handleSubmit,
    setIsDeleting,
    handleDelete,
    setValues
  } = useUserForm({ selectedUser, onSuccess })

  const renderDeleteConfirmation = () => {
    if (!isDeleting) return null

    return (
      <div className='mt-5'>
        <AppAlert
          title='¿Estás seguro?'
          description='Esta acción no se puede deshacer. El usuario será eliminado permanentemente.'
          variant={ALERT_VARIANT.ERROR}
        />
        <div className='mt-4 flex justify-end gap-2'>
          <Button variant='outline' onClick={() => setIsDeleting(false)}>
            Cancelar
          </Button>
          <Button variant='destructive' onClick={handleDelete}>
            Eliminar
          </Button>
        </div>
      </div>
    )
  }

  const renderConfirmPassword = () => {
    if (selectedUser) return null

    return (
      <>
        <Field className='flex flex-col gap-1'>
          <PasswordInput
            name='password'
            label='Contraseña'
            value={values.password}
            onChange={handleChange}
            required
          />
          <span className='text-xs text-slate-500/70 italic'>
            Recuerda que la contraseña debe tener al menos 8 caracteres y coincidir en ambos campos.
          </span>
        </Field>
        <Field className='flex flex-col gap-1'>
          <PasswordInput
            name='passwordConfirm'
            label='Repite la contraseña'
            value={values.passwordConfirm}
            onChange={handleChange}
            required
          />
        </Field>
      </>
    )
  }

  return (
    <div className='w-full'>
      <form onSubmit={handleSubmit} className='w-full'>
        <FieldSet>
          <AppAlert
            title='Gestiona tu Usuarios'
            description='Administra los usuarios que tienen acceso al sistema, asigna roles y controla su actividad para garantizar la seguridad y eficiencia de tu negocio.'
            variant={ALERT_VARIANT.INFO}
          />
          <FieldGroup className='flex flex-col gap-3'>
            <Field className='flex flex-col gap-1'>
              <Label required>
                Nombre del Usuario
              </Label>
              <Input
                placeholder='Jhon'
                required
                name='name'
                value={values.name}
                onChange={handleChange}
              />
            </Field>
            <Field className='flex flex-col gap-1'>
              <Label required>
                Apellido del Usuario
              </Label>
              <Input
                placeholder='Doe'
                required
                name='lastname'
                value={values.lastname}
                onChange={handleChange}
              />
            </Field>
            {!selectedUser &&
              <Field className='flex flex-col gap-1'>
                <Label required>
                  Correo Electrónico
                </Label>
                <Input
                  placeholder='doe@email.com'
                  type='email'
                  required
                  name='email'
                  value={values.email}
                  onChange={handleChange}
                />
              </Field>
            }
            {renderConfirmPassword()}
            <Field className='flex flex-col gap-1'>
              <Label required className='text-sm font-medium'>
                Estado
              </Label>
              <RadioGroup
                value={values.isActive ? 'true' : 'false'}
                className='w-fit'
                onValueChange={(value) => setValues(prev => ({ ...prev, isActive: value === 'true' }))}
              >
                <div className='flex items-center gap-3'>
                  <RadioGroupItem value='true' id='r1' />
                  <Label htmlFor='r1'>Activo</Label>
                </div>
                <div className='flex items-center gap-3'>
                  <RadioGroupItem value='false' id='r2' />
                  <Label htmlFor='r2'>Inactivo</Label>
                </div>
              </RadioGroup>
            </Field>
          </FieldGroup>
        </FieldSet>
        <Field orientation='horizontal' className='flex items-center justify-end'>
          {selectedUser && !isDeleting && (
            <Button variant='destructive' onClick={() => setIsDeleting(true)}>
              Eliminar
            </Button>
          )}
          {!isDeleting &&
            <Button type='submit' variant={'primary'} disabled={!isCompleted || isSubmitting}>
              {selectedUser ? 'Actualizar' : 'Crear Usuario'}
            </Button>
          }
        </Field>
      </form >
      {renderDeleteConfirmation()}
    </div >
  )
}
