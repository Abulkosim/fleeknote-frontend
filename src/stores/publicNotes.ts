import { defineStore } from 'pinia'
import { ref } from 'vue'
import apiClient from '@/api/client'
import { extractErrorMessage } from '@/utils/errors'

interface PublicNote {
    _id: string
    title: string
    content: string
    owner: string
    slug: string
    createdAt: Date
    updatedAt: Date
}

export const usePublicNotesStore = defineStore('publicNotes', () => {
    const notes = ref<PublicNote[]>([])
    const currentNote = ref<PublicNote | null>(null)
    const isLoading = ref(false)
    const error = ref('')

    async function fetchUserNotes(username: string) {
        try {
            isLoading.value = true
            const { data } = await apiClient.get(`/${username}/notes`)
            notes.value = data.map((note: any) => ({
                ...note,
                createdAt: new Date(note.createdAt),
                updatedAt: new Date(note.updatedAt)
            }))
        } catch (err: unknown) {
            error.value = extractErrorMessage(err, 'Failed to fetch public notes')
            throw err
        } finally {
            isLoading.value = false
        }
    }

    async function fetchNoteBySlug(username: string, slug: string) {
        try {
            isLoading.value = true
            const { data } = await apiClient.get(`/${username}/notes/${slug}`)
            currentNote.value = {
                ...data,
                createdAt: new Date(data.createdAt),
                updatedAt: new Date(data.updatedAt)
            }
            return currentNote.value
        } catch (err: unknown) {
            error.value = extractErrorMessage(err, 'Failed to fetch note')
            throw err
        } finally {
            isLoading.value = false
        }
    }

    return {
        notes,
        currentNote,
        isLoading,
        error,
        fetchUserNotes,
        fetchNoteBySlug
    }
}) 