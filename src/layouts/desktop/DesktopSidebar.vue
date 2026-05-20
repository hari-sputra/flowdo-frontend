<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

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

const handleLogout = () => {
  authStore.logout()
  router.push('/auth/login')
}
</script>

<template>
  <aside class="flex flex-col h-screen select-none relative transition-colors duration-300">
    <!-- Left Leather Binding Accent (Notebook Spine) -->
    <div class="absolute left-0 top-0 bottom-0 w-1 bg-accent/80 dark:bg-accent/60"></div>
    
    <!-- Sidebar Header (Brand Logo) -->
    <div class="h-16 flex items-center px-6 border-b border-border pl-7">
      <RouterLink to="/dashboard" class="flex items-center gap-2">
        <span class="font-heading text-xl font-bold tracking-tight text-accent">FlowDo</span>
      </RouterLink>
    </div>

    <!-- Navigation List (Table of Contents Style) -->
    <nav class="flex-1 py-6 px-4 space-y-1 pl-5">
      <RouterLink
        v-for="item in navItems"
        :key="item.label"
        :to="item.path"
        class="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200 group"
        :class="[
          item.isActive.value
            ? 'text-accent bg-accent/5 dark:bg-accent/10 border-l-2 border-accent pl-2.5 font-semibold'
            : 'text-text-secondary hover:text-text-primary hover:bg-border/30 dark:hover:bg-border/10 pl-3'
        ]"
      >
        <!-- Custom SVG Line Icons -->
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
        <span class="font-heading tracking-wide transition-colors">{{ item.label }}</span>
      </RouterLink>
    </nav>
  </aside>
</template>
