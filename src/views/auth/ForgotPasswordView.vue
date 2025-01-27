<script setup lang="ts">
import { ref } from 'vue'
import { useToastStore } from '@/stores/toast'
import { useAuthStore } from '@/stores/auth'
import { spacing, typography, colors, shadows, radii, animations, focusRings } from '@/design/tokens'

const auth = useAuthStore()
const email = ref('')
const isLoading = ref(false)
const error = ref('')
const isEmailSent = ref(false)
const toast = useToastStore()

async function handleSubmit() {
    try {
        isLoading.value = true
        error.value = ''
        await auth.forgotPassword(email.value)
        isEmailSent.value = true
    } catch (err) {
        error.value = 'Failed to send reset email'
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
                <h1>Reset password</h1>
                <p>We'll send you instructions to reset your password</p>
            </div>

            <div v-if="!isEmailSent">
                <form @submit.prevent="handleSubmit" class="auth-form">
                    <div class="form-group">
                        <label for="email">Email address</label>
                        <input id="email" v-model="email" type="email" required placeholder="Enter your email" />
                    </div>

                    <button type="submit" class="submit-btn" :disabled="isLoading">
                        <span v-if="isLoading">Sending...</span>
                        <span v-else>Send reset instructions</span>
                    </button>
                </form>
            </div>

            <div v-else class="success-message">
                <div class="success-icon">✓</div>
                <h2>Check your email</h2>
                <p>We've sent password reset instructions to {{ email }}</p>
            </div>

            <div class="auth-footer">
                <p>
                    Remember your password?
                    <router-link to="/login" class="link">Back to login</router-link>
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

.success-message {
    text-align: center;
    padding: v-bind('spacing.xl') 0;
}

.success-icon {
    width: 48px;
    height: 48px;
    background: v-bind('colors.primary[50]');
    color: v-bind('colors.primary[600]');
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    margin: 0 auto v-bind('spacing.lg');
}

.success-message h2 {
    font-size: v-bind('typography.sizes.xl');
    color: v-bind('colors.neutral[800]');
    margin-bottom: v-bind('spacing.sm');
}

.success-message p {
    color: v-bind('colors.neutral[600]');
    font-size: v-bind('typography.sizes.base');
}
</style>