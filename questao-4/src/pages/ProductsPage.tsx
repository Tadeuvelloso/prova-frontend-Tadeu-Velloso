/**
 * Listagem de produtos.
 *
 * Ainda é só a casca: a tabela, os filtros e a paginação entram nas etapas
 * seguintes. Existe agora para que o roteamento e as guardas de acesso sejam
 * verificáveis de ponta a ponta.
 */
export function ProductsPage() {
  return (
    <div className="space-y-2">
      <h2 className="font-display text-xl font-semibold tracking-tight text-content">
        Produtos
      </h2>
      <p className="text-sm text-content-muted">
        Listagem, filtros e paginação entram na sequência.
      </p>
    </div>
  )
}
