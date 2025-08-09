<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import { useNotesStore } from '@/stores/notes'
import { useRoute, useRouter } from 'vue-router'
import { spacing, typography, colors, shadows, radii, animations, focusRings } from '@/design/tokens'

const notesStore = useNotesStore()
const route = useRoute()
const router = useRouter()

const isSaving = ref(false)
const isLoading = ref(false)
const saveTimeout = ref<number | null>(null)
const contentInput = ref<HTMLTextAreaElement>()

const localTitle = ref('')
const localContent = ref('')

const currentNote = computed(() => notesStore.getCurrentNote())

watch(currentNote, (newNote) => {
    if (newNote) {
        localTitle.value = newNote.title
        localContent.value = newNote.content
    }
}, { immediate: true })

async function loadNoteFromRoute() {
    const noteId = route.params.id
    if (noteId) {
        try {
            isLoading.value = true
            const note = await notesStore.fetchNote(noteId as string)
            notesStore.setCurrentNote(note)
        } catch (err) {
            router.push('/notes')
        } finally {
            isLoading.value = false
        }
    } else {
        if (!currentNote.value || currentNote.value._id === '') {
            const emptyNote = {
                _id: '',
                title: '',
                content: '',
                owner: '',
                isPublic: false,
                slug: '',
                createdAt: new Date(),
                updatedAt: new Date()
            }
            notesStore.setCurrentNote(emptyNote)
        }
    }
}

onMounted(() => {
    loadNoteFromRoute()
})

async function autoSave() {
    isSaving.value = true

    if (!currentNote.value) return
    if (saveTimeout.value) clearTimeout(saveTimeout.value)

    saveTimeout.value = setTimeout(async () => {
        try {
            if (!currentNote.value) return

            const trimmedTitle = localTitle.value.trim()
            const trimmedContent = localContent.value.trim()

            if (currentNote.value._id === '') {
                const newNote = await notesStore.createNote(trimmedTitle, trimmedContent)
                notesStore.setCurrentNote(newNote)
                router.replace({
                    path: `/notes/${newNote._id}`,
                    replace: true
                })
            } else {
                const hasChanged =
                    currentNote.value.title !== trimmedTitle ||
                    currentNote.value.content !== trimmedContent

                if (hasChanged) {
                    const updatedNote = await notesStore.updateNote({
                        _id: currentNote.value._id,
                        title: trimmedTitle,
                        content: trimmedContent
                    })
                    // notesStore.setCurrentNote(updatedNote)
                }
            }
        } finally {
            isSaving.value = false
        }
    }, 2000) as unknown as number
}

function focusContentInput() {
    if (contentInput.value) {
        contentInput.value.focus()
    }
}

watch(() => localTitle.value, (newVal) => {
    if (newVal.trim() !== '') autoSave()
})

watch(() => localContent.value, (newVal) => {
    if (newVal.trim() !== '') autoSave()
})

watch(() => route.params.id, (newId, oldId) => {
    if (newId !== oldId) {
        loadNoteFromRoute()
    }
}, { flush: 'post' })
</script>

<template>
    <div class="notes-layout">
        <div class="notes-container">
            <main class="editor">
                <div class="editor-header">
                    <div class="save-status" :class="{ saving: isSaving }">
                        <span v-if="currentNote && currentNote._id !== '' || isSaving">
                            {{ isSaving ? 'Saving...' : 'All changes saved' }}
                        </span>
                        <span v-else>New Note</span>
                    </div>
                </div>

                <div v-if="isLoading" class="loading-state">
                    <div class="loading-spinner"></div>
                    <p>Loading note...</p>
                </div>

                <div v-else-if="currentNote" class="editor-content">
                    <input v-model="localTitle" type="text" class="title-input" placeholder="New note"
                        @keydown.prevent.enter="focusContentInput" />
                    <textarea ref="contentInput" v-model="localContent" class="content-input" @keydown.prevent.enter="autoSave"></textarea>
                </div>
            </main>
        </div>
    </div>
</template>

<style scoped>
.notes-layout {
    background: v-bind('colors.neutral[50]');
}

.notes-container {
    display: flex;
    gap: v-bind('spacing.md');
    max-width: 1400px;
    margin: 0 auto;
    height: calc(100vh - 64px);
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
    gap: v-bind('spacing.sm');
    overflow-y: auto;
}

.title-input {
    width: 100%;
    border: none;
    font-size: calc(1.25 * v-bind('typography.sizes.xl'));
    font-weight: 500;
    color: v-bind('colors.neutral[800]');
    padding: v-bind('spacing.xs') v-bind('spacing.md');
    border-radius: v-bind('radii.base');
    transition: v-bind('animations.transitions.base');
}

.title-input:focus,
.content-input:focus {
    outline: none;
}

.content-input {
    flex: 1;
    width: 100%;
    border: none;
    resize: none;
    font-size: v-bind('typography.sizes.base');
    line-height: v-bind('typography.lineHeights.relaxed');
    color: v-bind('colors.neutral[700]');
    padding: v-bind('spacing.xs') v-bind('spacing.md');
    border-radius: v-bind('radii.base');
    transition: v-bind('animations.transitions.base');
    font-family: v-bind('typography.fonts.sans');
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
    to {
        transform: rotate(360deg);
    }
}
</style>
