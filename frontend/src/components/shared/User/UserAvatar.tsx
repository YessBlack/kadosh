import { cn } from '@/lib/utils'

interface UserAvatarProps {
  imageUrl?: string
  name?: string
  lastname?: string
  className?: string
  isLoading?: boolean,
  classNameText?: string
}

export const UserAvatar = ({
  imageUrl,
  name,
  lastname,
  isLoading,
  className,
  classNameText
}: UserAvatarProps) => {
  const initials = `${name?.[0] ?? ''}${lastname?.[0] ?? ''}`.toUpperCase()

  return (
    <div className={cn('rounded-full overflow-hidden', className)}>
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={`${name} ${lastname}`}
          className={cn(
            'w-full h-full object-cover transition-all duration-300',
            isLoading && 'animate-pulse opacity-60'
          )}
        />
      ) : (
        <div className='w-full h-full p-2 bg-violet-200 dark:bg-violet-900/40 flex items-center justify-center'>
          <span className={cn('font-semibold text-violet-700 dark:text-violet-300', classNameText)}>
            {initials}
          </span>
        </div>
      )}
    </div>
  )
}
