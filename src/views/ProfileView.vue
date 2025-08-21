<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { Avatar, FloatLabel, InputText, Card, Button, Dialog, Skeleton, FileUpload } from 'primevue'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'
import { spacing, colors, shadows, radii, typography } from '@/design/tokens'
import { formatDistanceToNow } from 'date-fns'
import { useRouter } from 'vue-router'
const auth = useAuthStore()
const toast = useToastStore()
const router = useRouter()

const isLoading = ref(false)
const isDeleteAccountDialogOpen = ref(false)
const localUserName = ref('')
const localAvatar = ref('')
const avatarPreview = ref('')

const isUpdateDisabled = computed(() => {
  return localUserName.value.length > 24 || localUserName.value.length < 3
})
const firstLetter = computed(() => {
  return auth.user?.username?.charAt(0).toUpperCase() || ''
})

const formattedMemberSince = computed(() => {
  try {
    if (!auth.user?.createdAt) return 'Not available'
    return formatDistanceToNow(new Date(auth.user.createdAt), { addSuffix: true })
  } catch (error) {
    return 'Not available'
  }
})

onMounted(() => {
  loadUserData()
})

async function loadUserData() {
  try {
    isLoading.value = true
    await auth.getUserProfile()
    localUserName.value = auth.user?.username || ''
    localAvatar.value = auth.user?.avatar || ''
  } catch (error) {
    toast.addToast('Failed to load user data', 'error')
  } finally {
    isLoading.value = false
  }
}

function openDeleteAccountDialog() {
  isDeleteAccountDialogOpen.value = true
}

async function updateProfile() {
  try {
    if (!localUserName.value) {
      toast.addToast('Username cannot be empty', 'warning')
      return
    }

    await auth.updateProfile(localUserName.value, localAvatar.value)

    toast.addToast('Profile updated successfully', 'success')
  } catch (error) {
    toast.addToast('Failed to update profile', 'error')
  }
}

async function onAvatarSelect(event: any) {
  const file = event.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      const base64String = e.target?.result as string
      localAvatar.value = base64String
      avatarPreview.value = base64String
    }
    reader.readAsDataURL(file)
  }
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
    <Card v-if="isLoading" class="profile-container">
      <template #header>
        <div class="profile-header">
          <Skeleton shape="circle" size="4rem" />
        </div>
      </template>

      <template #title>
        <Skeleton width="60%" height="2rem" class="profile-title" />
      </template>

      <template #subtitle>
        <Skeleton width="40%" height="1.25rem" class="profile-subtitle" />
      </template>

      <template #content>
        <div class="profile-form">
          <Skeleton width="100%" height="2.5rem" />
          <Skeleton width="100%" height="2.5rem" />
          <Skeleton width="80%" height="2.5rem" />
        </div>
      </template>
      <template #footer>
        <div class="profile-actions">
          <Skeleton height="2rem" class="profile-action" />
          <Skeleton height="2rem" class="profile-action" />
        </div>
      </template>
    </Card>

    <Card v-else class="profile-container">
      <template #header>
        <div class="profile-header">
          <Avatar v-if="avatarPreview || auth.user?.avatar" :image="avatarPreview || auth.user?.avatar || ''"
            shape="circle" size="xlarge" class="profile-avatar" />
          <Avatar v-else :label="firstLetter" shape="circle" size="xlarge" class="profile-avatar" />
        </div>
      </template>

      <template #title>
        <h2 class="profile-title">{{ auth.user?.username }}</h2>
      </template>

      <template #subtitle>
        <p class="profile-subtitle">{{ 'Member since ' + formattedMemberSince }}</p>
      </template>

      <template #content>
        <div class="profile-form">
          <FloatLabel variant="on">
            <InputText id="username" v-model="localUserName" />
            <label for="username">Username</label>
          </FloatLabel>

          <FloatLabel variant="on">
            <InputText id="email" :model-value="auth.user?.email || ''" readonly />
            <label for="email">Email</label>
          </FloatLabel>

          <FileUpload mode="basic" name="avatar" accept="image/*" :maxFileSize="102400" chooseLabel="Choose Avatar"
            :auto="false" @select="onAvatarSelect" />
        </div>
      </template>

      <template #footer>
        <div class="profile-actions">
          <Button label="Delete Account" icon="pi pi-trash" @click="openDeleteAccountDialog" severity="danger" />
          <Button label="Update Profile" icon="pi pi-save" @click="updateProfile" severity="contrast"
            :disabled="isUpdateDisabled" />
        </div>
      </template>
    </Card>

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
  padding: v-bind("spacing.xl");
  background: v-bind("colors.neutral[50]");
}

.profile-container {
  max-width: 480px;
  margin: 0 auto;
  background: white;
  border-radius: v-bind("radii.md");
  border: 1px solid v-bind("colors.neutral[200]");
  box-shadow: v-bind("shadows.sm");
}

.profile-header {
  display: flex;
  justify-content: center;
  padding: v-bind("spacing.xl") 0 0;
}

.profile-avatar {
  border: 3px solid white;
  box-shadow: v-bind("shadows.sm");
}

.profile-title {
  margin: 0 auto;
  font-size: v-bind("typography.sizes.lg");
  font-weight: 500;
  text-align: center;
  color: v-bind("colors.neutral[900]");
}

.profile-subtitle {
  margin: 0 auto v-bind("spacing.md");
  text-align: center;
  color: v-bind("colors.neutral[500]");
  font-size: v-bind("typography.sizes.sm");
}

.profile-form {
  display: flex;
  flex-direction: column;
  gap: v-bind("spacing.md");
  padding: 0 v-bind("spacing.xl");
  margin-bottom: v-bind("spacing.md");
}

.profile-form input {
  width: 100%;
}

.profile-actions {
  display: flex;
  gap: v-bind("spacing.sm");
  padding: v-bind("spacing.md") v-bind("spacing.xl");
  border-top: 1px solid v-bind("colors.neutral[200]");
}

.profile-actions .p-button,
.profile-action {
  flex: 1;
}
</style>