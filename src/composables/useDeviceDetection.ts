import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useLocalStorage, useBreakpoints } from '@vueuse/core'

export type Platform = 'mobile' | 'tablet' | 'desktop'

export function useDeviceDetection() {
  const override = useLocalStorage<Platform | null>('flowdo-platform-override', null)
  
  // Base media query breakpoints
  const breakpoints = useBreakpoints({
    tablet: 768,
    desktop: 1024,
  })

  // Detect touch capability
  const isTouchDevice = ref(false)

  const updateTouchCapability = () => {
    isTouchDevice.value =
      typeof window !== 'undefined' &&
      ('ontouchstart' in window || navigator.maxTouchPoints > 0)
  }

  // Reactive width queries
  const isWidthMobile = breakpoints.smaller('tablet') // < 768px
  const isWidthTablet = breakpoints.between('tablet', 'desktop') // 768px - 1023px

  // Resolved active platform
  const platform = computed<Platform>(() => {
    if (override.value) {
      return override.value
    }

    if (isWidthMobile.value && isTouchDevice.value) {
      return 'mobile'
    }

    if (isWidthTablet.value && isTouchDevice.value) {
      return 'tablet'
    }

    return 'desktop'
  })

  const isMobile = computed(() => platform.value === 'mobile')
  const isTablet = computed(() => platform.value === 'tablet')
  const isDesktop = computed(() => platform.value === 'desktop')

  const setOverride = (p: Platform | null) => {
    override.value = p
  }

  onMounted(() => {
    updateTouchCapability()
    window.addEventListener('touchstart', updateTouchCapability, { passive: true })
  })

  onUnmounted(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('touchstart', updateTouchCapability)
    }
  })

  return {
    platform,
    override,
    isMobile,
    isTablet,
    isDesktop,
    setOverride,
  }
}
