'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams } from 'next/navigation'
import confetti from 'canvas-confetti'

interface PRFile {
  filename: string
  status: string
  additions: number
  deletions: number
  changes: number
  patch?: string
}

interface PRData {
  title: string
  number: number
  user: { login: string }
  html_url: string
  additions: number
  deletions: number
  changed_files: number
}

export default function ShopPage() {
  const params = useParams()
  const owner = params.owner as string
  const repo = params.repo as string
  const number = params.number as string

  const [pr, setPR] = useState<PRData | null>(null)
  const [files, setFiles] = useState<PRFile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cart, setCart] = useState<Set<string>>(new Set())
  const [cartOpen, setCartOpen] = useState(false)
  const [viewingDiff, setViewingDiff] = useState<PRFile | null>(null)
  const [checkoutDone, setCheckoutDone] = useState(false)
  const [patchContent, setPatchContent] = useState('')

  useEffect(() => {
    fetchPR()
  }, [owner, repo, number])

  async function fetchPR() {
    setLoading(true)
    setError('')

    try {
      // Fetch PR data
      const prRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls/${number}`)
      if (!prRes.ok) throw new Error('PR not found')
      const prData = await prRes.json()
      setPR(prData)

      // Fetch files
      const filesRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls/${number}/files`)
      if (!filesRes.ok) throw new Error('Could not fetch files')
      const filesData = await filesRes.json()
      setFiles(filesData)
    } catch (err: any) {
      setError(err.message || 'Failed to load PR')
    } finally {
      setLoading(false)
    }
  }

  function toggleCart(filename: string) {
    setCart(prev => {
      const next = new Set(prev)
      if (next.has(filename)) {
        next.delete(filename)
      } else {
        next.add(filename)
      }
      return next
    })
  }

  function addAllToCart() {
    setCart(new Set(files.map(f => f.filename)))
  }

  function clearCart() {
    setCart(new Set())
  }

  function generatePatch(): string {
    const selectedFiles = files.filter(f => cart.has(f.filename))
    const patches = selectedFiles
      .filter(f => f.patch)
      .map(f => {
        const header = `diff --git a/${f.filename} b/${f.filename}\n--- a/${f.filename}\n+++ b/${f.filename}`
        return `${header}\n${f.patch}`
      })
    return patches.join('\n\n')
  }

  function handleCheckout() {
    const patch = generatePatch()
    setPatchContent(patch)
    setCheckoutDone(true)
    setCartOpen(false)

    // Confetti!
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    })
  }

  function downloadPatch() {
    const blob = new Blob([patchContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `pr-${number}-selected.patch`
    a.click()
    URL.revokeObjectURL(url)
  }

  const cartItems = files.filter(f => cart.has(f.filename))
  const cartAdditions = cartItems.reduce((sum, f) => sum + f.additions, 0)
  const cartDeletions = cartItems.reduce((sum, f) => sum + f.deletions, 0)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-accent-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-text-secondary">Loading PR #{number}...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-accent-danger text-xl mb-4">{error}</p>
          <a href="/" className="text-accent-primary hover:underline">
            ← Back to home
          </a>
        </div>
      </div>
    )
  }

  if (checkoutDone) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-md"
        >
          <span className="text-6xl block mb-6">🎉</span>
          <h1 className="text-3xl font-bold mb-4">Order Complete!</h1>
          <p className="text-text-secondary mb-8">
            Your patch with {cart.size} files is ready.
          </p>
          <div className="space-y-4">
            <button
              onClick={downloadPatch}
              className="w-full px-6 py-3 bg-accent-primary hover:bg-accent-primary/90 text-white font-medium rounded-lg transition-colors"
            >
              Download Patch File
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(patchContent)
              }}
              className="w-full px-6 py-3 bg-bg-secondary hover:bg-bg-card text-text-primary font-medium rounded-lg border border-border transition-colors"
            >
              Copy to Clipboard
            </button>
            <a
              href="/"
              className="block text-text-secondary hover:text-text-primary transition-colors"
            >
              ← Shop another PR
            </a>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-bg-primary/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/" className="flex items-center gap-2">
              <span className="text-2xl">🛒</span>
              <span className="font-semibold hidden sm:inline">PRCart</span>
            </a>
            <span className="text-text-muted">/</span>
            <span className="text-text-secondary truncate max-w-[200px] sm:max-w-none">
              {owner}/{repo} #{number}
            </span>
          </div>
          <button
            onClick={() => setCartOpen(true)}
            className="relative flex items-center gap-2 px-4 py-2 bg-bg-secondary hover:bg-bg-card rounded-lg border border-border transition-colors"
          >
            <span>🛒</span>
            <span className="hidden sm:inline">Cart</span>
            {cart.size > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-accent-primary text-white text-xs rounded-full flex items-center justify-center">
                {cart.size}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* PR Info */}
      <div className="border-b border-border bg-bg-secondary/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-xl font-semibold mb-2">{pr?.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary">
            <span>{pr?.changed_files} files</span>
            <span className="text-accent-success">+{pr?.additions}</span>
            <span className="text-accent-danger">-{pr?.deletions}</span>
            <a
              href={pr?.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-primary hover:underline"
            >
              View on GitHub →
            </a>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-4">
          <button
            onClick={addAllToCart}
            className="text-sm text-accent-primary hover:underline"
          >
            Add all to cart
          </button>
          <button
            onClick={clearCart}
            className="text-sm text-text-secondary hover:text-text-primary"
          >
            Clear cart
          </button>
          <span className="flex-1" />
          <span className="text-sm text-text-muted">
            {cart.size} of {files.length} selected
          </span>
        </div>
      </div>

      {/* Product Grid */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {files.map((file) => (
            <ProductCard
              key={file.filename}
              file={file}
              inCart={cart.has(file.filename)}
              onToggle={() => toggleCart(file.filename)}
              onViewDiff={() => setViewingDiff(file)}
            />
          ))}
        </div>
      </main>

      {/* Cart Drawer */}
      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setCartOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-bg-primary border-l border-border z-50 flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h2 className="text-lg font-semibold">Your Cart ({cart.size})</h2>
                <button
                  onClick={() => setCartOpen(false)}
                  className="p-2 hover:bg-bg-secondary rounded-lg transition-colors"
                >
                  ✕
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {cartItems.length === 0 ? (
                  <p className="text-text-secondary text-center py-8">
                    Your cart is empty
                  </p>
                ) : (
                  cartItems.map((file) => (
                    <div
                      key={file.filename}
                      className="flex items-center justify-between p-3 bg-bg-secondary rounded-lg"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm truncate">{file.filename}</p>
                        <p className="text-xs text-text-muted">
                          <span className="text-accent-success">+{file.additions}</span>{' '}
                          <span className="text-accent-danger">-{file.deletions}</span>
                        </p>
                      </div>
                      <button
                        onClick={() => toggleCart(file.filename)}
                        className="p-1 text-text-muted hover:text-accent-danger transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                  ))
                )}
              </div>
              {cart.size > 0 && (
                <div className="p-4 border-t border-border space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Total</span>
                    <span>
                      {cart.size} files,{' '}
                      <span className="text-accent-success">+{cartAdditions}</span>{' '}
                      <span className="text-accent-danger">-{cartDeletions}</span>
                    </span>
                  </div>
                  <button
                    onClick={handleCheckout}
                    className="w-full py-3 bg-accent-success hover:bg-accent-success/90 text-white font-medium rounded-lg transition-colors"
                  >
                    Checkout →
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Diff Modal */}
      <AnimatePresence>
        {viewingDiff && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setViewingDiff(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-4 sm:inset-8 bg-bg-primary border border-border rounded-xl z-50 flex flex-col overflow-hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h2 className="font-mono text-sm truncate">{viewingDiff.filename}</h2>
                <button
                  onClick={() => setViewingDiff(null)}
                  className="p-2 hover:bg-bg-secondary rounded-lg transition-colors"
                >
                  ✕
                </button>
              </div>
              <div className="flex-1 overflow-auto p-4">
                <pre className="font-mono text-sm whitespace-pre-wrap">
                  {viewingDiff.patch?.split('\n').map((line, i) => (
                    <div
                      key={i}
                      className={
                        line.startsWith('+') && !line.startsWith('+++')
                          ? 'bg-accent-success/20 text-accent-success'
                          : line.startsWith('-') && !line.startsWith('---')
                          ? 'bg-accent-danger/20 text-accent-danger'
                          : 'text-text-secondary'
                      }
                    >
                      {line}
                    </div>
                  )) || <span className="text-text-muted">No diff available</span>}
                </pre>
              </div>
              <div className="p-4 border-t border-border flex justify-end gap-3">
                <button
                  onClick={() => setViewingDiff(null)}
                  className="px-4 py-2 text-text-secondary hover:text-text-primary transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    toggleCart(viewingDiff.filename)
                    setViewingDiff(null)
                  }}
                  className="px-4 py-2 bg-accent-primary hover:bg-accent-primary/90 text-white rounded-lg transition-colors"
                >
                  {cart.has(viewingDiff.filename) ? 'Remove from Cart' : 'Add to Cart'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

function ProductCard({
  file,
  inCart,
  onToggle,
  onViewDiff
}: {
  file: PRFile
  inCart: boolean
  onToggle: () => void
  onViewDiff: () => void
}) {
  const statusColors: Record<string, string> = {
    added: 'text-accent-success',
    modified: 'text-accent-warning',
    removed: 'text-accent-danger',
    renamed: 'text-accent-primary',
  }

  return (
    <motion.div
      layout
      whileHover={{ y: -2 }}
      className={`p-4 rounded-xl border transition-colors ${
        inCart
          ? 'bg-accent-primary/10 border-accent-primary'
          : 'bg-bg-card border-border hover:border-border/80'
      }`}
    >
      {/* Preview */}
      <button
        onClick={onViewDiff}
        className="w-full h-24 bg-bg-primary rounded-lg mb-3 overflow-hidden text-left"
      >
        <pre className="p-2 text-xs text-text-muted font-mono overflow-hidden">
          {file.patch?.slice(0, 200) || 'No preview available'}
        </pre>
      </button>

      {/* Info */}
      <div className="mb-3">
        <p className="font-mono text-sm truncate mb-1" title={file.filename}>
          {file.filename.split('/').pop()}
        </p>
        <p className="text-xs text-text-muted truncate" title={file.filename}>
          {file.filename.includes('/') ? file.filename.split('/').slice(0, -1).join('/') : '/'}
        </p>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between mb-3 text-sm">
        <span className={statusColors[file.status] || 'text-text-secondary'}>
          {file.status}
        </span>
        <span>
          <span className="text-accent-success">+{file.additions}</span>{' '}
          <span className="text-accent-danger">-{file.deletions}</span>
        </span>
      </div>

      {/* Add to Cart */}
      <button
        onClick={onToggle}
        className={`w-full py-2 rounded-lg font-medium transition-colors ${
          inCart
            ? 'bg-accent-primary text-white'
            : 'bg-bg-secondary hover:bg-bg-card-hover text-text-primary border border-border'
        }`}
      >
        {inCart ? '✓ In Cart' : 'Add to Cart'}
      </button>
    </motion.div>
  )
}
