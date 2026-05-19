<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <!-- Main entry point: Layout structures are resolved inside routing views -->
  <RouterView v-slot="{ Component }">
    <transition name="page-fade" mode="out-in">
      <component :is="Component" />
    </transition>
  </RouterView>
</template>
