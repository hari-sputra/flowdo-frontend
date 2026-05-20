<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps<{
  count: number
}>()

const router = useRouter()
const isVisible = ref(true)

const dismiss = () => {
  isVisible.value = false
}

// Auto dismiss after 5 seconds
onMounted(() => {
  if (props.count > 0) {
    setTimeout(() => {
      dismiss()
    }, 5000)
  }
})
</script>

<template>
  <transition name="scale-in">
    <div
      v-if="isVisible && count > 0"
      class="bg-accent/10 border border-accent/20 text-accent px-4 py-3 rounded-xl flex items-center justify-between shadow-sm dark:bg-accent/20"
    >
      <div class="flex items-center gap-3">
        <div class="bg-accent text-white p-1.5 rounded-full">
          <svg class="w-4 h-4 stroke-current stroke-2" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3" />
          </svg>
        </div>
        <div>
          <p class="text-sm font-semibold">Tasks Due Today</p>
          <p class="text-xs opacity-80">You have {{ count }} task(s) to complete today.</p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <button
          @click="router.push('/tasks/today')"
          class="text-xs font-bold px-3 py-1.5 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
        >
          View
        </button>
        <button @click="dismiss" class="p-1 opacity-70 hover:opacity-100 transition-opacity">
          <svg class="w-4 h-4 stroke-current stroke-2" viewBox="0 0 24 24" fill="none">
            <path stroke-linecap="round" stroke-linejoin="round" d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  </transition>
</template>
