import { toast } from 'sonner'

export const showToast = {
  success: (message: string, description?: string) => {
    toast.success(message, { description, position: 'bottom-center', richColors: true })
  },
  error: (message: string, description?: string) => {
    toast.error(message, { description, position: 'bottom-center', richColors: true })
  },
  warning: (message: string, description?: string) => {
    toast.warning(message, { description, position: 'bottom-center', richColors: true })
  },
  info: (message: string, description?: string) => {
    toast.info(message, { description, position: 'bottom-center', richColors: true })
  }
}
