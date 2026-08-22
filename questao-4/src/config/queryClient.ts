import { QueryClient } from '@tanstack/react-query'
import { AppError } from '../utils/errorHandler'

/**
 * Ao contrário do catálogo estático da Questão 3, aqui os dados mudam — pela
 * própria aplicação e por outros usuários do mesmo backend. Meio minuto é
 * curto o bastante para não servir uma lista defasada e longo o bastante para
 * navegar entre listagem e formulário sem refazer a requisição.
 */
const THIRTY_SECONDS = 1000 * 30

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: THIRTY_SECONDS,

      /**
       * Desligado por causa da hibernação do Render: voltar para a aba depois
       * de um tempo dispararia justamente a requisição que espera o servidor
       * acordar. As mutações já invalidam o cache, então a lista se mantém
       * correta sem isto.
       */
      refetchOnWindowFocus: false,

      retry: (failureCount, error) => {
        // 4xx é erro de quem pediu: repetir devolve o mesmo resultado.
        // Só falha de rede e 5xx justificam nova tentativa.
        const status = error instanceof AppError ? error.status : undefined
        if (status && status >= 400 && status < 500) return false

        return failureCount < 2
      },
    },

    mutations: {
      /**
       * Nunca repetir escrita automaticamente. Um POST que falhou por timeout
       * pode ter chegado ao servidor mesmo assim — repetir criaria o produto
       * duas vezes. Quem decide tentar de novo é o usuário.
       */
      retry: false,
    },
  },
})
