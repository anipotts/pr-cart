import { clsx } from 'clsx'
import type { PRFile } from '@/types'

interface FileCardProps {
  file: PRFile
  isSelected: boolean
  isActive: boolean
  onToggle: () => void
  onClick: () => void
}

const statusColors: Record<PRFile['status'], string> = {
  added: 'bg-gh-green/20 text-gh-green',
  modified: 'bg-yellow-500/20 text-yellow-400',
  removed: 'bg-gh-red/20 text-gh-red',
  renamed: 'bg-purple-500/20 text-purple-400',
  copied: 'bg-blue-500/20 text-blue-400',
  changed: 'bg-yellow-500/20 text-yellow-400',
  unchanged: 'bg-gray-500/20 text-gray-400',
}

const statusLabels: Record<PRFile['status'], string> = {
  added: 'Added',
  modified: 'Modified',
  removed: 'Deleted',
  renamed: 'Renamed',
  copied: 'Copied',
  changed: 'Changed',
  unchanged: 'Unchanged',
}

export function FileCard({ file, isSelected, isActive, onToggle, onClick }: FileCardProps) {
  const filename = file.filename.split('/').pop() || file.filename
  const directory = file.filename.includes('/')
    ? file.filename.substring(0, file.filename.lastIndexOf('/'))
    : ''

  return (
    <div
      className={clsx(
        'file-card px-3 py-2 border-l-2 cursor-pointer',
        isSelected ? 'selected border-gh-green' : 'border-transparent',
        isActive && 'bg-gh-border/30'
      )}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <div className="pt-0.5">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => {
              e.stopPropagation()
              onToggle()
            }}
            className="cart-checkbox w-4 h-4 rounded border-gh-border bg-gh-bg-secondary text-gh-green focus:ring-gh-green focus:ring-offset-0 cursor-pointer"
          />
        </div>

        {/* File info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm truncate">{filename}</span>
            <span className={clsx('text-xs px-1.5 py-0.5 rounded', statusColors[file.status])}>
              {statusLabels[file.status]}
            </span>
          </div>
          {directory && (
            <div className="text-xs text-gh-text-muted truncate mt-0.5">
              {directory}
            </div>
          )}
          {file.previousFilename && (
            <div className="text-xs text-gh-text-muted mt-0.5">
              from {file.previousFilename}
            </div>
          )}
        </div>

        {/* Line changes */}
        <div className="text-xs font-mono flex items-center gap-1 shrink-0">
          {file.additions > 0 && (
            <span className="text-gh-green">+{file.additions}</span>
          )}
          {file.deletions > 0 && (
            <span className="text-gh-red">-{file.deletions}</span>
          )}
          {file.additions === 0 && file.deletions === 0 && (
            <span className="text-gh-text-muted">-</span>
          )}
        </div>
      </div>
    </div>
  )
}
