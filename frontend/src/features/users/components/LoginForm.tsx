import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useLoginForm } from '@/features/users/hooks/useLoginForm'
import { ChevronRight } from 'lucide-react'
import { PasswordInput } from '@/components/common/PasswordInput/PasswordInput'

export const LoginForm = () => {
  const {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    isFormFilled
  } = useLoginForm()

  return (
    <div className='flex w-full flex-col gap-5'>
      <div className='mb-2 space-y-1'>
        <h1 className='text-3xl font-bold tracking-tight text-slate-900 dark:text-[#E5E7EB]'>
          Iniciar sesión
        </h1>
        <p className='text-sm text-slate-600 dark:text-[#9CA3AF]'>
          Ingrese sus credenciales para acceder al sistema.
        </p>
      </div>

      <form onSubmit={handleSubmit} className='space-y-5'>

        <div className='relative space-y-3'>
          <div className='relative space-y-1'>
            <Label required htmlFor='email' className='text-[13px] font-semibold text-slate-800 dark:text-[#E5E7EB]'>
              Correo electrónico
            </Label>
            <Input
              id='email'
              type='email'
              name='email'
              placeholder='tu@email.com'
              value={values.email}
              autoComplete=''
              onChange={handleChange}
              className='border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:border-violet-500 focus-visible:ring-violet-400/35 dark:border-[#1E1B4B] dark:bg-[#151b2C]/70 dark:text-[#E5E7EB] dark:placeholder:text-[#9CA3AF] dark:focus-visible:border-[#A78BFA] dark:focus-visible:ring-[#A78BFA]/35'
            />
            <p className='absolute top-17 right-0 text-[11px] text-red-500 dark:text-red-400'>
              {errors.email}
            </p>
          </div>

          <div className='relative space-y-1'>
            <PasswordInput
              name='password'
              label='Contraseña'
              value={values.password}
              onChange={handleChange}
              required
            />
            <p className='absolute top-17 right-0 text-[11px] text-red-500 dark:text-red-400'>
              {errors.password ?? errors.server}
            </p>
          </div>
        </div>

        <Button
          type='submit'
          size='lg'
          className='mt-2 h-11 w-full justify-center gap-2 rounded-lg bg-violet-600 text-white hover:bg-violet-500 dark:bg-[#7C3AED] dark:hover:bg-[#6D28D9]'
          disabled={isSubmitting || !isFormFilled()}
        >
          <span>Ingresar</span>
          <ChevronRight />
        </Button>

      </form>
    </div>
  )
}
