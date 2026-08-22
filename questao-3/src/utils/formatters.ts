// Locale pt-BR com moeda USD produz "US$ 109,95": separador brasileiro, sem
// esconder que os preços da Fake Store não são em real.
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
