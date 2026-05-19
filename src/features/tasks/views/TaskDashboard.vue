<script setup lang="ts">
import { computed, ref } from 'vue'
import { useTaskStore } from '@/stores/task.store'
import { useAuthStore } from '@/stores/auth.store'
import { useRouter } from 'vue-router'
import dayjs from 'dayjs'

const taskStore = useTaskStore()
const authStore = useAuthStore()
const router = useRouter()

const todayStr = dayjs().format('dddd, D MMMM')

// Active tasks that are "In Progress" for the horizontal scroll section
const inProgressTasks = computed(() => {
  return taskStore.tasks.filter(t => t.status === 'in-progress')
})

// Tasks filtered list (by default all, but can search/filter)
const searchQuery = ref('')
const selectedPriority = ref<'all' | 'low' | 'medium' | 'high' | 'urgent'>('all')

const filteredTasks = computed(() => {
  return taskStore.tasks.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         (t.description || '').toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesPriority = selectedPriority.value === 'all' || t.priority === selectedPriority.value
    return matchesSearch && matchesPriority
  })
})

const getPriorityColorClass = (priority: string) => {
  switch (priority) {
    case 'urgent': return 'bg-danger text-white'
    case 'high': return 'bg-accent text-white'
    case 'medium': return 'bg-[#7952eb] text-white'
    default: return 'bg-[#ffd12e] text-text-primary'
  }
}

const toggleTask = (id: string) => {
  taskStore.toggleTaskStatus(id)
}
</script>

