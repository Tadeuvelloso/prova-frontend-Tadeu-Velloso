
export interface ApiSuccess<T> {
  success: true
  data: T
}

export interface ApiMessage {
  success: true
  message: string
}

export interface ApiErrorPayload {
  success: false
  message: string
  statusCode: number
  context: string
  details?: unknown
}

export interface ApiValidationDetail {
  path: string
  message: string
}
