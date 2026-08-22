import axios from 'axios'
import { API_CONFIG } from '../config/api.config'
import { useAuthStore } from '../store/authStore'
import { toAppError } from '../utils/errorHandler'
import { notify } from '../utils/notify'
import { endSession } from './session'

export const api = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
})

/** Única rota pública da API: não exige token e trata 401 de outro jeito. */
const LOGIN_PATH = '/auth/login'

/**
 * Request: injeta o token em toda chamada.
 *
 * A leitura é por `getState()`, não por hook. O Axios não vive dentro da
 * árvore do React e não pode se inscrever em store; além disso `getState()`
 * devolve o valor no instante do envio, o que evita mandar um token velho
 * capturado num closure de render anterior.
 */
api.interceptors.request.use((config) => {
  const { token } = useAuthStore.getState()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

/**
 * Response: normaliza a falha e resolve o que é transversal.
 *
 * Nenhuma camada acima precisa importar Axios para tratar erro — services,
 * hooks e componentes recebem sempre um `AppError`.
 */
api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    const appError = toAppError(error)
    const requestUrl = axios.isAxiosError(error) ? (error.config?.url ?? '') : ''

    /**
     * 401 no login é credencial errada, e não sessão vencida. Sem esta
     * exceção, quem digitasse a senha errada veria "Sessão expirada" no lugar
     * de "Credenciais inválidas" — e ainda seria deslogado de uma sessão que
     * nem existia.
     */
    if (appError.status === 401 && !requestUrl.includes(LOGIN_PATH)) {
      endSession('Sessão expirada. Faça login novamente.')
    }

    /**
     * 403 é permissão insuficiente, não sessão inválida: o token continua
     * bom e derrubar o usuário seria desproporcional. Como a interface já
     * esconde as ações que o papel não permite, chegar aqui significa que
     * algo escapou — vale avisar de qualquer forma.
     */
    if (appError.status === 403) {
      notify.error(appError.message)
    }

    return Promise.reject(appError)
  },
)
