<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <!-- Global transitions can be added here later -->
  <RouterView v-slot="{ Component }">
    <transition name="page-fade" mode="out-in">
      <component :is="Component" />
    </transition>
  </RouterView>
</template>
