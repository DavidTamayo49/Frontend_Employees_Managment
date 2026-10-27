import { QueryClient } from '@tanstack/react-query'
import { isApiError } from '@/shared/api/ApiError'

export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 1000,
        // Al volver a la pestaña se traen los cambios hechos desde otros clientes.
        refetchOnWindowFocus: true,
        // No reintentar errores 4xx: son respuestas definitivas del backend.
        retry: (failureCount, error) => {
          if (isApiError(error) && error.status >= 400 && error.status < 500) return false
          return failureCount < 2
        },
      },
    },
  })
}
