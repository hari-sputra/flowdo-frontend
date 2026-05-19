<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useTheme } from '@/composables/useTheme'

const { isDark, setTheme } = useTheme()
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-surface transition-colors duration-300 px-4 py-8 relative overflow-hidden font-body">
    <!-- Figma styling purple gradient and blurred background ellipses -->
    <div class="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-accent/10 blur-[120px] pointer-events-none"></div>
    <div class="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-accent/15 blur-[120px] pointer-events-none"></div>

    <!-- Main Auth Card Container -->
    <div class="w-full max-w-[420px] bg-surface-elevated shadow-lg border border-border rounded-2xl p-8 sm:p-10 relative z-10 transition-colors duration-300">
      
      <!-- Top Theme Toggle (Handcrafted Minimal Accent Button) -->
      <div class="absolute top-4 right-4 flex items-center gap-2 z-20">
        <button
          @click="setTheme(isDark ? 'light' : 'dark')"
          class="p-2 text-text-secondary hover:text-text-primary rounded-full hover:bg-border/20 transition-all duration-200"
          aria-label="Toggle theme"
        >
          <!-- Sun Icon (Light mode) -->
          <svg v-if="isDark" class="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
          </svg>
          <!-- Moon Icon (Dark mode) -->
          <svg v-else class="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
          </svg>
        </button>
      </div>

      <!-- App Brand Logo header -->
      <div class="text-center mb-8">
        <h1 class="font-heading text-4xl font-extrabold text-accent mb-2 tracking-tight">
          FlowDo
        </h1>
        <p class="font-body text-xs text-text-secondary tracking-wide uppercase font-semibold">
          Simple, elegant task management
        </p>
      </div>

      <!-- Form Slot content -->
      <RouterView v-slot="{ Component }">
        <transition name="page-fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </RouterView>
    </div>
  </div>
</template>

