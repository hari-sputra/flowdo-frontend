import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import dayjs from 'dayjs'
import type { Task, TaskCreatePayload, TaskUpdatePayload } from '@/types/task.types'
import type { Tag, TagCreatePayload } from '@/types/tag.types'
import { useTaskSorting } from '@/composables/useTaskSorting'
import { useDueDateAlert } from '@/composables/useDueDateAlert'
import { taskService } from '@/services/task.service'
import { tagService } from '@/services/tag.service'

export const useTaskStore = defineStore('tasks', () => {
  const todayStr = dayjs().format('YYYY-MM-DD')
  const tomorrowStr = dayjs().add(1, 'day').format('YYYY-MM-DD')

  const tasks = ref<Task[]>([])
  const tags = ref<Tag[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Use Composables for Sorting and Alerts
  const { sortState, sortedTasks, toggleSort } = useTaskSorting(tasks)
  const { dueTodayTasks, overdueTasks, showDueTodayToast, isOverdue, isDueToday } = useDueDateAlert(tasks)

  const fetchTasks = async () => {
    isLoading.value = true
    error.value = null
    try {
      tasks.value = await taskService.fetchAll()
    } catch (e: any) {
      error.value = 'Failed to fetch tasks'
      console.error(e)
    } finally {
      isLoading.value = false
    }
  }

  const fetchTags = async () => {
    try {
      tags.value = await tagService.fetchAll()
    } catch (e: any) {
      console.error('Failed to fetch tags', e)
    }
  }

  // Task Actions
  const addTask = async (taskPayload: TaskCreatePayload) => {
    try {
      const newTask = await taskService.create(taskPayload)
      tasks.value.push(newTask)
      return newTask
    } catch (e: any) {
      console.error('Failed to create task', e)
      throw e
    }
  }

  const updateTask = async (id: string, updates: TaskUpdatePayload) => {
    try {
      const updatedTask = await taskService.update(id, updates)
      const index = tasks.value.findIndex(t => t.id === id)
      if (index !== -1) {
        tasks.value[index] = updatedTask
      }
      return updatedTask
    } catch (e: any) {
      console.error('Failed to update task', e)
      throw e
    }
  }

  const deleteTask = async (id: string) => {
    try {
      await taskService.remove(id)
      tasks.value = tasks.value.filter(t => t.id !== id)
    } catch (e: any) {
      console.error('Failed to delete task', e)
      throw e
    }
  }

  const toggleTaskStatus = async (id: string) => {
    try {
      const updatedTask = await taskService.toggleStatus(id)
      const index = tasks.value.findIndex(t => t.id === id)
      if (index !== -1) {
        tasks.value[index] = updatedTask
      }
    } catch (e: any) {
      console.error('Failed to toggle task status', e)
      throw e
    }
  }

  // Tag Actions
  const addTag = async (tagPayload: TagCreatePayload) => {
    try {
      const newTag = await tagService.create(tagPayload)
      tags.value.push(newTag)
      return newTag
    } catch (e: any) {
      console.error('Failed to create tag', e)
      throw e
    }
  }

  const deleteTag = async (id: string) => {
    const tag = tags.value.find(t => t.id === id)
    if (tag && !tag.isDefault) {
      try {
        await tagService.remove(id)
        tags.value = tags.value.filter(t => t.id !== id)
        // Also fetch tasks again because some tasks might have lost their tags on backend
        await fetchTasks()
      } catch (e: any) {
        console.error('Failed to delete tag', e)
        throw e
      }
    }
  }

  // Helper selectors and progress computations
  const getTasksByDate = (dateStr: string) => {
    return sortedTasks.value.filter(t => t.dueDate === dateStr)
  }

  const getTasksByFilter = (filterType: string) => {
    if (filterType === 'todo') {
      return sortedTasks.value.filter(t => t.status === 'to-do')
    } else if (filterType === 'inprogress') {
      return sortedTasks.value.filter(t => t.status === 'in-progress')
    } else if (filterType === 'completed') {
      return sortedTasks.value.filter(t => t.status === 'done')
    }
    return sortedTasks.value
  }

  const getPriorityStats = (priority: 'low' | 'medium' | 'high' | 'urgent') => {
    const priorityTasks = tasks.value.filter(t => t.priority === priority)
    const total = priorityTasks.length
    if (total === 0) return { total: 0, completed: 0, progress: 0 }
    const completed = priorityTasks.filter(t => t.status === 'done').length
    const progress = Math.round((completed / total) * 100)
    return { total, completed, progress }
  }

  const dailyProgress = computed(() => {
    const todayTasks = getTasksByDate(todayStr)
    const total = todayTasks.length
    if (total === 0) return 100
    const completed = todayTasks.filter(t => t.status === 'done').length
    return Math.round((completed / total) * 100)
  })

  const dueTodayCount = computed(() => {
    return dueTodayTasks.value.length
  })

  return {
    tasks,
    tags,
    isLoading,
    error,
    sortState,
    sortedTasks,
    overdueTasks,
    dueTodayTasks,
    dueTodayCount,
    dailyProgress,
    fetchTasks,
    fetchTags,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    toggleSort,
    addTag,
    deleteTag,
    getTasksByDate,
    getTasksByFilter,
    getPriorityStats,
    showDueTodayToast,
    isOverdue,
    isDueToday
  }
})
