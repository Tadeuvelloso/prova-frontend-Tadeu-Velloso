import { queryClient } from '../config/queryClient'
import { useAuthStore } from '../store/authStore'
import { notify } from '../utils/notify'

/**
 * Encerra a sessão em um lugar só.
 *
 * Existe porque derrubar a sessão é mais do que apagar o token: o cache do
 * React Query guarda respostas obtidas com aquele token e precisa ir junto.
 * Sem o `clear()`, o próximo usuário a entrar veria por um instante os dados
 * do anterior, servidos do cache antes do primeiro refetch.
 *
 * É chamado de dois lugares — do interceptor, quando o servidor recusa o
 * token, e do botão "Sair" — e os dois precisam fazer exatamente a mesma
 * coisa.
 *
 * Não redireciona: quem faz isso é o `ProtectedRoute`, que observa o store e
 * reage à ausência do token. Um `window.location` aqui recarregaria a página
 * inteira e jogaria fora a navegação da SPA.
 */
export function endSession(message?: string): void {
  // Várias requisições podem tomar 401 ao mesmo tempo. Sem esta guarda, a
  // limpeza de cache rodaria uma vez para cada resposta.
  if (!useAuthStore.getState().token) return

  useAuthStore.getState().logout()
  queryClient.clear()

  if (message) notify.info(message)
}
