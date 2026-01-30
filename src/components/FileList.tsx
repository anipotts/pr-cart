import { useState, useMemo } from 'react'
import { useCartStore } from '@/stores/useCartStore'
import { FileCard } from '@/components/FileCard'

export function FileList() {
  const { pr, selectedFiles, toggleFile, setPreviewFile, previewFile, selectAll, deselectAll } = useCartStore()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'selected' | 'unselected'>('all')

  const filteredFiles = useMemo(() => {
    if (!pr) return []

    let files = pr.files

    // Apply search
    if (search) {
      const searchLower = search.toLowerCase()
      files = files.filter(f => f.filename.toLowerCase().includes(searchLower))
    }

    // Apply filter
    if (filter === 'selected') {
      files = files.filter(f => selectedFiles.has(f.filename))
    } else if (filter === 'unselected') {
      files = files.filter(f => !selectedFiles.has(f.filename))
    }

    return files
  }, [pr, search, filter, selectedFiles])

  if (!pr) return null

  const allSelected = pr.files.length > 0 && selectedFiles.size === pr.files.length
  const someSelected = selectedFiles.size > 0 && selectedFiles.size < pr.files.length

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Search and controls */}
      <div className="p-3 space-y-3 border-b border-gh-border">
        {/* Search */}
        <input
          type="text"
          placeholder="Search files..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-3 py-2 text-sm bg-gh-bg border border-gh-border rounded focus:outline-none focus:ring-1 focus:ring-gh-blue"
        />

        {/* Filter tabs */}
        <div className="flex gap-1">
          {[
            { value: 'all', label: `All (${pr.files.length})` },
            { value: 'selected', label: `In Cart (${selectedFiles.size})` },
            { value: 'unselected', label: `Not in Cart (${pr.files.length - selectedFiles.size})` },
          ].map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setFilter(value as typeof filter)}
              className={`px-2 py-1 text-xs rounded ${
                filter === value
                  ? 'bg-gh-blue text-white'
                  : 'bg-gh-border/50 text-gh-text-muted hover:text-gh-text'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Select all / none */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={allSelected}
            ref={(el) => {
              if (el) el.indeterminate = someSelected
            }}
            onChange={() => {
              if (allSelected || someSelected) {
                deselectAll()
              } else {
                selectAll()
              }
            }}
            className="w-4 h-4 rounded border-gh-border bg-gh-bg-secondary text-gh-green focus:ring-gh-green focus:ring-offset-0"
          />
          <span className="text-sm text-gh-text-muted">
            {allSelected ? 'Deselect all' : someSelected ? 'Deselect all' : 'Select all'}
          </span>
        </div>
      </div>

      {/* File list */}
      <div className="flex-1 overflow-y-auto">
        {filteredFiles.length === 0 ? (
          <div className="p-4 text-center text-gh-text-muted text-sm">
            {search ? 'No files match your search' : 'No files in this category'}
          </div>
        ) : (
          <div className="divide-y divide-gh-border/50">
            {filteredFiles.map((file) => (
              <FileCard
                key={file.filename}
                file={file}
                isSelected={selectedFiles.has(file.filename)}
                isActive={previewFile === file.filename}
                onToggle={() => toggleFile(file.filename)}
                onClick={() => setPreviewFile(file.filename)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
