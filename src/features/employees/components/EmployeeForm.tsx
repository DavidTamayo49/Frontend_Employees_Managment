import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router'
import { useCompanies, useDocumentTypes, useRoles } from '@/features/catalogs/hooks/useCatalogs'
import { Button } from '@/shared/ui/button'
import { FormField } from '@/shared/ui/FormField'
import { Input } from '@/shared/ui/input'
import { NativeSelect } from '@/shared/ui/native-select'
import {
  emptyEmployeeFormValues,
  employeeSchema,
  getChangedFields,
  type EmployeeFormOutput,
  type EmployeeFormValues,
} from '../model/employeeSchema'
import type { ModifyEmployeeRequest, RegisterEmployeeRequest } from '../model/types'

type EmployeeFormProps =
  | {
      mode: 'create'
      submitting?: boolean
      onSubmit: (values: RegisterEmployeeRequest) => void
    }
  | {
      mode: 'edit'
      initialValues: EmployeeFormValues
      submitting?: boolean
      onSubmit: (changes: ModifyEmployeeRequest) => void
    }

type Option = { id: string; name: string }

function CatalogOptions({ items, isPending, placeholder }: { items?: Option[]; isPending: boolean; placeholder: string }) {
  return (
    <>
      <option value="">{isPending ? 'Cargando…' : placeholder}</option>
      {items?.map((item) => (
        <option key={item.id} value={item.id}>
          {item.name}
        </option>
      ))}
    </>
  )
}

export function EmployeeForm(props: EmployeeFormProps) {
  const documentTypes = useDocumentTypes()
  const roles = useRoles()
  const companies = useCompanies()

  // Los <select> necesitan sus opciones antes de montar para mostrar los valores iniciales.
  if (documentTypes.isPending || roles.isPending || companies.isPending) {
    return <p className="text-sm text-muted-foreground">Cargando catálogos…</p>
  }

  return <EmployeeFormFields {...props} catalogs={{ documentTypes, roles, companies }} />
}

type CatalogQuery = { data?: Option[]; isPending: boolean; isError: boolean }

function EmployeeFormFields(
  props: EmployeeFormProps & {
    catalogs: { documentTypes: CatalogQuery; roles: CatalogQuery; companies: CatalogQuery }
  },
) {
  const { documentTypes, roles, companies } = props.catalogs
  const initialValues = props.mode === 'edit' ? props.initialValues : emptyEmployeeFormValues

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<EmployeeFormValues, unknown, EmployeeFormOutput>({
    resolver: zodResolver(employeeSchema),
    defaultValues: initialValues,
  })

  const currentValues = useWatch({ control }) as EmployeeFormValues
  const hasChanges =
    props.mode === 'create' || Object.keys(getChangedFields(initialValues, { ...initialValues, ...currentValues })).length > 0

  const submit = handleSubmit((values) => {
    if (props.mode === 'create') {
      props.onSubmit(values)
    } else {
      const changes = getChangedFields(initialValues, values)
      if (Object.keys(changes).length > 0) props.onSubmit(changes)
    }
  })

  const fieldProps = (name: keyof EmployeeFormValues) => ({
    id: name,
    'aria-invalid': errors[name] ? true : undefined,
    'aria-describedby': errors[name] ? `${name}-error` : undefined,
    ...register(name),
  })

  return (
    <form onSubmit={submit} noValidate className="grid gap-5">
      <FormField id="name" label="Nombre" error={errors.name?.message}>
        <Input autoComplete="off" {...fieldProps('name')} />
      </FormField>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField id="documentTypeId" label="Tipo de documento" error={errors.documentTypeId?.message}>
          <NativeSelect {...fieldProps('documentTypeId')}>
            <CatalogOptions
              items={documentTypes.data}
              isPending={documentTypes.isPending}
              placeholder="Selecciona…"
            />
          </NativeSelect>
        </FormField>

        <FormField id="document" label="Documento" error={errors.document?.message}>
          <Input autoComplete="off" {...fieldProps('document')} />
        </FormField>
      </div>

      <FormField id="roleId" label="Rol" error={errors.roleId?.message}>
        <NativeSelect {...fieldProps('roleId')}>
          <CatalogOptions items={roles.data} isPending={roles.isPending} placeholder="Selecciona…" />
        </NativeSelect>
      </FormField>

      <FormField id="companyId" label="Empresa" error={errors.companyId?.message}>
        <NativeSelect {...fieldProps('companyId')}>
          <CatalogOptions items={companies.data} isPending={companies.isPending} placeholder="Selecciona…" />
        </NativeSelect>
      </FormField>

      {(documentTypes.isError || roles.isError || companies.isError) && (
        <p className="text-sm text-destructive">No se pudieron cargar algunos catálogos. Recarga la página para reintentar.</p>
      )}

      <div className="flex justify-end gap-2">
        <Button variant="outline" asChild>
          <Link to="/empleados">Cancelar</Link>
        </Button>
        <Button type="submit" disabled={props.submitting || !hasChanges}>
          {props.submitting ? 'Guardando…' : 'Guardar'}
        </Button>
      </div>
    </form>
  )
}
