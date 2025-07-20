<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'
import { spacing, typography, colors, shadows, radii, animations, focusRings } from '@/design/tokens'
import { formatDistanceToNow } from 'date-fns'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import { useRouter } from 'vue-router'
const auth = useAuthStore()
const toast = useToastStore()
const router = useRouter()

const isLoading = ref(false)
const isDeleteAccountDialogOpen = ref(false)

onMounted(() => {
  loadUserData()
})

async function loadUserData() {
  try {
    isLoading.value = true
    await auth.getUserProfile()
  } catch (error) {
    toast.addToast('Failed to load user data', 'error')
  } finally {
    isLoading.value = false
  }
}

function openDeleteAccountDialog() {
  isDeleteAccountDialogOpen.value = true
}

async function deleteAccount() {
  try {
    await auth.deleteAccount()
    isDeleteAccountDialogOpen.value = false
    auth.logout()
    router.push('/')
  } catch (error) {
    toast.addToast('Failed to delete account', 'error')
  }
}
</script>

<template>
  <div class="profile-page">
    <div class="profile-container">
      <div v-if="isLoading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Loading profile...</p>
      </div>

      <div v-else-if="auth.user" class="profile-content">
        <div class="profile-header">
          <h1>Profile</h1>
          <p class="subtitle">Manage your account</p>
        </div>

        <div class="profile-info">
          <div class="info-group">
            <label>Username</label>
            <div class="info-value">{{ auth.user.username }}</div>
          </div>

          <div class="info-group">
            <label>Email</label>
            <div class="info-value">{{ auth.user.email }}</div>
          </div>

          <div class="info-group">
            <label>Member Since</label>
            <div class="info-value">
              {{ formatDistanceToNow(new Date(auth.user.createdAt), { addSuffix: true }) }}
            </div>
          </div>

          <Button label="Delete Account" @click="openDeleteAccountDialog" severity="danger" />
        </div>
      </div>
    </div>

    <Dialog v-model:visible="isDeleteAccountDialogOpen" header="Delete Account" :modal="true">
      <p>Are you sure you want to delete your account?</p>
      <template #footer>
        <Button label="Cancel" severity="secondary" @click="isDeleteAccountDialogOpen = false" text />
        <Button label="Delete" severity="danger" @click="deleteAccount" />
      </template>
    </Dialog>
  </div>
</template>

<style scoped>
.profile-page {
  min-height: calc(100vh - 64px);
  padding: v-bind('spacing.lg');
  background: v-bind('colors.neutral[50]');
}

.profile-container {
  max-width: 800px;
  margin: 0 auto;
  background: white;
  border-radius: v-bind('radii.lg');
  box-shadow: v-bind('shadows.base');
  border: 1px solid v-bind('colors.neutral[200]');
  padding: v-bind('spacing.xl');
}

.profile-header {
  margin-bottom: v-bind('spacing.xl');
}

.profile-header h1 {
  font-size: v-bind('typography.sizes["2xl"]');
  font-weight: 600;
  color: v-bind('colors.neutral[800]');
  margin-bottom: v-bind('spacing.xs');
}

.subtitle {
  color: v-bind('colors.neutral[500]');
  font-size: v-bind('typography.sizes.base');
}

.profile-info {
  display: flex;
  flex-direction: column;
  gap: v-bind('spacing.lg');
}

.info-group {
  display: flex;
  flex-direction: column;
  gap: v-bind('spacing.xs');
}

.info-group label {
  font-size: v-bind('typography.sizes.sm');
  font-weight: 500;
  color: v-bind('colors.neutral[600]');
}

.info-value {
  padding: v-bind('spacing.md');
  background: v-bind('colors.neutral[50]');
  border-radius: v-bind('radii.base');
  font-size: v-bind('typography.sizes.base');
  color: v-bind('colors.neutral[800]');
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  gap: v-bind('spacing.md');
  color: v-bind('colors.neutral[500]');
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid v-bind('colors.neutral[200]');
  border-top-color: v-bind('colors.primary[500]');
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .profile-page {
    padding: v-bind('spacing.md');
  }

  .profile-container {
    border-radius: v-bind('radii.base');
    padding: v-bind('spacing.lg');
  }
}
</style>