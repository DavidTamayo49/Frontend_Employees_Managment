import { QueryClient } from '@tanstack/react-query'
import { isApiError } from '@/shared/api/ApiError'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000,
      refetchOnWindowFocus: false,
      // No reintentar errores 4xx: son respuestas definitivas del backend.
      retry: (failureCount, error) => {
        if (isApiError(error) && error.status >= 400 && error.status < 500) return false
        return failureCount < 2
      },
    },
  },
})
