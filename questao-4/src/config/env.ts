
const FALLBACK_API_URL = 'https://distribuidora-backend-m46a.onrender.com/api'

const configuredApiUrl = import.meta.env.VITE_API_URL?.trim()

export const env = {
  apiUrl: configuredApiUrl || FALLBACK_API_URL,
} as const
