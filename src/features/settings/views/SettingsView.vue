<script setup lang="ts">
import { useTheme, type ThemePreference } from '@/composables/useTheme'
import { useDeviceDetection, type Platform } from '@/composables/useDeviceDetection'

const { preference: themePref, setTheme } = useTheme()
const { override: platformOverride, setOverride } = useDeviceDetection()

const themes: { label: string; value: ThemePreference; desc: string }[] = [
  {
    label: 'Figma Light Mode',
    value: 'light',
    desc: 'Crisp purple accent branding with a clean, flat light violet background.'
  },
  {
    label: 'Modern Slate Dark',
    value: 'dark',
    desc: 'Deep modern slate colors combined with vibrant violet accents for low-light comfort.'
  },
  {
    label: 'System Matcher',
    value: 'system',
    desc: 'Automatically adjusts between Light and Dark mode based on OS settings.'
  }
]

const platforms: { label: string; value: Platform | null; desc: string }[] = [
  {
    label: 'Auto Detect (Device Engine)',
    value: null,
    desc: 'Evaluate device categories reactively using touch + viewport queries.'
  },
  {
    label: 'Force Mobile Layout',
    value: 'mobile',
    desc: 'Simulate smartphone UI with user profile headers and bottom nav bar.'
  },
  {
    label: 'Force Tablet Layout',
    value: 'tablet',
    desc: 'Simulate collapsible sidebar layout matching Figma tablet screens.'
  },
  {
    label: 'Force Desktop Layout',
    value: 'desktop',
    desc: 'Render widescreen viewports utilizing the same collapsible tablet sidebar.'
  }
]
</script>

<template>
  <div class="space-y-8 font-body pb-10">
    <div class="border-b border-border pb-4">
      <h1 class="font-heading text-2xl font-bold text-text-primary">
        App Preferences
      </h1>
      <p class="text-xs text-text-secondary">
        Personalize visual styling and override responsive layout parameters
      </p>
    </div>

    <!-- Theme Settings Card -->
    <div class="card-elevated p-6">
      <h2 class="font-heading text-base font-bold text-text-primary mb-4 border-b border-border/50 pb-2">
        Branding Cover Theme
      </h2>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          v-for="theme in themes"
          :key="theme.value"
          @click="setTheme(theme.value)"
          class="flex flex-col text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer select-none"
          :class="[
            themePref === theme.value
              ? 'border-accent bg-accent/5 dark:bg-accent/10 ring-1 ring-accent'
              : 'border-border hover:border-text-secondary/50 bg-transparent'
          ]"
        >
          <span class="font-semibold text-sm text-text-primary mb-1">{{ theme.label }}</span>
          <span class="text-xs text-text-secondary leading-relaxed">{{ theme.desc }}</span>
        </button>
      </div>
    </div>

    <!-- Adaptive Layout Override Card (Extremely powerful debug/useability tool!) -->
    <div class="card-elevated p-6">
      <h2 class="font-heading text-base font-bold text-text-primary mb-2 border-b border-border/50 pb-2">
        Platform Overrides
      </h2>
      <p class="text-xs text-text-secondary mb-4 leading-relaxed">
        Force layout formats to verify how the application adapts interfaces. Great for testing smartphone bottom-bars, tablet indices, or full desktop spreads.
      </p>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          v-for="platform in platforms"
          :key="platform.label"
          @click="setOverride(platform.value)"
          class="flex flex-col text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer select-none"
          :class="[
            platformOverride === platform.value
              ? 'border-accent bg-accent/5 dark:bg-accent/10 ring-1 ring-accent'
              : 'border-border hover:border-text-secondary/50 bg-transparent'
          ]"
        >
          <span class="font-semibold text-sm text-text-primary mb-1">{{ platform.label }}</span>
          <span class="text-xs text-text-secondary leading-relaxed">{{ platform.desc }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

