import { queryClient } from '../config/queryClient'
import { useAuthStore } from '../store/authStore'
import { notify } from '../utils/notify'

export function endSession(message?: string): void {
  if (!useAuthStore.getState().token) return

  useAuthStore.getState().logout()
  // O cache guarda respostas obtidas com o token antigo: sem limpar, o
  // próximo usuário veria os dados do anterior antes do primeiro refetch.
  queryClient.clear()

  if (message) notify.info(message)
}
