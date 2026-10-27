import { useState } from 'react'
import { PlusIcon, UsersIcon } from 'lucide-react'
import { Link, useSearchParams } from 'react-router'
import { getErrorMessage } from '@/shared/api/ApiError'
import { Button } from '@/shared/ui/button'
import { ErrorState } from '@/shared/ui/ErrorState'
import { CompanyFilter } from '../components/CompanyFilter'
import { DeleteEmployeeDialog } from '../components/DeleteEmployeeDialog'
import { EmployeeTable, EmployeeTableSkeleton } from '../components/EmployeeTable'
import { useEmployees } from '../hooks/useEmployees'
import type { EmployeeDetail } from '../model/types'

export function EmployeesListPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const companyId = searchParams.get('companyId') ?? ''
  const employees = useEmployees(companyId || undefined)
  const [toDelete, setToDelete] = useState<EmployeeDetail | null>(null)

  const changeCompany = (value: string) => {
    setSearchParams(value ? { companyId: value } : {}, { replace: true })
  }

  let content
  if (employees.isPending) {
    content = <EmployeeTableSkeleton />
  } else if (employees.isError) {
    content = <ErrorState message={getErrorMessage(employees.error)} onRetry={() => void employees.refetch()} />
  } else if (employees.data.length === 0) {
    content = (
      <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed py-12 text-center">
        <UsersIcon className="size-10 text-muted-foreground" />
        <p className="text-muted-foreground">
          {companyId ? 'No hay empleados registrados en esta empresa.' : 'Aún no hay empleados registrados.'}
        </p>
        <Button asChild>
          <Link to="/empleados/nuevo">
            <PlusIcon />
            Crear empleado
          </Link>
        </Button>
      </div>
    )
  } else {
    content = <EmployeeTable employees={employees.data} onDelete={setToDelete} />
  }

  return (
    <section className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">Empleados</h1>
        <Button asChild>
          <Link to="/empleados/nuevo">
            <PlusIcon />
            Nuevo empleado
          </Link>
        </Button>
      </div>

      <CompanyFilter value={companyId} onChange={changeCompany} />

      <div className="rounded-lg border bg-card p-2">{content}</div>

      <DeleteEmployeeDialog employee={toDelete} onClose={() => setToDelete(null)} />
    </section>
  )
}
