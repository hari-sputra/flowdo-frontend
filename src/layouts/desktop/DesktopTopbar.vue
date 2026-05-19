<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useTheme } from '@/composables/useTheme'

const route = useRoute()
const { isDark, setTheme } = useTheme()

// Page title resolver
const pageTitle = computed(() => {
  if (route.path === '/settings') return 'Settings'
  if (route.query.filter === 'today') return 'Due Today'
  if (route.query.filter === 'tags') return 'Tag Management'
  return 'My Workspace'
})

// Mock states (to be backed by Pinia store in Phase 3/5)
const dueTodayCount = ref(3) // Mock notification badge count
const userDropdownOpen = ref(false)
const userInitials = ref('HS') // Mock user: Hari Sputra
</script>

<template>
  <header class="flex items-center justify-between px-8 select-none transition-colors duration-300">
    <!-- Left Section: Page Heading -->
    <div>
      <h2 class="font-heading text-xl font-bold tracking-tight text-text-primary">
        {{ pageTitle }}
      </h2>
    </div>

    <!-- Right Section: Actions & Utilities -->
    <div class="flex items-center gap-4">
      
      <!-- Theme Switcher -->
      <button
        @click="setTheme(isDark ? 'light' : 'dark')"
        class="p-2 text-text-secondary hover:text-text-primary rounded-full hover:bg-border/30 dark:hover:bg-border/10 transition-colors"
        :aria-label="isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
      >
        <svg v-if="isDark" class="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
        <svg v-else class="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      </button>

      <!-- Notification Bell with Red Badge -->
      <div class="relative">
        <button
          class="p-2 text-text-secondary hover:text-text-primary rounded-full hover:bg-border/30 dark:hover:bg-border/10 transition-colors relative"
          aria-label="Notifications"
        >
          <svg class="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          
          <!-- Due Today red notification dot count -->
          <span
            v-if="dueTodayCount > 0"
            class="absolute top-1.5 right-1.5 w-4 h-4 bg-danger text-[10px] text-white rounded-full flex items-center justify-center font-mono font-bold scale-90"
          >
            {{ dueTodayCount }}
          </span>
        </button>
      </div>

      <!-- Vertical border divider -->
      <div class="h-6 w-[1px] bg-border"></div>

      <!-- User Profile trigger -->
      <div class="relative">
        <button
          @click="userDropdownOpen = !userDropdownOpen"
          class="flex items-center gap-2 group p-1 pr-2 rounded-full hover:bg-border/30 dark:hover:bg-border/10 transition-colors"
        >
          <span class="w-8 h-8 rounded-full bg-accent/10 dark:bg-accent/20 border border-border text-accent flex items-center justify-center font-mono font-bold text-sm">
            {{ userInitials }}
          </span>
          <span class="text-sm font-medium text-text-secondary group-hover:text-text-primary transition-colors hidden sm:inline">
            Hari Sputra
          </span>
          <svg class="w-4 h-4 text-text-secondary transition-transform duration-200" :class="{ 'rotate-180': userDropdownOpen }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <!-- Mock Dropdown Menu -->
        <div
          v-if="userDropdownOpen"
          v-on-click-outside="() => userDropdownOpen = false"
          class="absolute right-0 mt-2 w-48 bg-surface-elevated paper-border paper-shadow rounded-md py-1 z-30 transition-all text-sm"
        >
          <div class="px-4 py-2 border-b border-border text-xs text-text-secondary font-mono">
            Signed in as <br>
            <span class="font-body text-text-primary text-sm break-all font-semibold">hari@example.com</span>
          </div>
          <RouterLink
            to="/settings"
            @click="userDropdownOpen = false"
            class="block px-4 py-2 text-text-primary hover:bg-border/30 dark:hover:bg-border/10 transition-colors font-medium"
          >
            My Settings
          </RouterLink>
        </div>
      </div>
      
    </div>
  </header>
</template>
