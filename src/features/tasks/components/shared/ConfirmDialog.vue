<script setup lang="ts">
defineProps<{
  open: boolean
  title: string
  message: string
}>()

const emit = defineEmits<{
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()
</script>

<template>
  <transition name="page-fade">
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
    >
      <div
        class="bg-surface-elevated w-full max-w-sm rounded-2xl p-6 shadow-xl border border-border"
        v-on-click-outside="() => emit('cancel')"
      >
        <div class="flex items-center justify-center w-12 h-12 rounded-full bg-danger/10 text-danger mb-4 mx-auto">
          <svg class="w-6 h-6 stroke-current stroke-2" viewBox="0 0 24 24" fill="none">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        
        <h3 class="text-center font-heading text-lg font-bold text-text-primary mb-2">
          {{ title }}
        </h3>
        
        <p class="text-center text-sm text-text-secondary mb-6 leading-relaxed">
          {{ message }}
        </p>
        
        <div class="flex gap-3">
          <button
            @click="emit('cancel')"
            class="flex-1 py-2.5 px-4 rounded-xl border border-border text-text-secondary font-semibold hover:bg-border/50 hover:text-text-primary transition-colors text-sm"
          >
            Cancel
          </button>
          <button
            @click="emit('confirm')"
            class="flex-1 py-2.5 px-4 rounded-xl bg-danger text-white font-semibold hover:bg-danger/90 transition-colors text-sm shadow-md"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>