<template>
  <div class="space-y-6 font-body pb-10">
    
    <!-- Greeting & Date Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-xl font-bold text-text-primary">
          Manage your tasks
        </h1>
        <p class="text-xs text-text-secondary font-medium">
          {{ todayStr }}
        </p>
      </div>
      
      <!-- Small dynamic task counter -->
      <span class="text-xs font-semibold text-accent bg-accent/10 px-3 py-1 rounded-full">
        {{ taskStore.dueTodayCount }} active
      </span>
    </div>

    <!-- 1. Daily Progress Card (Figma Style) -->
    <div class="bg-accent text-white rounded-3xl p-6 shadow-md relative overflow-hidden transition-all duration-300">
      <!-- Decorative background glow -->
      <div class="absolute -right-10 -bottom-10 w-40 h-40 rounded-full bg-white/10 blur-xl"></div>
      
      <div class="space-y-4 relative z-10">
        <div>
          <h3 class="text-sm font-semibold opacity-90">Daily Task Progress</h3>
          <p class="text-2xl font-bold mt-1">
            {{ taskStore.dailyProgress }}% Completed
          </p>
          <p class="text-xs opacity-75 mt-0.5">
            Keep it up! Finish your priority tasks today.
          </p>
        </div>

        <!-- Progress Bar -->
        <div class="w-full bg-white/20 h-2 rounded-full overflow-hidden">
          <div 
            class="bg-white h-full rounded-full transition-all duration-500" 
            :style="{ width: `${taskStore.dailyProgress}%` }"
          ></div>
        </div>
      </div>
    </div>

    <!-- 2. In Progress Tasks (Horizontal Scroll Section) -->
    <div class="space-y-3" v-if="inProgressTasks.length > 0">
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-bold text-text-primary">Tasks In Progress</h3>
        <RouterLink to="/tasks/today" class="text-xs font-semibold text-accent hover:underline">
          View all
        </RouterLink>
      </div>

      <!-- Horizontal Scrollable Container -->
      <div class="flex gap-4 overflow-x-auto pb-3 snap-x scrollbar-none">
        <div 
          v-for="task in inProgressTasks" 
          :key="task.id"
          class="shrink-0 w-64 card-elevated p-5 snap-start relative flex flex-col justify-between h-36"
        >
          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="status-badge status-badge-inprogress">
                {{ task.tags[0] || 'Task' }}
              </span>
              <span class="text-[10px] text-text-secondary font-medium">
                {{ dayjs(task.dueDate).format('D MMM') }}
              </span>
            </div>
            <h4 class="text-sm font-bold text-text-primary line-clamp-2 leading-snug">
              {{ task.title }}
            </h4>
          </div>

          <!-- Bottom check row -->
          <div class="flex items-center justify-between mt-2 pt-2 border-t border-border/50">
            <span class="text-[10px] uppercase font-bold tracking-wider" :class="task.priority === 'urgent' ? 'text-danger' : 'text-text-secondary'">
              {{ task.priority }}
            </span>
            <button 
              @click="toggleTask(task.id)"
              class="w-6 h-6 rounded-full border-2 border-accent flex items-center justify-center text-accent hover:bg-accent/5 transition-colors"
            >
              <svg class="w-3.5 h-3.5 fill-none stroke-current stroke-3" viewBox="0 0 24 24">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 3. Task Priority groups progress grid -->
    <div class="space-y-3">
      <h3 class="text-sm font-bold text-text-primary">Task Priorities</h3>
      
      <div class="grid grid-cols-2 gap-4">
        <!-- Urgent -->
        <div 
          @click="selectedPriority = selectedPriority === 'urgent' ? 'all' : 'urgent'"
          class="card-elevated p-4 cursor-pointer relative overflow-hidden transition-all duration-200"
          :class="[selectedPriority === 'urgent' ? 'ring-2 ring-danger border-transparent' : '']"
        >
          <div class="flex items-center justify-between mb-3">
            <span class="w-2 h-2 rounded-full bg-danger"></span>
            <span class="text-[10px] text-text-secondary font-bold">URGENT</span>
          </div>
          <h4 class="text-sm font-bold text-text-primary">Urgent Tasks</h4>
          <div class="mt-4 flex items-center justify-between text-xs text-text-secondary">
            <span>{{ taskStore.getPriorityStats('urgent').completed }}/{{ taskStore.getPriorityStats('urgent').total }} completed</span>
            <span class="font-bold text-text-primary">{{ taskStore.getPriorityStats('urgent').progress }}%</span>
          </div>
        </div>

        <!-- High -->
        <div 
          @click="selectedPriority = selectedPriority === 'high' ? 'all' : 'high'"
          class="card-elevated p-4 cursor-pointer relative overflow-hidden transition-all duration-200"
          :class="[selectedPriority === 'high' ? 'ring-2 ring-accent border-transparent' : '']"
        >
          <div class="flex items-center justify-between mb-3">
            <span class="w-2 h-2 rounded-full bg-accent"></span>
            <span class="text-[10px] text-text-secondary font-bold">HIGH</span>
          </div>
          <h4 class="text-sm font-bold text-text-primary">High Tasks</h4>
          <div class="mt-4 flex items-center justify-between text-xs text-text-secondary">
            <span>{{ taskStore.getPriorityStats('high').completed }}/{{ taskStore.getPriorityStats('high').total }} completed</span>
            <span class="font-bold text-text-primary">{{ taskStore.getPriorityStats('high').progress }}%</span>
          </div>
        </div>

        <!-- Medium -->
        <div 
          @click="selectedPriority = selectedPriority === 'medium' ? 'all' : 'medium'"
          class="card-elevated p-4 cursor-pointer relative overflow-hidden transition-all duration-200"
          :class="[selectedPriority === 'medium' ? 'ring-2 ring-[#7952eb] border-transparent' : '']"
        >
          <div class="flex items-center justify-between mb-3">
            <span class="w-2 h-2 rounded-full bg-[#7952eb]"></span>
            <span class="text-[10px] text-text-secondary font-bold">MEDIUM</span>
          </div>
          <h4 class="text-sm font-bold text-text-primary">Medium Tasks</h4>
          <div class="mt-4 flex items-center justify-between text-xs text-text-secondary">
            <span>{{ taskStore.getPriorityStats('medium').completed }}/{{ taskStore.getPriorityStats('medium').total }} completed</span>
            <span class="font-bold text-text-primary">{{ taskStore.getPriorityStats('medium').progress }}%</span>
          </div>
        </div>

        <!-- Low -->
        <div 
          @click="selectedPriority = selectedPriority === 'low' ? 'all' : 'low'"
          class="card-elevated p-4 cursor-pointer relative overflow-hidden transition-all duration-200"
          :class="[selectedPriority === 'low' ? 'ring-2 ring-[#ffd12e] border-transparent' : '']"
        >
          <div class="flex items-center justify-between mb-3">
            <span class="w-2 h-2 rounded-full bg-[#ffd12e]"></span>
            <span class="text-[10px] text-text-secondary font-bold">LOW</span>
          </div>
          <h4 class="text-sm font-bold text-text-primary">Low Tasks</h4>
          <div class="mt-4 flex items-center justify-between text-xs text-text-secondary">
            <span>{{ taskStore.getPriorityStats('low').completed }}/{{ taskStore.getPriorityStats('low').total }} completed</span>
            <span class="font-bold text-text-primary">{{ taskStore.getPriorityStats('low').progress }}%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 4. Dynamic Tasks List showing filtered selections -->
    <div class="space-y-4 pt-2">
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-bold text-text-primary">
          {{ selectedPriority !== 'all' ? `${selectedPriority} Priority` : 'All' }} Task Entries
        </h3>
        
        <!-- Search bar input -->
        <div class="relative w-44">
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Search..."
            class="w-full bg-surface border border-border text-xs rounded-full py-1.5 pl-7 pr-3 focus:outline-none focus:border-accent transition-colors"
          />
          <svg class="w-3.5 h-3.5 text-text-secondary absolute left-2.5 top-2.5 fill-none stroke-current" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
      </div>

      <!-- Task items list -->
      <div class="space-y-3" v-if="filteredTasks.length > 0">
        <div 
          v-for="task in filteredTasks"
          :key="task.id"
          class="card-elevated p-4 flex items-start justify-between gap-3 hover:-translate-y-px transition-transform duration-200"
        >
          <div class="flex items-start gap-3">
            <button 
              @click="toggleTask(task.id)"
              class="w-5 h-5 rounded border-2 border-border mt-0.5 flex items-center justify-center transition-colors"
              :class="[task.status === 'done' ? 'bg-success/20 border-success text-success' : 'hover:border-accent']"
            >
              <svg v-if="task.status === 'done'" class="w-3.5 h-3.5 fill-none stroke-current stroke-3" viewBox="0 0 24 24">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </button>
            <div class="space-y-1">
              <h4 
                class="text-sm font-bold text-text-primary"
                :class="[task.status === 'done' ? 'line-through text-text-secondary opacity-60' : '']"
              >
                {{ task.title }}
              </h4>
              <p class="text-xs text-text-secondary line-clamp-1" v-if="task.description">
                {{ task.description }}
              </p>
              <div class="flex items-center gap-2 mt-1">
                <span class="text-[10px] text-text-secondary font-medium">
                  Due {{ dayjs(task.dueDate).format('D MMM YYYY') }}
                </span>
                <span class="w-1 h-1 rounded-full bg-border"></span>
                <span class="text-[10px] font-semibold uppercase" :class="task.priority === 'urgent' ? 'text-danger' : 'text-accent'">
                  {{ task.priority }}
                </span>
              </div>
            </div>
          </div>

          <span class="status-badge" :class="[
            task.status === 'done' ? 'status-badge-done' : 
            task.status === 'in-progress' ? 'status-badge-inprogress' : 'status-badge-todo'
          ]">
            {{ task.status }}
          </span>
        </div>
      </div>
      
      <!-- Empty state -->
      <div v-else class="text-center py-10 bg-surface-elevated rounded-2xl border border-border border-dashed">
        <svg class="w-8 h-8 mx-auto text-text-secondary/40 fill-none stroke-current mb-2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" />
          <line x1="8" y1="12" x2="16" y2="12" />
        </svg>
        <p class="text-xs text-text-secondary">No tasks found matching query.</p>
      </div>
    </div>

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
