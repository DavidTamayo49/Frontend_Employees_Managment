import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mockFetchByPath, renderWithProviders } from '@/test/utils'
import { EmployeeForm } from './EmployeeForm'

const CC = '3f1c2a9e-8b7d-4c6e-9a1b-2d3e4f5a6b7c'
const DEV = '7a8b9c0d-1e2f-4a3b-8c4d-5e6f7a8b9c0d'
const QA = '8b9c0d1e-2f3a-4b4c-9d5e-6f7a8b9c0d1e'
const ACME = 'c1d2e3f4-a5b6-4c7d-8e9f-0a1b2c3d4e5f'

beforeEach(() => {
  mockFetchByPath({
    '/document-types': [{ id: CC, name: 'Cédula de ciudadanía' }],
    '/roles': [
      { id: DEV, name: 'Desarrollador' },
      { id: QA, name: 'Analista QA' },
    ],
    '/companies': [{ id: ACME, name: 'Acme S.A.S.', nit: '900123456' }],
  })
})

describe('EmployeeForm', () => {
  it('muestra los errores de validación junto a cada campo y no envía', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    renderWithProviders(<EmployeeForm mode="create" onSubmit={onSubmit} />)

    await user.type(await screen.findByLabelText('Documento'), 'A-1')
    await user.click(screen.getByRole('button', { name: 'Guardar' }))

    expect(await screen.findByText('El nombre es obligatorio')).toBeInTheDocument()
    expect(screen.getByText('El documento debe ser alfanumérico y tener entre 5 y 20 caracteres')).toBeInTheDocument()
    expect(screen.getByText('Selecciona un tipo de documento')).toBeInTheDocument()
    expect(screen.getByText('Selecciona un rol')).toBeInTheDocument()
    expect(screen.getByText('Selecciona una empresa')).toBeInTheDocument()
    expect(screen.getByLabelText('Nombre')).toHaveAttribute('aria-invalid', 'true')
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('en modo creación envía todos los campos', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    renderWithProviders(<EmployeeForm mode="create" onSubmit={onSubmit} />)

    await user.type(await screen.findByLabelText('Nombre'), '  Ana Pérez ')
    await user.selectOptions(screen.getByLabelText('Tipo de documento'), CC)
    await user.type(screen.getByLabelText('Documento'), 'AB12345')
    await user.selectOptions(screen.getByLabelText('Rol'), DEV)
    await user.selectOptions(screen.getByLabelText('Empresa'), ACME)
    await user.click(screen.getByRole('button', { name: 'Guardar' }))

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({
        name: 'Ana Pérez',
        document: 'AB12345',
        documentTypeId: CC,
        roleId: DEV,
        companyId: ACME,
      }),
    )
  })

  it('en modo edición deshabilita Guardar sin cambios y envía solo los campos cambiados', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    renderWithProviders(
      <EmployeeForm
        mode="edit"
        initialValues={{ name: 'Ana Pérez', document: 'AB12345', documentTypeId: CC, roleId: DEV, companyId: ACME }}
        onSubmit={onSubmit}
      />,
    )

    const name = await screen.findByLabelText('Nombre')
    expect(name).toHaveValue('Ana Pérez')
    expect(screen.getByLabelText('Rol')).toHaveValue(DEV)
    expect(screen.getByRole('button', { name: 'Guardar' })).toBeDisabled()

    await user.clear(name)
    await user.type(name, 'Ana María Pérez')
    await user.selectOptions(screen.getByLabelText('Rol'), QA)

    const save = screen.getByRole('button', { name: 'Guardar' })
    expect(save).toBeEnabled()
    await user.click(save)

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1))
    expect(onSubmit).toHaveBeenCalledWith({ name: 'Ana María Pérez', roleId: QA })
  })
})
