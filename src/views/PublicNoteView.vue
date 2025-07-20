<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePublicNotesStore } from '@/stores/publicNotes'
import { useToastStore } from '@/stores/toast'
import { spacing, typography, colors, shadows, radii, animations, focusRings } from '@/design/tokens'
import { formatDistanceToNow } from 'date-fns'

const route = useRoute()
const router = useRouter()
const publicNotesStore = usePublicNotesStore()
const toast = useToastStore()

const isLoading = ref(false)
const username = ref(route.params.username as string)
const slug = ref(route.params.slug as string)

async function loadNote() {
    try {
        isLoading.value = true
        await publicNotesStore.fetchNoteBySlug(username.value, slug.value)
    } catch (err) {
        toast.addToast('Failed to load note', 'error')
        router.push(`/${username.value}/notes`)
    } finally {
        isLoading.value = false
    }
}

onMounted(() => {
    loadNote()
})
</script>

<template>
    <div class="public-note">
        <div class="container">
            <div v-if="isLoading" class="loading-state">
                <div class="loading-spinner"></div>
                <p>Loading note...</p>
            </div>

            <div v-else-if="publicNotesStore.currentNote" class="note-content">
                <header class="note-header">
                    <router-link :to="`/${username}/notes`" class="back-link">
                        ← Back to notes
                    </router-link>
                    <div class="meta">
                        Last updated {{ formatDistanceToNow(publicNotesStore.currentNote.updatedAt, { addSuffix: true }) }}
                    </div>
                </header>

                <h1 class="note-title">{{ publicNotesStore.currentNote.title || 'Untitled' }}</h1>
                <div class="note-body">
                    {{ publicNotesStore.currentNote.content }}
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.public-note {
    min-height: calc(100vh - 64px);
    background: v-bind('colors.neutral[50]');
    padding: v-bind('spacing.lg');
}

.container {
    max-width: 800px;
    margin: 0 auto;
}

.loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 300px;
    color: v-bind('colors.neutral[500]');
    gap: v-bind('spacing.md');
}

.loading-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid v-bind('colors.neutral[200]');
    border-top-color: v-bind('colors.primary[500]');
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

.note-content {
    background: white;
    border-radius: v-bind('radii.lg');
    box-shadow: v-bind('shadows.base');
    padding: v-bind('spacing.xl');
    border: 1px solid v-bind('colors.neutral[200]');
}

.note-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: v-bind('spacing.xl');
}

.back-link {
    color: v-bind('colors.primary[600]');
    text-decoration: none;
    font-weight: 500;
    transition: v-bind('animations.transitions.base');
}

.back-link:hover {
    color: v-bind('colors.primary[700]');
}

.meta {
    font-size: v-bind('typography.sizes.sm');
    color: v-bind('colors.neutral[500]');
}

.note-title {
    font-size: v-bind('typography.sizes["2xl"]');
    font-weight: 600;
    color: v-bind('colors.neutral[800]');
    margin-bottom: v-bind('spacing.lg');
}

.note-body {
    font-size: v-bind('typography.sizes.base');
    line-height: v-bind('typography.lineHeights.relaxed');
    color: v-bind('colors.neutral[700]');
    white-space: pre-wrap;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

@media (max-width: 768px) {
    .public-note {
        padding: v-bind('spacing.md');
    }

    .note-content {
        border-radius: v-bind('radii.base');
        padding: v-bind('spacing.lg');
    }
}
</style>
