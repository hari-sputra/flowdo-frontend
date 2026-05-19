import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import { computed } from 'vue'
import dayjs from 'dayjs'

export interface Task {
  id: string
  title: string
  description?: string
  status: 'to-do' | 'in-progress' | 'done'
  dueDate: string // YYYY-MM-DD
  priority: 'low' | 'medium' | 'high' | 'urgent'
  tags: string[]
}

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

  // Actions
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

  // Helper selectors and progress computations
  const getTasksByDate = (dateStr: string) => {
    return tasks.value.filter(t => t.dueDate === dateStr)
  }

  // Get tasks by filter query
  const getTasksByFilter = (filterType: string) => {
    if (filterType === 'todo') {
      return tasks.value.filter(t => t.status === 'to-do')
    } else if (filterType === 'inprogress') {
      return tasks.value.filter(t => t.status === 'in-progress')
    } else if (filterType === 'completed') {
      return tasks.value.filter(t => t.status === 'done')
    }
    return tasks.value
  }

  // Compute stats for a specific priority
  const getPriorityStats = (priority: 'low' | 'medium' | 'high' | 'urgent') => {
    const priorityTasks = tasks.value.filter(t => t.priority === priority)
    const total = priorityTasks.length
    if (total === 0) return { total: 0, completed: 0, progress: 0 }
    const completed = priorityTasks.filter(t => t.status === 'done').length
    const progress = Math.round((completed / total) * 100)
    return { total, completed, progress }
  }

  // Total daily completion statistics
  const dailyProgress = computed(() => {
    const todayTasks = getTasksByDate(todayStr)
    const total = todayTasks.length
    if (total === 0) return 100
    const completed = todayTasks.filter(t => t.status === 'done').length
    return Math.round((completed / total) * 100)
  })

  // Due today count (not done yet)
  const dueTodayCount = computed(() => {
    return tasks.value.filter(t => t.dueDate === todayStr && t.status !== 'done').length
  })

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    getTasksByDate,
    getTasksByFilter,
    getPriorityStats,
    dailyProgress,
    dueTodayCount
  }
})
