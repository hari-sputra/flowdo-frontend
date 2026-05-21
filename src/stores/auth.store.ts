import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, LoginPayload, RegisterPayload } from '@/types/auth.types'
import { authService } from '@/services/auth.service'
import type { AxiosError } from 'axios'
import type { ApiValidationError } from '@/types/auth.types'

export const useAuthStore = defineStore('auth', () => {
  const currentUser = ref<User | null>(null)
  const isLoading = ref(false)
  const errors = ref<Record<string, string[]>>({})

  const isAuthenticated = computed(() => currentUser.value !== null)

  const login = async (payload: LoginPayload) => {
    isLoading.value = true
    errors.value = {}
    try {
      const user = await authService.login(payload)
      currentUser.value = user
      return { success: true }
    } catch (error: any) {
      if (error.response?.status === 422) {
        const validationError = error.response.data as ApiValidationError
        errors.value = validationError.errors
      }
      return { success: false, errors: errors.value }
    } finally {
      isLoading.value = false
    }
  }

  const register = async (payload: RegisterPayload) => {
    isLoading.value = true
    errors.value = {}
    try {
      const user = await authService.register(payload)
      currentUser.value = user
      return { success: true }
    } catch (error: any) {
      if (error.response?.status === 422) {
        const validationError = error.response.data as ApiValidationError
        errors.value = validationError.errors
      }
      return { success: false, errors: errors.value }
    } finally {
      isLoading.value = false
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      currentUser.value = null
    }
  }

  const checkAuth = async () => {
    try {
      const user = await authService.fetchUser()
      currentUser.value = user
    } catch (error) {
      currentUser.value = null
    }
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
    isLoading,
    errors,
    login,
    register,
    logout,
    checkAuth,
    userInitials
  }
})
