<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { Task } from '@/types/task.types'
import { useTaskStore } from '@/stores/task.store'
import { isOverdue, formatRelativeDate } from '@/utils/date.utils'
import TaskPriorityBadge from './TaskPriorityBadge.vue'

const props = defineProps<{
  task: Task
}>()

const emit = defineEmits<{
  (e: 'delete', id: string): void
}>()

const router = useRouter()
const taskStore = useTaskStore()

const toggleStatus = async () => {
  await taskStore.toggleTaskStatus(props.task.id)
}

const editTask = () => {
  router.push(`/tasks/${props.task.id}/edit`)
}

const taskIsOverdue = computed(() => {
  if (props.task.status === 'done') return false
  return isOverdue(props.task.dueDate)
})

const isDone = computed(() => props.task.status === 'done')
const isInProgress = computed(() => props.task.status === 'in-progress')
</script>

<template>
  <div
    class="card-elevated p-4 flex flex-col gap-3 group transition-all duration-300 relative"
    :class="{ 
      'opacity-60': isDone,
      'border-danger/50 ring-1 ring-danger/20': taskIsOverdue && !isDone,
      'border-accent/40 ring-1 ring-accent/10': isInProgress
    }"
  >
    <div class="flex items-start gap-3">
      <!-- Checkbox toggle -->
      <button
        @click.stop="toggleStatus"
        class="mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-200 focus:outline-none cursor-pointer"
        :class="[
          isDone
            ? 'bg-accent border-accent text-white'
            : isInProgress
              ? 'border-accent bg-accent/10 shadow-[0_0_8px_rgba(var(--color-accent),0.4)]'
              : 'border-text-secondary/40 hover:border-accent hover:bg-accent/10'
        ]"
        :title="isDone ? 'Mark as To-Do' : isInProgress ? 'Mark as Done' : 'Mark as In Progress'"
      >
        <svg v-if="isDone" class="w-3.5 h-3.5 fill-none stroke-current stroke-3" viewBox="0 0 24 24">
          <polyline points="20 6 9 17 4 12" />
        </svg>
        <div v-else-if="isInProgress" class="w-2.5 h-2.5 bg-accent rounded-full animate-pulse"></div>
      </button>

      <!-- Content -->
      <div class="flex-1 min-w-0">
        <h3
          class="font-semibold text-text-primary truncate transition-all"
          :class="{ 'line-through text-text-secondary': isDone }"
        >
          {{ task.title }}
        </h3>
        <p
          v-if="task.description"
          class="text-xs text-text-secondary mt-1 line-clamp-2 leading-relaxed"
          :class="{ 'line-through opacity-70': isDone }"
        >
          {{ task.description }}
        </p>

        <!-- Priority & Status Row -->
        <div class="flex items-center gap-1.5 mt-3 text-xs overflow-hidden shrink-0">
          <TaskPriorityBadge :priority="task.priority" />
          <span class="text-[10px] font-bold uppercase tracking-wider" 
                :class="isDone ? 'text-accent' : isInProgress ? 'text-accent' : 'text-text-secondary/70'">
            • {{ isDone ? 'Done' : isInProgress ? 'In Progress' : 'To-Do' }}
          </span>
        </div>
        
        <!-- Date Row -->
        <div
          class="flex items-center gap-1 mt-2 text-xs font-medium truncate"
          :class="[
            taskIsOverdue ? 'text-danger' : 'text-text-secondary',
            isDone ? 'opacity-70 line-through' : ''
          ]"
        >
          <svg class="w-3.5 h-3.5 stroke-current stroke-2 fill-none shrink-0" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span class="truncate">{{ formatRelativeDate(task.dueDate) }}</span>
          <span v-if="taskIsOverdue" class="ml-1 text-[10px] uppercase font-bold bg-danger/10 px-1.5 py-0.5 rounded text-danger shrink-0">Overdue</span>
        </div>

        <!-- Tags Row -->
        <div v-if="task.tags && task.tags.length > 0" class="flex flex-wrap gap-1.5 mt-2.5">
          <span
            v-for="tag in task.tags"
            :key="tag.id"
            class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-border text-text-secondary"
            :style="{ backgroundColor: tag.color + '20', color: tag.color }"
          >
            #{{ tag.name }}
          </span>
        </div>
      </div>

      <!-- Action Menu (Visible on hover desktop, always visible mobile) -->
      <div class="flex flex-col items-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shrink-0">
        <button
          @click.stop="editTask"
          class="p-1.5 text-text-secondary hover:text-accent hover:bg-accent/10 rounded-lg transition-colors cursor-pointer"
          title="Edit Task"
        >
          <svg class="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </button>
        <button
          @click.stop="emit('delete', task.id)"
          class="p-1.5 text-text-secondary hover:text-danger hover:bg-danger/10 rounded-lg transition-colors cursor-pointer"
          title="Delete Task"
        >
          <svg class="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            <line x1="10" y1="11" x2="10" y2="17" />
            <line x1="14" y1="11" x2="14" y2="17" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>
