import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
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

export const useAuthStore = defineStore('auth', () => {
    const user = ref<User | null>(JSON.parse(localStorage.getItem('user') ?? 'null'))
    const token = ref<string | null>(localStorage.getItem('token'))
    const error = ref('')

    const isAuthenticated = computed(() => !!token.value)

    async function login(email: string, password: string) {
        try {
            const { data } = await apiClient.post('/auth/login', {
                email,
                password
            })

            user.value = data.user
            token.value = data.token
            localStorage.setItem('token', data.token)
            localStorage.setItem('user', JSON.stringify(data.user))
            localStorage.setItem('username', data.user.username)
        } catch (err: unknown) {
            error.value = extractErrorMessage(err, 'Login failed')
            throw err  
        }
    }

    async function signup(username: string, email: string, password: string) {
        try {
            const { data } = await apiClient.post('/auth/register', {
                username,
                email,
                password
            })

            user.value = data.user
            token.value = data.token
            localStorage.setItem('token', data.token)
            localStorage.setItem('user', JSON.stringify(data.user))
            localStorage.setItem('username', data.user.username)
        } catch (err: unknown) {
            error.value = extractErrorMessage(err, 'Registration failed')
            throw err  
        }
    }

    async function forgotPassword(email: string) {
        try {
            await apiClient.post('/auth/forgot-password', { email })
        } catch (error) {
            console.error('Forgot password error:', error)
            throw error
        }
    }

    async function resetPassword(token: string, password: string) {
        try {
            await apiClient.post(`/auth/reset-password/${token}`, {
                password
            })
        } catch (error) {
            console.error('Reset password error:', error)
            throw error
        }
    }

    function logout() {
        user.value = null
        token.value = null

        localStorage.removeItem('token')
        localStorage.removeItem('user')
        localStorage.removeItem('username')
    }

    async function getUserProfile() {
        if (token.value) {
            try {
                const { data } = await apiClient.get('/auth/me')
                user.value = data
                localStorage.setItem('user', JSON.stringify(data))
            } catch (error) {
                console.error('Load user error:', error)
                logout()
            }
        }
    }

    async function deleteAccount() {
        try {
            await apiClient.delete('/auth/delete')
        } catch (error) {
            console.error('Delete account error:', error)
            throw error
        }
    }

    async function updateProfile(username: string, avatar: string) {
        try {
            await apiClient.post('/auth/update-profile', { username, avatar })
            if (user.value) {
                user.value.username = username
                user.value.avatar = avatar
            }
        } catch (error) {
            console.error('Update profile error:', error)
            throw error
        }
    }

    return {
        user,
        token,
        isAuthenticated,
        login,
        signup,
        logout,
        forgotPassword,
        resetPassword,
        getUserProfile,
        deleteAccount,
        updateProfile
    }
}) 