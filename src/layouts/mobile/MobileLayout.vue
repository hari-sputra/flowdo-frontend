<script setup lang="ts">
import MobileHeader from './MobileHeader.vue'
import MobileBottomNav from './MobileBottomNav.vue'
</script>

<template>
  <div class="h-screen flex flex-col bg-surface text-text-primary transition-colors duration-300 relative overflow-hidden select-none">
    
    <!-- Mobile Fixed Top Header -->
    <MobileHeader class="h-14 shrink-0 border-b border-border bg-surface-elevated z-20" />

    <!-- Scrollable Main Page Spread -->
    <main class="flex-1 overflow-y-auto p-4 pb-20 bg-surface select-text">
      <slot />
    </main>

    <!-- Mobile Fixed Bottom Navigation -->
    <MobileBottomNav class="h-16 shrink-0 border-t border-border bg-surface-elevated pb-safe z-20" />
  </div>
</template>

<style scoped>
/* Safe area padding for newer smartphone screens (notches) */
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom, 0px);
}
</style>
