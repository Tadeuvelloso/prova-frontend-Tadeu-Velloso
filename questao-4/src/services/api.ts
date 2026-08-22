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

const LOGIN_PATH = '/auth/login'

api.interceptors.request.use((config) => {
  const { token } = useAuthStore.getState()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    const appError = toAppError(error)
    const requestUrl = axios.isAxiosError(error) ? (error.config?.url ?? '') : ''

    // 401 no login é credencial errada, não sessão vencida: sem esta exceção
    // quem erra a senha seria deslogado de uma sessão que nem existia.
    if (appError.status === 401 && !requestUrl.includes(LOGIN_PATH)) {
      endSession('Sessão expirada. Faça login novamente.')
    }

    if (appError.status === 403) {
      notify.error(appError.message)
    }

    return Promise.reject(appError)
  },
)
