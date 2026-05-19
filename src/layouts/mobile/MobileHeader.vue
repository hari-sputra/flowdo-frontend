<script setup lang="ts">
import { ref } from 'vue'
import { useTheme } from '@/composables/useTheme'

const { isDark, setTheme } = useTheme()
const hasAlerts = ref(true) // Mock status for daily reminders
</script>

<template>
  <header class="flex items-center justify-between px-4 select-none transition-colors duration-300">
    <!-- App Brand -->
    <div>
      <h2 class="font-heading text-lg font-bold tracking-tight text-accent">
        FlowDo
      </h2>
    </div>

    <!-- Right utilities -->
    <div class="flex items-center gap-1.5">
      <!-- Minimal Theme Switcher -->
      <button
        @click="setTheme(isDark ? 'light' : 'dark')"
        class="p-2 text-text-secondary hover:text-text-primary rounded-full hover:bg-border/20 transition-colors"
        aria-label="Toggle theme"
      >
        <svg v-if="isDark" class="w-4.5 h-4.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
        <svg v-else class="w-4.5 h-4.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      </button>

      <!-- Alert Reminder status icon -->
      <div class="relative">
        <button
          class="p-2 text-text-secondary hover:text-text-primary rounded-full hover:bg-border/20 transition-colors"
          aria-label="Alerts due"
        >
          <svg class="w-4.5 h-4.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <!-- Tiny red notification dot -->
          <span
            v-if="hasAlerts"
            class="absolute top-2 right-2 w-2 h-2 bg-danger rounded-full ring-1 ring-surface-elevated"
          ></span>
        </button>
      </div>
    </div>
  </header>
</template>
