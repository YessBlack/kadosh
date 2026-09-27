import { ALERT_VARIANT } from '@/components/common/Alert/alert.type'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, CheckCircle, Info, TriangleAlert } from 'lucide-react'
import type { ReactNode } from 'react'

const ALERT_CONFIG = {
  [ALERT_VARIANT.INFO]: { icon: <Info className='h-4 w-4' />, variant: 'info' as const },
  [ALERT_VARIANT.SUCCESS]: { icon: <CheckCircle className='h-4 w-4' />, variant: 'success' as const },
  [ALERT_VARIANT.WARNING]: { icon: <TriangleAlert className='h-4 w-4' />, variant: 'warning' as const },
  [ALERT_VARIANT.ERROR]: { icon: <AlertCircle className='h-4 w-4' />, variant: 'destructive' as const },
  [ALERT_VARIANT.PURPLE]: { icon: null, variant: 'purple' as const }
}

interface AppAlertProps {
  variant?: ALERT_VARIANT
  title: string
  description?: string
  icon?: ReactNode | null
  className?: string
}

export const AppAlert = ({
  variant = ALERT_VARIANT.INFO,
  title,
  description,
  icon,
  className
}: AppAlertProps) => {
  const { icon: defaultIcon, variant: alertVariant } = ALERT_CONFIG[variant]

  const resolvedIcon = icon !== undefined ? icon : defaultIcon

  return (
    <Alert variant={alertVariant} className={className}>
      {resolvedIcon}
      <AlertTitle>{title}</AlertTitle>
      {description && <AlertDescription>{description}</AlertDescription>}
    </Alert>
  )
}
