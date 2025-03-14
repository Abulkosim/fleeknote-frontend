import { defineStore } from 'pinia'
import { ref } from 'vue'
import apiClient from '@/api/client'

interface Note {
    _id: string
    title: string
    content: string
    owner: string
    isPublic: boolean
    slug: string
    createdAt: Date
    updatedAt: Date
}

export const useNotesStore = defineStore('notes', () => {
    const notes = ref<Note[]>([])
    const currentNote = ref<Note | null>(null)
    const isLoading = ref(false)
    const error = ref('')

    async function fetchNotes() {
        try {
            isLoading.value = true
            const { data } = await apiClient.get('/notes')
            notes.value = data.map((note: any) => ({
                ...note,
                createdAt: new Date(note.createdAt),
                updatedAt: new Date(note.updatedAt)
            }))
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Failed to fetch notes'
            throw error.value
        } finally {
            isLoading.value = false
        }
    }

    async function fetchNote(id: string) {
        try {
            const { data } = await apiClient.get(`/notes/${id}`)
            const note = {
                ...data,
                createdAt: new Date(data.createdAt),
                updatedAt: new Date(data.updatedAt)
            }
            currentNote.value = note
            return note
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Failed to fetch note'
            throw error.value
        }
    }

    async function createNote(title: string, content: string) {
        try {
            const { data } = await apiClient.post('/notes', { title, content })
            const newNote = {
                ...data,
                createdAt: new Date(data.createdAt),
                updatedAt: new Date(data.updatedAt)
            }
            notes.value.unshift(newNote)
            return newNote
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Failed to create note'
            throw error.value
        }
    }

    async function updateNote(updates: Partial<Note>) {
        try {
            const { _id, owner, slug, createdAt, updatedAt, ...updateData } = updates

            if (!_id) {
                throw new Error('Note ID is required for update')
            }

            const { data } = await apiClient.patch(`/notes/${_id}`, updateData)
            const updatedNote = {
                ...data,
                createdAt: new Date(data.createdAt),
                updatedAt: new Date(data.updatedAt)
            }

            const index = notes.value.findIndex(n => n._id === _id)
            if (index !== -1) {
                notes.value[index] = updatedNote
            }
            return updatedNote
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Failed to update note'
            throw error.value
        }
    }

    async function togglePublish(id: string) {
        try {
            const { data } = await apiClient.post(`/notes/${id}/toggle-publish`)
            const updatedNote = {
                ...data,
                createdAt: new Date(data.createdAt),
                updatedAt: new Date(data.updatedAt)
            }

            const index = notes.value.findIndex(n => n._id === id)
            if (index !== -1) {
                notes.value[index] = updatedNote
            }
            return updatedNote
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Failed to toggle publish status'
            throw error.value
        }
    }

    async function deleteNote(id: string) {
        try {
            await apiClient.delete(`/notes/${id}`)
            notes.value = notes.value.filter(note => note._id !== id)
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Failed to delete note'
            throw error.value
        }
    }

    return {
        notes,
        currentNote,
        isLoading,
        error,
        fetchNotes,
        fetchNote,
        createNote,
        updateNote,
        deleteNote,
        togglePublish
    }
}) 