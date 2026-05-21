<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

const props = defineProps<{
  collapsed: boolean
}>()

const emit = defineEmits<{
  (e: 'toggle'): void
}>()

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const navItems = [
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
    label: 'Add Task',
    icon: 'plus',
    path: '/tasks/new',
    isActive: computed(() => route.path === '/tasks/new')
  }
]

const settingsActive = computed(() => route.path === '/settings')

const handleLogout = async () => {
  await authStore.logout()
  router.push('/auth/login')
}
</script>

<template>
  <aside class="flex flex-col h-screen select-none relative transition-colors duration-300">
    <!-- Collapsible accent indicator on left -->
    <div class="absolute left-0 top-0 bottom-0 w-1 bg-accent"></div>

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
        :to="item.path"
        class="flex items-center gap-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200"
        :class="[
          item.isActive.value
            ? 'text-accent bg-accent/5 dark:bg-accent/10 border-l-2 border-accent font-semibold pl-2'
            : 'text-text-secondary hover:text-text-primary hover:bg-border/20 dark:hover:bg-border/5 pl-2.5'
        ]"
      >
        <span class="w-5 h-5 shrink-0 flex items-center justify-center">
          <!-- Home Icon -->
          <svg v-if="item.icon === 'home'" class="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>

          <!-- List Icon -->
          <svg v-else-if="item.icon === 'list'" class="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
            <line x1="8" y1="6" x2="21" y2="6" />
            <line x1="8" y1="12" x2="21" y2="12" />
            <line x1="8" y1="18" x2="21" y2="18" />
            <line x1="3" y1="6" x2="3.01" y2="6" />
            <line x1="3" y1="12" x2="3.01" y2="12" />
            <line x1="3" y1="18" x2="3.01" y2="18" />
          </svg>

          <!-- Plus Icon -->
          <svg v-else-if="item.icon === 'plus'" class="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </span>
        <span
          v-if="!props.collapsed"
          class="font-body tracking-wide transition-opacity duration-200"
        >
          {{ item.label }}
        </span>
      </RouterLink>
    </nav>
  </aside>
</template>

