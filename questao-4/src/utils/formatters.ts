/**
 * Formatadores criados uma vez no módulo, não a cada chamada: instanciar um
 * `Intl.NumberFormat` é caro, e numa tabela ele seria recriado por célula a
 * cada render.
 */
const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

const numberFormatter = new Intl.NumberFormat('pt-BR')

export function formatCurrency(value: number): string {
  return currencyFormatter.format(value)
}

/** Separador de milhar no estoque: 1500 vira "1.500". */
export function formatNumber(value: number): string {
  return numberFormatter.format(value)
}
