<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useTaskStore } from '@/stores/task.store'
import dayjs from 'dayjs'
import TagManagerModal from '../components/shared/TagManagerModal.vue'
import ConfirmDialog from '../components/shared/ConfirmDialog.vue'
import { taskService } from '@/services/task.service'

const taskStore = useTaskStore()
const router = useRouter()
const route = useRoute()

const title = ref('')
const description = ref('')
const dueDate = ref(dayjs().format('YYYY-MM-DD'))
const priority = ref<'low' | 'medium' | 'high' | 'urgent'>('medium')
const selectedTags = ref<string[]>([])
const showTagModal = ref(false)

const showDeleteConfirm = ref(false)
const taskId = route.params.id as string
const isLoading = ref(true)
const isSubmitting = ref(false)

onMounted(async () => {
  try {
    taskStore.fetchTags()
    let task = taskStore.tasks.find(t => t.id === taskId)
    if (!task) {
      // If refreshed on edit page, fetch it directly
      task = await taskService.fetchById(taskId)
    }
    if (task) {
      title.value = task.title
      description.value = task.description || ''
      dueDate.value = task.dueDate
      priority.value = task.priority
      // Extract tag names for the form
      selectedTags.value = task.tags.map(t => t.name)
    } else {
      router.replace('/tasks/today')
    }
  } catch (error) {
    console.error('Failed to load task', error)
    router.replace('/tasks/today')
  } finally {
    isLoading.value = false
  }
})

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

const handleUpdateTask = async () => {
  if (!title.value.trim() || isSubmitting.value) return
  
  isSubmitting.value = true
  try {
    await taskStore.updateTask(taskId, {
      title: title.value,
      description: description.value,
      dueDate: dueDate.value,
      priority: priority.value,
      tags: selectedTags.value
    })
    
    // Route back to today tasks view
    router.push('/tasks/today')
  } catch (error) {
    console.error('Failed to update task', error)
  } finally {
    isSubmitting.value = false
  }
}

const handleDeleteTask = async () => {
  isSubmitting.value = true
  try {
    await taskStore.deleteTask(taskId)
    router.push('/tasks/today')
  } catch (error) {
    console.error('Failed to delete task', error)
    isSubmitting.value = false
    showDeleteConfirm.value = false
  }
}
</script>

<template>
  <div class="space-y-6 font-body pb-10 max-w-lg mx-auto">
    <!-- Header -->
    <div class="border-b border-border pb-4 flex justify-between items-start">
      <div>
        <h1 class="text-xl font-bold text-text-primary">
          Edit Task
        </h1>
        <p class="text-xs text-text-secondary">
          Update the details of your task
        </p>
      </div>
      <button 
        type="button" 
        @click="showDeleteConfirm = true"
        class="text-xs font-semibold text-danger bg-danger/10 px-3 py-1.5 rounded-lg hover:bg-danger/20 transition-colors cursor-pointer"
      >
        Delete
      </button>
    </div>

    <!-- Form -->
    <form @submit.prevent="handleUpdateTask" class="space-y-5">
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

      <!-- Actions -->
      <div class="pt-4 flex gap-3">
        <button 
          type="button"
          @click="router.back()"
          class="flex-1 bg-surface-elevated hover:bg-border/30 border border-border text-text-secondary font-semibold py-3 px-4 rounded-xl transition-all duration-200 text-center text-sm cursor-pointer"
        >
          Cancel
        </button>
        <button 
          type="submit"
          :disabled="isSubmitting"
          class="flex-1 bg-accent hover:bg-accent/90 text-white font-semibold py-3 px-4 rounded-xl shadow-md transform active:scale-98 transition-all duration-200 text-center text-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <span v-if="isSubmitting">Saving...</span>
          <span v-else>Save Changes</span>
        </button>
      </div>
    </form>

    <TagManagerModal :open="showTagModal" @close="showTagModal = false" />
    <!-- Confirm Delete Dialog -->
    <ConfirmDialog
      :open="showDeleteConfirm"
      title="Delete Task"
      message="Are you sure you want to delete this task? This action cannot be undone."
      @confirm="handleDeleteTask"
      @cancel="showDeleteConfirm = false"
    />
  </div>
</template>
