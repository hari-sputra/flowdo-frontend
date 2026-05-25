<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { useTaskStore } from "@/stores/task.store";
import { useAuthStore } from "@/stores/auth.store";
import { useRouter } from "vue-router";
import dayjs from "dayjs";
import TaskCard from "../components/shared/TaskCard.vue";
import TaskSortControls from "../components/shared/TaskSortControls.vue";
import ConfirmDialog from "../components/shared/ConfirmDialog.vue";

const taskStore = useTaskStore();
const authStore = useAuthStore();
const router = useRouter();

const todayStr = dayjs().format("dddd, D MMMM");

onMounted(async () => {
  await Promise.all([taskStore.fetchTasks(), taskStore.fetchTags()]);
  taskStore.showDueTodayToast();
});

// Active tasks that are "In Progress" for the horizontal scroll section
const inProgressTasks = computed(() => {
  return taskStore.sortedTasks.filter((t) => t.status === "in-progress");
});

// Tasks filtered list (by default all, but can search/filter)
const searchQuery = ref("");
const selectedPriority = ref<"all" | "low" | "medium" | "high" | "urgent">(
  "all",
);
const showPriorities = ref(true);

const filteredTasks = computed(() => {
  return taskStore.sortedTasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (t.description || "")
        .toLowerCase()
        .includes(searchQuery.value.toLowerCase());
    const matchesPriority =
      selectedPriority.value === "all" || t.priority === selectedPriority.value;
    return matchesSearch && matchesPriority;
  });
});

const getPriorityColorClass = (priority: string) => {
  switch (priority) {
    case "urgent":
      return "bg-danger text-white";
    case "high":
      return "bg-accent text-white";
    case "medium":
      return "bg-[#7952eb] text-white";
    default:
      return "bg-[#ffd12e] text-text-primary";
  }
};

const toggleTask = (id: string) => {
  taskStore.toggleTaskStatus(id);
};

// Delete Confirmation
const showDeleteConfirm = ref(false);
const taskToDelete = ref<string | null>(null);

const confirmDelete = (id: string) => {
  taskToDelete.value = id;
  showDeleteConfirm.value = true;
};

const executeDelete = () => {
  if (taskToDelete.value) {
    taskStore.deleteTask(taskToDelete.value);
  }
  showDeleteConfirm.value = false;
  taskToDelete.value = null;
};
</script>

