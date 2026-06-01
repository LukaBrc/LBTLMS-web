const fallbackBaseUrl = 'http://localhost:8081'

export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || fallbackBaseUrl,
}
