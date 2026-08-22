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

/**
 * Mapa de rotas.
 *
 * As guardas são rotas sem caminho que envolvem as filhas por um `Outlet`.
 * Isso mantém a regra de acesso declarada uma vez, no lugar onde a árvore de
 * rotas está descrita, em vez de repetida dentro de cada página — e o dia em
 * que entrar uma tela nova, ela nasce protegida por estar aninhada aqui.
 */
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
          // A raiz não tem tela própria: manda para a listagem.
          { path: '/', element: <Navigate to={DEFAULT_AUTHENTICATED_ROUTE} replace /> },
          { path: '/produtos', element: <ProductsPage /> },

          // As telas de escrita ficam sob mais uma guarda: ter sessão não
          // basta, o papel precisa permitir.
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
  // Fora das guardas de propósito: um endereço inexistente deve dizer isso,
  // e não mandar o visitante para o login como se fosse falta de permissão.
  { path: '*', element: <NotFoundPage /> },
])
