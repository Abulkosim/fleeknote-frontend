<script setup lang="ts">
import { colors, animations } from '@/design/tokens'

defineProps<{
    size?: 'sm' | 'md' | 'lg'
    color?: string
}>()
</script>

<template>
    <div class="loading-spinner" :class="[size || 'md']">
        <div class="spinner"></div>
    </div>
</template>

<style scoped>
.loading-spinner {
    display: flex;
    align-items: center;
    justify-content: center;
}

.spinner {
    border-radius: 50%;
    border: 2px solid v-bind('colors.neutral[200]');
    border-top-color: v-bind('color || colors.primary[500]');
    animation: spin 0.8s linear infinite;
}

.sm .spinner {
    width: 16px;
    height: 16px;
    border-width: 2px;
}

.md .spinner {
    width: 24px;
    height: 24px;
    border-width: 2px;
}

.lg .spinner {
    width: 40px;
    height: 40px;
    border-width: 3px;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}
</style>