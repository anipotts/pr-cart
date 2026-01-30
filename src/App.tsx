import { useCartStore } from '@/stores/useCartStore'
import { Header } from '@/components/Header'
import { PRLoader } from '@/components/PRLoader'
import { FileList } from '@/components/FileList'
import { CartSummary } from '@/components/CartSummary'
import { DiffViewer } from '@/components/DiffViewer'

function App() {
  const { pr, isLoading, error } = useCartStore()

  return (
    <div className="min-h-screen bg-gh-bg text-gh-text flex flex-col">
      <Header />

      {!pr ? (
        <div className="flex-1 flex items-center justify-center p-8">
          <PRLoader />
        </div>
      ) : (
        <div className="flex-1 flex">
          {/* Left: File List */}
          <div className="w-1/3 border-r border-gh-border overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gh-border bg-gh-bg-secondary">
              <h2 className="text-lg font-semibold">Browse Changes</h2>
              <p className="text-sm text-gh-text-muted mt-1">
                {pr.files.length} files changed in this PR
              </p>
            </div>
            <FileList />
          </div>

          {/* Center: Diff Viewer */}
          <div className="flex-1 overflow-hidden flex flex-col">
            <DiffViewer />
          </div>

          {/* Right: Cart Summary */}
          <div className="w-72 border-l border-gh-border overflow-hidden flex flex-col">
            <CartSummary />
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gh-bg-secondary p-6 rounded-lg shadow-xl">
            <div className="animate-spin w-8 h-8 border-2 border-gh-blue border-t-transparent rounded-full mx-auto" />
            <p className="mt-4 text-gh-text-muted">Loading PR...</p>
          </div>
        </div>
      )}

      {/* Error Toast */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-gh-red text-white px-4 py-3 rounded-lg shadow-xl z-50 max-w-md">
          <div className="flex items-start gap-3">
            <span className="text-lg">!</span>
            <div className="flex-1">
              <p className="font-medium">Error</p>
              <p className="text-sm opacity-90">{error}</p>
            </div>
            <button
              onClick={() => useCartStore.getState().clearError()}
              className="opacity-70 hover:opacity-100"
            >
              x
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
