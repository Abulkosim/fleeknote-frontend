<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useNotesStore } from '@/stores/notes'
import { useRouter } from 'vue-router'
import { colors, spacing, typography, shadows, radii, animations } from '@/design/tokens'

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
            <button @click="createNewNote" class="new-note-btn">New</button>
        </div>

        <div v-if="notesStore.isLoading" class="notes-loading">
            Loading notes...
        </div>
        
        <div v-else class="notes-list">
            <div 
                v-for="note in notesStore.notes" 
                :key="note._id" 
                class="note-item"
                :class="{ active: $route.params.id === note._id }"
                @click="router.push(`/notes/${note._id}`)"
            >
                {{ note.title || 'Untitled Note' }}
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
    padding: v-bind('spacing.lg');
    transition: v-bind('animations.transitions.smooth');
}

@media (max-width: 768px) {
    .sidebar {
        position: fixed;
        left: -280px;
        top: 0;
        bottom: 0;
        z-index: 50;
        background: white;
        height: 100vh;
    }

    .sidebar-open {
        left: 0;
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

.new-note-btn {
    padding: v-bind('spacing.sm') v-bind('spacing.md');
    background: v-bind('colors.primary[600]');
    color: white;
    border: none;
    border-radius: v-bind('radii.base');
    cursor: pointer;
    font-size: v-bind('typography.sizes.sm');
    transition: v-bind('animations.transitions.base');
}

.new-note-btn:hover {
    background: v-bind('colors.primary[700]');
}

.notes-list {
    display: flex;
    flex-direction: column;
    gap: v-bind('spacing.xs');
}

.note-item {
    padding: v-bind('spacing.md');
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

.sidebar-toggle {
    position: fixed;
    bottom: v-bind('spacing.lg');
    right: v-bind('spacing.lg');
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: white;
    border: 1px solid v-bind('colors.neutral[200]');
    box-shadow: v-bind('shadows.md');
    z-index: 40;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: v-bind('animations.transitions.base');
}

.sidebar-toggle:hover {
    transform: scale(1.05);
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

.hamburger::before { top: -6px; }
.hamburger::after { bottom: -6px; }

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