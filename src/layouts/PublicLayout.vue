<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppHeader from '../components/AppHeader.vue'
</script>

<template>
  <div class="public-layout">
    <AppHeader />

    <RouterView />
  </div>
</template>

<style scoped>
.public-layout {
  min-height: 100vh;
}
</style> 