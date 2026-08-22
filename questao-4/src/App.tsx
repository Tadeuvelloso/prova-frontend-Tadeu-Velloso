import { Button } from './components/common/Button'
import { ThemeToggle } from './components/common/ThemeToggle'
import { LoginPage } from './pages/LoginPage'
import { AppProviders } from './providers/AppProviders'
import { endSession } from './services/session'
import { useAuthStore } from './store/authStore'
import { formatCurrency, formatNumber } from './utils/formatters'
import { notify } from './utils/notify'

/**
 * TEMPORÁRIO — amostra dos tokens de tema.
 *
 * Existe para conferir a identidade visual nos dois temas antes de as telas
 * serem construídas em cima dela. Some quando o roteamento entrar no lugar.
 */

const swatches = [
  { token: 'surface', className: 'bg-surface' },
  { token: 'surface-muted', className: 'bg-surface-muted' },
  { token: 'border-subtle', className: 'bg-border-subtle' },
  { token: 'border-strong', className: 'bg-border-strong' },
  { token: 'content-muted', className: 'bg-content-muted' },
  { token: 'content', className: 'bg-content' },
  { token: 'brand', className: 'bg-brand' },
  { token: 'brand-soft', className: 'bg-brand-soft' },
  { token: 'success', className: 'bg-success' },
  { token: 'danger', className: 'bg-danger' },
]

const rows = [
  { name: 'Coca-Cola 2L', sku: 'COCA-2L', price: 8.0, stock: 100, active: true },
  { name: 'Skol 350ml', sku: 'SKOL-350', price: 3.5, stock: 200, active: true },
  { name: 'Água Mineral 500ml', sku: 'AGUA-500', price: 1.5, stock: 12, active: false },
]

function App() {
  return (
    <AppProviders>
      <Gate />
    </AppProviders>
  )
}

/**
 * TEMPORÁRIO — versão mínima do que o `ProtectedRoute` fará na etapa 8.
 *
 * Existe para que a autenticação seja demonstrável antes do roteamento entrar:
 * sem token, tela de login; com token, a aplicação. Note que ninguém precisa
 * mandar "redirecionar" — o interceptor apaga o token e este componente, que
 * observa o store, reage sozinho.
 */
function Gate() {
  const token = useAuthStore((state) => state.token)

  return token ? <TokensPreview /> : <LoginPage />
}

function TokensPreview() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-border-subtle bg-surface">
        <div className="mx-auto flex max-w-4xl items-center gap-4 px-4 py-6">
          <div>
            <p className="font-mono text-xs tracking-[0.2em] text-content-muted uppercase">
              Questão 4
            </p>
            <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight text-content">
              Gestão de produtos
            </h1>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <ThemeToggle />
            <Button variant="secondary" onClick={() => endSession()}>
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl space-y-10 px-4 py-10">
        <section className="space-y-3">
          <h2 className="font-display text-sm font-semibold tracking-wide text-content uppercase">
            Tipografia
          </h2>

          <div className="space-y-2 rounded-lg border border-border-subtle bg-surface p-5 shadow-card">
            <p className="font-display text-2xl font-semibold text-content">
              Space Grotesk carrega os títulos
            </p>
            <p className="text-content-muted">
              Inter no texto corrido — a leitura longa de descrição e mensagem de erro.
            </p>
            <p className="font-mono text-sm text-content tabular-nums">
              R$ 1.234,50 · 0987 unidades · JetBrains Mono nos números
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-sm font-semibold tracking-wide text-content uppercase">
            Cores
          </h2>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            {swatches.map((swatch) => (
              <div key={swatch.token} className="space-y-1.5">
                <div
                  className={`h-12 rounded-md border border-border-subtle ${swatch.className}`}
                />
                <p className="font-mono text-[11px] text-content-muted">{swatch.token}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-sm font-semibold tracking-wide text-content uppercase">
            Componentes
          </h2>

          <div className="space-y-5 rounded-lg border border-border-subtle bg-surface p-5 shadow-card">
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-brand-contrast transition-colors hover:bg-brand-hover"
              >
                Novo produto
              </button>

              <button
                type="button"
                className="rounded-md border border-border-strong bg-surface px-4 py-2 text-sm font-medium text-content transition-colors hover:border-brand hover:text-brand"
              >
                Cancelar
              </button>

              <button
                type="button"
                className="rounded-md px-4 py-2 text-sm font-medium text-danger transition-colors hover:bg-danger-soft"
              >
                Excluir
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-3 border-t border-border-subtle pt-5">
              <button
                type="button"
                onClick={() => notify.success('Produto cadastrado com sucesso.')}
                className="rounded-md border border-border-strong bg-surface px-3 py-1.5 text-sm text-content transition-colors hover:border-brand hover:text-brand"
              >
                Testar sucesso
              </button>

              <button
                type="button"
                onClick={() => notify.error('SKU já cadastrado.')}
                className="rounded-md border border-border-strong bg-surface px-3 py-1.5 text-sm text-content transition-colors hover:border-brand hover:text-brand"
              >
                Testar erro
              </button>

              <button
                type="button"
                onClick={() => notify.info('Sessão expirada. Faça login novamente.')}
                className="rounded-md border border-border-strong bg-surface px-3 py-1.5 text-sm text-content transition-colors hover:border-brand hover:text-brand"
              >
                Testar aviso
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border-subtle">
                    <th scope="col" className="pb-2 font-medium text-content-muted">
                      Produto
                    </th>
                    <th scope="col" className="pb-2 font-medium text-content-muted">
                      SKU
                    </th>
                    <th scope="col" className="pb-2 text-right font-medium text-content-muted">
                      Preço
                    </th>
                    <th scope="col" className="pb-2 text-right font-medium text-content-muted">
                      Estoque
                    </th>
                    <th scope="col" className="pb-2 font-medium text-content-muted">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.sku} className="border-b border-border-subtle last:border-0">
                      <td className="py-3 text-content">{row.name}</td>
                      <td className="py-3 font-mono text-xs text-content-muted">{row.sku}</td>
                      <td className="py-3 text-right font-mono text-content tabular-nums">
                        {formatCurrency(row.price)}
                      </td>
                      <td className="py-3 text-right font-mono text-content-muted tabular-nums">
                        {formatNumber(row.stock)}
                      </td>
                      <td className="py-3">
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                            row.active
                              ? 'bg-success-soft text-success'
                              : 'bg-danger-soft text-danger'
                          }`}
                        >
                          {row.active ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
