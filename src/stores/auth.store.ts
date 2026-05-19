import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import { computed } from 'vue'

export interface User {
  id: string
  name: string
  email: string
  avatarUrl?: string
}

export const useAuthStore = defineStore('auth', () => {
  const currentUser = useLocalStorage<User | null>('flowdo_user', {
    id: 'user-1',
    name: 'Hari Saputra',
    email: 'hari.saputra.dev@gmail.com'
  })

  const isAuthenticated = computed(() => currentUser.value !== null)

  const login = (email: string) => {
    currentUser.value = {
      id: 'user-1',
      name: 'Hari Saputra',
      email: email
    }
  }

  const logout = () => {
    currentUser.value = null
  }

  const userInitials = computed(() => {
    if (!currentUser.value) return '?'
    const parts = currentUser.value.name.split(' ')
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase()
    }
    return parts[0].substring(0, 2).toUpperCase()
  })

  return {
    currentUser,
    isAuthenticated,
    login,
    logout,
    userInitials
  }
})
