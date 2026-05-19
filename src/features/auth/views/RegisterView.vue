<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const name = ref('')
const email = ref('')
const password = ref('')

const handleRegister = () => {
  // Mock registration: redirect to dashboard
  if (name.value && email.value && password.value) {
    router.push('/dashboard')
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="text-center sm:text-left border-b border-border pb-3">
      <h2 class="font-heading text-xl font-bold text-text-primary">
        Register Account
      </h2>
      <p class="font-mono text-xs text-text-secondary mt-1">
        Set up a new journal
      </p>
    </div>

    <form @submit.prevent="handleRegister" class="space-y-5">
      <!-- Full Name -->
      <div class="space-y-1">
        <label for="name" class="font-mono text-xs text-text-secondary uppercase tracking-wider block">
          Full Name
        </label>
        <input
          id="name"
          v-model="name"
          type="text"
          required
          placeholder="e.g. Hari Sputra"
          class="w-full bg-transparent border-b border-border py-2 px-1 text-text-primary font-body text-sm placeholder:text-text-secondary/40 focus:outline-none focus:border-accent transition-colors"
        />
      </div>

      <!-- Email Address -->
      <div class="space-y-1">
        <label for="email" class="font-mono text-xs text-text-secondary uppercase tracking-wider block">
          Email Address
        </label>
        <input
          id="email"
          v-model="email"
          type="email"
          required
          placeholder="e.g. hari@example.com"
          class="w-full bg-transparent border-b border-border py-2 px-1 text-text-primary font-body text-sm placeholder:text-text-secondary/40 focus:outline-none focus:border-accent transition-colors"
        />
      </div>

      <!-- Password -->
      <div class="space-y-1">
        <label for="password" class="font-mono text-xs text-text-secondary uppercase tracking-wider block">
          Password
        </label>
        <input
          id="password"
          v-model="password"
          type="password"
          required
          placeholder="Min. 8 characters"
          class="w-full bg-transparent border-b border-border py-2 px-1 text-text-primary font-body text-sm placeholder:text-text-secondary/40 focus:outline-none focus:border-accent transition-colors"
        />
      </div>

      <!-- Submit button -->
      <div class="pt-2">
        <button
          type="submit"
          class="w-full bg-accent hover:bg-accent/90 text-surface font-heading py-2.5 px-4 rounded border border-accent hover:border-accent/90 shadow-sm transition-all duration-200 cursor-pointer text-center text-sm font-semibold tracking-wide"
        >
          Create Notebook
        </button>
      </div>
    </form>

    <div class="text-center pt-4 border-t border-border/50 text-xs">
      <span class="text-text-secondary">Already have one?</span>
      <RouterLink to="/login" class="text-accent font-semibold ml-1.5 hover:underline">
        Sign in to existing account
      </RouterLink>
    </div>
  </div>
</template>
