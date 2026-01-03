import { defineStore } from 'pinia'
import { ref } from 'vue'
import apiClient from '@/api/client'
import { extractErrorMessage } from '@/utils/errors'

interface User {
  id: string
  username: string
  email: string
  createdAt: string
  updatedAt: string
  role: string
  avatar: string | null
}

export const useAdminStore = defineStore('admin', () => {
    const users = ref<User[]>([])
    const isLoading = ref(false)
    const error = ref('')

    async function fetchUsers() {
        try {
            isLoading.value = true
            error.value = ''
            const { data } = await apiClient.get('/admin/users')
            users.value = data.users as User[];
        } catch (err: unknown) {
            error.value = extractErrorMessage(err, 'Failed to fetch users')
            throw err
        } finally {
            isLoading.value = false
        }
    }

    return {
        users,
        isLoading,
        error,
        fetchUsers
    }
})

