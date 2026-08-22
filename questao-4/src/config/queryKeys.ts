/**
 * Chaves do React Query em um lugar só.
 *
 * A chave é o identificador do dado no cache: é por ela que se lê, se semeia
 * e se invalida. Espalhar literais pelo código faz com que um `['auth','me']`
 * digitado diferente em dois arquivos vire, silenciosamente, dois caches
 * distintos — o tipo de erro que não quebra o build e só aparece como "a tela
 * não atualizou".
 */
import type { ProductFilters } from '../types/product'

export const queryKeys = {
  /** Usuário da sessão validada. */
  authMe: ['auth', 'me'] as const,

  /**
   * Listagem de produtos.
   *
   * Os filtros que vão ao servidor entram na chave, e não só na URL: é isso
   * que dá um cache por combinação de filtro e que elimina a corrida de
   * respostas fora de ordem quando alguém troca o status rápido — cada
   * resposta é guardada no seu próprio lugar, em vez de sobrescrever a tela.
   */
  products: (filters: ProductFilters = {}) => ['products', filters] as const,

  /**
   * Prefixo de todas as listagens, qualquer que seja o filtro.
   *
   * É o alvo da invalidação depois de criar, editar ou excluir: como o filtro
   * entra na chave, existe um cache por combinação, e invalidar só a
   * combinação visível deixaria as outras desatualizadas.
   */
  productsRoot: ['products'] as const,

  /** Um produto específico, carregado pela tela de edição. */
  product: (id: string) => ['product', id] as const,
} as const
