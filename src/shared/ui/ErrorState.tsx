import { AlertCircleIcon } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert'
import { Button } from '@/shared/ui/button'

type ErrorStateProps = {
  message: string
  onRetry?: () => void
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <Alert variant="destructive">
      <AlertCircleIcon />
      <AlertTitle>Ocurrió un error</AlertTitle>
      <AlertDescription>
        <p>{message}</p>
        {onRetry && (
          <div>
            <Button variant="outline" size="sm" onClick={onRetry}>
              Reintentar
            </Button>
          </div>
        )}
      </AlertDescription>
    </Alert>
  )
}
