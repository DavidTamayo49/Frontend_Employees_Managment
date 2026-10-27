import { createBrowserRouter, Navigate } from 'react-router'
import { EditEmployeePage } from '@/features/employees/pages/EditEmployeePage'
import { EmployeesListPage } from '@/features/employees/pages/EmployeesListPage'
import { NewEmployeePage } from '@/features/employees/pages/NewEmployeePage'
import { AppLayout } from './AppLayout'

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { index: true, element: <EmployeesListPage /> },
      { path: 'empleados', element: <EmployeesListPage /> },
      { path: 'empleados/nuevo', element: <NewEmployeePage /> },
      { path: 'empleados/:id/editar', element: <EditEmployeePage /> },
      { path: '*', element: <Navigate to="/empleados" replace /> },
    ],
  },
])
