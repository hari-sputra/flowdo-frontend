<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

const router = useRouter()
const authStore = useAuthStore()

const name = ref('')
const email = ref('')
const password = ref('')
const passwordConfirmation = ref('')
const errors = ref<Record<string, string[]>>({})

const handleRegister = async () => {
  errors.value = {}
  
  const result = await authStore.register({
    name: name.value,
    email: email.value,
    password: password.value,
    password_confirmation: passwordConfirmation.value
  })
  
  if (result.success) {
    router.push('/dashboard')
  } else if (result.errors) {
    errors.value = result.errors
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="text-center sm:text-left border-b border-border pb-4">
      <h2 class="font-heading text-2xl font-bold text-text-primary">
        Create Account
      </h2>
      <p class="text-xs text-text-secondary mt-1">
        Sign up to start organizing your tasks.
      </p>
    </div>

    <form @submit.prevent="handleRegister" class="space-y-4" novalidate>
      <!-- Name Input -->
      <div class="space-y-1.5">
        <label for="name" class="text-xs font-semibold" :class="errors.name ? 'text-danger' : 'text-text-secondary'">
          Full Name
        </label>
        <input
          id="name"
          v-model="name"
          type="text"
          required
          placeholder="John Doe"
          class="w-full bg-surface-elevated border rounded-xl py-2.5 px-3.5 text-text-primary text-sm placeholder:text-text-secondary/40 focus:outline-none focus:ring-1 transition-all duration-200"
          :class="errors.name ? 'border-danger focus:border-danger focus:ring-danger' : 'border-border focus:border-accent focus:ring-accent'"
        />
        <p v-if="errors.name" class="text-[10px] font-medium text-danger mt-1">{{ errors.name[0] }}</p>
      </div>

      <!-- Email Input -->
      <div class="space-y-1.5">
        <label for="email" class="text-xs font-semibold" :class="errors.email ? 'text-danger' : 'text-text-secondary'">
          Email Address
        </label>
        <input
          id="email"
          v-model="email"
          type="email"
          required
          placeholder="name@example.com"
          class="w-full bg-surface-elevated border rounded-xl py-2.5 px-3.5 text-text-primary text-sm placeholder:text-text-secondary/40 focus:outline-none focus:ring-1 transition-all duration-200"
          :class="errors.email ? 'border-danger focus:border-danger focus:ring-danger' : 'border-border focus:border-accent focus:ring-accent'"
        />
        <p v-if="errors.email" class="text-[10px] font-medium text-danger mt-1">{{ errors.email[0] }}</p>
      </div>

      <!-- Password Input -->
      <div class="space-y-1.5">
        <label for="password" class="text-xs font-semibold" :class="errors.password ? 'text-danger' : 'text-text-secondary'">
          Password
        </label>
        <input
          id="password"
          v-model="password"
          type="password"
          required
          placeholder="Min. 8 characters"
          class="w-full bg-surface-elevated border rounded-xl py-2.5 px-3.5 text-text-primary text-sm placeholder:text-text-secondary/40 focus:outline-none focus:ring-1 transition-all duration-200"
          :class="errors.password ? 'border-danger focus:border-danger focus:ring-danger' : 'border-border focus:border-accent focus:ring-accent'"
        />
        <p v-if="errors.password" class="text-[10px] font-medium text-danger mt-1">{{ errors.password[0] }}</p>
      </div>

      <!-- Password Confirmation Input -->
      <div class="space-y-1.5">
        <label for="passwordConfirmation" class="text-xs font-semibold" :class="errors.password_confirmation ? 'text-danger' : 'text-text-secondary'">
          Confirm Password
        </label>
        <input
          id="passwordConfirmation"
          v-model="passwordConfirmation"
          type="password"
          required
          placeholder="Confirm password"
          class="w-full bg-surface-elevated border rounded-xl py-2.5 px-3.5 text-text-primary text-sm placeholder:text-text-secondary/40 focus:outline-none focus:ring-1 transition-all duration-200"
          :class="errors.password_confirmation ? 'border-danger focus:border-danger focus:ring-danger' : 'border-border focus:border-accent focus:ring-accent'"
        />
        <p v-if="errors.password_confirmation" class="text-[10px] font-medium text-danger mt-1">{{ errors.password_confirmation[0] }}</p>
      </div>

      <!-- Submit button -->
      <div class="pt-2">
        <button
          type="submit"
          :disabled="authStore.isLoading"
          class="w-full bg-accent hover:bg-accent/90 text-white font-semibold py-3 px-4 rounded-xl shadow-md transform active:scale-98 transition-all duration-200 cursor-pointer text-center text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="authStore.isLoading">Creating account...</span>
          <span v-else>Create Account</span>
        </button>
      </div>
    </form>

    <!-- Footer links -->
    <div class="text-center text-xs text-text-secondary pt-2">
      Already have an account? 
      <router-link to="/auth/login" class="text-accent font-semibold hover:underline">
        Sign in
      </router-link>
    </div>
  </div>
</template>