<template>
  <div class="space-y-6 font-body pb-10">
    <!-- Greeting & Date Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-xl font-bold text-text-primary">Manage your tasks</h1>
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

      <div v-if="taskStore.tasks.length > 0" class="space-y-4 relative z-10">
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
          <div class="bg-white h-full rounded-full transition-all duration-500"
            :style="{ width: `${taskStore.dailyProgress}%` }"></div>
        </div>
      </div>

      <!-- Empty state when no tasks exist at all -->
      <div v-else class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
        <div>
          <h3 class="text-sm font-semibold opacity-90">Welcome to FlowDo!</h3>
          <p class="text-xl font-bold mt-1">
            Ready to get organized?
          </p>
          <p class="text-xs opacity-75 mt-0.5">
            You don't have any tasks yet. Create one to get started!
          </p>
        </div>
        
        <RouterLink to="/tasks/new" class="shrink-0 inline-flex items-center justify-center gap-2 bg-white text-accent hover:bg-white/90 font-bold py-2.5 px-5 rounded-xl transition-all duration-200 cursor-pointer shadow-sm">
          <svg class="w-4 h-4 stroke-current stroke-2" viewBox="0 0 24 24" fill="none">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Task
        </RouterLink>
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
        <div v-for="task in inProgressTasks" :key="task.id"
          class="shrink-0 w-64 card-elevated p-5 snap-start relative flex flex-col justify-between h-36"
          @click="router.push(`/tasks/${task.id}/edit`)">
          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="status-badge status-badge-inprogress truncate max-w-[120px]">
                {{ task.tags && task.tags.length > 0 ? task.tags[0].name : "Task" }}
              </span>
              <span class="text-[10px] text-text-secondary font-medium shrink-0">
                {{ dayjs(task.dueDate).format("D MMM") }}
              </span>
            </div>
            <h4 class="text-sm font-bold text-text-primary line-clamp-2 leading-snug cursor-pointer hover:text-accent">
              {{ task.title }}
            </h4>
          </div>

          <!-- Bottom check row -->
          <div class="flex items-center justify-between mt-2 pt-2 border-t border-border/50">
            <span class="text-[10px] uppercase font-bold tracking-wider" :class="task.priority === 'urgent'
                ? 'text-danger'
                : 'text-text-secondary'
              ">
              {{ task.priority }}
            </span>
            <button @click.stop="toggleTask(task.id)"
              class="w-6 h-6 rounded-full border-2 border-accent flex items-center justify-center text-accent hover:bg-accent/5 transition-colors cursor-pointer">
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
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-bold text-text-primary">Task Priorities</h3>
        <button @click="showPriorities = !showPriorities" class="text-xs font-semibold text-text-secondary hover:text-accent transition-colors flex items-center gap-1 cursor-pointer">
          {{ showPriorities ? 'Hide' : 'Show' }}
          <svg class="w-4 h-4 transition-transform duration-200 stroke-2" :class="{'rotate-180': showPriorities}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      </div>

      <div v-show="showPriorities" class="grid grid-cols-2 gap-4">
        <!-- Urgent -->
        <div @click="
          selectedPriority = selectedPriority === 'urgent' ? 'all' : 'urgent'
          " class="card-elevated p-4 cursor-pointer relative overflow-hidden transition-all duration-200" :class="[
            selectedPriority === 'urgent'
              ? 'ring-2 ring-danger border-transparent'
              : '',
          ]">
          <div class="flex items-center justify-between mb-3">
            <span class="w-2 h-2 rounded-full bg-danger"></span>
            <span class="text-[10px] text-text-secondary font-bold">URGENT</span>
          </div>
          <h4 class="text-sm font-bold text-text-primary">Urgent Tasks</h4>
          <div class="mt-4 flex items-center justify-between text-xs text-text-secondary">
            <span>{{ taskStore.getPriorityStats("urgent").completed }}/{{
              taskStore.getPriorityStats("urgent").total
            }}
              completed</span>
            <span class="font-bold text-text-primary">{{ taskStore.getPriorityStats("urgent").progress }}%</span>
          </div>
        </div>

        <!-- High -->
        <div @click="
          selectedPriority = selectedPriority === 'high' ? 'all' : 'high'
          " class="card-elevated p-4 cursor-pointer relative overflow-hidden transition-all duration-200" :class="[
            selectedPriority === 'high'
              ? 'ring-2 ring-accent border-transparent'
              : '',
          ]">
          <div class="flex items-center justify-between mb-3">
            <span class="w-2 h-2 rounded-full bg-accent"></span>
            <span class="text-[10px] text-text-secondary font-bold">HIGH</span>
          </div>
          <h4 class="text-sm font-bold text-text-primary">High Tasks</h4>
          <div class="mt-4 flex items-center justify-between text-xs text-text-secondary">
            <span>{{ taskStore.getPriorityStats("high").completed }}/{{
              taskStore.getPriorityStats("high").total
            }}
              completed</span>
            <span class="font-bold text-text-primary">{{ taskStore.getPriorityStats("high").progress }}%</span>
          </div>
        </div>

        <!-- Medium -->
        <div @click="
          selectedPriority = selectedPriority === 'medium' ? 'all' : 'medium'
          " class="card-elevated p-4 cursor-pointer relative overflow-hidden transition-all duration-200" :class="[
            selectedPriority === 'medium'
              ? 'ring-2 ring-[#7952eb] border-transparent'
              : '',
          ]">
          <div class="flex items-center justify-between mb-3">
            <span class="w-2 h-2 rounded-full bg-[#7952eb]"></span>
            <span class="text-[10px] text-text-secondary font-bold">MEDIUM</span>
          </div>
          <h4 class="text-sm font-bold text-text-primary">Medium Tasks</h4>
          <div class="mt-4 flex items-center justify-between text-xs text-text-secondary">
            <span>{{ taskStore.getPriorityStats("medium").completed }}/{{
              taskStore.getPriorityStats("medium").total
            }}
              completed</span>
            <span class="font-bold text-text-primary">{{ taskStore.getPriorityStats("medium").progress }}%</span>
          </div>
        </div>

        <!-- Low -->
        <div @click="selectedPriority = selectedPriority === 'low' ? 'all' : 'low'"
          class="card-elevated p-4 cursor-pointer relative overflow-hidden transition-all duration-200" :class="[
            selectedPriority === 'low'
              ? 'ring-2 ring-[#ffd12e] border-transparent'
              : '',
          ]">
          <div class="flex items-center justify-between mb-3">
            <span class="w-2 h-2 rounded-full bg-[#ffd12e]"></span>
            <span class="text-[10px] text-text-secondary font-bold">LOW</span>
          </div>
          <h4 class="text-sm font-bold text-text-primary">Low Tasks</h4>
          <div class="mt-4 flex items-center justify-between text-xs text-text-secondary">
            <span>{{ taskStore.getPriorityStats("low").completed }}/{{
              taskStore.getPriorityStats("low").total
            }}
              completed</span>
            <span class="font-bold text-text-primary">{{ taskStore.getPriorityStats("low").progress }}%</span>
          </div>
        </div>
      </div>
    </div>

    <hr class="border-border border"/>

    <!-- 4. Dynamic Tasks List showing filtered selections -->
    <div class="space-y-4 pt-2">
      <div class="flex items-center justify-between flex-wrap gap-4">
        <h3 class="text-sm font-bold text-text-primary">
          {{
            selectedPriority !== "all" ? `${selectedPriority} Priority` : "All"
          }}
          Task Entries
        </h3>

        <!-- Search bar input -->
        <div class="relative w-full sm:w-44">
          <input v-model="searchQuery" type="text" placeholder="Search..."
            class="w-full bg-surface border border-accent text-xs rounded-full py-1.5 pl-7 pr-3 focus:outline-none focus:border-accent transition-colors" />
          <svg class="w-3.5 h-3.5 text-text-secondary absolute left-2.5 top-2.5 fill-none stroke-current"
            viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
      </div>

      <TaskSortControls :sortState="taskStore.sortState" @toggle-sort="taskStore.toggleSort" />

      <!-- Task items list -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" v-if="filteredTasks.length > 0">
        <TaskCard v-for="task in filteredTasks" :key="task.id" :task="task" @delete="confirmDelete" />
      </div>

      <!-- Empty state -->
      <div v-else class="text-center py-10 bg-surface-elevated rounded-2xl border border-border border-dashed">
        <svg class="w-8 h-8 mx-auto text-text-secondary/40 fill-none stroke-current mb-2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" />
          <line x1="8" y1="12" x2="16" y2="12" />
        </svg>
        <p class="text-xs text-text-secondary">
          No tasks found matching query.
        </p>
      </div>
    </div>

    <ConfirmDialog :open="showDeleteConfirm" title="Delete Task"
      message="Are you sure you want to delete this task? This action cannot be undone." @confirm="executeDelete"
      @cancel="showDeleteConfirm = false" />
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
