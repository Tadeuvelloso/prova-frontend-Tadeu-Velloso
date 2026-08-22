import { RouterProvider } from 'react-router-dom'
import { AppProviders } from './providers/AppProviders'
import { AuthProvider } from './providers/AuthProvider'
import { router } from './routes'

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
