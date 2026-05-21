import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import dayjs from 'dayjs'
import { useTaskStore } from '../task.store'

// Mock the taskService
vi.mock('@/services/task.service', () => ({
  taskService: {
    fetchAll: vi.fn(async () => []),
    fetchById: vi.fn(),
    create: vi.fn(async (payload) => ({ ...payload, id: 'new-id', status: payload.status || 'to-do' })),
    update: vi.fn(async (id, payload) => ({ id, ...payload })),
    remove: vi.fn(async () => {}),
    toggleStatus: vi.fn(async (id) => ({ id, status: 'done' })), // simplified
  }
}))

vi.mock('@/services/tag.service', () => ({
  tagService: {
    fetchAll: vi.fn(async () => []),
    create: vi.fn(async (payload) => ({ ...payload, id: 'new-tag', isDefault: false })),
    update: vi.fn(),
    remove: vi.fn(async () => {})
  }
}))

describe('Task Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should initialize empty', () => {
    const store = useTaskStore()
    expect(store.tasks.length).toBe(0)
  })

  it('should add a new task successfully via mock', async () => {
    const store = useTaskStore()
    await store.addTask({
      title: 'New Task',
      dueDate: '2023-01-01',
      priority: 'low'
    })
    expect(store.tasks.length).toBe(1)
    expect(store.tasks[0].title).toBe('New Task')
  })
})
