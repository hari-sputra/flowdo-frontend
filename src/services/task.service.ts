import httpClient from '@/lib/http.client'
import type { Task, TaskCreatePayload, TaskUpdatePayload } from '@/types/task.types'
import type { ApiResponse } from '@/types/auth.types'

export const taskService = {
  async fetchAll(params?: Record<string, any>): Promise<Task[]> {
    const response = await httpClient.get<ApiResponse<Task[]>>('/api/tasks', { params })
    return response.data.data
  },

  async fetchById(id: string): Promise<Task> {
    const response = await httpClient.get<ApiResponse<Task>>(`/api/tasks/${id}`)
    return response.data.data
  },

  async create(payload: TaskCreatePayload): Promise<Task> {
    const response = await httpClient.post<ApiResponse<Task>>('/api/tasks', payload)
    return response.data.data
  },

  async update(id: string, payload: TaskUpdatePayload): Promise<Task> {
    const response = await httpClient.put<ApiResponse<Task>>(`/api/tasks/${id}`, payload)
    return response.data.data
  },

  async remove(id: string): Promise<void> {
    await httpClient.delete(`/api/tasks/${id}`)
  },

  async toggleStatus(id: string): Promise<Task> {
    const response = await httpClient.patch<ApiResponse<Task>>(`/api/tasks/${id}/toggle`)
    return response.data.data
  },

  async fetchDueToday(): Promise<Task[]> {
    const response = await httpClient.get<ApiResponse<Task[]>>('/api/tasks/due-today')
    return response.data.data
  }
}
