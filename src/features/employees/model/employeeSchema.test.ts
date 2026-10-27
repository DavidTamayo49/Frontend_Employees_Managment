import { describe, expect, it } from 'vitest'
import { employeeSchema, getChangedFields, type EmployeeFormValues } from './employeeSchema'

const valid: EmployeeFormValues = {
  name: '  Ana Pérez  ',
  document: 'AB12345',
  documentTypeId: '3f1c2a9e-8b7d-4c6e-9a1b-2d3e4f5a6b7c',
  roleId: '7a8b9c0d-1e2f-4a3b-8c4d-5e6f7a8b9c0d',
  companyId: 'c1d2e3f4-a5b6-4c7d-8e9f-0a1b2c3d4e5f',
}

function issuesFor(values: Partial<EmployeeFormValues>) {
  const result = employeeSchema.safeParse({ ...valid, ...values })
  return result.success ? [] : [...new Set(result.error.issues.map((issue) => issue.path[0]))]
}

describe('employeeSchema', () => {
  it('acepta un empleado válido y quita los espacios del nombre', () => {
    const result = employeeSchema.parse(valid)
    expect(result.name).toBe('Ana Pérez')
  })

  it.each(['12345', 'ABCDE12345ABCDE12345'])('acepta el documento %s', (document) => {
    expect(issuesFor({ document })).toEqual([])
  })

  it('rechaza un nombre vacío o solo con espacios', () => {
    expect(issuesFor({ name: '' })).toEqual(['name'])
    expect(issuesFor({ name: '    ' })).toEqual(['name'])
  })

  it('rechaza un nombre de más de 100 caracteres', () => {
    expect(issuesFor({ name: 'a'.repeat(101) })).toEqual(['name'])
    expect(issuesFor({ name: 'a'.repeat(100) })).toEqual([])
  })

  it.each(['', '1234', 'A'.repeat(21), 'AB-1234', 'AB 12345', 'ÑANDÚ123'])('rechaza el documento "%s"', (document) => {
    expect(issuesFor({ document })).toEqual(['document'])
  })

  it.each(['documentTypeId', 'roleId', 'companyId'] as const)('rechaza %s vacío o que no es UUID', (field) => {
    expect(issuesFor({ [field]: '' })).toEqual([field])
    expect(issuesFor({ [field]: 'no-es-un-uuid' })).toEqual([field])
  })
})

describe('getChangedFields', () => {
  it('devuelve solo los campos modificados', () => {
    const changes = getChangedFields(valid, { ...valid, name: 'Ana María', roleId: valid.companyId })
    expect(changes).toEqual({ name: 'Ana María', roleId: valid.companyId })
  })

  it('ignora cambios que solo agregan espacios', () => {
    expect(getChangedFields(valid, { ...valid, document: ' AB12345 ' })).toEqual({})
  })
})
