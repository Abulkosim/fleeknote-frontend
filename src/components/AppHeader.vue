<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { colors, spacing, typography, radii } from '@/design/tokens'

const auth = useAuthStore()
const router = useRouter()

function handleLogout() {
  auth.logout()
  router.push('/')
}
</script>

<template>
  <header class="header">
    <div class="header-content">
      <router-link to="/" class="logo">FleekNote</router-link>

      <div v-if="auth.isAuthenticated" class="nav">
        <button @click="handleLogout" class="logout-btn">Logout</button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.header {
  border-bottom: 1px solid v-bind('colors.neutral[200]');
  background: white;
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: v-bind('spacing.md') v-bind('spacing.lg');
  height: 64px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: v-bind('typography.sizes.lg');
  font-weight: 500;
  color: v-bind('colors.neutral[800]');
  text-decoration: none;
  letter-spacing: -0.01em;
}

.logout-btn {
  padding: v-bind('spacing.sm') v-bind('spacing.lg');
  border: 1px solid v-bind('colors.neutral[200]');
  background: white;
  border-radius: v-bind('radii.base');
  color: v-bind('colors.neutral[600]');
  cursor: pointer;
  font-size: v-bind('typography.sizes.sm');
  transition: all 0.2s;
  font-weight: 500;
}

.logout-btn:hover {
  border-color: v-bind('colors.neutral[300]');
  color: v-bind('colors.neutral[800]');
}
</style>