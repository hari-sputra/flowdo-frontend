export interface User {
  id: string
  name: string
  email: string
  avatarUrl?: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
  password_confirmation: string
}

export interface ApiResponse<T> {
  data: T
}

export interface ApiValidationError {
  message: string
  errors: Record<string, string[]>
}
