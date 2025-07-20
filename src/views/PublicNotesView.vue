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

async function loadNotes() {
    try {
        isLoading.value = true
        await publicNotesStore.fetchUserNotes(username.value)
    } catch (err) {
        toast.addToast('Failed to load notes', 'error')
    } finally {
        isLoading.value = false
    }
}

function handleNoteClick(slug: string) {
    router.push(`/${username.value}/notes/${slug}`)
}

onMounted(() => {
    loadNotes()
})
</script>

<template>
    <div class="public-notes">
        <div class="container">
            <header class="header">
                <h2>{{ username }}'s Public Notes</h2>
            </header>

            <div v-if="isLoading" class="loading-state">
                <div class="loading-spinner"></div>
                <p>Loading notes...</p>
            </div>

            <div v-else-if="publicNotesStore.notes.length === 0" class="empty-state">
                <p>No public notes found</p>
            </div>

            <div v-else class="notes-grid">
                <div v-for="note in publicNotesStore.notes" :key="note._id" class="note-card"
                    @click="handleNoteClick(note.slug)">
                    <h2 class="note-title">{{ note.title || 'Untitled' }}</h2>
                    <p class="note-preview">{{ note.content.slice(0, 150) }}{{ note.content.length > 150 ? '...' : ''
                    }}</p>
                    <div class="note-meta">
                        <span>Last updated {{ formatDistanceToNow(note.updatedAt, { addSuffix: true }) }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.public-notes {
    min-height: calc(100vh - 64px);
    background: v-bind('colors.neutral[50]');
    padding: v-bind('spacing.lg');
}

.container {
    max-width: 1024px;
    margin: 0 auto;
}

.header {
    margin-bottom: v-bind('spacing.md');
}

.header h1 {
    font-size: v-bind('typography.sizes["2xl"]');
    font-weight: 600;
    color: v-bind('colors.neutral[800]');
}

.notes-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: v-bind('spacing.md');
}

.note-card {
    background: white;
    border-radius: v-bind('radii.lg');
    box-shadow: v-bind('shadows.base');
    padding: v-bind('spacing.md') v-bind('spacing.lg');
    border: 1px solid v-bind('colors.neutral[200]');
    cursor: pointer;
    transition: v-bind('animations.transitions.base');
}

.note-card:hover {
    transform: translateY(-2px);
    box-shadow: v-bind('shadows.lg');
}

.note-title {
    font-size: v-bind('typography.sizes.lg');
    font-weight: 600;
    color: v-bind('colors.neutral[800]');
    margin-bottom: v-bind('spacing.sm');
}

.note-preview {
    font-size: v-bind('typography.sizes.base');
    color: v-bind('colors.neutral[600]');
    line-height: v-bind('typography.lineHeights.relaxed');
    margin-bottom: v-bind('spacing.md');
    min-height: 60px;
}

.note-meta {
    font-size: v-bind('typography.sizes.sm');
    color: v-bind('colors.neutral[500]');
}

.loading-state,
.empty-state {
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

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

@media (max-width: 768px) {
    .public-notes {
        padding: v-bind('spacing.md');
    }

    .notes-grid {
        grid-template-columns: 1fr;
    }
}
</style>
