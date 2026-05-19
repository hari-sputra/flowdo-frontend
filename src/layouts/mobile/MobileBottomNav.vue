<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const dueTodayCount = ref(3) // Mock task badge count for due-today tasks

const tabs = [
  {
    label: 'Tasks',
    icon: 'list',
    path: '/dashboard',
    isActive: computed(() => route.path === '/dashboard' && !route.query.filter)
  },
  {
    label: 'Today',
    icon: 'calendar',
    path: '/dashboard',
    query: { filter: 'today' },
    isActive: computed(() => route.path === '/dashboard' && route.query.filter === 'today')
  },
  {
    label: 'Tags',
    icon: 'tag',
    path: '/dashboard',
    query: { filter: 'tags' },
    isActive: computed(() => route.path === '/dashboard' && route.query.filter === 'tags')
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
      :to="{ path: tab.path, query: tab.query }"
      class="flex flex-col items-center justify-center py-1.5 flex-1 relative transition-all duration-200"
      :class="[
        tab.isActive.value
          ? 'text-accent border-t-2 border-accent font-semibold'
          : 'text-text-secondary hover:text-text-primary'
      ]"
    >
      <!-- Line Icon -->
      <span class="w-5.5 h-5.5 flex items-center justify-center relative mb-1">
        <svg v-if="tab.icon === 'list'" class="w-5.5 h-5.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
          <line x1="8" y1="6" x2="21" y2="6" />
          <line x1="8" y1="12" x2="21" y2="12" />
          <line x1="8" y1="18" x2="21" y2="18" />
          <line x1="3" y1="6" x2="3.01" y2="6" />
          <line x1="3" y1="12" x2="3.01" y2="12" />
          <line x1="3" y1="18" x2="3.01" y2="18" />
        </svg>
        
        <svg v-else-if="tab.icon === 'calendar'" class="w-5.5 h-5.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
          <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01" />
        </svg>
        
        <svg v-else-if="tab.icon === 'tag'" class="w-5.5 h-5.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
          <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
          <line x1="7" y1="7" x2="7.01" y2="7" />
        </svg>
        
        <svg v-else-if="tab.icon === 'settings'" class="w-5.5 h-5.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>

        <!-- Red Badge Count on "Today" tab (per user request) -->
        <span
          v-if="tab.icon === 'calendar' && dueTodayCount > 0"
          class="absolute -top-1.5 -right-2.5 bg-danger text-white text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-mono font-bold scale-90 border border-surface-elevated"
        >
          {{ dueTodayCount }}
        </span>
      </span>
      
      <!-- Label -->
      <span class="text-[10px] font-mono tracking-wider">{{ tab.label }}</span>
    </RouterLink>
  </nav>
</template>
