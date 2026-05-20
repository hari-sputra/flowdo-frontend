import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import { computed } from 'vue'
import type { User, LoginPayload, RegisterPayload } from '@/types/auth.types'
import { validateEmail, validatePassword, validateRequired } from '@/utils/validation.utils'

export const useAuthStore = defineStore('auth', () => {
  const currentUser = useLocalStorage<User | null>('flowdo_user', {
    id: 'user-1',
    name: 'Hari Saputra',
    email: 'hari.saputra.dev@gmail.com'
  })

  const isAuthenticated = computed(() => currentUser.value !== null)

  const login = (payload: LoginPayload) => {
    const errors: Record<string, string> = {}
    
    const emailErr = validateEmail(payload.email)
    if (emailErr) errors.email = emailErr
    
    const passErr = validatePassword(payload.password)
    if (passErr) errors.password = passErr
    
    if (Object.keys(errors).length > 0) {
      return { success: false, errors }
    }
    
    currentUser.value = {
      id: 'user-1',
      name: 'Hari Saputra',
      email: payload.email
    }
    return { success: true }
  }

  const register = (payload: RegisterPayload) => {
    const errors: Record<string, string> = {}
    
    const nameErr = validateRequired(payload.name, 'Name')
    if (nameErr) errors.name = nameErr
    
    const emailErr = validateEmail(payload.email)
    if (emailErr) errors.email = emailErr
    
    const passErr = validatePassword(payload.password)
    if (passErr) errors.password = passErr
    
    if (Object.keys(errors).length > 0) {
      return { success: false, errors }
    }
    
    currentUser.value = {
      id: 'user-2',
      name: payload.name,
      email: payload.email
    }
    return { success: true }
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
    register,
    logout,
    userInitials
  }
})
