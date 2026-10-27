import { useQuery } from '@tanstack/react-query'
import { getCompanies, getDocumentTypes, getRoles } from '../api/catalogsApi'

/** Los catálogos cambian poco: se mantienen frescos 10 minutos. */
const CATALOG_STALE_TIME = 10 * 60 * 1000

export const catalogKeys = {
  all: ['catalogs'] as const,
  documentTypes: () => [...catalogKeys.all, 'document-types'] as const,
  roles: () => [...catalogKeys.all, 'roles'] as const,
  companies: () => [...catalogKeys.all, 'companies'] as const,
}

export function useDocumentTypes() {
  return useQuery({
    queryKey: catalogKeys.documentTypes(),
    queryFn: ({ signal }) => getDocumentTypes(signal),
    staleTime: CATALOG_STALE_TIME,
  })
}

export function useRoles() {
  return useQuery({
    queryKey: catalogKeys.roles(),
    queryFn: ({ signal }) => getRoles(signal),
    staleTime: CATALOG_STALE_TIME,
  })
}

export function useCompanies() {
  return useQuery({
    queryKey: catalogKeys.companies(),
    queryFn: ({ signal }) => getCompanies(signal),
    staleTime: CATALOG_STALE_TIME,
  })
}
