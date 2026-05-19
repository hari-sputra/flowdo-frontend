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
vi.stubGlobal('window', {
  matchMedia: matchMediaMock,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  innerWidth: 1200
})
vi.stubGlobal('navigator', {
  maxTouchPoints: 0
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
import { useDeviceDetection } from '../useDeviceDetection'

describe('useDeviceDetection.ts', () => {
  beforeEach(() => {
    localStorageMock.clear()
    vi.restoreAllMocks()
  })

  it('should initialize and return default platform', () => {
    const { platform, override } = useDeviceDetection()
    expect(override.value).toBeNull()
    // Defaults to desktop when window touch is not present
    expect(platform.value).toBe('desktop')
  })

  it('should prioritize and respect manual platform override', () => {
    const { platform, setOverride } = useDeviceDetection()
    setOverride('mobile')
    expect(platform.value).toBe('mobile')

    setOverride('tablet')
    expect(platform.value).toBe('tablet')

    setOverride(null)
    expect(platform.value).toBe('desktop')
  })
})
