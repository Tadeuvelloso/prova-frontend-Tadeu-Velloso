import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './config/queryClient'
import { MainLayout } from './components/layout/MainLayout'
import { ProductsPage } from './pages/ProductsPage'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MainLayout>
        <ProductsPage />
      </MainLayout>
    </QueryClientProvider>
  )
}

export default App
