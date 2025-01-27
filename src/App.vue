<script setup lang="ts">
import { RouterView } from 'vue-router'
import Toast from '@/components/Toast.vue'
</script>

<template>
  <div class="app-container">
    <RouterView />
    <Toast />
  </div>
</template>

<style>
html,
body {
  margin: 0;
  padding: 0;
  min-height: 100vh;
}

.app-container {
  min-height: 100vh;
  position: relative;
}
</style>
