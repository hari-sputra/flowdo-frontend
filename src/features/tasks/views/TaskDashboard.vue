<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useDeviceDetection } from '@/composables/useDeviceDetection'

const route = useRoute()
const { platform } = useDeviceDetection()
</script>

<template>
  <div class="space-y-6">
    <!-- Header with notebook-style rule border -->
    <div class="border-b border-border pb-4">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="font-heading text-3xl font-extrabold text-text-primary tracking-tight">
            Notebook Entries
          </h1>
          <p class="font-mono text-xs text-text-secondary mt-1">
            Active filters: {{ route.query.filter || 'all tasks' }}
          </p>
        </div>
        
        <!-- Ink stamp priority placeholder -->
        <span class="inline-block border-2 border-dashed border-accent/60 text-accent font-heading text-xs font-bold uppercase tracking-widest px-3 py-1 rounded rotate-[-2deg] opacity-75">
          Ink & Parchment
        </span>
      </div>
    </div>

    <!-- Active Layout Metaphor Status Info Box (Wow-factor indicator) -->
    <div class="bg-surface-elevated paper-shadow paper-border rounded-lg p-6 relative overflow-hidden transition-colors duration-300">
      <div class="absolute right-0 top-0 bottom-0 w-2 bg-accent opacity-30"></div>
      
      <h3 class="font-heading text-lg font-bold text-text-primary mb-2">
        Adaptive Platform Environment Resolved
      </h3>
      <p class="font-body text-sm text-text-secondary mb-4 max-w-2xl leading-relaxed">
        FlowDo uses an adaptive design rather than responsive reflows. The application has successfully rendered the optimized layout shell for your current device category:
      </p>

      <div class="flex flex-wrap items-center gap-3">
        <span class="font-mono text-xs uppercase tracking-wider bg-border/40 px-3 py-1.5 rounded-full font-bold text-text-primary">
          Platform: {{ platform }}
        </span>
        <span class="font-mono text-xs uppercase tracking-wider bg-accent/10 px-3 py-1.5 rounded-full font-bold text-accent">
          Shell Layout: {{ platform.toUpperCase() }} VIEWPORT
        </span>
      </div>
    </div>

    <!-- Notebook Ruled lines task list placeholder -->
    <div class="bg-surface-elevated paper-shadow paper-border rounded-lg p-6 transition-colors duration-300">
      <h3 class="font-heading text-lg font-bold text-text-primary mb-4 border-b border-border pb-2">
        Ruled Notebook Entries (Mock Up)
      </h3>
      
      <div class="ruled-line divide-y divide-border/20 space-y-4 pt-2">
        <div class="flex items-start gap-4 pb-4">
          <input type="checkbox" class="mt-1 accent-accent" checked />
          <div class="space-y-1">
            <h4 class="font-body text-sm font-semibold line-through text-text-secondary">Scaffold Vite and Tailwind v4</h4>
            <p class="font-mono text-xs text-text-secondary">Due: Today • Priority: Urgent</p>
          </div>
        </div>
        
        <div class="flex items-start gap-4 py-4">
          <input type="checkbox" class="mt-1 accent-accent" />
          <div class="space-y-1">
            <h4 class="font-body text-sm font-semibold text-text-primary">Create three platform-specific adaptive layouts</h4>
            <p class="font-mono text-xs text-text-secondary">Due: May 20, 2026 • Priority: High</p>
          </div>
        </div>

        <div class="flex items-start gap-4 py-4">
          <input type="checkbox" class="mt-1 accent-accent" />
          <div class="space-y-1">
            <h4 class="font-body text-sm font-semibold text-text-primary">Write robust unit testing for platform detection and theme composables</h4>
            <p class="font-mono text-xs text-text-secondary">Due: May 22, 2026 • Priority: Medium</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
