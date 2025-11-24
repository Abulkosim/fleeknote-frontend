<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import { PhPencilLine, PhGlobe, PhTrash, PhCopy, PhCheck } from '@phosphor-icons/vue'
import { useNotesStore } from '@/stores/notes'
import { useToastStore } from '@/stores/toast'
import { colors, spacing, shadows, radii, animations } from '@/design/tokens'
import LoadingSpinner from './LoadingSpinner.vue'

interface Props {
  noteId: string
  isPublic: boolean
  showContextMenu: boolean
  slug: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
}>()

const notesStore = useNotesStore()
const toastStore = useToastStore()
const router = useRouter()

const showDeleteDialog = ref(false)
const copying = ref(false)
const copied = ref(false)

const handleEdit = () => {
  router.push(`/notes/${props.noteId}`)
  emit('close')
}

const handleTogglePublish = async () => {
  try {
    await notesStore.togglePublish(props.noteId)
    const message = props.isPublic ? 'Note unpublished' : 'Note published'
    toastStore.addToast(message, 'success')
  } catch {
    const message = props.isPublic ? 'Failed to unpublish note' : 'Failed to publish note'
    toastStore.addToast(message, 'error')
  }
  emit('close')
}

const handleCopyLink = async () => {
  if (copying.value || copied.value) return

  try {
    copying.value = true
    const { username, slug } = await notesStore.getNoteLink(props.noteId)
    const link = `${window.location.origin}/${username}/notes/${slug}`
    await navigator.clipboard.writeText(link)
    toastStore.addToast('Link copied to clipboard', 'success')
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch {
    toastStore.addToast('Failed to copy link', 'error')
  } finally {
    copying.value = false
  }
}

const openDeleteDialog = () => {
  showDeleteDialog.value = true
}

const handleDelete = async () => {
  try {
    await notesStore.deleteNote(props.noteId)
    notesStore.clearCurrentNote()
    showDeleteDialog.value = false
    emit('close')
    router.push('/notes')
  } catch (error) {
    console.error('Failed to delete note:', error)
    toastStore.addToast('Failed to delete note', 'error')
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
    <button
      v-if="isPublic"
      class="menu-item"
      :disabled="copying || copied"
      @click="handleCopyLink"
    >
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
      <Button label="Cancel" severity="secondary" text @click="showDeleteDialog = false" />
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
    border-radius: v-bind('radii.base');
    transition: v-bind('animations.transitions.base');
}

.menu-item:disabled {
    cursor: not-allowed;
    opacity: 0.7;
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