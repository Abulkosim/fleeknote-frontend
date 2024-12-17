import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import apiClient from '@/api/client'

interface User {
    id: string
    username: string
    email: string
}

export const useAuthStore = defineStore('auth', () => {
    const user = ref<User | null>(null)
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
            localStorage.clear()
            localStorage.setItem('token', data.token)            
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Login failed'
            throw error.value
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
            localStorage.clear()
            localStorage.setItem('token', data.token)
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Registration failed'
            throw error.value
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
            await apiClient.post('/auth/reset-password', {
                token,
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
        localStorage.clear()
        localStorage.removeItem('token')
    }

    // Load user data if token exists
    async function loadUser() {
        if (token.value) {
            try {
                const { data } = await apiClient.get('/auth/me')
                user.value = data.user
            } catch (error) {
                console.error('Load user error:', error)
                logout()
            }
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
        loadUser
    }
}) 