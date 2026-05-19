import { computed, watchEffect } from 'vue'
import { useLocalStorage, useMediaQuery } from '@vueuse/core'

export type ThemePreference = 'light' | 'dark' | 'system'

export function useTheme() {
  const preference = useLocalStorage<ThemePreference>('flowdo-theme', 'system')
  
  // Media query for system prefers-color-scheme
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)')

  // Computed state of resolved dark mode status
  const isDark = computed(() => {
    if (preference.value === 'system') {
      return prefersDark.value
    }
    return preference.value === 'dark'
  })

  // Set html.dark class reactively
  watchEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement
      if (isDark.value) {
        root.classList.add('dark')
      } else {
        root.classList.remove('dark')
      }
    }
  })

  const setTheme = (theme: ThemePreference) => {
    preference.value = theme
  }

  return {
    preference,
    isDark,
    setTheme,
  }
}
