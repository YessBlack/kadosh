import { useState, useRef, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { CloudUpload } from 'lucide-react'
import { FileItem } from './FileItem'
import { UPLOAD_STATUS, type UploadFile } from '@/components/shared/FileUpload/file.types'

export interface FileUploadProps {
  accept?: string
  variant?: 'standalone' | 'modal'
  maxFiles?: number
  maxSizeMB?: number
  onFilesChange?: (files: UploadFile[]) => void
}

export const FileUpload = ({
  accept = '.doc,.docx,.pdf,.xls,.xlsx',
  variant = 'standalone',
  maxFiles = 1,
  maxSizeMB = 55,
  onFilesChange
}: FileUploadProps) => {
  const [files, setFiles] = useState<UploadFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const simulateUpload = useCallback((id: number) => {
    const willFail = Math.random() < 0.3

    const interval = setInterval(() => {
      setFiles((prev) => {
        const updated = prev.map((f) => {
          if (f.id !== id || f.status !== UPLOAD_STATUS.UPLOADING) return f
          const newProgress = Math.min(100, f.progress + Math.floor(Math.random() * 12 + 3))

          if (newProgress >= 100) {
            return {
              ...f,
              progress: 100,
              status: willFail ? UPLOAD_STATUS.ERROR : UPLOAD_STATUS.DONE
            }
          }

          return { ...f, progress: newProgress }
        })

        const target = updated.find((f) => f.id === id)
        if (!target || target.status !== UPLOAD_STATUS.UPLOADING) clearInterval(interval)

        onFilesChange?.(updated)
        return updated
      })
    }, 300)
  }, [onFilesChange])

  const addFiles = useCallback((newFiles: File[]) => {
    setFiles((prev) => {
      const slots = maxFiles - prev.length
      if (slots <= 0) return prev

      const toAdd: UploadFile[] = newFiles.slice(0, slots).map((file) => ({
        id: Date.now() + Math.random(),
        name: file.name,
        size: file.size,
        file,
        status: UPLOAD_STATUS.UPLOADING,
        progress: 0
      }))

      toAdd.forEach((f) => simulateUpload(f.id))

      const next = [...prev, ...toAdd]
      onFilesChange?.(next)
      return next
    })
  }, [maxFiles, simulateUpload, onFilesChange])

  const removeFile = (id: number) => {
    setFiles((prev) => {
      const next = prev.filter((f) => f.id !== id)
      onFilesChange?.(next)
      return next
    })
  }

  const retryFile = (id: number) => {
    setFiles((prev) => {
      const next = prev.map((f) =>
        f.id === id ? { ...f, status: UPLOAD_STATUS.UPLOADING, progress: 0 } : f
      )
      onFilesChange?.(next)
      return next
    })
    simulateUpload(id)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    addFiles(Array.from(e.dataTransfer.files))
  }

  const canUploadMore = files.length < maxFiles
  const archivoLabel = maxFiles === 1 ? 'archivo' : 'archivos'

  return (
    <div className={cn(
      variant === 'standalone' && 'w-full max-w-md rounded-2xl border bg-background p-6 shadow-sm'
    )}>

      <div className='mb-5'>
        <h2 className='text-lg font-semibold'>Subir archivo</h2>
        <p className='text-sm text-muted-foreground'>
          Máx. {maxFiles} {archivoLabel}, {maxSizeMB} MB cada uno.
        </p>
      </div>

      <div
        onClick={() => canUploadMore && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          'relative flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-4 py-10 text-center transition-all duration-200',
          isDragging
            ? 'border-violet-400 bg-violet-50/50 dark:bg-violet-950/20'
            : 'border-border hover:border-violet-300 hover:bg-muted/40 dark:hover:bg-muted/20',
          !canUploadMore && 'pointer-events-none opacity-40'
        )}
      >
        <input
          ref={inputRef}
          type='file'
          multiple
          accept={accept}
          className='hidden'
          onChange={(e) => {
            if (e.target.files) {
              addFiles(Array.from(e.target.files))
              e.target.value = ''
            }
          }}
        />

        <div className='flex h-11 w-11 items-center justify-center rounded-full bg-muted'>
          <CloudUpload className='h-5 w-5 text-violet-500' />
        </div>

        <div className='space-y-1'>
          <p className='text-sm text-muted-foreground'>
            <span className='font-medium text-violet-600 dark:text-violet-400'>
              Haz clic para subir
            </span>{' '}
            o arrastra y suelta
          </p>
          <p className='text-xs text-muted-foreground'>
            DOC, DOCX, PDF, XLS, XLSX — máx. {maxSizeMB} MB
          </p>
        </div>
      </div>

      {files.length > 0 && (
        <div className='mt-4 flex flex-col gap-2'>
          {files.map((f) => (
            <FileItem key={f.id} file={f} onRemove={removeFile} onRetry={retryFile} />
          ))}
        </div>
      )}
    </div>
  )
}
