import httpClient from '@/lib/http.client'
import type { Tag, TagCreatePayload } from '@/types/tag.types'
import type { ApiResponse } from '@/types/auth.types'

export const tagService = {
  async fetchAll(): Promise<Tag[]> {
    const response = await httpClient.get<ApiResponse<Tag[]>>('/api/tags')
    return response.data.data
  },

  async create(payload: TagCreatePayload): Promise<Tag> {
    const response = await httpClient.post<ApiResponse<Tag>>('/api/tags', payload)
    return response.data.data
  },

  async update(id: string, payload: Partial<TagCreatePayload>): Promise<Tag> {
    const response = await httpClient.put<ApiResponse<Tag>>(`/api/tags/${id}`, payload)
    return response.data.data
  },

  async remove(id: string): Promise<void> {
    await httpClient.delete(`/api/tags/${id}`)
  }
}
