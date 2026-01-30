import { useState } from 'react'
import { useCartStore, useCartStats } from '@/stores/useCartStore'
import { generatePatch, downloadPatch } from '@/services/patch'

interface CheckoutModalProps {
  onClose: () => void
}

export function CheckoutModal({ onClose }: CheckoutModalProps) {
  const { pr, selectedFiles } = useCartStore()
  const stats = useCartStats()
  const [mode, setMode] = useState<'patch' | 'branch'>('patch')
  const [branchName, setBranchName] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  if (!pr) return null

  const handleDownloadPatch = () => {
    const patch = generatePatch(pr, selectedFiles)
    const filename = `${pr.owner}-${pr.repo}-pr${pr.number}-selection.patch`
    downloadPatch(patch, filename)
    onClose()
  }

  const handleCreateBranch = async () => {
    if (!branchName.trim()) return

    // For now, we'll generate the patch and provide instructions
    // Full GitHub branch creation would require auth
    setIsLoading(true)

    try {
      const patch = generatePatch(pr, selectedFiles)
      const filename = `${branchName}.patch`
      downloadPatch(patch, filename)

      // Show instructions
      alert(
        `Patch downloaded as ${filename}\n\n` +
        `To apply:\n` +
        `1. git checkout -b ${branchName}\n` +
        `2. git apply ${filename}\n` +
        `3. git commit -m "Apply selected changes from PR #${pr.number}"`
      )

      onClose()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gh-bg-secondary rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="p-4 border-b border-gh-border">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <span>🛒</span>
              <span>Checkout</span>
            </h2>
            <button
              onClick={onClose}
              className="text-gh-text-muted hover:text-gh-text p-1"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Summary */}
        <div className="p-4 border-b border-gh-border">
          <div className="bg-gh-bg rounded-lg p-3 text-sm">
            <div className="flex justify-between mb-2">
              <span className="text-gh-text-muted">Files selected</span>
              <span className="font-mono">{stats.files}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gh-text-muted">Lines added</span>
              <span className="font-mono text-gh-green">+{stats.additions}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gh-text-muted">Lines removed</span>
              <span className="font-mono text-gh-red">-{stats.deletions}</span>
            </div>
          </div>
        </div>

        {/* Mode selection */}
        <div className="p-4 space-y-4">
          {/* Download patch option */}
          <label className="flex items-start gap-3 p-3 border border-gh-border rounded-lg cursor-pointer hover:bg-gh-bg/50">
            <input
              type="radio"
              name="mode"
              value="patch"
              checked={mode === 'patch'}
              onChange={() => setMode('patch')}
              className="mt-1"
            />
            <div>
              <div className="font-medium">Download as patch file</div>
              <div className="text-sm text-gh-text-muted mt-1">
                Get a .patch file you can apply with <code className="bg-gh-bg px-1 rounded">git apply</code>
              </div>
            </div>
          </label>

          {/* Create branch option */}
          <label className="flex items-start gap-3 p-3 border border-gh-border rounded-lg cursor-pointer hover:bg-gh-bg/50">
            <input
              type="radio"
              name="mode"
              value="branch"
              checked={mode === 'branch'}
              onChange={() => setMode('branch')}
              className="mt-1"
            />
            <div className="flex-1">
              <div className="font-medium">Create branch with changes</div>
              <div className="text-sm text-gh-text-muted mt-1">
                Download patch with instructions to create a new branch
              </div>
              {mode === 'branch' && (
                <input
                  type="text"
                  placeholder="branch-name"
                  value={branchName}
                  onChange={(e) => setBranchName(e.target.value.replace(/\s+/g, '-'))}
                  className="mt-2 w-full px-3 py-2 text-sm bg-gh-bg border border-gh-border rounded focus:outline-none focus:ring-1 focus:ring-gh-blue"
                  onClick={(e) => e.stopPropagation()}
                />
              )}
            </div>
          </label>
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-gh-border flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 border border-gh-border text-gh-text-muted hover:text-gh-text rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={mode === 'patch' ? handleDownloadPatch : handleCreateBranch}
            disabled={mode === 'branch' && !branchName.trim()}
            className="flex-1 py-2 bg-gh-green hover:bg-gh-green/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
          >
            {isLoading ? 'Processing...' : mode === 'patch' ? 'Download Patch' : 'Download & Instructions'}
          </button>
        </div>
      </div>
    </div>
  )
}
