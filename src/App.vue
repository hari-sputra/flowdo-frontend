<script setup lang="ts">
import { RouterView } from 'vue-router'
import { Toaster } from 'vue-sonner'
import { useTheme } from '@/composables/useTheme'

const { isDark } = useTheme()
</script>

<template>
  <!-- Main entry point: Layout structures are resolved inside routing views -->
  <RouterView v-slot="{ Component, route }">
    <transition name="page-fade" mode="out-in">
      <component :is="Component" :key="route.path" />
    </transition>
  </RouterView>
  
  <Toaster position="top-right" :theme="isDark ? 'dark' : 'light'" />
</template>
