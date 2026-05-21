import axios from 'axios'
import type { AxiosError } from 'axios'

const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '',
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
})

// CSRF Token is handled automatically by Axios for subsequent requests
// once it receives the XSRF-TOKEN cookie from the server.

httpClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // We handle 401 redirection in the store or components
    // to avoid circular dependencies with vue-router here if possible,
    // but doing it here is also fine if we import router carefully.
    if (error.response?.status === 401) {
      // For now, we will let the store handle the 401 and redirect.
      // Alternatively, we could dispatch a global event or use router directly.
    }
    return Promise.reject(error)
  }
)

export async function initializeCsrf(): Promise<void> {
  await httpClient.get('/sanctum/csrf-cookie')
}

export default httpClient
