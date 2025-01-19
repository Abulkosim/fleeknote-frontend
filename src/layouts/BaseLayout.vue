<script setup lang="ts">
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import AppHeader from '../components/AppHeader.vue'
import AppSidebar from '../components/AppSidebar.vue'
import { useAuthStore } from '../stores/auth'
import { colors, spacing, radii, shadows } from '../design/tokens'

const auth = useAuthStore()

const route = useRoute()

const showSidebar = computed(() => {
  return auth.isAuthenticated && route.path !== '/'
})
</script>

<template>
  <div class="app-layout">
    <AppHeader />

    <main class="app-main">
      <AppSidebar v-if="showSidebar" />
      <div class="app-content">
        <RouterView />
      </div>
    </main>
  </div>
</template>

<style scoped>
.app-layout {
  min-height: 100vh;
  background: v-bind('colors.neutral[50]');
}

.app-main {
  display: flex;
  gap: v-bind('spacing.md');
  padding: v-bind('spacing.md');
  max-width: 1400px;
  margin: 0 auto;
}

.app-content {
  flex: 1;
  background: white;
  border-radius: v-bind('radii.lg');
  box-shadow: v-bind('shadows.base');
  border: 1px solid v-bind('colors.neutral[200]');
  padding: v-bind('spacing.lg');
}
</style>