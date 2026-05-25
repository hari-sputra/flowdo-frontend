<script setup lang="ts">
import type { TaskSortState, TaskSortField } from '@/types/task.types'

defineProps<{
  sortState: TaskSortState
}>()

const emit = defineEmits<{
  (e: 'toggle-sort', field: TaskSortField): void
}>()

const sortOptions: { label: string; field: TaskSortField }[] = [
  { label: 'Status', field: 'status' },
  { label: 'Due Date', field: 'dueDate' },
  { label: 'Priority', field: 'priority' },
  { label: 'Title', field: 'title' }
]
</script>

<template>
  <div class="flex items-center gap-2 mb-4 overflow-x-auto pb-1 no-scrollbar">
    <span class="text-xs font-semibold text-text-secondary whitespace-nowrap">Sort by:</span>
    <button
      v-for="option in sortOptions"
      :key="option.field"
      @click="emit('toggle-sort', option.field)"
      class="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap cursor-pointer"
      :class="[
        sortState.field === option.field 
          ? 'bg-accent/10 text-accent dark:bg-accent/20' 
          : 'bg-surface border border-border text-text-secondary hover:text-text-primary hover:border-text-secondary/50'
      ]"
    >
      {{ option.label }}
      <span v-if="sortState.field === option.field" class="flex flex-col -space-y-1">
        <svg v-if="sortState.direction === 'asc'" class="w-3 h-3 stroke-current stroke-2" viewBox="0 0 24 24" fill="none">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7" />
        </svg>
        <svg v-else class="w-3 h-3 stroke-current stroke-2" viewBox="0 0 24 24" fill="none">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </span>
    </button>
  </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
