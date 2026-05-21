import httpClient, { initializeCsrf } from '@/lib/http.client'
import type { User, LoginPayload, RegisterPayload, ApiResponse } from '@/types/auth.types'

export const authService = {
  async login(payload: LoginPayload): Promise<User> {
    await initializeCsrf()
    const response = await httpClient.post<ApiResponse<User>>('/api/login', payload)
    return response.data.data
  },

  async register(payload: RegisterPayload): Promise<User> {
    await initializeCsrf()
    const response = await httpClient.post<ApiResponse<User>>('/api/register', payload)
    return response.data.data
  },

  async logout(): Promise<void> {
    await httpClient.post('/api/logout')
  },

  async fetchUser(): Promise<User> {
    const response = await httpClient.get<ApiResponse<User>>('/api/user')
    return response.data.data
  }
}
