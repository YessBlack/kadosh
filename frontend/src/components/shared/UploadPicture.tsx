import { UserAvatar } from '@/components/shared/User/UserAvatar'
import { Camera } from 'lucide-react'
import { useRef, type ChangeEvent } from 'react'

interface UploadPictureProps {
  isLoading?: boolean
  imageUrl?: string
  name?: string
  lastname?: string
  onGetImage: (image: File) => void
}

export const UploadPicture = ({
  isLoading,
  imageUrl,
  name,
  lastname,
  onGetImage
}: UploadPictureProps) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onGetImage(file)
      e.target.value = ''
    }
  }

  return (
    <div className='relative mx-auto'>
      <input
        ref={inputRef}
        type='file'
        accept='image/*'
        className='hidden'
        onChange={handleChange}
      />

      <div
        onClick={() => inputRef.current?.click()}
        className='group relative w-35 h-35 rounded-full cursor-pointer overflow-hidden ring-4 ring-background shadow-md'
      >
        <UserAvatar
          imageUrl={imageUrl}
          name={name}
          lastname={lastname}
          isLoading={isLoading}
          className='w-full h-full'
          classNameText={'text-5xl'}
        />

        <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center'>
          <Camera className='w-6 h-6 text-white tex' />
        </div>
      </div>

      <button
        onClick={() => inputRef.current?.click()}
        className='absolute bottom-0 right-0 m-1 w-7 h-7 rounded-full bg-violet-400 hover:bg-violet-500 text-white flex items-center justify-center shadow-md transition-colors duration-200 ring-2 ring-background'
        type='button'
        title='Cambiar foto'
      >
        <Camera className='w-4 h-4' />
      </button>
    </div>
  )
}
