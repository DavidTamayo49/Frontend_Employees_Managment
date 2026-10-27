import { useMutation, useQuery, useQueryClient, type QueryClient } from '@tanstack/react-query'
import { isApiError } from '@/shared/api/ApiError'
import { employeesApi } from '../api/employeesApi'
import type { EmployeeDetail, ModifyEmployeeRequest, RegisterEmployeeRequest } from '../model/types'

export const employeeKeys = {
  all: ['employees'] as const,
  list: (companyId?: string) => [...employeeKeys.all, 'list', { companyId: companyId ?? null }] as const,
}

/** Cada cuánto se refresca el listado mientras la pestaña está visible. */
const EMPLOYEES_REFETCH_INTERVAL = 10 * 1000

export function useEmployees(companyId?: string, options: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: employeeKeys.list(companyId),
    queryFn: ({ signal }) => employeesApi.list(companyId, signal),
    enabled: options.enabled,
    refetchInterval: EMPLOYEES_REFETCH_INTERVAL,
  })
}

function removeFromCachedLists(queryClient: QueryClient, id: string) {
  queryClient.setQueriesData<EmployeeDetail[]>({ queryKey: employeeKeys.all }, (data) =>
    data?.filter((employee) => employee.id !== id),
  )
}

/**
 * Busca un empleado primero en cualquier listado en caché y, si no está,
 * descarga el listado completo (`GET /employees`).
 */
export function useEmployee(id: string) {
  const queryClient = useQueryClient()
  const cached = queryClient
    .getQueriesData<EmployeeDetail[]>({ queryKey: employeeKeys.all })
    .flatMap(([, data]) => data ?? [])
    .find((employee) => employee.id === id)

  const query = useEmployees(undefined, { enabled: !cached })
  const employee = cached ?? query.data?.find((item) => item.id === id)

  return {
    employee,
    isPending: !cached && query.isPending,
    error: cached ? null : query.error,
    refetch: query.refetch,
  }
}

export function useRegisterEmployee() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: RegisterEmployeeRequest) => employeesApi.register(body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: employeeKeys.all }),
  })
}

export function useModifyEmployee() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, changes }: { id: string; changes: ModifyEmployeeRequest }) => employeesApi.modify(id, changes),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: employeeKeys.all }),
    onError: (error) => {
      if (isApiError(error) && error.status === 404) {
        return queryClient.invalidateQueries({ queryKey: employeeKeys.all })
      }
    },
  })
}

export function useDeleteEmployee() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => employeesApi.remove(id),
    onSuccess: (_response, id) => {
      // Se quita de inmediato de la tabla, sin esperar al refetch.
      removeFromCachedLists(queryClient, id)
      return queryClient.invalidateQueries({ queryKey: employeeKeys.all })
    },
    onError: (error, id) => {
      // Si ya no existe, el listado está desactualizado.
      if (isApiError(error) && error.status === 404) {
        removeFromCachedLists(queryClient, id)
        return queryClient.invalidateQueries({ queryKey: employeeKeys.all })
      }
    },
  })
}
