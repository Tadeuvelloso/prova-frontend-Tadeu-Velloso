import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './config/queryClient'
import { useProducts } from './hooks/useProducts'

// Prévia temporária: existe só para provar que os dados chegam do React Query.
// Vira a ProductsPage com a tabela na próxima etapa.
function ProductsPreview() {
  const { data, isPending, isError, error } = useProducts()

  if (isPending) return <p className="mt-6 text-content-muted">Carregando produtos…</p>

  if (isError) return <p className="mt-6 text-danger">{error.message}</p>

  return (
    <ul className="mt-6 space-y-1 text-sm text-content-muted">
      {data.map((product) => (
        <li key={product.id}>
          {product.title} — {product.price} — {product.category}
        </li>
      ))}
    </ul>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <main className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="text-2xl font-semibold text-content">Catálogo de Produtos</h1>
        <p className="mt-2 text-content-muted">
          Consumo da Fake Store API com React Query e Axios.
        </p>
        <ProductsPreview />
      </main>
    </QueryClientProvider>
  )
}

export default App
