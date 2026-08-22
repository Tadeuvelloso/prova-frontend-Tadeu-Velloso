import { formatCurrency, formatNumber } from '../../../utils/formatters'
import type { Product } from '../../../types/product'
import { PRODUCT_COLUMNS } from './columns'
import { StatusBadge } from './StatusBadge'

interface ProductsTableProps {
  products: Product[]
}

export function ProductsTable({ products }: ProductsTableProps) {
  return (
    // A rolagem fica no contêiner, não na página: em tela estreita a tabela
    // desliza dentro da própria caixa e o restante do layout não se mexe.
    <div className="overflow-x-auto rounded-lg border border-border-subtle bg-surface shadow-card">
      <table className="w-full min-w-[40rem] text-left text-sm">
        {/*
          Descreve a tabela para leitores de tela. Visualmente redundante —
          o título da página já diz isso — mas quem navega por audição pula de
          tabela em tabela e precisa saber o que cada uma contém.
        */}
        <caption className="sr-only">Lista de produtos cadastrados</caption>

        <thead>
          <tr className="border-b border-border-subtle">
            {PRODUCT_COLUMNS.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={`px-4 py-3 text-xs font-medium tracking-wide text-content-muted uppercase ${
                  column.align === 'right' ? 'text-right' : 'text-left'
                }`}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <ProductRow key={product._id} product={product} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

function ProductRow({ product }: { product: Product }) {
  // O backend expõe `minStockAlert` justamente para isto. Mostrar o número
  // sem o alerta deixaria o dado que importa invisível numa lista longa.
  const isLowStock = product.stock <= product.minStockAlert

  return (
    <tr className="border-b border-border-subtle last:border-0">
      {/*
        `th scope="row"` e não `td`: o nome identifica a linha, e é ele que o
        leitor de tela repete ao percorrer as outras células.
      */}
      <th scope="row" className="px-4 py-3 text-left font-medium text-content">
        {product.name}
      </th>

      <td className="px-4 py-3 font-mono text-xs text-content-muted">{product.sku}</td>

      <td className="px-4 py-3 text-content-muted">{product.category}</td>

      {/* `tabular-nums` alinha os dígitos coluna a coluna, o que torna a
          comparação de preços possível de bater o olho. */}
      <td className="px-4 py-3 text-right font-mono text-content tabular-nums">
        {formatCurrency(product.salePrice)}
      </td>

      <td className="px-4 py-3 text-right font-mono tabular-nums">
        <span className={isLowStock ? 'text-danger' : 'text-content-muted'}>
          {formatNumber(product.stock)}
        </span>
        {isLowStock && (
          <span className="ml-1 text-[10px] text-danger uppercase">
            {/* Não depende só da cor: quem não distingue vermelho lê o rótulo. */}
            baixo
          </span>
        )}
      </td>

      <td className="px-4 py-3">
        <StatusBadge active={product.active} />
      </td>
    </tr>
  )
}
