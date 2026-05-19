<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const props = defineProps<{
  collapsed: boolean
}>()

const emit = defineEmits<{
  (e: 'toggle'): void
}>()

const route = useRoute()
const router = useRouter()

const navItems = [
  {
    label: 'Tasks',
    icon: 'list',
    path: '/dashboard',
    isActive: computed(() => route.path === '/dashboard' && !route.query.filter)
  },
  {
    label: 'Due Today',
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
  }
]

const settingsActive = computed(() => route.path === '/settings')

const handleLogout = () => {
  router.push('/login')
}
</script>

<template>
  <aside class="flex flex-col h-screen select-none relative transition-all duration-300">
    <!-- Collapsible spine-line accent on left -->
    <div class="absolute left-0 top-0 bottom-0 w-1 bg-accent/60"></div>

    <!-- Header / Toggle Section -->
    <div class="h-16 flex items-center justify-between px-4 border-b border-border pl-5">
      <!-- Collapse toggle button -->
      <button
        @click="emit('toggle')"
        class="p-1.5 rounded border border-border bg-surface-elevated hover:bg-border/30 dark:hover:bg-border/10 text-text-secondary hover:text-text-primary transition-all duration-200"
        :aria-label="props.collapsed ? 'Expand menu' : 'Collapse menu'"
      >
        <svg v-if="props.collapsed" class="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
          <polyline points="13 17 18 12 13 7" />
          <polyline points="6 17 11 12 6 7" />
        </svg>
        <svg v-else class="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
          <polyline points="11 17 6 12 11 7" />
          <polyline points="18 17 13 12 18 7" />
        </svg>
      </button>

      <!-- Logo name (only shown when expanded) -->
      <span
        v-if="!props.collapsed"
        class="font-heading text-lg font-bold tracking-tight text-accent mr-auto pl-3"
      >
        FlowDo
      </span>
    </div>

    <!-- Navigation Items -->
    <nav class="flex-1 py-6 px-3 space-y-2 pl-4">
      <RouterLink
        v-for="item in navItems"
        :key="item.label"
        :to="{ path: item.path, query: item.query }"
        class="flex items-center gap-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200"
        :class="[
          item.isActive.value
            ? 'text-accent bg-accent/5 dark:bg-accent/10 border-l-2 border-accent font-semibold pl-2'
            : 'text-text-secondary hover:text-text-primary hover:bg-border/20 dark:hover:bg-border/5 pl-2.5'
        ]"
      >
        <span class="w-5 h-5 shrink-0 flex items-center justify-center">
          <svg v-if="item.icon === 'list'" class="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
            <line x1="8" y1="6" x2="21" y2="6" />
            <line x1="8" y1="12" x2="21" y2="12" />
            <line x1="8" y1="18" x2="21" y2="18" />
            <line x1="3" y1="6" x2="3.01" y2="6" />
            <line x1="3" y1="12" x2="3.01" y2="12" />
            <line x1="3" y1="18" x2="3.01" y2="18" />
          </svg>
          <svg v-else-if="item.icon === 'calendar'" class="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
            <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01" />
          </svg>
          <svg v-else-if="item.icon === 'tag'" class="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
            <line x1="7" y1="7" x2="7.01" y2="7" />
          </svg>
        </span>
        <span
          v-if="!props.collapsed"
          class="font-heading tracking-wide transition-opacity duration-200"
        >
          {{ item.label }}
        </span>
      </RouterLink>
    </nav>

    <!-- Divider Line -->
    <div class="h-[1px] bg-border mx-3"></div>

    <!-- Bottom Actions Area -->
    <div class="p-3 space-y-2 pl-4 pb-6">
      <!-- Settings link -->
      <RouterLink
        to="/settings"
        class="flex items-center gap-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200"
        :class="[
          settingsActive.value
            ? 'text-accent bg-accent/5 dark:bg-accent/10 border-l-2 border-accent font-semibold pl-2'
            : 'text-text-secondary hover:text-text-primary hover:bg-border/20 dark:hover:bg-border/5 pl-2.5'
        ]"
      >
        <span class="w-5 h-5 shrink-0 flex items-center justify-center">
          <svg class="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </span>
        <span
          v-if="!props.collapsed"
          class="font-heading tracking-wide transition-opacity duration-200"
        >
          Settings
        </span>
      </RouterLink>

      <!-- Logout action -->
      <button
        @click="handleLogout"
        class="w-full flex items-center gap-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200 text-danger hover:bg-danger/5 dark:hover:bg-danger/10 text-left"
        :class="[props.collapsed ? 'pl-2.5' : 'pl-2.5']"
      >
        <span class="w-5 h-5 shrink-0 flex items-center justify-center">
          <svg class="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
          </svg>
        </span>
        <span
          v-if="!props.collapsed"
          class="font-heading tracking-wide transition-opacity duration-200"
        >
          Logout
        </span>
      </button>
    </div>
  </aside>
</template>
