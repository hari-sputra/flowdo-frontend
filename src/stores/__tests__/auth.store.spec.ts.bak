import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

// Mock DOM Globals in Node test environment
const storeMock = new Map<string, string>()
const localStorageMock = {
  getItem: vi.fn((key: string) => storeMock.get(key) || null),
  setItem: vi.fn((key: string, value: string) => {
    storeMock.set(key, value)
  }),
  clear: vi.fn(() => {
    storeMock.clear()
  }),
  removeItem: vi.fn((key: string) => {
    storeMock.delete(key)
  }),
  length: 0,
  key: vi.fn(() => null)
}

vi.stubGlobal('localStorage', localStorageMock)

// Import store after mocking globals
import { useAuthStore } from '../auth.store'

describe('Auth Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorageMock.clear()
  })

  it('should initialize with default mocked user', () => {
    const store = useAuthStore()
    expect(store.currentUser).not.toBeNull()
    expect(store.currentUser?.name).toBe('Hari Saputra')
    expect(store.isAuthenticated).toBe(true)
  })

  it('should compute user initials correctly', () => {
    const store = useAuthStore()
    expect(store.userInitials).toBe('HS')
    
    store.currentUser = {
      id: 'test',
      name: 'John Doe',
      email: 'john@example.com'
    }
    expect(store.userInitials).toBe('JD')

    store.currentUser = {
      id: 'test',
      name: 'Single',
      email: 'single@example.com'
    }
    expect(store.userInitials).toBe('SI')
  })

  it('should handle login and logout correctly', () => {
    const store = useAuthStore()
    
    store.logout()
    expect(store.currentUser).toBeNull()
    expect(store.isAuthenticated).toBe(false)
    expect(store.userInitials).toBe('?')

    store.login({ email: 'newuser@example.com', password: 'password123' })
    expect(store.currentUser?.email).toBe('newuser@example.com')
    expect(store.currentUser?.name).toBe('Hari Saputra')
    expect(store.isAuthenticated).toBe(true)
  })
})
