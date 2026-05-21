import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import dayjs from 'dayjs'

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
import { useTaskStore } from '../task.store'

describe('Task Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorageMock.clear()
  })

  it('should prepopulate tasks with default list', () => {
    const store = useTaskStore()
    expect(store.tasks.length).toBeGreaterThan(0)
  })

  it('should add a new task successfully', () => {
    const store = useTaskStore()
    const taskCount = store.tasks.length

    const todayStr = dayjs().format('YYYY-MM-DD')
    store.addTask({
      title: 'New Unit Test Task',
      description: 'Test description',
      status: 'to-do',
      dueDate: todayStr,
      priority: 'low',
      tags: ['Test']
    })

    expect(store.tasks.length).toBe(taskCount + 1)
    expect(store.tasks[store.tasks.length - 1].title).toBe('New Unit Test Task')
  })

  it('should toggle task status correctly', () => {
    const store = useTaskStore()
    const todayStr = dayjs().format('YYYY-MM-DD')
    const id = store.addTask({
      title: 'Toggle Task',
      status: 'to-do',
      dueDate: todayStr,
      priority: 'low',
      tags: []
    })

    store.toggleTaskStatus(id)
    expect(store.tasks.find(t => t.id === id)?.status).toBe('in-progress')

    store.toggleTaskStatus(id)
    expect(store.tasks.find(t => t.id === id)?.status).toBe('done')

    store.toggleTaskStatus(id)
    expect(store.tasks.find(t => t.id === id)?.status).toBe('to-do')
  })

  it('should calculate priority statistics correctly', () => {
    const store = useTaskStore()
    
    // Clear pre-populated tasks for isolated test
    store.tasks = []

    store.addTask({ title: 'Task 1', status: 'done', dueDate: '2026-05-19', priority: 'high', tags: [] })
    store.addTask({ title: 'Task 2', status: 'to-do', dueDate: '2026-05-19', priority: 'high', tags: [] })

    const stats = store.getPriorityStats('high')
    expect(stats.total).toBe(2)
    expect(stats.completed).toBe(1)
    expect(stats.progress).toBe(50)
  })
})
