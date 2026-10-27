import { z } from 'zod'
import type { EmployeeDetail, ModifyEmployeeRequest } from './types'

const catalogId = (requiredMessage: string) =>
  z.string().min(1, requiredMessage).pipe(z.guid('El valor seleccionado no es válido'))

/** Replica las reglas de validación del backend. */
export const employeeSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'El nombre es obligatorio')
    .max(100, 'El nombre no puede superar los 100 caracteres'),
  document: z
    .string()
    .trim()
    .min(1, 'El documento es obligatorio')
    .regex(/^[A-Za-z0-9]{5,20}$/, 'El documento debe ser alfanumérico y tener entre 5 y 20 caracteres'),
  documentTypeId: catalogId('Selecciona un tipo de documento'),
  roleId: catalogId('Selecciona un rol'),
  companyId: catalogId('Selecciona una empresa'),
})

export type EmployeeFormValues = z.input<typeof employeeSchema>
export type EmployeeFormOutput = z.output<typeof employeeSchema>

export const emptyEmployeeFormValues: EmployeeFormValues = {
  name: '',
  document: '',
  documentTypeId: '',
  roleId: '',
  companyId: '',
}

export function toEmployeeFormValues(employee: EmployeeDetail): EmployeeFormValues {
  return {
    name: employee.name,
    document: employee.document,
    documentTypeId: employee.documentType.id,
    roleId: employee.role.id,
    companyId: employee.company.id,
  }
}

const FIELDS = ['name', 'document', 'documentTypeId', 'roleId', 'companyId'] as const

/** Devuelve solo los campos cuyo valor (sin espacios a los lados) difiere del original. */
export function getChangedFields(original: EmployeeFormValues, current: EmployeeFormValues): ModifyEmployeeRequest {
  const changes: ModifyEmployeeRequest = {}
  for (const field of FIELDS) {
    const value = current[field].trim()
    if (value !== original[field].trim()) changes[field] = value
  }
  return changes
}
