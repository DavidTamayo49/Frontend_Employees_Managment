import { UsersIcon } from 'lucide-react'
import { Link, Outlet } from 'react-router'

export function AppLayout() {
  return (
    <div className="min-h-screen bg-muted/40">
      <header className="border-b bg-background">
        <div className="mx-auto flex h-14 max-w-6xl items-center px-4">
          <Link to="/empleados" className="flex items-center gap-2 font-semibold">
            <UsersIcon className="size-5" />
            Gestión de empleados
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
