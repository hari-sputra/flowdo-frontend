<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTaskStore } from '@/stores/task.store'
import dayjs from 'dayjs'
import TaskCard from '../components/shared/TaskCard.vue'
import ConfirmDialog from '../components/shared/ConfirmDialog.vue'

const taskStore = useTaskStore()

// Days of the week generator (centered around today)
const selectedDate = ref(dayjs().format('YYYY-MM-DD'))

const weekDays = computed(() => {
  return Array.from({ length: 7 }).map((_, i) => {
    const day = dayjs().add(i - 3, 'day')
    return {
      name: day.format('ddd'),
      dayNum: day.format('DD'),
      fullDate: day.format('YYYY-MM-DD'),
      isToday: day.isSame(dayjs(), 'day')
    }
  })
})

// Status filters: all, todo, inprogress, completed
const activeStatusFilter = ref<'all' | 'todo' | 'inprogress' | 'completed'>('all')

const filteredTasks = computed(() => {
  // First filter by selected date
  let list = taskStore.getTasksByDate(selectedDate.value)
  
  // Then filter by status
  if (activeStatusFilter.value === 'todo') {
    return list.filter(t => t.status === 'to-do')
  } else if (activeStatusFilter.value === 'inprogress') {
    return list.filter(t => t.status === 'in-progress')
  } else if (activeStatusFilter.value === 'completed') {
    return list.filter(t => t.status === 'done')
  }
  return list
})

const selectDate = (dateStr: string) => {
  selectedDate.value = dateStr
}

// Delete Confirmation
const showDeleteConfirm = ref(false)
const taskToDelete = ref<string | null>(null)

const confirmDelete = (id: string) => {
  taskToDelete.value = id
  showDeleteConfirm.value = true
}

const executeDelete = () => {
  if (taskToDelete.value) {
    taskStore.deleteTask(taskToDelete.value)
  }
  showDeleteConfirm.value = false
  taskToDelete.value = null
}
</script>

<template>
  <div class="space-y-6 font-body pb-10">
    
    <!-- Top Date Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-xl font-bold text-text-primary">
          Today's Tasks
        </h1>
        <p class="text-xs text-text-secondary font-medium">
          {{ dayjs(selectedDate).format('MMMM D, YYYY') }}
        </p>
      </div>
    </div>

    <!-- 1. Week Calendar Row (Figma Style) -->
    <div class="flex justify-between items-center bg-surface-elevated border border-border rounded-2xl p-4 shadow-sm overflow-x-auto gap-2 scrollbar-none">
      <div 
        v-for="day in weekDays" 
        :key="day.fullDate"
        @click="selectDate(day.fullDate)"
        class="flex flex-col items-center justify-center min-w-[3rem] py-2.5 rounded-xl cursor-pointer transition-all duration-200 shrink-0"
        :class="[
          selectedDate === day.fullDate
            ? 'bg-accent text-white shadow-sm font-semibold' 
            : 'text-text-secondary hover:bg-border/20'
        ]"
      >
        <span class="text-[10px] uppercase font-bold tracking-wider opacity-80 mb-1">
          {{ day.name }}
        </span>
        <span class="text-sm">
          {{ day.dayNum }}
        </span>
        <!-- Small dot indicator if selected date has tasks -->
        <span 
          v-if="taskStore.getTasksByDate(day.fullDate).length > 0"
          class="w-1 h-1 rounded-full mt-1.5"
          :class="selectedDate === day.fullDate ? 'bg-white' : 'bg-accent'"
        ></span>
      </div>
    </div>

    <!-- 2. Status Filter Tabs (Figma Style) -->
    <div class="flex border-b border-border/50 pb-1 gap-6 text-sm font-medium overflow-x-auto scrollbar-none">
      <button 
        @click="activeStatusFilter = 'all'"
        class="pb-2 relative whitespace-nowrap"
        :class="activeStatusFilter === 'all' ? 'text-accent font-bold' : 'text-text-secondary hover:text-text-primary transition-colors'"
      >
        All
        <span v-if="activeStatusFilter === 'all'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-accent rounded-full"></span>
      </button>
      
      <button 
        @click="activeStatusFilter = 'todo'"
        class="pb-2 relative whitespace-nowrap"
        :class="activeStatusFilter === 'todo' ? 'text-accent font-bold' : 'text-text-secondary hover:text-text-primary transition-colors'"
      >
        To-Do
        <span v-if="activeStatusFilter === 'todo'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-accent rounded-full"></span>
      </button>

      <button 
        @click="activeStatusFilter = 'inprogress'"
        class="pb-2 relative whitespace-nowrap"
        :class="activeStatusFilter === 'inprogress' ? 'text-accent font-bold' : 'text-text-secondary hover:text-text-primary transition-colors'"
      >
        In Progress
        <span v-if="activeStatusFilter === 'inprogress'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-accent rounded-full"></span>
      </button>

      <button 
        @click="activeStatusFilter = 'completed'"
        class="pb-2 relative whitespace-nowrap"
        :class="activeStatusFilter === 'completed' ? 'text-accent font-bold' : 'text-text-secondary hover:text-text-primary transition-colors'"
      >
        Completed
        <span v-if="activeStatusFilter === 'completed'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-accent rounded-full"></span>
      </button>
    </div>

    <!-- 3. Tasks List for Selected Day -->
    <div class="space-y-3" v-if="filteredTasks.length > 0">
      <TaskCard 
        v-for="task in filteredTasks" 
        :key="task.id" 
        :task="task" 
        @delete="confirmDelete"
      />
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12 bg-surface-elevated rounded-2xl border border-border border-dashed mt-4">
      <svg class="w-12 h-12 mx-auto text-text-secondary/40 fill-none stroke-current mb-3" viewBox="0 0 24 24">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
      <h3 class="text-sm font-bold text-text-primary mb-1">No tasks today</h3>
      <p class="text-xs text-text-secondary max-w-[200px] mx-auto">
        You don't have any tasks scheduled for this day.
      </p>
    </div>

    <ConfirmDialog
      :open="showDeleteConfirm"
      title="Delete Task"
      message="Are you sure you want to delete this task? This action cannot be undone."
      @confirm="executeDelete"
      @cancel="showDeleteConfirm = false"
    />

  </div>
</template>

<style scoped>
.scrollbar-none::-webkit-scrollbar {
  display: none;
}
.scrollbar-none {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
