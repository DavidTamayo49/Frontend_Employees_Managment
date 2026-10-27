import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { isApiError } from '@/shared/api/ApiError'
import { employeesApi } from '../api/employeesApi'
import type { EmployeeDetail, ModifyEmployeeRequest, RegisterEmployeeRequest } from '../model/types'

export const employeeKeys = {
  all: ['employees'] as const,
  list: (companyId?: string) => [...employeeKeys.all, 'list', { companyId: companyId ?? null }] as const,
}

export function useEmployees(companyId?: string, options: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: employeeKeys.list(companyId),
    queryFn: ({ signal }) => employeesApi.list(companyId, signal),
    enabled: options.enabled,
  })
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
    onSuccess: () => queryClient.invalidateQueries({ queryKey: employeeKeys.all }),
    onError: (error) => {
      // Si ya no existe, el listado está desactualizado.
      if (isApiError(error) && error.status === 404) {
        return queryClient.invalidateQueries({ queryKey: employeeKeys.all })
      }
    },
  })
}
