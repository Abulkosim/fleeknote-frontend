<script setup lang="ts">
import { useNotesStore } from '@/stores/notes'
import { useRouter } from 'vue-router'
import { colors, spacing, shadows, radii, animations } from '@/design/tokens'
import { PhPencilLine, PhGlobe, PhTrash } from "@phosphor-icons/vue"
import { useToastStore } from '@/stores/toast'

const props = defineProps<{
    noteId: string
    isPublic: boolean
    show: boolean
    position: { x: number; y: number }
}>()

const emit = defineEmits(['close'])
const notesStore = useNotesStore()
const router = useRouter()
const toast = useToastStore()

async function handleDelete() {
    if (confirm('Are you sure you want to delete this note?')) {
        try {
            await notesStore.deleteNote(props.noteId)
            router.push('/notes')
        } catch (error) {
            console.error('Failed to delete note:', error)
        }
    }
    emit('close')
}

async function handleTogglePublish() {
    try {
        await notesStore.togglePublish(props.noteId)
    } catch (error) {
        console.error('Failed to toggle publish status:', error)
    }
    emit('close')
}

function handleEdit() {
    router.push(`/notes/${props.noteId}`)
    emit('close')
}
</script>

<template>
    <div v-if="show" class="context-menu" :style="{ top: `${position.y}px`, left: `${position.x}px` }" @click.stop>
        <button class="menu-item" @click="handleEdit">
            <PhPencilLine :size="20" class="menu-item-icon" />
            Edit
        </button>
        <button class="menu-item" @click="handleTogglePublish">
            <PhGlobe :size="20" class="menu-item-icon" />
            {{ isPublic ? 'Make Private' : 'Publish' }}
        </button>
        <button class="menu-item delete" @click="handleDelete">
            <PhTrash :size="20" class="menu-item-icon" />
            Delete
        </button>
    </div>
</template>

<style scoped>
.context-menu {
    position: fixed;
    background: white;
    border-radius: v-bind('radii.md');
    box-shadow: v-bind('shadows.lg');
    border: 1px solid v-bind('colors.neutral[200]');
    min-width: 160px;
    z-index: 100;
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

.menu-item.delete:hover {
    background: v-bind('colors.red[50]');
}
</style>