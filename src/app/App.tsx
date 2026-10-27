import { useState } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router'
import { Toaster } from '@/shared/ui/sonner'
import { createQueryClient } from './queryClient'
import { router } from './router'

export function App() {
  // En estado (no a nivel de módulo) para que el hot reload no cree un segundo
  // QueryClient: la tabla y las mutaciones quedarían en cachés distintas.
  const [queryClient] = useState(createQueryClient)

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster />
    </QueryClientProvider>
  )
}
