import { PencilIcon, Trash2Icon } from 'lucide-react'
import { Link } from 'react-router'
import { Button } from '@/shared/ui/button'
import { Skeleton } from '@/shared/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table'
import type { EmployeeDetail } from '../model/types'

const COLUMNS = ['Nombre', 'Tipo de documento', 'Documento', 'Rol', 'Empresa', 'Acciones']

function Header() {
  return (
    <TableHeader>
      <TableRow>
        {COLUMNS.map((column) => (
          <TableHead key={column} className={column === 'Acciones' ? 'text-right' : undefined}>
            {column}
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  )
}

export function EmployeeTableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <Table aria-busy="true" aria-label="Cargando empleados">
      <Header />
      <TableBody>
        {Array.from({ length: rows }, (_, row) => (
          <TableRow key={row}>
            {COLUMNS.map((column) => (
              <TableCell key={column}>
                <Skeleton className="h-5 w-full max-w-40" />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

type EmployeeTableProps = {
  employees: EmployeeDetail[]
  onDelete: (employee: EmployeeDetail) => void
}

export function EmployeeTable({ employees, onDelete }: EmployeeTableProps) {
  return (
    <Table>
      <Header />
      <TableBody>
        {employees.map((employee) => (
          <TableRow key={employee.id}>
            <TableCell className="font-medium">{employee.name}</TableCell>
            <TableCell>{employee.documentType.name}</TableCell>
            <TableCell>{employee.document}</TableCell>
            <TableCell>{employee.role.name}</TableCell>
            <TableCell>{employee.company.name}</TableCell>
            <TableCell>
              <div className="flex justify-end gap-1">
                <Button variant="ghost" size="sm" asChild>
                  <Link to={`/empleados/${employee.id}/editar`} aria-label={`Editar a ${employee.name}`}>
                    <PencilIcon />
                    Editar
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  aria-label={`Eliminar a ${employee.name}`}
                  onClick={() => onDelete(employee)}
                >
                  <Trash2Icon />
                  Eliminar
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
