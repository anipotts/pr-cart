import { useState } from 'react'
import { useCartStore } from '@/stores/useCartStore'

export function PRLoader() {
  const [url, setUrl] = useState('')
  const { loadPR, isLoading } = useCartStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim()) return
    await loadPR(url.trim())
  }

  const handlePaste = async (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData('text')
    // Auto-submit if it looks like a GitHub PR URL
    if (pasted.includes('github.com') && pasted.includes('/pull/')) {
      e.preventDefault()
      setUrl(pasted)
      await loadPR(pasted.trim())
    }
  }

  return (
    <div className="w-full max-w-xl">
      <div className="text-center mb-8">
        <span className="text-6xl">🛒</span>
        <h1 className="text-3xl font-bold mt-4">PRCart</h1>
        <p className="text-gh-text-muted mt-2">
          Shop your pull requests. Keep what you need.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="pr-url" className="block text-sm font-medium mb-2">
            Paste a GitHub PR URL
          </label>
          <input
            id="pr-url"
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onPaste={handlePaste}
            placeholder="https://github.com/owner/repo/pull/123"
            className="w-full px-4 py-3 bg-gh-bg-secondary border border-gh-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gh-blue focus:border-transparent text-gh-text placeholder:text-gh-text-muted"
            disabled={isLoading}
            autoFocus
          />
          <p className="text-xs text-gh-text-muted mt-2">
            Or use short format: owner/repo#123
          </p>
        </div>

        <button
          type="submit"
          disabled={!url.trim() || isLoading}
          className="w-full py-3 bg-gh-green hover:bg-gh-green/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
              Loading...
            </span>
          ) : (
            'Load PR'
          )}
        </button>
      </form>

      <div className="mt-8 text-center text-sm text-gh-text-muted">
        <p>
          Works with public repositories. For private repos,{' '}
          <a href="#" className="text-gh-blue hover:underline">
            sign in with GitHub
          </a>
          .
        </p>
      </div>

      {/* Example URLs */}
      <div className="mt-8 p-4 bg-gh-bg-secondary rounded-lg">
        <p className="text-sm font-medium mb-2">Try an example:</p>
        <div className="space-y-2">
          {[
            'facebook/react/pull/28000',
            'vercel/next.js/pull/60000',
            'microsoft/vscode/pull/200000',
          ].map((example) => (
            <button
              key={example}
              onClick={() => {
                const fullUrl = `https://github.com/${example}`
                setUrl(fullUrl)
                loadPR(fullUrl)
              }}
              className="block w-full text-left text-sm text-gh-blue hover:underline"
            >
              github.com/{example}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
