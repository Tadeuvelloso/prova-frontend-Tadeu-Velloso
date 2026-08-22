import type { ReactNode } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { SnackbarProvider } from 'notistack'
import { SnackbarToast } from '../components/common/SnackbarToast'
import { queryClient } from '../config/queryClient'

/**
 * Providers globais da aplicação.
 *
 * Ficam acima do roteamento de propósito: o feedback precisa sobreviver à
 * navegação. Salvar um produto emite o toast e navega de volta para a
 * listagem — se o provider estivesse dentro da rota, a mensagem morreria
 * junto com a tela que a originou.
 */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <SnackbarProvider
        // Todas as variantes usam o mesmo conteúdo customizado: o visual
        // padrão do notistack é Material Design e não conversa com os tokens
        // daqui.
        Components={{
          default: SnackbarToast,
          success: SnackbarToast,
          error: SnackbarToast,
          info: SnackbarToast,
          warning: SnackbarToast,
        }}
        /**
         * Evita empilhar mensagens idênticas. Não é preciosismo: se o token
         * expirar com a listagem e o `/auth/me` em voo ao mesmo tempo, as
         * duas respostas 401 passam pelo interceptor e emitiriam dois
         * "Sessão expirada" iguais.
         */
        preventDuplicate
        maxSnack={3}
        /**
         * Topo, e não rodapé, por um motivo medido: os botões de ação dos
         * formulários ficam alinhados à direita no fim do conteúdo, e um
         * snackbar ancorado embaixo à direita cobre exatamente essa área.
         * Verifiquei com `elementFromPoint` no centro do botão "Cadastrar
         * produto": quem respondia era o parágrafo do toast, e o clique não
         * chegava ao botão enquanto a mensagem estivesse na tela.
         *
         * Feedback não pode disputar espaço com controle de ação.
         */
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {children}
      </SnackbarProvider>
    </QueryClientProvider>
  )
}
