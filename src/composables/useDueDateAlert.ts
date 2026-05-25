import { computed, type Ref } from 'vue'
import { toast } from 'vue-sonner'
import type { Task } from '@/types/task.types'
import { isToday as checkIsToday, isOverdue as checkIsOverdue } from '@/utils/date.utils'

export function useDueDateAlert(tasks: Ref<Task[]>) {
  const isOverdue = (task: Task) => {
    if (task.status === 'done') return false
    return checkIsOverdue(task.dueDate)
  }

  const isDueToday = (task: Task) => {
    if (task.status === 'done') return false
    return checkIsToday(task.dueDate)
  }

  const dueTodayTasks = computed(() => {
    return tasks.value.filter(isDueToday)
  })

  const overdueTasks = computed(() => {
    return tasks.value.filter(isOverdue)
  })

  const showDueTodayToast = () => {
    const count = dueTodayTasks.value.length
    if (count > 0) {
      toast(`You have ${count} task${count > 1 ? 's' : ''} due today`, {
        description: 'Stay on track and get them done!',
        action: {
          label: 'View',
          onClick: () => {
            import('@/router').then(({ default: router }) => {
              router.push('/tasks/today')
            })
          }
        }
      })
    }
  }

  return {
    dueTodayTasks,
    overdueTasks,
    showDueTodayToast,
    isOverdue,
    isDueToday
  }
}
