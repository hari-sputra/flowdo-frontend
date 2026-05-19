<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useTaskStore } from '@/stores/task.store'
import dayjs from 'dayjs'

const taskStore = useTaskStore()
const router = useRouter()

const title = ref('')
const description = ref('')
const dueDate = ref(dayjs().format('YYYY-MM-DD'))
const priority = ref<'low' | 'medium' | 'high' | 'urgent'>('medium')
const selectedTag = ref<string>('Work')

const tagsList = ['Work', 'Personal', 'Study', 'Fitness']

const getTagColorClass = (tag: string, isActive: boolean) => {
  if (!isActive) return 'bg-border/30 text-text-secondary hover:bg-border/50'
  switch (tag) {
    case 'Work': return 'bg-category-blue text-[#005DC2]'
    case 'Personal': return 'bg-category-pink text-[#C2006B]'
    case 'Study': return 'bg-category-purple text-accent'
    default: return 'bg-category-yellow text-[#D49B00]'
  }
}

const selectPriority = (p: 'low' | 'medium' | 'high' | 'urgent') => {
  priority.value = p
}

const handleAddTask = () => {
  if (!title.value.trim()) return
  
  taskStore.addTask({
    title: title.value,
    description: description.value,
    status: 'to-do',
    dueDate: dueDate.value,
    priority: priority.value,
    tags: [selectedTag.value]
  })
  
  // Route back to today tasks view
  router.push('/tasks/today')
}
</script>

<template>
  <div class="space-y-6 font-body pb-10 max-w-lg mx-auto">
    <!-- Header -->
    <div class="border-b border-border pb-4">
      <h1 class="text-xl font-bold text-text-primary">
        Create New Task
      </h1>
      <p class="text-xs text-text-secondary">
        Add details to organize your schedule
      </p>
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
            class="py-2.5 px-1 rounded-xl text-xs font-bold border transition-all duration-200 capitalize"
            :class="[
              priority === p 
                ? 'bg-accent/10 border-accent text-accent shadow-sm' 
                : 'bg-surface-elevated border-border text-text-secondary hover:bg-border/20'
            ]"
          >
            {{ p }}
          </button>
        </div>
      </div>

      <!-- Tags Category Pill List -->
      <div class="space-y-2">
        <span class="text-xs font-bold text-text-primary uppercase tracking-wider block">
          Category Tag
        </span>

        <div class="flex flex-wrap gap-2.5">
          <button 
            type="button"
            v-for="tag in tagsList"
            :key="tag"
            @click="selectedTag = tag"
            class="status-badge cursor-pointer transform hover:scale-103 active:scale-98 transition-all duration-150"
            :class="getTagColorClass(tag, selectedTag === tag)"
          >
            {{ tag }}
          </button>
        </div>
      </div>

      <!-- Actions -->
      <div class="pt-4 flex gap-3">
        <button 
          type="button"
          @click="router.back()"
          class="flex-1 bg-surface-elevated hover:bg-border/30 border border-border text-text-secondary font-semibold py-3 px-4 rounded-xl transition-all duration-200 text-center text-sm"
        >
          Cancel
        </button>
        <button 
          type="submit"
          class="flex-1 bg-accent hover:bg-accent/90 text-white font-semibold py-3 px-4 rounded-xl shadow-md transform active:scale-98 transition-all duration-200 text-center text-sm"
        >
          Create Task
        </button>
      </div>
    </form>
  </div>
</template>
