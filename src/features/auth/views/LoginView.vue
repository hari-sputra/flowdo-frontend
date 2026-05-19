<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

const router = useRouter()
const authStore = useAuthStore()
const email = ref('')
const password = ref('')

const handleLogin = () => {
  if (email.value && password.value) {
    authStore.login(email.value)
    router.push('/dashboard')
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="text-center sm:text-left border-b border-border pb-4">
      <h2 class="font-heading text-2xl font-bold text-text-primary">
        Sign In
      </h2>
      <p class="text-xs text-text-secondary mt-1">
        Welcome back! Please enter your details.
      </p>
    </div>

    <form @submit.prevent="handleLogin" class="space-y-5">
      <!-- Email Input -->
      <div class="space-y-1.5">
        <label for="email" class="text-xs font-semibold text-text-secondary">
          Email Address
        </label>
        <input
          id="email"
          v-model="email"
          type="email"
          required
          placeholder="name@example.com"
          class="w-full bg-surface-elevated border border-border rounded-xl py-2.5 px-3.5 text-text-primary text-sm placeholder:text-text-secondary/40 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all duration-200"
        />
      </div>

      <!-- Password Input -->
      <div class="space-y-1.5">
        <label for="password" class="text-xs font-semibold text-text-secondary">
          Password
        </label>
        <input
          id="password"
          v-model="password"
          type="password"
          required
          placeholder="••••••••"
          class="w-full bg-surface-elevated border border-border rounded-xl py-2.5 px-3.5 text-text-primary text-sm placeholder:text-text-secondary/40 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all duration-200"
        />
      </div>

      <!-- Submit button -->
      <div class="pt-2">
        <button
          type="submit"
          class="w-full bg-accent hover:bg-accent/90 text-white font-semibold py-3 px-4 rounded-xl shadow-md transform active:scale-98 transition-all duration-200 cursor-pointer text-center text-sm"
        >
          Sign In
        </button>
      </div>
    </form>

    <div class="text-center pt-4 border-t border-border/50 text-xs">
      <span class="text-text-secondary">First time here?</span>
      <RouterLink to="/register" class="text-accent font-bold ml-1 hover:underline">
        Register a new account
      </RouterLink>
    </div>
  </div>
</template>

