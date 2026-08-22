/**
 * Chaves do React Query em um lugar só.
 *
 * A chave é o identificador do dado no cache: é por ela que se lê, se semeia
 * e se invalida. Espalhar literais pelo código faz com que um `['auth','me']`
 * digitado diferente em dois arquivos vire, silenciosamente, dois caches
 * distintos — o tipo de erro que não quebra o build e só aparece como "a tela
 * não atualizou".
 */
export const queryKeys = {
  /** Usuário da sessão validada. */
  authMe: ['auth', 'me'] as const,
} as const
