<script setup lang="ts">
import { useDeviceDetection } from '@/composables/useDeviceDetection'
import MobileLayout from './mobile/MobileLayout.vue'
import TabletLayout from './tablet/TabletLayout.vue'
import DesktopLayout from './desktop/DesktopLayout.vue'

const { platform } = useDeviceDetection()

const layoutMap = {
  mobile: MobileLayout,
  tablet: TabletLayout,
  desktop: TabletLayout, // Use the collapsible tablet layout for desktop as requested
} as const
</script>

<template>
  <component :is="layoutMap[platform]">
    <RouterView />
  </component>
</template>
