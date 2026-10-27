import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'
import { toast } from 'sonner'
import { getErrorMessage, isApiError } from '@/shared/api/ApiError'
import { ErrorState } from '@/shared/ui/ErrorState'
import { Skeleton } from '@/shared/ui/skeleton'
import { EmployeeForm } from '../components/EmployeeForm'
import { useEmployee, useModifyEmployee } from '../hooks/useEmployees'
import { toEmployeeFormValues } from '../model/employeeSchema'
import type { ModifyEmployeeRequest } from '../model/types'

const NOT_FOUND_MESSAGE = 'El empleado indicado no existe'

export function EditEmployeePage() {
  const { id = '' } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { employee, isPending, error, refetch } = useEmployee(id)
  const modifyEmployee = useModifyEmployee()

  const notFound = !isPending && !error && !employee

  useEffect(() => {
    if (notFound) {
      toast.error(NOT_FOUND_MESSAGE)
      navigate('/empleados', { replace: true })
    }
  }, [notFound, navigate])

  const submit = (changes: ModifyEmployeeRequest) => {
    modifyEmployee.mutate(
      { id, changes },
      {
        onSuccess: (response) => {
          toast.success(response.mensajes[0] ?? 'Empleado modificado')
          navigate('/empleados')
        },
        onError: (err) => {
          if (isApiError(err) && err.status === 404) {
            toast.error(NOT_FOUND_MESSAGE)
            navigate('/empleados', { replace: true })
          } else {
            toast.error(getErrorMessage(err))
          }
        },
      },
    )
  }

  let content
  if (isPending) {
    content = (
      <div className="grid gap-5" aria-busy="true" aria-label="Cargando empleado">
        {Array.from({ length: 5 }, (_, i) => (
          <Skeleton key={i} className="h-14 w-full" />
        ))}
      </div>
    )
  } else if (error) {
    content = <ErrorState message={getErrorMessage(error)} onRetry={() => void refetch()} />
  } else if (employee) {
    content = (
      <EmployeeForm
        key={employee.id}
        mode="edit"
        initialValues={toEmployeeFormValues(employee)}
        submitting={modifyEmployee.isPending}
        onSubmit={submit}
      />
    )
  }

  return (
    <section className="mx-auto grid max-w-2xl gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Editar empleado</h1>
      <div className="rounded-lg border bg-card p-6">{content}</div>
    </section>
  )
}
