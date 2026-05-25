<script setup lang="ts">
import { ref } from 'vue'
import TabletSidebar from './TabletSidebar.vue'
import DesktopTopbar from '../desktop/DesktopTopbar.vue'
import { useTaskStore } from '@/stores/task.store'

const isCollapsed = ref(true) // Collapsed (icon-only) by default per user request
const taskStore = useTaskStore()
</script>

<template>
  <div class="h-screen overflow-hidden flex bg-surface text-text-primary transition-colors duration-300 relative">
    
    <!-- Collapsible Tablet Sidebar -->
    <TabletSidebar
      :collapsed="isCollapsed"
      @toggle="isCollapsed = !isCollapsed"
      class="shrink-0 border-r border-border bg-surface-elevated z-20"
      :class="[isCollapsed ? 'w-16' : 'w-[240px]']"
    />

    <!-- Main Workspace -->
    <div class="flex-1 flex flex-col min-w-0">
      
      <!-- Top header bar for Tablet using DesktopTopbar -->
      <DesktopTopbar class="h-16 shrink-0 border-b border-border bg-surface-elevated z-10" />

      <!-- Scrollable Main Content -->
      <main class="flex-1 overflow-y-auto p-6 lg:p-8 bg-surface">
        <div class="max-w-6xl mx-auto h-full">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>

