<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { PhNotePencil, PhTextOutdent } from "@phosphor-icons/vue";
import { useNotesStore } from '@/stores/notes'
import { useRouter } from 'vue-router'
import { colors, spacing, typography, shadows, radii, animations } from '@/design/tokens'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import NoteContextMenu from '@/components/NoteContextMenu.vue'

const notesStore = useNotesStore()
const router = useRouter()
const isMobile = ref(window.innerWidth < 768)
const isSidebarOpen = ref(!isMobile.value)

function handleResize() {
    isMobile.value = window.innerWidth < 768
    isSidebarOpen.value = !isMobile.value
}

function toggleSidebar() {
    isSidebarOpen.value = !isSidebarOpen.value
}

async function createNewNote() {
    router.push('/notes')
}

onMounted(() => {
    window.addEventListener('resize', handleResize)
    notesStore.fetchNotes()
})

onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
})
</script>

<template>
    <aside :class="['sidebar', { 'sidebar-open': isSidebarOpen }]">
        <div class="sidebar-header">
            <h2 class="sidebar-title">Notes</h2>
            <div class="sidebar-actions">
                <div class="sidebar-toggle" @click="toggleSidebar">
                    <PhTextOutdent class="sidebar-icon" :size="20" />
                </div>
                <div class="new-note" @click="createNewNote">
                    <PhNotePencil class="sidebar-icon" :size="20" />
                </div>
            </div>
        </div>

        <div v-if="notesStore.isLoading" class="notes-loading">
            <LoadingSpinner size="md" />
        </div>

        <div v-else class="notes-list">
            <div v-for="note in notesStore.notes" :key="note._id" class="note-item"
                :class="{ active: $route.params.id === note._id }" @click="router.push(`/notes/${note._id}`)">
                <span>{{ note.title || 'Untitled Note' }}</span>
                <!-- <NoteContextMenu :noteId="note._id" :isPublic="note.isPublic" :show="true"
                    :position="{ x: 0, y: 0 }" /> -->
            </div>
        </div>
    </aside>
</template>

<style scoped>
.sidebar {
    position: relative;
    width: 280px;
    background: white;
    border-radius: v-bind('radii.md');
    box-shadow: v-bind('shadows.base');
    padding: v-bind('spacing.md');
    transition: v-bind('animations.transitions.smooth');
}

@media (max-width: 768px) {
    .sidebar {
        position: fixed;
        top: 0;
        bottom: 0;
        z-index: 50;
        background: white;
        height: 100vh;
        transform: translateX(-296px);
    }

    .sidebar.sidebar-open {
        transform: translateX(0);
        box-shadow: v-bind('shadows.lg');
    }
}

.sidebar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: v-bind('spacing.lg');
}

.sidebar-title {
    font-size: v-bind('typography.sizes.sm');
    font-weight: 500;
    color: v-bind('colors.neutral[500]');
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.sidebar-actions {
    display: flex;
    gap: v-bind('spacing.sm');
}

.sidebar-toggle,
.new-note {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 50%;
    transition: v-bind('animations.transitions.base');
}

.sidebar-toggle:hover,
.new-note:hover {
    background: v-bind('colors.neutral[100]');
}

.sidebar-icon {
    fill: v-bind('colors.neutral[500]');
}

.notes-list {
    display: flex;
    flex-direction: column;
    gap: v-bind('spacing.xs');
}

.note-item {
    padding: v-bind('spacing.sm');
    cursor: pointer;
    transition: v-bind('animations.transitions.base');
    border-radius: v-bind('radii.base');
    color: v-bind('colors.neutral[700]');
}

.note-item:hover {
    background: v-bind('colors.neutral[100]');
}

.note-item.active {
    background: v-bind('colors.primary[50]');
    color: v-bind('colors.primary[700]');
}

.hamburger {
    width: 20px;
    height: 2px;
    background: v-bind('colors.neutral[600]');
    position: relative;
}

.hamburger::before,
.hamburger::after {
    content: '';
    position: absolute;
    width: 20px;
    height: 2px;
    background: v-bind('colors.neutral[600]');
    left: 0;
}

.hamburger::before {
    top: -6px;
}

.hamburger::after {
    bottom: -6px;
}

.sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    border: 0;
}

.notes-loading {
    padding: v-bind('spacing.md');
    color: v-bind('colors.neutral[500]');
    text-align: center;
}
</style>