<script setup lang="ts">
import type { TaskPriority } from '@/types/task.types'

defineProps<{
  priority: TaskPriority
}>()
</script>

<template>
  <span
    class="status-badge"
    :class="`status-badge-${priority === 'medium' || priority === 'high' ? 'inprogress' : priority === 'urgent' ? 'urgent' : 'todo'}`"
  >
    {{ priority }}
  </span>
</template>
