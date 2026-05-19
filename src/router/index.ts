import { createRouter, createWebHistory } from 'vue-router'
import AuthLayout from '@/layouts/AuthLayout.vue'
import AdaptiveRoot from '@/layouts/AdaptiveRoot.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/dashboard'
    },
    // Authentication Paths (Centered layout)
    {
      path: '/auth',
      component: AuthLayout,
      children: [
        {
          path: 'login',
          name: 'login',
          component: () => import('@/features/auth/views/LoginView.vue')
        },
        {
          path: 'register',
          name: 'register',
          component: () => import('@/features/auth/views/RegisterView.vue')
        }
      ]
    },
    // Redirect legacy route definitions to clean auth paths
    {
      path: '/login',
      redirect: '/auth/login'
    },
    {
      path: '/register',
      redirect: '/auth/register'
    },
    // Application Shell Paths (Adaptive layouts based on device)
    {
      path: '/',
      component: AdaptiveRoot,
      children: [
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('@/features/tasks/views/TaskDashboard.vue')
        },
        {
          path: 'tasks/today',
          name: 'today-tasks',
          component: () => import('@/features/tasks/views/TodayTasksView.vue')
        },
        {
          path: 'tasks/new',
          name: 'add-task',
          component: () => import('@/features/tasks/views/AddTaskView.vue')
        },
        {
          path: 'settings',
          name: 'settings',
          component: () => import('@/features/settings/views/SettingsView.vue')
        }
      ]
    },
    // Fallback redirect
    {
      path: '/:pathMatch(.*)*',
      redirect: '/dashboard'
    }
  ]
})

export default router
