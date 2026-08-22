import { RouterProvider } from 'react-router-dom'
import { AppProviders } from './providers/AppProviders'
import { AuthProvider } from './providers/AuthProvider'
import { router } from './routes'

/**
 * A ordem das camadas não é arbitrária:
 *
 * `AppProviders` primeiro, porque o `AuthProvider` consulta `/auth/me` pelo
 * React Query e precisa do client; e porque o feedback fica acima do
 * roteamento, para sobreviver à navegação.
 *
 * `AuthProvider` depois, para que a validação da sessão aconteça antes de
 * qualquer rota renderizar.
 */
function App() {
  return (
    <AppProviders>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </AppProviders>
  )
}

export default App
