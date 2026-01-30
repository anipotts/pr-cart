import { create } from 'zustand'
import type { CartStore, PRData } from '@/types'
import { parsePRUrl } from '@/utils/url'
import { fetchPR } from '@/services/github'

export const useCartStore = create<CartStore>((set, get) => ({
  // State
  pr: null,
  selectedFiles: new Set<string>(),
  isLoading: false,
  error: null,
  previewFile: null,

  // Actions
  loadPR: async (url: string, token?: string) => {
    set({ isLoading: true, error: null })

    try {
      const parsed = parsePRUrl(url)
      if (!parsed) {
        throw new Error('Invalid GitHub PR URL. Expected format: https://github.com/owner/repo/pull/123')
      }

      const pr = await fetchPR(parsed.owner, parsed.repo, parsed.number, token)

      set({
        pr,
        selectedFiles: new Set<string>(), // Start with empty cart
        isLoading: false,
        previewFile: pr.files.length > 0 ? pr.files[0].filename : null,
      })
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load PR',
      })
    }
  },

  toggleFile: (filename: string) => {
    const { selectedFiles } = get()
    const newSelected = new Set(selectedFiles)

    if (newSelected.has(filename)) {
      newSelected.delete(filename)
    } else {
      newSelected.add(filename)
    }

    set({ selectedFiles: newSelected })
  },

  selectAll: () => {
    const { pr } = get()
    if (!pr) return

    const allFiles = new Set(pr.files.map(f => f.filename))
    set({ selectedFiles: allFiles })
  },

  deselectAll: () => {
    set({ selectedFiles: new Set<string>() })
  },

  setPreviewFile: (filename: string | null) => {
    set({ previewFile: filename })
  },

  clearPR: () => {
    set({
      pr: null,
      selectedFiles: new Set<string>(),
      previewFile: null,
      error: null,
    })
  },

  clearError: () => {
    set({ error: null })
  },
}))

// Selector hooks for computed values
export const useSelectedCount = () => useCartStore(state => state.selectedFiles.size)

export const useSelectedFiles = () => useCartStore(state => {
  const { pr, selectedFiles } = state
  if (!pr) return []
  return pr.files.filter(f => selectedFiles.has(f.filename))
})

export const useCartStats = () => useCartStore(state => {
  const { pr, selectedFiles } = state
  if (!pr) return { additions: 0, deletions: 0, files: 0 }

  let additions = 0
  let deletions = 0

  for (const file of pr.files) {
    if (selectedFiles.has(file.filename)) {
      additions += file.additions
      deletions += file.deletions
    }
  }

  return { additions, deletions, files: selectedFiles.size }
})
