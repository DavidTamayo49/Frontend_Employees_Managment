import type { ReactNode } from 'react'
import { Label } from '@/shared/ui/label'

type FormFieldProps = {
  id: string
  label: string
  error?: string
  children: ReactNode
}

/** Envoltorio de campo: etiqueta, control y mensaje de error. */
export function FormField({ id, label, error, children }: FormFieldProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error && (
        <p id={`${id}-error`} className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}
