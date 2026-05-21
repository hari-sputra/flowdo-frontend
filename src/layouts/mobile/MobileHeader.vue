<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { useTaskStore } from '@/stores/task.store'

const router = useRouter()
const authStore = useAuthStore()
const taskStore = useTaskStore()

const userDropdownOpen = ref(false)

const handleLogout = async () => {
  await authStore.logout()
  router.push('/auth/login')
  userDropdownOpen.value = false
}
</script>

<template>
  <header class="flex items-center justify-between px-5 select-none transition-colors duration-300">
    <!-- User profile greeting on left (Figma Home Style) -->
    <div class="relative">
      <button 
        @click="userDropdownOpen = !userDropdownOpen"
        class="flex items-center gap-3 text-left hover:opacity-80 transition-opacity"
      >
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
      </button>

      <!-- Dropdown Menu -->
      <div
        v-if="userDropdownOpen"
        v-on-click-outside="() => userDropdownOpen = false"
        class="absolute left-0 mt-2 w-48 bg-surface-elevated paper-border paper-shadow rounded-md py-1 z-30 transition-all text-sm"
      >
        <RouterLink
          to="/settings"
          @click="userDropdownOpen = false"
          class="flex items-center gap-3 px-4 py-2.5 text-text-primary hover:bg-border/30 dark:hover:bg-border/10 transition-colors font-medium"
        >
          <svg class="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
          Settings
        </RouterLink>
        
        <button
          @click="handleLogout"
          class="w-full text-left flex items-center gap-3 px-4 py-2.5 text-danger hover:bg-danger/5 dark:hover:bg-danger/10 transition-colors font-medium border-t border-border/50"
        >
          <svg class="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
          </svg>
          Logout
        </button>
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

