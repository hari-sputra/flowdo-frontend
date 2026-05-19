<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTaskStore } from '@/stores/task.store'
import dayjs from 'dayjs'

const taskStore = useTaskStore()

// Days of the week generator (centered around today)
const selectedDate = ref(dayjs().format('YYYY-MM-DD'))

const weekDays = computed(() => {
  const startOfWeek = dayjs().startOf('week') // defaults to Sunday or Monday depending on locale, let's just make it relative to today-3 days to today+3 days for absolute custom 7 days
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

const toggleTask = (id: string) => {
  taskStore.toggleTaskStatus(id)
}

const deleteTask = (id: string) => {
  taskStore.deleteTask(id)
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
    <div class="flex justify-between items-center bg-surface-elevated border border-border rounded-2xl p-4 shadow-sm">
      <div 
        v-for="day in weekDays" 
        :key="day.fullDate"
        @click="selectDate(day.fullDate)"
        class="flex flex-col items-center justify-center w-10 py-2.5 rounded-xl cursor-pointer transition-all duration-200"
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
    <div class="flex border-b border-border/50 pb-1 gap-6 text-sm font-medium">
      <button 
        @click="activeStatusFilter = 'all'"
        class="pb-2 relative"
        :class="activeStatusFilter === 'all' ? 'text-accent font-bold' : 'text-text-secondary'"
      >
        All
        <span v-if="activeStatusFilter === 'all'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-accent rounded-full"></span>
      </button>
      
      <button 
        @click="activeStatusFilter = 'todo'"
        class="pb-2 relative"
        :class="activeStatusFilter === 'todo' ? 'text-accent font-bold' : 'text-text-secondary'"
      >
        To-Do
        <span v-if="activeStatusFilter === 'todo'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-accent rounded-full"></span>
      </button>

      <button 
        @click="activeStatusFilter = 'inprogress'"
        class="pb-2 relative"
        :class="activeStatusFilter === 'inprogress' ? 'text-accent font-bold' : 'text-text-secondary'"
      >
        In Progress
        <span v-if="activeStatusFilter === 'inprogress'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-accent rounded-full"></span>
      </button>

      <button 
        @click="activeStatusFilter = 'completed'"
        class="pb-2 relative"
        :class="activeStatusFilter === 'completed' ? 'text-accent font-bold' : 'text-text-secondary'"
      >
        Completed
        <span v-if="activeStatusFilter === 'completed'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-accent rounded-full"></span>
      </button>
    </div>

    <!-- 3. Tasks List for Selected Day -->
    <div class="space-y-3" v-if="filteredTasks.length > 0">
      <div 
        v-for="task in filteredTasks" 
        :key="task.id"
        class="card-elevated p-4 flex items-center justify-between gap-4 hover:-translate-y-px transition-transform duration-200"
      >
        <div class="flex items-center gap-3">
          <!-- Checkbox status toggle -->
          <button 
            @click="toggleTask(task.id)"
            class="w-5 h-5 rounded border-2 border-border flex items-center justify-center transition-colors"
            :class="[task.status === 'done' ? 'bg-success/20 border-success text-success' : 'hover:border-accent']"
          >
            <svg v-if="task.status === 'done'" class="w-3.5 h-3.5 fill-none stroke-current stroke-3" viewBox="0 0 24 24">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </button>
          
          <div class="space-y-0.5">
            <h3 
              class="text-sm font-bold text-text-primary"
              :class="[task.status === 'done' ? 'line-through text-text-secondary opacity-60' : '']"
            >
              {{ task.title }}
            </h3>
            <div class="flex items-center gap-2">
              <span class="text-[10px] font-semibold uppercase tracking-wider" :class="task.priority === 'urgent' ? 'text-danger' : 'text-text-secondary'">
                {{ task.priority }}
              </span>
              <span class="w-1 h-1 rounded-full bg-border"></span>
              <span class="status-badge" :class="[
                task.status === 'done' ? 'status-badge-done' : 
                task.status === 'in-progress' ? 'status-badge-inprogress' : 'status-badge-todo'
              ]">
                {{ task.status }}
              </span>
            </div>
          </div>
        </div>

        <!-- Right: Actions (Delete) -->
        <button 
          @click="deleteTask(task.id)"
          class="p-2 text-text-secondary hover:text-danger hover:bg-danger/5 dark:hover:bg-danger/10 rounded-full transition-all duration-200"
          aria-label="Delete Task"
        >
          <svg class="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            <line x1="10" y1="11" x2="10" y2="17" />
            <line x1="14" y1="11" x2="14" y2="17" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12 bg-surface-elevated rounded-2xl border border-border border-dashed">
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

  </div>
</template>
