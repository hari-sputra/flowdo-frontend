<script setup lang="ts">
import { useTheme, type ThemePreference } from '@/composables/useTheme'
import { useDeviceDetection, type Platform } from '@/composables/useDeviceDetection'

const { preference: themePref, setTheme } = useTheme()
const { override: platformOverride, setOverride } = useDeviceDetection()

const themes: { label: string; value: ThemePreference; desc: string }[] = [
  {
    label: 'Clean Monochrome Book',
    value: 'light',
    desc: 'Crisp white paper aesthetic with high-contrast grayscale ink typography.'
  },
  {
    label: 'Dark Leather Journal',
    value: 'dark',
    desc: 'Luxurious dark brown bound cover style with gold-foil text accents.'
  },
  {
    label: 'Book Companion (System)',
    value: 'system',
    desc: 'Synthesize surface style matches system setting automatically.'
  }
]

const platforms: { label: string; value: Platform | null; desc: string }[] = [
  {
    label: 'Auto Detect (Device Engine)',
    value: null,
    desc: 'Evaluate device categories reactively using touch + viewport queries.'
  },
  {
    label: 'Force Smartphone Layout',
    value: 'mobile',
    desc: 'Simulate the pocket-notebook layout styled for hand-held scrolling.'
  },
  {
    label: 'Force Tablet Layout',
    value: 'tablet',
    desc: 'Simulate collapsible TOC navigation index.'
  },
  {
    label: 'Force Desktop Layout',
    value: 'desktop',
    desc: 'Expand index spine spreads to desktop widescreen view.'
  }
]
</script>

<template>
  <div class="space-y-8">
    <div class="border-b border-border pb-4">
      <h1 class="font-heading text-3xl font-extrabold text-text-primary tracking-tight">
        Journal Preferences
      </h1>
      <p class="font-mono text-xs text-text-secondary mt-1">
        Personalize style and behavior layouts
      </p>
    </div>

    <!-- Theme Settings Card -->
    <div class="bg-surface-elevated paper-shadow paper-border rounded-lg p-6 transition-colors duration-300">
      <h2 class="font-heading text-lg font-bold text-text-primary mb-4 border-b border-border pb-2">
        Ink & Cover Theme
      </h2>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          v-for="theme in themes"
          :key="theme.value"
          @click="setTheme(theme.value)"
          class="flex flex-col text-left p-4 rounded border transition-all duration-200 cursor-pointer select-none"
          :class="[
            themePref === theme.value
              ? 'border-accent bg-accent/5 dark:bg-accent/10 ring-1 ring-accent'
              : 'border-border hover:border-text-secondary/50 bg-transparent'
          ]"
        >
          <span class="font-heading font-semibold text-sm text-text-primary mb-1">{{ theme.label }}</span>
          <span class="font-body text-xs text-text-secondary leading-relaxed">{{ theme.desc }}</span>
        </button>
      </div>
    </div>

    <!-- Adaptive Layout Override Card (Extremely powerful debug/useability tool!) -->
    <div class="bg-surface-elevated paper-shadow paper-border rounded-lg p-6 transition-colors duration-300">
      <h2 class="font-heading text-lg font-bold text-text-primary mb-2 border-b border-border pb-2">
        Platform Overrides
      </h2>
      <p class="font-body text-xs text-text-secondary mb-4 leading-relaxed">
        Force layout formats to verify how the application adapts interfaces. Great for testing smartphone bottom-bars, tablet indices, or full desktop spreads.
      </p>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          v-for="platform in platforms"
          :key="platform.label"
          @click="setOverride(platform.value)"
          class="flex flex-col text-left p-4 rounded border transition-all duration-200 cursor-pointer select-none"
          :class="[
            platformOverride === platform.value
              ? 'border-accent bg-accent/5 dark:bg-accent/10 ring-1 ring-accent'
              : 'border-border hover:border-text-secondary/50 bg-transparent'
          ]"
        >
          <span class="font-heading font-semibold text-sm text-text-primary mb-1">{{ platform.label }}</span>
          <span class="font-body text-xs text-text-secondary leading-relaxed">{{ platform.desc }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
