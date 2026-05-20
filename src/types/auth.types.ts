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
}
