/**
 * Os preços da Fake Store API são em dólar. Formatar no locale pt-BR com a
 * moeda USD produz "US$ 109,95": separador decimal brasileiro, sem esconder
 * que o valor não é em real.
 */
const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'USD',
})

const ratingFormatter = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
})

export function formatCurrency(value: number): string {
  return currencyFormatter.format(value)
}

export function formatRating(rate: number): string {
  return ratingFormatter.format(rate)
}
