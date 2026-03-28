import axios, { type InternalAxiosRequestConfig, type AxiosResponse, type AxiosError } from 'axios'

// ─── Platform-safe storage helpers ───────────────────────────────────────────
const getToken = (): string|null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('agrochain_token')
  }
  return null
}

const clearStorage = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.clear()
  }
}

// ─── Axios instance ───────────────────────────────────────────────────────────
const client = axios.create({
  baseURL:
    (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_API_URL) ||
    (typeof process !== 'undefined' && process.env.EXPO_PUBLIC_API_URL) ||
    'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' }
})

// Request interceptor — attach Bearer token from whichever storage is available
client.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = getToken()
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error: AxiosError) => Promise.reject(error)
)

// Response interceptor — clear session on 401; redirect only on web
client.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      clearStorage()
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default client