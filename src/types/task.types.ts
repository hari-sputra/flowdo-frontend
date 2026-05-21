import type { Tag } from './tag.types'

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'
export type TaskStatus = 'to-do' | 'in-progress' | 'done'
export type TaskSortField = 'dueDate' | 'title' | 'priority'
export type SortDirection = 'asc' | 'desc'

export interface Task {
  id: string
  title: string
  description?: string
  status: TaskStatus
  dueDate: string
  priority: TaskPriority
  tags: Tag[]
}

export interface TaskCreatePayload {
  title: string
  description?: string
  dueDate: string
  priority: TaskPriority
  status?: TaskStatus
  tags?: string[]
}

export interface TaskUpdatePayload {
  title?: string
  description?: string
  dueDate?: string
  priority?: TaskPriority
  status?: TaskStatus
  tags?: string[]
}

export interface TaskSortState {
  field: TaskSortField
  direction: SortDirection
}
