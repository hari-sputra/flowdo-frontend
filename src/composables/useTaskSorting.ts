import { ref, computed, type Ref, type ComputedRef } from 'vue'
import type { Task, TaskSortState, TaskSortField } from '@/types/task.types'

export function useTaskSorting(tasks: Ref<Task[]>) {
  const sortState = ref<TaskSortState>({
    field: 'status',
    direction: 'asc'
  })

  const priorityWeights: Record<string, number> = {
    urgent: 4,
    high: 3,
    medium: 2,
    low: 1
  }

  const toggleSort = (field: TaskSortField) => {
    if (sortState.value.field === field) {
      sortState.value.direction = sortState.value.direction === 'asc' ? 'desc' : 'asc'
    } else {
      sortState.value.field = field
      sortState.value.direction = 'asc'
    }
  }

  const sortedTasks = computed(() => {
    return [...tasks.value].sort((a, b) => {
      const { field, direction } = sortState.value
      const modifier = direction === 'asc' ? 1 : -1

      switch (field) {
        case 'dueDate': {
          const dateA = new Date(a.dueDate).getTime()
          const dateB = new Date(b.dueDate).getTime()
          return (dateA - dateB) * modifier
        }
        case 'title': {
          return a.title.localeCompare(b.title) * modifier
        }
        case 'priority': {
          const weightA = priorityWeights[a.priority] || 0
          const weightB = priorityWeights[b.priority] || 0
          return (weightA - weightB) * modifier
        }
        case 'status': {
          const statusWeights: Record<string, number> = {
            'to-do': 1,
            'in-progress': 2,
            'done': 3
          }
          const weightA = statusWeights[a.status] || 0
          const weightB = statusWeights[b.status] || 0
          return (weightA - weightB) * modifier
        }
        default:
          return 0
      }
    })
  })

  return {
    sortState,
    sortedTasks,
    toggleSort
  }
}
