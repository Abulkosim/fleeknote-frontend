<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'
import { spacing, typography, colors, shadows, radii, animations, focusRings } from '@/design/tokens'
import { extractErrorMessage } from '@/utils/errors'

const auth = useAuthStore()
const router = useRouter()
const toast = useToastStore()

const form = ref({
    username: '',
    email: '',
    password: '',
})

const isLoading = ref(false)
const error = ref('')

async function handleSubmit() {
    try {
        isLoading.value = true
        error.value = ''
        await auth.signup(form.value.username, form.value.email, form.value.password)
        router.push('/notes')
    } catch (err: unknown) {
        error.value = extractErrorMessage(err, 'Failed to create account')
        toast.addToast(error.value, 'error')
    } finally {
        isLoading.value = false
    }
}
</script>

<template>
    <div class="auth-page">
        <div class="auth-container">
            <div class="auth-header">
                <h1>Create account</h1>
                <p>Start your writing journey today</p>
            </div>

            <form @submit.prevent="handleSubmit" class="auth-form">
                <div class="form-group">
                    <label for="username">Username</label>
                    <input id="username" v-model="form.username" type="text" required placeholder="Choose a username" />
                </div>

                <div class="form-group">
                    <label for="email">Email</label>
                    <input id="email" v-model="form.email" type="email" required placeholder="you@example.com" />
                </div>

                <div class="form-group">
                    <label for="password">Password</label>
                    <input id="password" v-model="form.password" type="password" required
                        placeholder="Create a password" />
                </div>

                <button type="submit" class="submit-btn" :disabled="isLoading">
                    <span v-if="isLoading">Creating account...</span>
                    <span v-else>Create account</span>
                </button>
            </form>

            <div class="auth-footer">
                <p>
                    Already have an account?
                    <router-link to="/login" class="link">Sign in</router-link>
                </p>
            </div>
        </div>
    </div>
</template>

<style scoped>
.auth-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: v-bind('spacing.md');
    background: v-bind('colors.neutral[50]');
}

.auth-container {
    width: 100%;
    max-width: 400px;
    background: white;
    border-radius: v-bind('radii.lg');
    box-shadow: v-bind('shadows.lg');
    padding: v-bind('spacing.xl');
    animation: fadeIn 0.5s ease-out;
}

.auth-header {
    text-align: center;
    margin-bottom: v-bind('spacing.xl');
}

.auth-header h1 {
    font-size: v-bind('typography.sizes["2xl"]');
    font-weight: 600;
    color: v-bind('colors.neutral[800]');
    margin-bottom: v-bind('spacing.xs');
}

.auth-header p {
    color: v-bind('colors.neutral[500]');
    font-size: v-bind('typography.sizes.base');
}

.auth-form {
    display: flex;
    flex-direction: column;
    gap: v-bind('spacing.lg');
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: v-bind('spacing.xs');
}

.password-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

label {
    font-size: v-bind('typography.sizes.sm');
    font-weight: 500;
    color: v-bind('colors.neutral[700]');
}

input {
    padding: v-bind('spacing.md');
    border: 1px solid v-bind('colors.neutral[200]');
    border-radius: v-bind('radii.base');
    font-size: v-bind('typography.sizes.base');
    color: v-bind('colors.neutral[800]');
    transition: v-bind('animations.transitions.base');
}

input:focus {
    outline: none;
    border-color: v-bind('colors.primary[500]');
    box-shadow: v-bind('focusRings.base');
}

.submit-btn {
    padding: v-bind('spacing.md');
    background: v-bind('colors.primary[600]');
    color: white;
    border: none;
    border-radius: v-bind('radii.base');
    font-weight: 500;
    font-size: v-bind('typography.sizes.base');
    cursor: pointer;
    transition: v-bind('animations.transitions.base');
}

.submit-btn:hover:not(:disabled) {
    background: v-bind('colors.primary[700]');
}

.submit-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}

.auth-footer {
    margin-top: v-bind('spacing.xl');
    text-align: center;
    color: v-bind('colors.neutral[600]');
    font-size: v-bind('typography.sizes.sm');
}

.link,
.forgot-link {
    color: v-bind('colors.primary[600]');
    text-decoration: none;
    font-weight: 500;
    transition: v-bind('animations.transitions.base');
}

.link:hover,
.forgot-link:hover {
    color: v-bind('colors.primary[700]');
    text-decoration: underline;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>