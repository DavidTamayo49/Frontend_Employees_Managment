import { toast } from 'sonner'
import { getErrorMessage } from '@/shared/api/ApiError'
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog'
import { useDeleteEmployee } from '../hooks/useEmployees'
import type { EmployeeDetail } from '../model/types'

type DeleteEmployeeDialogProps = {
  employee: EmployeeDetail | null
  onClose: () => void
}

export function DeleteEmployeeDialog({ employee, onClose }: DeleteEmployeeDialogProps) {
  const deleteEmployee = useDeleteEmployee()

  const confirm = () => {
    if (!employee) return
    deleteEmployee.mutate(employee.id, {
      onSuccess: (response) => toast.success(response.mensajes[0] ?? 'Empleado eliminado exitosamente'),
      onError: (error) => toast.error(getErrorMessage(error)),
      onSettled: onClose,
    })
  }

  return (
    <ConfirmDialog
      open={employee !== null}
      onOpenChange={(open) => {
        if (!open && !deleteEmployee.isPending) onClose()
      }}
      title="Eliminar empleado"
      description={employee ? `¿Eliminar a ${employee.name}? Esta acción no se puede deshacer.` : ''}
      confirmLabel="Eliminar"
      pendingLabel="Eliminando…"
      pending={deleteEmployee.isPending}
      onConfirm={confirm}
    />
  )
}
