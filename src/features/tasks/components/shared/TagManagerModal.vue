<script setup lang="ts">
import { ref } from 'vue'
import { useTaskStore } from '@/stores/task.store'
import type { Tag } from '@/types/tag.types'

defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const taskStore = useTaskStore()

const newTagName = ref('')
const newTagColor = ref('#8764FF')
const isCreating = ref(false)

const predefinedColors = [
  '#8764FF', // Purple
  '#FF7D53', // Orange
  '#2555FF', // Blue
  '#F478B8', // Pink
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#6366F1', // Indigo
]

const handleAddTag = () => {
  if (!newTagName.value.trim()) return
  
  taskStore.addTag({
    name: newTagName.value.trim(),
    color: newTagColor.value
  })
  
  newTagName.value = ''
  isCreating.value = false
}

const handleDeleteTag = (id: string) => {
  if (confirm('Delete this tag? It will be removed from all tasks.')) {
    taskStore.deleteTag(id)
  }
}
</script>

<template>
  <transition name="page-fade">
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
    >
      <div
        class="bg-surface-elevated w-full max-w-md rounded-2xl shadow-xl border border-border flex flex-col max-h-[80vh]"
        v-on-click-outside="() => emit('close')"
      >
        <!-- Header -->
        <div class="flex items-center justify-between p-4 border-b border-border">
          <h2 class="font-heading font-bold text-lg text-text-primary">Manage Tags</h2>
          <button @click="emit('close')" class="p-1.5 text-text-secondary hover:text-text-primary rounded-lg hover:bg-border/50">
            <svg class="w-5 h-5 stroke-current stroke-2" viewBox="0 0 24 24" fill="none">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Tag List -->
        <div class="flex-1 overflow-y-auto p-4 space-y-3 min-h-[200px]">
          <div
            v-for="tag in taskStore.tags"
            :key="tag.id"
            class="flex items-center justify-between p-3 rounded-xl border border-border bg-surface"
          >
            <div class="flex items-center gap-3">
              <span class="w-4 h-4 rounded-full shadow-sm" :style="{ backgroundColor: tag.color }"></span>
              <span class="font-medium text-sm text-text-primary">{{ tag.name }}</span>
              <span v-if="tag.isDefault" class="text-[10px] uppercase font-bold bg-border text-text-secondary px-1.5 py-0.5 rounded">Default</span>
            </div>
            
            <button
              v-if="!tag.isDefault"
              @click="handleDeleteTag(tag.id)"
              class="p-1.5 text-text-secondary hover:text-danger hover:bg-danger/10 rounded-md transition-colors"
              title="Delete Tag"
            >
              <svg class="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Add New Footer -->
        <div class="p-4 border-t border-border bg-surface-elevated rounded-b-2xl">
          <button
            v-if="!isCreating"
            @click="isCreating = true"
            class="w-full py-2.5 flex items-center justify-center gap-2 border border-dashed border-text-secondary/50 text-text-secondary rounded-xl hover:text-accent hover:border-accent hover:bg-accent/5 transition-colors font-medium text-sm"
          >
            <svg class="w-4 h-4 stroke-current stroke-2" viewBox="0 0 24 24" fill="none">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Create New Tag
          </button>
          
          <div v-else class="space-y-4 animate-in slide-in-from-bottom-2 fade-in duration-200">
            <input
              v-model="newTagName"
              type="text"
              placeholder="Tag Name (e.g., Grocery)"
              class="w-full bg-surface border border-border rounded-xl py-2 px-3 text-sm text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
              @keyup.enter="handleAddTag"
            />
            
            <div>
              <p class="text-xs font-semibold text-text-secondary mb-2">Color Label</p>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="color in predefinedColors"
                  :key="color"
                  @click="newTagColor = color"
                  class="w-6 h-6 rounded-full transition-transform hover:scale-110 flex items-center justify-center"
                  :style="{ backgroundColor: color }"
                >
                  <svg v-if="newTagColor === color" class="w-3.5 h-3.5 text-white stroke-current stroke-3" viewBox="0 0 24 24" fill="none">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div class="flex gap-2 pt-2">
              <button
                @click="isCreating = false"
                class="flex-1 py-2 text-sm font-semibold text-text-secondary border border-border rounded-xl hover:bg-border/50"
              >
                Cancel
              </button>
              <button
                @click="handleAddTag"
                :disabled="!newTagName.trim()"
                class="flex-1 py-2 text-sm font-semibold bg-accent text-white rounded-xl hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save Tag
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  </transition>
</template>
