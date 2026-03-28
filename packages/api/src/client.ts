import axios, { type InternalAxiosRequestConfig, type AxiosResponse, type AxiosError } from 'axios'

// ─── Platform-safe storage helpers ───────────────────────────────────────────
// localStorage doesn't exist in React Native; AsyncStorage is async.
// We expose a unified interface so the interceptors work on both platforms.

const isWeb = typeof window !== 'undefined' && typeof localStorage !== 'undefined'

const storage = {
  getItem: async (key: string): Promise<string | null> => {
    if (isWeb) {
      return localStorage.getItem(key)
    }
    // React Native — dynamically imported so the web bundle never touches it
    const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default
    return AsyncStorage.getItem(key)
  },
  clear: async (): Promise<void> => {
    if (isWeb) {
      localStorage.clear()
      return
    }
    const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default
    await AsyncStorage.clear()
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
    const token = await storage.getItem('agrochain_token')
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
      await storage.clear()
      if (isWeb) {
        window.location.href = '/login'
      }
      // On mobile, the auth store's loadFromStorage will handle the redirect
    }
    return Promise.reject(error)
  }
)

export default client