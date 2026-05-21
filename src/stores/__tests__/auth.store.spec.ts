import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '../auth.store'

// Mock the authService
vi.mock('@/services/auth.service', () => ({
  authService: {
    login: vi.fn(async () => ({ id: '1', name: 'Hari', email: 'hari@test.com' })),
    register: vi.fn(async () => ({ id: '1', name: 'Hari', email: 'hari@test.com' })),
    logout: vi.fn(async () => {}),
    fetchUser: vi.fn(async () => ({ id: '1', name: 'Hari Saputra', email: 'hari@test.com' }))
  }
}))

describe('Auth Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should initialize unauthenticated', () => {
    const store = useAuthStore()
    expect(store.isAuthenticated).toBe(false)
  })

  it('should login and set user', async () => {
    const store = useAuthStore()
    await store.login({ email: 'hari@test.com', password: 'password' })
    expect(store.isAuthenticated).toBe(true)
    expect(store.currentUser?.name).toBe('Hari')
  })
})
