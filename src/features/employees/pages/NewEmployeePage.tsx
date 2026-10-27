import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import { getErrorMessage } from '@/shared/api/ApiError'
import { EmployeeForm } from '../components/EmployeeForm'
import { useRegisterEmployee } from '../hooks/useEmployees'
import type { RegisterEmployeeRequest } from '../model/types'

export function NewEmployeePage() {
  const navigate = useNavigate()
  const registerEmployee = useRegisterEmployee()

  const submit = (values: RegisterEmployeeRequest) => {
    registerEmployee.mutate(values, {
      onSuccess: (response) => {
        toast.success(response.mensajes[0] ?? 'Empleado registrado')
        navigate('/empleados')
      },
      // El formulario no se desmonta, así que lo escrito se conserva.
      onError: (error) => toast.error(getErrorMessage(error)),
    })
  }

  return (
    <section className="mx-auto grid max-w-2xl gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Nuevo empleado</h1>
      <div className="rounded-lg border bg-card p-6">
        <EmployeeForm mode="create" submitting={registerEmployee.isPending} onSubmit={submit} />
      </div>
    </section>
  )
}
