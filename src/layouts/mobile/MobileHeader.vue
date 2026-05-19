<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import { useTaskStore } from '@/stores/task.store'

const authStore = useAuthStore()
const taskStore = useTaskStore()
</script>

<template>
  <header class="flex items-center justify-between px-5 select-none transition-colors duration-300">
    <!-- User profile greeting on left (Figma Home Style) -->
    <div class="flex items-center gap-3">
      <!-- Minimal Avatar Circle -->
      <span class="w-9 h-9 rounded-full bg-accent/10 dark:bg-accent/20 border border-border text-accent flex items-center justify-center font-bold text-xs">
        {{ authStore.userInitials }}
      </span>
      <div class="flex flex-col">
        <span class="text-[10px] uppercase tracking-wider text-text-secondary font-semibold">Hello!</span>
        <h2 class="font-heading text-[14px] font-bold text-text-primary -mt-0.5 leading-none">
          {{ authStore.currentUser?.name || 'User' }}
        </h2>
      </div>
    </div>

    <!-- Right utilities: Notification bell with badge -->
    <div class="flex items-center gap-2">
      <!-- Alert Reminder status icon -->
      <div class="relative">
        <button
          class="p-2 text-text-secondary hover:text-text-primary rounded-full hover:bg-border/20 transition-colors relative"
          aria-label="Alerts due"
        >
          <svg class="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <!-- Red notification dot based on task store count -->
          <span
            v-if="taskStore.dueTodayCount > 0"
            class="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full ring-1 ring-surface-elevated animate-pulse"
          ></span>
        </button>
      </div>
    </div>
  </header>
</template>

