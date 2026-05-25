<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTaskStore } from '@/stores/task.store'
import dayjs from 'dayjs'
import TagManagerModal from '../components/shared/TagManagerModal.vue'

const taskStore = useTaskStore()

onMounted(() => {
  taskStore.fetchTags()
})
const router = useRouter()

const title = ref('')
const description = ref('')
const dueDate = ref(dayjs().format('YYYY-MM-DD'))
const priority = ref<'low' | 'medium' | 'high' | 'urgent'>('medium')
const selectedTags = ref<string[]>([])
const showTagModal = ref(false)

const selectPriority = (p: 'low' | 'medium' | 'high' | 'urgent') => {
  priority.value = p
}

const getPriorityActiveClass = (p: string) => {
  switch (p) {
    case 'urgent': return 'bg-red-500 border-red-500 text-white shadow-md'
    case 'high': return 'bg-orange-500 border-orange-500 text-white shadow-md'
    case 'medium': return 'bg-yellow-500 border-yellow-500 text-white shadow-md'
    case 'low': return 'bg-green-500 border-green-500 text-white shadow-md'
    default: return 'bg-accent border-accent text-white shadow-md'
  }
}

const toggleTag = (tagName: string) => {
  if (selectedTags.value.includes(tagName)) {
    selectedTags.value = selectedTags.value.filter(t => t !== tagName)
  } else {
    selectedTags.value.push(tagName)
  }
}

const isSubmitting = ref(false)

const handleAddTask = async () => {
  if (!title.value.trim() || isSubmitting.value) return
  
  isSubmitting.value = true
  try {
    await taskStore.addTask({
      title: title.value,
      description: description.value,
      status: 'to-do',
      dueDate: dueDate.value,
      priority: priority.value,
      tags: selectedTags.value.length > 0 ? selectedTags.value : ['Work'] // Default tag if empty
    })
    
    // Route back to today tasks view
    router.push('/tasks/today')
  } catch (error) {
    console.error('Failed to add task', error)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="space-y-6 font-body pb-10 max-w-lg mx-auto">
    <!-- Header -->
    <div class="border-b border-border pb-4 flex justify-between items-start">
      <div>
        <h1 class="text-xl font-bold text-text-primary">
          Create New Task
        </h1>
        <p class="text-xs text-text-secondary">
          Add details to organize your schedule
        </p>
      </div>
    </div>

    <!-- Form -->
    <form @submit.prevent="handleAddTask" class="space-y-5">
      <!-- Title -->
      <div class="space-y-1.5">
        <label for="title" class="text-xs font-bold text-text-primary uppercase tracking-wider">
          Task Title
        </label>
        <input 
          id="title"
          v-model="title"
          type="text"
          required
          placeholder="e.g. Design Dashboard UI"
          class="w-full bg-surface-elevated border border-border rounded-xl py-2.5 px-3.5 text-text-primary text-sm placeholder:text-text-secondary/40 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all duration-200"
        />
      </div>

      <!-- Description -->
      <div class="space-y-1.5">
        <label for="description" class="text-xs font-bold text-text-primary uppercase tracking-wider">
          Description (Optional)
        </label>
        <textarea 
          id="description"
          v-model="description"
          rows="3"
          placeholder="e.g. Add details or notes..."
          class="w-full bg-surface-elevated border border-border rounded-xl py-2.5 px-3.5 text-text-primary text-sm placeholder:text-text-secondary/40 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all duration-200 resize-none"
        ></textarea>
      </div>

      <!-- Due Date -->
      <div class="space-y-1.5">
        <label for="dueDate" class="text-xs font-bold text-text-primary uppercase tracking-wider">
          Due Date
        </label>
        <input 
          id="dueDate"
          v-model="dueDate"
          type="date"
          required
          class="w-full bg-surface-elevated border border-border rounded-xl py-2.5 px-3.5 text-text-primary text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all duration-200"
        />
      </div>

      <!-- Priority Segmented Selector -->
      <div class="space-y-2">
        <span class="text-xs font-bold text-text-primary uppercase tracking-wider block">
          Priority Level
        </span>
        
        <div class="grid grid-cols-4 gap-2">
          <button 
            type="button"
            v-for="p in (['low', 'medium', 'high', 'urgent'] as const)"
            :key="p"
            @click="selectPriority(p)"
            class="py-2.5 px-1 rounded-xl text-xs font-bold border transition-all duration-200 capitalize cursor-pointer"
            :class="[
              priority === p 
                ? getPriorityActiveClass(p)
                : 'bg-surface-elevated border-border text-text-secondary hover:bg-border/20'
            ]"
          >
            {{ p }}
          </button>
        </div>
      </div>

      <!-- Tags Category Pill List -->
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-text-primary uppercase tracking-wider block">
            Category Tags
          </span>
          <button 
            type="button"
            @click="showTagModal = true"
            class="text-xs font-semibold text-accent hover:underline flex items-center gap-1 cursor-pointer"
          >
            <svg class="w-3.5 h-3.5 stroke-current stroke-2" viewBox="0 0 24 24" fill="none">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Manage Tags
          </button>
        </div>

        <div class="flex flex-wrap gap-2.5">
          <button 
            type="button"
            v-for="tag in taskStore.tags"
            :key="tag.id"
            @click="toggleTag(tag.name)"
            class="status-badge cursor-pointer transform hover:scale-103 active:scale-98 transition-all duration-150"
            :style="selectedTags.includes(tag.name) 
              ? { backgroundColor: tag.color, color: '#ffffff' } 
              : { backgroundColor: tag.color + '1A', color: tag.color }"
          >
            {{ tag.name }}
          </button>
        </div>
      </div>


      <!-- Submit button -->
      <div class="pt-6">
        <button
          type="submit"
          :disabled="isSubmitting"
          class="w-full bg-accent hover:bg-accent/90 text-white font-semibold py-3.5 px-4 rounded-xl shadow-md transform active:scale-98 transition-all duration-200 cursor-pointer text-center flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="isSubmitting">Creating...</span>
          <span v-else>Create Task</span>
        </button>
      </div>
    </form>

    <TagManagerModal :open="showTagModal" @close="showTagModal = false" />
  </div>
</template>
