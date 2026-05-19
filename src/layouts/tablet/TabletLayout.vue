<script setup lang="ts">
import { ref } from 'vue'
import TabletSidebar from './TabletSidebar.vue'

const isCollapsed = ref(true) // Collapsed (icon-only) by default per user request
</script>

<template>
  <div class="min-h-screen flex bg-surface text-text-primary transition-colors duration-300 relative">
    
    <!-- Collapsible Tablet Sidebar -->
    <TabletSidebar
      :collapsed="isCollapsed"
      @toggle="isCollapsed = !isCollapsed"
      class="shrink-0 border-r border-border bg-surface-elevated z-20"
      :class="[isCollapsed ? 'w-16' : 'w-[240px]']"
    />

    <!-- Main Workspace -->
    <div class="flex-1 flex flex-col min-w-0">
      
      <!-- Top header bar for Tablet -->
      <header class="h-16 flex items-center justify-between px-6 border-b border-border bg-surface-elevated z-10 select-none">
        <h2 class="font-heading text-lg font-bold tracking-tight text-text-primary">
          FlowDo
        </h2>
        <div class="flex items-center gap-3">
          <!-- Notification Dot Indicator -->
          <div class="w-2.5 h-2.5 bg-danger rounded-full ring-2 ring-surface"></div>
          <span class="font-mono text-xs text-text-secondary">3 active tasks</span>
        </div>
      </header>

      <!-- Scrollable Main Content -->
      <main class="flex-1 overflow-y-auto p-6 paper-texture">
        <slot />
      </main>
    </div>
  </div>
</template>
