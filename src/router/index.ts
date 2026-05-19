import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/App.vue') // Placeholder until Auth feature
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/App.vue') // Placeholder until Task feature
    }
  ]
})

export default router
