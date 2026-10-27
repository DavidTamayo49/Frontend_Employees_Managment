import type { Company, DocumentType, Role } from '@/features/catalogs/model/types'

/** Empleado tal como lo devuelve el listado (con los catálogos resueltos). */
export type EmployeeDetail = {
  id: string
  name: string
  document: string
  documentType: DocumentType
  role: Role
  company: Company
}

/** Empleado devuelto por el registro y la modificación (solo IDs). */
export type SavedEmployee = {
  id: string
  name: string
  document: string
  documentTypeId: string
  roleId: string
  companyId: string
}

export type RegisterEmployeeRequest = {
  name: string
  document: string
  documentTypeId: string
  roleId: string
  companyId: string
}

/** Modificación parcial: solo los campos que cambiaron. */
export type ModifyEmployeeRequest = Partial<RegisterEmployeeRequest>
