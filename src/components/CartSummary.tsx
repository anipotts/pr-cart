import { useState } from 'react'
import { useCartStore, useCartStats, useSelectedFiles } from '@/stores/useCartStore'
import { generatePatch, downloadPatch } from '@/services/patch'
import { CheckoutModal } from '@/components/CheckoutModal'

export function CartSummary() {
  const { pr, selectedFiles } = useCartStore()
  const stats = useCartStats()
  const selectedFilesList = useSelectedFiles()
  const [showCheckout, setShowCheckout] = useState(false)

  if (!pr) return null

  const isEmpty = selectedFiles.size === 0

  return (
    <div className="flex flex-col h-full">
      {/* Cart header */}
      <div className="p-4 border-b border-gh-border bg-gh-bg-secondary">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🛒</span>
          <h2 className="text-lg font-semibold">Your Cart</h2>
        </div>
      </div>

      {/* Cart stats */}
      <div className="p-4 space-y-4">
        <div className="bg-gh-bg-secondary rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gh-text-muted">Files</span>
            <span className="font-mono font-medium">
              {stats.files} / {pr.files.length}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gh-text-muted">Additions</span>
            <span className="font-mono text-gh-green">+{stats.additions}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gh-text-muted">Deletions</span>
            <span className="font-mono text-gh-red">-{stats.deletions}</span>
          </div>
          <div className="flex justify-between items-center border-t border-gh-border pt-3">
            <span className="text-gh-text-muted">Net change</span>
            <span className={`font-mono font-medium ${
              stats.additions - stats.deletions >= 0 ? 'text-gh-green' : 'text-gh-red'
            }`}>
              {stats.additions - stats.deletions >= 0 ? '+' : ''}{stats.additions - stats.deletions}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div>
          <div className="flex justify-between text-xs text-gh-text-muted mb-1">
            <span>Cart progress</span>
            <span>{Math.round((stats.files / pr.files.length) * 100)}%</span>
          </div>
          <div className="h-2 bg-gh-border rounded-full overflow-hidden">
            <div
              className="h-full bg-gh-green transition-all duration-300"
              style={{ width: `${(stats.files / pr.files.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Selected files preview */}
      {!isEmpty && (
        <div className="flex-1 overflow-y-auto border-t border-gh-border">
          <div className="p-3">
            <h3 className="text-sm font-medium text-gh-text-muted mb-2">In Cart:</h3>
            <div className="space-y-1">
              {selectedFilesList.slice(0, 10).map((file) => (
                <div
                  key={file.filename}
                  className="text-xs font-mono text-gh-text truncate"
                  title={file.filename}
                >
                  {file.filename.split('/').pop()}
                </div>
              ))}
              {selectedFilesList.length > 10 && (
                <div className="text-xs text-gh-text-muted">
                  +{selectedFilesList.length - 10} more files
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Checkout button */}
      <div className="p-4 border-t border-gh-border mt-auto">
        <button
          onClick={() => setShowCheckout(true)}
          disabled={isEmpty}
          className="w-full py-3 bg-gh-green hover:bg-gh-green/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <span>🛒</span>
          <span>Checkout ({stats.files} files)</span>
        </button>
        {isEmpty && (
          <p className="text-xs text-gh-text-muted text-center mt-2">
            Add files to your cart to checkout
          </p>
        )}
      </div>

      {/* Checkout modal */}
      {showCheckout && (
        <CheckoutModal onClose={() => setShowCheckout(false)} />
      )}
    </div>
  )
}
