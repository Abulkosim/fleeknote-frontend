<script setup lang="ts">
import { onMounted } from 'vue'
import { DataTable, Column, Tag, Avatar } from 'primevue'
import { useAdminStore } from '@/stores/admin'
import { formatDistanceToNow } from 'date-fns'
import { spacing } from '@/design/tokens'

const adminStore = useAdminStore()

onMounted(async () => {
  await adminStore.fetchUsers()
})

const getRoleSeverity = (role: string) => {
  return role === 'admin' ? 'danger' : 'info'
}
</script>

<template>
  <div class="admin-users-page">
    <DataTable :value="adminStore.users" :loading="adminStore.isLoading" paginator :rows="10"
      :rowsPerPageOptions="[10, 25, 50]" sortMode="multiple" removableSort stripedRows showGridlines>
      <Column field="username" header="Username" sortable>
        <template #body="{ data }">
          <div class="user-cell">
            <Avatar v-if="data.avatar" :image="data.avatar" shape="circle" size="small" class="user-avatar" />
            <Avatar v-else :label="data.username.charAt(0).toUpperCase()" shape="circle" size="small"
              class="user-avatar" />
            <span>{{ data.username }}</span>
          </div>
        </template>
      </Column>

      <Column field="email" header="Email" sortable />

      <Column field="role" header="Role" sortable>
        <template #body="{ data }">
          <Tag :value="data.role.toUpperCase()" :severity="getRoleSeverity(data.role)" />
        </template>
      </Column>

      <Column field="createdAt" header="Joined" sortable>
        <template #body="{ data }">
          {{ formatDistanceToNow(new Date(data.createdAt), { addSuffix: true }) }}
        </template>
      </Column>

      <Column field="updatedAt" header="Last Updated" sortable>
        <template #body="{ data }">
          {{ formatDistanceToNow(new Date(data.updatedAt), { addSuffix: true }) }}
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<style scoped>
.admin-users-page {
  padding: v-bind('spacing.lg');
  max-width: 1400px;
  margin: 0 auto;
}

.user-cell {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-avatar {
  flex-shrink: 0;
}
</style>
