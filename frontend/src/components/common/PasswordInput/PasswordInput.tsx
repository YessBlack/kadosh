// components/common/PasswordInput/PasswordInput.tsx
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

interface PasswordInputProps {
  id?: string
  name: string
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  required?: boolean
}

export const PasswordInput = ({
  id,
  name,
  label,
  value,
  onChange,
  placeholder = '••••••••',
  required
}: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className='space-y-1'>
      <Label required={required} htmlFor={id ?? name} className='text-[13px] font-semibold text-slate-800 dark:text-[#E5E7EB]'>
        {label}
      </Label>
      <div className='relative'>
        <Input
          id={id ?? name}
          name={name}
          type={showPassword ? 'text' : 'password'}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete='off'
          className='border-slate-300 bg-white pr-10 text-slate-900 placeholder:text-slate-400 focus-visible:border-violet-500 focus-visible:ring-violet-400/35 dark:border-[#1E1B4B] dark:bg-[#151b2C]/70 dark:text-[#E5E7EB] dark:placeholder:text-[#9CA3AF] dark:focus-visible:border-[#A78BFA] dark:focus-visible:ring-[#A78BFA]/35'
        />
        <Button
          type='button'
          variant='link'
          size='icon-sm'
          className='absolute right-1 top-1/2 -translate-y-1/2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 active:translate-y-[-50%]! active:scale-100! dark:text-[#9CA3AF] dark:hover:bg-[#1E1B4B]/50 dark:hover:text-[#E5E7EB]'
          onClick={() => setShowPassword((v) => !v)}
        >
          <span className='inline-flex size-4 items-center justify-center'>
            {showPassword ? <EyeOff /> : <Eye />}
          </span>
        </Button>
      </div>
    </div>
  )
}
