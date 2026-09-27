import { UPLOAD_STATUS, type UploadFile } from '@/components/shared/FileUpload/file.types'
import { Button } from '@/components/ui/button'
import { formatSize } from '@/utils/fileUtils'
import { File as FileIcon, Trash2, RefreshCw, CircleCheck } from 'lucide-react'

export interface FileItemProps {
  file: UploadFile;
  onRemove: (id: number) => void;
  onRetry: (id: number) => void;
}

export const FileItem = ({ file, onRemove, onRetry }: FileItemProps) => {
  const { id, name, size, status, progress } = file
  const secsLeft = Math.max(1, Math.round((100 - progress) / 15))

  return (
    <div className='flex items-center gap-3 rounded-lg bg-muted px-3 py-2.5'>
      <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-md border bg-background'>
        <FileIcon className='h-4 w-4 text-muted-foreground' />
      </div>

      <div className='min-w-0 flex-1'>
        <p className='truncate text-sm font-medium'>{name}</p>

        {status === UPLOAD_STATUS.UPLOADING && (
          <>
            <p className='text-xs text-muted-foreground'>
              {formatSize(size)} | {progress}% · {secsLeft}s restantes
            </p>
            <div className='mt-1.5 h-1 w-full overflow-hidden rounded-full bg-border'>
              <div
                className='h-full rounded-full bg-primary transition-all duration-300'
                style={{ width: `${progress}%` }}
              />
            </div>
          </>
        )}

        {status === UPLOAD_STATUS.DONE && (
          <>
            <p className='text-xs text-muted-foreground'>{formatSize(size)}</p>
            <p className='flex items-center gap-1 text-xs text-green-600 dark:text-green-400'>
              Completado <CircleCheck className='h-3 w-3' />
            </p>
          </>
        )}

        {status === UPLOAD_STATUS.ERROR && (
          <>
            <p className='text-xs text-muted-foreground'>{formatSize(size)}</p>
            <p className='text-xs text-destructive'>Error al subir</p>
          </>
        )}
      </div>

      <div className='flex shrink-0 gap-1'>
        {status === UPLOAD_STATUS.ERROR && (
          <Button variant='ghost' size='icon' className='h-7 w-7' onClick={() => onRetry(id)} title='Reintentar'>
            <RefreshCw className='h-3.5 w-3.5' />
          </Button>
        )}
        <Button variant='ghost' size='icon' className='h-7 w-7 text-muted-foreground hover:text-destructive' onClick={() => onRemove(id)} title='Eliminar'>
          <Trash2 className='h-3.5 w-3.5' />
        </Button>
      </div>
    </div>
  )
}
