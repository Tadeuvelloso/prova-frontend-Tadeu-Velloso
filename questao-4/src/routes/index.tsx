import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppLayout } from '../components/layout/AppLayout'
import { LoginPage } from '../pages/LoginPage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { ProductFormPage } from '../pages/ProductFormPage'
import { ProductsPage } from '../pages/ProductsPage'
import { PRODUCT_WRITE_ROLES } from '../utils/permissions'
import { DEFAULT_AUTHENTICATED_ROUTE, PublicOnlyRoute } from './PublicOnlyRoute'
import { ProtectedRoute } from './ProtectedRoute'
import { RoleRoute } from './RoleRoute'

export const router = createBrowserRouter([
  {
    element: <PublicOnlyRoute />,
    children: [{ path: '/login', element: <LoginPage /> }],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: '/', element: <Navigate to={DEFAULT_AUTHENTICATED_ROUTE} replace /> },
          { path: '/produtos', element: <ProductsPage /> },

          {
            element: <RoleRoute allow={PRODUCT_WRITE_ROLES} />,
            children: [
              { path: '/produtos/novo', element: <ProductFormPage /> },
              { path: '/produtos/:id/editar', element: <ProductFormPage /> },
            ],
          },
        ],
      },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
])
