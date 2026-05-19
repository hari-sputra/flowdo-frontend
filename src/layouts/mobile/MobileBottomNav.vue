<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useTaskStore } from '@/stores/task.store'

const route = useRoute()
const taskStore = useTaskStore()

const tabs = [
  {
    label: 'Home',
    icon: 'home',
    path: '/dashboard',
    isActive: computed(() => route.path === '/dashboard')
  },
  {
    label: 'Tasks',
    icon: 'list',
    path: '/tasks/today',
    isActive: computed(() => route.path === '/tasks/today')
  },
  {
    label: 'Add',
    icon: 'plus',
    path: '/tasks/new',
    isActive: computed(() => route.path === '/tasks/new')
  },
  {
    label: 'Settings',
    icon: 'settings',
    path: '/settings',
    isActive: computed(() => route.path === '/settings')
  }
]
</script>

<template>
  <nav class="flex items-center justify-around w-full px-2 py-1 select-none transition-colors duration-300">
    <RouterLink
      v-for="tab in tabs"
      :key="tab.label"
      :to="tab.path"
      class="flex flex-col items-center justify-center py-1.5 flex-1 relative transition-all duration-200"
      :class="[
        tab.isActive.value
          ? 'text-accent font-semibold'
          : 'text-text-secondary hover:text-text-primary'
      ]"
    >
      <!-- Icon Wrapper -->
      <span class="w-6 h-6 flex items-center justify-center relative mb-1">
        <!-- Home Icon -->
        <svg v-if="tab.icon === 'home'" class="w-6 h-6 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>

        <!-- Tasks Icon -->
        <svg v-else-if="tab.icon === 'list'" class="w-6 h-6 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
          <line x1="8" y1="6" x2="21" y2="6" />
          <line x1="8" y1="12" x2="21" y2="12" />
          <line x1="8" y1="18" x2="21" y2="18" />
          <line x1="3" y1="6" x2="3.01" y2="6" />
          <line x1="3" y1="12" x2="3.01" y2="12" />
          <line x1="3" y1="18" x2="3.01" y2="18" />
        </svg>
        
        <!-- Add Icon (FAB Style or In-line FAB) -->
        <span v-else-if="tab.icon === 'plus'" class="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center shadow-md transform hover:scale-105 active:scale-95 transition-all duration-200">
          <svg class="w-5 h-5 fill-none stroke-current stroke-3" viewBox="0 0 24 24">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </span>
        
        <!-- Settings Icon -->
        <svg v-else-if="tab.icon === 'settings'" class="w-6 h-6 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>

        <!-- Red Badge Count on "Tasks" tab (dueTodayCount) -->
        <span
          v-if="tab.icon === 'list' && taskStore.dueTodayCount > 0"
          class="absolute -top-1.5 -right-2 bg-danger text-white text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold scale-90 border border-surface-elevated"
        >
          {{ taskStore.dueTodayCount }}
        </span>
      </span>
      
      <!-- Label -->
      <span v-if="tab.icon !== 'plus'" class="text-[10px] tracking-wide font-medium">{{ tab.label }}</span>
    </RouterLink>
  </nav>
</template>

