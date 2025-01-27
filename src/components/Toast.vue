<script setup lang="ts">
import { computed } from 'vue'
import { useToastStore, type ToastType } from '@/stores/toast'
import { colors, spacing, typography, shadows, radii, animations } from '@/design/tokens'
import { PhCheckCircle, PhWarning, PhInfo, PhX, PhXCircle } from "@phosphor-icons/vue"

const toastStore = useToastStore()

const positionClasses = computed(() => {
    const pos = toastStore.position
    return {
        top: pos.startsWith('top') ? '0px' : 'auto',
        bottom: pos.startsWith('bottom') ? '0px' : 'auto',
        left: pos.includes('left') ? '0px'
            : pos.includes('center') ? '50%' : 'auto',
        right: pos.includes('right') ? '0px' : 'auto',
        transform: pos.includes('center') ? 'translateX(-50%)' : 'none'
    }
})

const getIcon = (type: ToastType) => {
    switch (type) {
        case 'success':
            return PhCheckCircle
        case 'error':
            return PhXCircle
        case 'warning':
            return PhWarning
        default:
            return PhInfo
    }
}

const getTypeStyles = (type: ToastType) => {
    switch (type) {
        case 'success':
            return {
                background: '#f0fdf4',
                border: `1px solid #bbf7d0`,
                icon: '#16a34a'
            }
        case 'error':
            return {
                background: '#FEF2F2',
                border: '1px solid #FECACA',
                icon: '#DC2626'
            }
        case 'warning':
            return {
                background: '#FFFBEB',
                border: '1px solid #FEF3C7',
                icon: '#D97706'
            }
        default:
            return {
                background: '#f8fafc',
                border: `1px solid #e2e8f0`,
                icon: '#475569'
            }
    }
}
</script>

<template>
    <div class="toast-container" :style="positionClasses">
        <TransitionGroup name="toast">
            <div v-for="toast in toastStore.toasts" :key="toast.id" class="toast" :style="getTypeStyles(toast.type)">
                <component :is="getIcon(toast.type)" :size="20" class="toast-icon"
                    :style="{ color: getTypeStyles(toast.type).icon }" />
                <span class="toast-message">{{ toast.message }}</span>
                <button @click="toastStore.removeToast(toast.id)" class="close-button">
                    <PhX :size="16" />
                </button>
            </div>
        </TransitionGroup>
    </div>
</template>

<style scoped>
.toast-container {
    position: fixed;
    z-index: 9999;
    padding: v-bind('spacing.md');
    pointer-events: none;
    max-width: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: v-bind('spacing.sm');
}

.toast {
    pointer-events: auto;
    display: flex;
    align-items: center;
    gap: v-bind('spacing.sm');
    padding: v-bind('spacing.md');
    border-radius: v-bind('radii.lg');
    box-shadow: v-bind('shadows.lg');
    max-width: 400px;
    width: 100%;
}

.toast-message {
    flex: 1;
    font-size: v-bind('typography.sizes.sm');
    color: v-bind('colors.neutral[800]');
}

.close-button {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2px;
    border-radius: v-bind('radii.base');
    border: none;
    background: transparent;
    color: v-bind('colors.neutral[500]');
    cursor: pointer;
    transition: v-bind('animations.transitions.base');
}

.close-button:hover {
    background: rgba(0, 0, 0, 0.05);
    color: v-bind('colors.neutral[700]');
}

.toast-enter-active,
.toast-leave-active {
    transition: all 0.2s ease-out;
}

.toast-enter-from {
    opacity: 0;
    transform: translateY(-20px);
}

.toast-leave-to {
    opacity: 0;
    transform: translateY(-20px);
}
</style>