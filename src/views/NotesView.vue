<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useNotesStore } from '@/stores/notes'
import { useRoute, useRouter } from 'vue-router'
import { spacing, typography, colors, shadows, radii, animations, focusRings } from '@/design/tokens'

const notesStore = useNotesStore()
const route = useRoute()
const router = useRouter()

const currentNote = ref({
    _id: '',
    title: '',
    content: '',
    lastModified: new Date()
})

const isSaving = ref(false)
const isLoading = ref(false)
const saveTimeout = ref<number | null>(null)
const isNewNote = ref(true)

onMounted(async () => {
    const noteId = route.params.id
    if (noteId) {
        try {
            isLoading.value = true
            isNewNote.value = false
            const note = await notesStore.fetchNote(noteId as string)
            currentNote.value = note
        } catch (err) {
            router.push('/notes')
        } finally {
            isLoading.value = false
        }
    }
})

async function autoSave() {
    if (saveTimeout.value) clearTimeout(saveTimeout.value)
    isSaving.value = true

    saveTimeout.value = setTimeout(async () => {
        try {
            
            if (isNewNote.value) {
                const newNote = await notesStore.createNote(
                    currentNote.value.title,
                    currentNote.value.content
                )
                currentNote.value = newNote
                isNewNote.value = false
                router.replace(`/notes/${newNote._id}`)
            } else {
                await notesStore.updateNote({
                    _id: currentNote.value._id,
                    title: currentNote.value.title,
                    content: currentNote.value.content
                })
            }
        } finally {
            isSaving.value = false
        }
    }, 2000) as unknown as number
}

watch(() => currentNote.value.title, autoSave)
watch(() => currentNote.value.content, autoSave)

watch(() => currentNote.value.title, (newVal) => {
    if (newVal.trim() !== '') autoSave()
})

watch(() => currentNote.value.content, (newVal) => {
    if (newVal.trim() !== '') autoSave()
})
</script>

<template>
    <div class="notes-layout">
        <div class="notes-container">

            <main class="editor">
                <div class="editor-header">
                    <div class="save-status" :class="{ saving: isSaving }">
                        {{ isSaving ? 'Saving...' : 'All changes saved' }}
                    </div>
                </div>

                <div v-if="isLoading" class="loading-state">
                    <div class="loading-spinner"></div>
                    <p>Loading note...</p>
                </div>

                <div v-else class="editor-content">
                    <input v-model="currentNote.title" type="text" class="title-input" placeholder="Note title..." />


                    <textarea v-model="currentNote.content" class="content-input"
                        placeholder="Start writing..."></textarea>
                </div>
            </main>
        </div>
    </div>
</template>

<style scoped>
.notes-layout {
    min-height: 100vh;
    background: v-bind('colors.neutral[50]');
}

.notes-container {
    display: flex;
    gap: v-bind('spacing.md');
    max-width: 1400px;
    margin: 0 auto;
    height: calc(100vh - 64px);
    /* Adjust based on header height */
}

.editor {
    flex: 1;
    background: white;
    border-radius: v-bind('radii.lg');
    box-shadow: v-bind('shadows.base');
    border: 1px solid v-bind('colors.neutral[200]');
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.editor-header {
    padding: v-bind('spacing.sm') v-bind('spacing.md');
    border-bottom: 1px solid v-bind('colors.neutral[200]');
    display: flex;
    justify-content: flex-end;
}

.save-status {
    font-size: v-bind('typography.sizes.sm');
    color: v-bind('colors.neutral[500]');
    transition: v-bind('animations.transitions.base');
}

.save-status.saving {
    color: v-bind('colors.primary[600]');
}

.editor-content {
    flex: 1;
    padding: v-bind('spacing.lg');
    display: flex;
    flex-direction: column;
    gap: v-bind('spacing.md');
    overflow-y: auto;
}

.title-input {
    width: 100%;
    border: none;
    font-size: v-bind('typography.sizes.xl');
    font-weight: 600;
    color: v-bind('colors.neutral[800]');
    padding: v-bind('spacing.sm');
    border-radius: v-bind('radii.base');
    transition: v-bind('animations.transitions.base');
}

.title-input:focus {
    outline: none;
    background: v-bind('colors.neutral[50]');
}

.content-input {
    flex: 1;
    width: 100%;
    border: none;
    resize: none;
    font-size: v-bind('typography.sizes.base');
    line-height: v-bind('typography.lineHeights.relaxed');
    color: v-bind('colors.neutral[700]');
    padding: v-bind('spacing.md');
    border-radius: v-bind('radii.base');
    transition: v-bind('animations.transitions.base');
    font-family: v-bind('typography.fonts.sans');
}

.content-input:focus {
    outline: none;
    background: v-bind('colors.neutral[50]');
}

@media (max-width: 768px) {
    .notes-container {
        padding: 0;
    }

    .editor {
        border-radius: 0;
        border: none;
    }
}

.loading-state {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: v-bind('spacing.md');
    color: v-bind('colors.neutral[500]');
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
    to { transform: rotate(360deg); }
}
</style>