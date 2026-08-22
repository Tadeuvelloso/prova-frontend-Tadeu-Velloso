import axios from 'axios'
import { API_CONFIG } from '../config/api.config'
import { toAppError } from '../utils/errorHandler'

export const api = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
})

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => Promise.reject(toAppError(error)),
)
