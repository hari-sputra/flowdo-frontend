import { describe, it, expect, beforeEach, vi } from 'vitest'

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

const classListMock = {
  add: vi.fn(),
  remove: vi.fn(),
  toggle: vi.fn()
}

const documentMock = {
  documentElement: {
    classList: classListMock,
    className: ''
  }
}

const matchMediaMock = vi.fn().mockImplementation((query) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn()
}))

vi.stubGlobal('localStorage', localStorageMock)
vi.stubGlobal('document', documentMock)
vi.stubGlobal('window', {
  matchMedia: matchMediaMock,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn()
})

// Mock Vue hooks directly to prevent getCurrentInstance / DOM rendering errors
vi.mock('vue', async (importOriginal) => {
  const original = await importOriginal<typeof import('vue')>()
  return {
    ...original,
    onMounted: (fn: () => void) => fn(),
    onUnmounted: () => {}
  }
})

// Import the composable after stubbing globals
import { useTheme } from '../useTheme'

describe('useTheme.ts', () => {
  beforeEach(() => {
    localStorageMock.clear()
    classListMock.add.mockClear()
    classListMock.remove.mockClear()
    classListMock.toggle.mockClear()
    vi.restoreAllMocks()
  })

  it('should initialize with default system theme', () => {
    const { preference } = useTheme()
    expect(preference.value).toBe('system')
  })

  it('should allow setting custom light theme preference', () => {
    const { preference, setTheme } = useTheme()
    setTheme('light')
    expect(preference.value).toBe('light')
  })

  it('should allow setting custom dark theme preference', () => {
    const { preference, setTheme } = useTheme()
    setTheme('dark')
    expect(preference.value).toBe('dark')
  })

  it('should resolve isDark based on light preference', () => {
    const { isDark, setTheme } = useTheme()
    setTheme('light')
    expect(isDark.value).toBe(false)
  })

  it('should resolve isDark based on dark preference', () => {
    const { isDark, setTheme } = useTheme()
    setTheme('dark')
    expect(isDark.value).toBe(true)
  })
})
