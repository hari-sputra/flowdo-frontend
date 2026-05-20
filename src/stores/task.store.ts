import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import { computed } from 'vue'
import dayjs from 'dayjs'
import type { Task } from '@/types/task.types'
import type { Tag } from '@/types/tag.types'
import { useTaskSorting } from '@/composables/useTaskSorting'
import { useDueDateAlert } from '@/composables/useDueDateAlert'

export const useTaskStore = defineStore('tasks', () => {
  const todayStr = dayjs().format('YYYY-MM-DD')
  const tomorrowStr = dayjs().add(1, 'day').format('YYYY-MM-DD')

  // Prepopulate tasks from the Figma community design relative to today
  const tasks = useLocalStorage<Task[]>('flowdo_tasks', [
    {
      id: 'task-1',
      title: 'Market Research',
      description: 'Conduct market research and user analysis for the grocery shopping application.',
      status: 'done',
      dueDate: todayStr,
      priority: 'medium',
      tags: ['Work']
    },
    {
      id: 'task-2',
      title: 'Competitive Analysis',
      description: 'Analyze competitors in the grocery shopping space to identify gaps and features.',
      status: 'in-progress',
      dueDate: todayStr,
      priority: 'high',
      tags: ['Work']
    },
    {
      id: 'task-3',
      title: 'Create Low-fidelity Wireframe',
      description: 'Sketch out initial layout and basic structures for the Uber Eats challenge screen flow.',
      status: 'to-do',
      dueDate: todayStr,
      priority: 'urgent',
      tags: ['Personal']
    },
    {
      id: 'task-4',
      title: 'How to pitch a Design Sprint',
      description: 'Study materials and prepare slides about design sprints for the client meeting.',
      status: 'to-do',
      dueDate: tomorrowStr,
      priority: 'low',
      tags: ['Study']
    }
  ])

  // Tags State
  const tags = useLocalStorage<Tag[]>('flowdo_tags', [
    { id: 'tag-1', name: 'Work', color: '#8764FF', isDefault: true },
    { id: 'tag-2', name: 'Personal', color: '#FF7D53', isDefault: true },
    { id: 'tag-3', name: 'Study', color: '#2555FF', isDefault: true },
    { id: 'tag-4', name: 'Fitness', color: '#F478B8', isDefault: true }
  ])

  // Use Composables for Sorting and Alerts
  const { sortState, sortedTasks, toggleSort } = useTaskSorting(tasks)
  const { dueTodayTasks, overdueTasks, showDueTodayToast, isOverdue, isDueToday } = useDueDateAlert(tasks)

  // Task Actions
  const addTask = (task: Omit<Task, 'id'>) => {
    const id = `task-${Math.random().toString(36).substring(2, 9)}`
    tasks.value.push({ ...task, id })
    return id
  }

  const updateTask = (id: string, updates: Partial<Task>) => {
    const index = tasks.value.findIndex(t => t.id === id)
    if (index !== -1) {
      tasks.value[index] = { ...tasks.value[index], ...updates }
    }
  }

  const deleteTask = (id: string) => {
    tasks.value = tasks.value.filter(t => t.id !== id)
  }

  const toggleTaskStatus = (id: string) => {
    const task = tasks.value.find(t => t.id === id)
    if (task) {
      if (task.status === 'to-do') {
        task.status = 'in-progress'
      } else if (task.status === 'in-progress') {
        task.status = 'done'
      } else {
        task.status = 'to-do'
      }
    }
  }

  // Tag Actions
  const addTag = (tag: Omit<Tag, 'id'>) => {
    const id = `tag-${Math.random().toString(36).substring(2, 9)}`
    tags.value.push({ ...tag, id, isDefault: false })
    return id
  }

  const deleteTag = (id: string) => {
    const tag = tags.value.find(t => t.id === id)
    if (tag && !tag.isDefault) {
      tags.value = tags.value.filter(t => t.id !== id)
      // Optional: remove this tag from all tasks
      tasks.value.forEach(t => {
        t.tags = t.tags.filter(tagName => tagName !== tag.name)
      })
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
    sortState,
    sortedTasks,
    overdueTasks,
    dueTodayTasks,
    dueTodayCount,
    dailyProgress,
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
