import { useMemo } from 'react'
import { useCartStore } from '@/stores/useCartStore'
import { clsx } from 'clsx'

interface DiffLine {
  type: 'context' | 'addition' | 'deletion' | 'header'
  content: string
  oldNum?: number
  newNum?: number
}

function parsePatch(patch: string): DiffLine[] {
  if (!patch) return []

  const lines: DiffLine[] = []
  const patchLines = patch.split('\n')

  let oldNum = 0
  let newNum = 0

  for (const line of patchLines) {
    if (line.startsWith('@@')) {
      // Parse hunk header: @@ -10,7 +10,8 @@
      const match = line.match(/@@ -(\d+),?\d* \+(\d+),?\d* @@/)
      if (match) {
        oldNum = parseInt(match[1], 10)
        newNum = parseInt(match[2], 10)
      }
      lines.push({ type: 'header', content: line })
    } else if (line.startsWith('+')) {
      lines.push({ type: 'addition', content: line.slice(1), newNum })
      newNum++
    } else if (line.startsWith('-')) {
      lines.push({ type: 'deletion', content: line.slice(1), oldNum })
      oldNum++
    } else if (line.startsWith(' ') || line === '') {
      lines.push({ type: 'context', content: line.slice(1) || '', oldNum, newNum })
      oldNum++
      newNum++
    }
  }

  return lines
}

export function DiffViewer() {
  const { pr, previewFile, selectedFiles, toggleFile } = useCartStore()

  const file = useMemo(() => {
    if (!pr || !previewFile) return null
    return pr.files.find(f => f.filename === previewFile) || null
  }, [pr, previewFile])

  const diffLines = useMemo(() => {
    if (!file?.patch) return []
    return parsePatch(file.patch)
  }, [file])

  if (!pr) return null

  if (!file) {
    return (
      <div className="flex-1 flex items-center justify-center text-gh-text-muted">
        <p>Select a file to view its diff</p>
      </div>
    )
  }

  const isSelected = selectedFiles.has(file.filename)

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* File header */}
      <div className="p-4 border-b border-gh-border bg-gh-bg-secondary flex items-center gap-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => toggleFile(file.filename)}
          className="w-5 h-5 rounded border-gh-border bg-gh-bg text-gh-green focus:ring-gh-green focus:ring-offset-0"
        />
        <div className="flex-1 min-w-0">
          <div className="font-mono text-sm truncate">{file.filename}</div>
          <div className="text-xs text-gh-text-muted mt-1">
            <span className="text-gh-green">+{file.additions}</span>
            {' '}
            <span className="text-gh-red">-{file.deletions}</span>
          </div>
        </div>
        <button
          onClick={() => toggleFile(file.filename)}
          className={clsx(
            'px-3 py-1.5 text-sm rounded-lg transition-colors',
            isSelected
              ? 'bg-gh-red/20 text-gh-red hover:bg-gh-red/30'
              : 'bg-gh-green/20 text-gh-green hover:bg-gh-green/30'
          )}
        >
          {isSelected ? 'Remove from cart' : 'Add to cart'}
        </button>
      </div>

      {/* Diff content */}
      <div className="flex-1 overflow-auto font-mono text-sm">
        {!file.patch ? (
          <div className="p-4 text-gh-text-muted">
            {file.status === 'removed' ? (
              'File deleted - no diff available'
            ) : (
              'Binary file or no changes to display'
            )}
          </div>
        ) : diffLines.length === 0 ? (
          <div className="p-4 text-gh-text-muted">No changes in this file</div>
        ) : (
          <table className="w-full border-collapse">
            <tbody>
              {diffLines.map((line, i) => (
                <tr
                  key={i}
                  className={clsx(
                    line.type === 'addition' && 'diff-addition',
                    line.type === 'deletion' && 'diff-deletion',
                    line.type === 'header' && 'bg-gh-blue/10'
                  )}
                >
                  {line.type === 'header' ? (
                    <td colSpan={3} className="px-4 py-1 text-gh-blue">
                      {line.content}
                    </td>
                  ) : (
                    <>
                      <td className="w-12 text-right px-2 py-0.5 text-gh-text-muted select-none border-r border-gh-border/30">
                        {line.oldNum || ''}
                      </td>
                      <td className="w-12 text-right px-2 py-0.5 text-gh-text-muted select-none border-r border-gh-border/30">
                        {line.newNum || ''}
                      </td>
                      <td className="px-4 py-0.5 whitespace-pre">
                        <span className="text-gh-text-muted mr-2">
                          {line.type === 'addition' ? '+' : line.type === 'deletion' ? '-' : ' '}
                        </span>
                        {line.content}
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
