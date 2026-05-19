<script setup lang="ts">
import DesktopSidebar from './DesktopSidebar.vue'
import DesktopTopbar from './DesktopTopbar.vue'
</script>

<template>
  <div class="min-h-screen flex bg-surface text-text-primary transition-colors duration-300 relative">
    
    <!-- Desktop Sidebar (Book Spine/Index) -->
    <DesktopSidebar class="w-[240px] shrink-0 border-r border-border bg-surface-elevated z-20" />

    <!-- Main Workspace (Page Spread) -->
    <div class="flex-1 flex flex-col min-w-0">
      
      <!-- Desktop Topbar (Page Header) -->
      <DesktopTopbar class="h-16 shrink-0 border-b border-border bg-surface-elevated z-10" />

      <!-- Scrollable Main Content (Writing Surface) -->
      <main class="flex-1 overflow-y-auto p-8 lg:p-10 paper-texture relative">
        <div class="max-w-6xl mx-auto h-full">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>
