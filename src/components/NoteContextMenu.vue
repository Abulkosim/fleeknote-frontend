<script setup lang="ts">
import { useNotesStore } from '@/stores/notes'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { colors, spacing, shadows, radii, animations } from '@/design/tokens'
import { PhPencilLine, PhGlobe, PhTrash, PhCopy, PhCheck } from "@phosphor-icons/vue"
import { useToastStore } from '@/stores/toast'
import { ref } from 'vue'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const props = defineProps<{
    noteId: string
    isPublic: boolean
    showContextMenu: boolean
    slug: string
}>()

const emit = defineEmits(['close'])
const notesStore = useNotesStore()
const authStore = useAuthStore()
const router = useRouter()
const toast = useToastStore()
const copying = ref(false)
const copied = ref(false)

const showDeleteDialog = ref(false)

async function handleDelete() {
    try {
        await notesStore.deleteNote(props.noteId)
        router.push('/notes')
        showDeleteDialog.value = false
        notesStore.clearCurrentNote()
        emit('close')
    } catch (error) {
        console.error('Failed to delete note:', error)
        toast.addToast('Failed to delete note', 'error')
    }
}

function openDeleteDialog() {
    showDeleteDialog.value = true
}

async function handleTogglePublish() {
    try {
        await notesStore.togglePublish(props.noteId)
        toast.addToast(props.isPublic ? 'Note published' : 'Note unpublished', 'success')
    } catch (error) {
        toast.addToast(props.isPublic ? 'Failed to unpublish note' : 'Failed to publish note', 'error')
    }
    emit('close')
}

function handleEdit() {
    router.push(`/notes/${props.noteId}`)
    emit('close')
}

async function handleCopyLink() {
    try {
        copying.value = true
        const { username, slug } = await notesStore.getNoteLink(props.noteId)
        const link = `${window.location.origin}/${username}/notes/${slug}`
        navigator.clipboard.writeText(link)
        toast.addToast('Link copied to clipboard', 'success')
    } catch {
        toast.addToast('Failed to copy link', 'error')
    } finally {
        copying.value = false
        copied.value = true
        setTimeout(() => {
            copied.value = false
        }, 2000)
    }
}
</script>

<template>
    <div v-if="showContextMenu" class="context-menu" @click.stop>
        <button class="menu-item" @click="handleEdit">
            <PhPencilLine :size="20" class="menu-item-icon" />
            Edit
        </button>
        <button class="menu-item" @click="handleTogglePublish">
            <PhGlobe :size="20" class="menu-item-icon" />
            {{ isPublic ? 'Make Private' : 'Publish' }}
        </button>
        <button v-if="isPublic" class="menu-item" @click="handleCopyLink" :disabled="copying || copied">
            <template v-if="copying">
                <LoadingSpinner size="md" class="menu-item-icon" />
                Copying...
            </template>
            <template v-else-if="copied">
                <PhCheck :size="20" class="menu-item-icon" />
                Copied!
            </template>
            <template v-else>
                <PhCopy :size="20" class="menu-item-icon" />
                Copy Link
            </template>
        </button>
        <button class="menu-item delete" @click="openDeleteDialog">
            <PhTrash :size="20" class="menu-item-icon" />
            Delete
        </button>
    </div>

    <Dialog v-model:visible="showDeleteDialog" modal header="Delete Note" :style="{ width: '30rem' }">
        <p>Are you sure you want to delete this note?</p>
        <template #footer>
            <Button label="Cancel" @click="showDeleteDialog = false" severity="secondary" text />
            <Button label="Delete" severity="danger" @click="handleDelete" />
        </template>
    </Dialog>
</template>

<style scoped>
.context-menu {
    position: absolute;
    background: white;
    border-radius: v-bind('radii.md');
    box-shadow: v-bind('shadows.lg');
    border: 1px solid v-bind('colors.neutral[200]');
    min-width: 160px;
    z-index: 100;
    top: 100%;
    left: -20px;
    padding: v-bind('spacing.sm');
}

.menu-item {
    display: flex;
    align-items: center;
    gap: v-bind('spacing.sm');
    width: 100%;
    padding: v-bind('spacing.sm') v-bind('spacing.md');
    border: none;
    background: none;
    text-align: left;
    cursor: pointer;
    color: v-bind('colors.neutral[700]');
    transition: v-bind('animations.transitions.base');
}

.menu-item-icon {
    fill: v-bind('colors.neutral[700]');
}

.menu-item:hover {
    background: v-bind('colors.neutral[100]');
}

.menu-item.delete {
    color: v-bind('colors.red[600]');
}

.menu-item.delete .menu-item-icon {
    fill: v-bind('colors.red[600]');
}

.menu-item.delete:hover {
    background: v-bind('colors.red[50]');
}
</style>