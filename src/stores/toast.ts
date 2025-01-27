import { defineStore } from 'pinia'
import { ref } from 'vue'

export type ToastType = 'success' | 'error' | 'info' | 'warning'
export type ToastPosition = 'top-center' | 'top-right' | 'top-left' | 'bottom-center' | 'bottom-right' | 'bottom-left'

interface Toast {
    id: string
    message: string
    type: ToastType
    duration?: number
}

export const useToastStore = defineStore('toast', () => {
    const toasts = ref<Toast[]>([])
    const position = ref<ToastPosition>('top-center')

    function addToast(message: string, type: ToastType = 'info', duration: number = 3000) {
        const id = Math.random().toString(36).substring(2, 9)
        const toast = { id, message, type, duration }
        toasts.value.push(toast)

        if (duration > 0) {
            setTimeout(() => {
                removeToast(id)
            }, duration)
        }
    }

    function removeToast(id: string) {
        const index = toasts.value.findIndex(t => t.id === id)
        if (index > -1) {
            toasts.value.splice(index, 1)
        }
    }

    function setPosition(newPosition: ToastPosition) {
        position.value = newPosition
    }

    return {
        toasts,
        position,
        addToast,
        removeToast,
        setPosition
    }
}) 