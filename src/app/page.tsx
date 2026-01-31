'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

export default function LandingPage() {
  const [url, setUrl] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Parse GitHub PR URL
    const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)\/pull\/(\d+)/)
    if (!match) {
      setError('Paste a GitHub PR URL like: https://github.com/owner/repo/pull/123')
      return
    }

    const [, owner, repo, number] = match
    router.push(`/github/${owner}/${repo}/pull/${number}`)
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 border-b border-border/50 bg-bg-primary/80 backdrop-blur-lg">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🛒</span>
            <span className="font-semibold text-lg">PRCart</span>
          </div>
          <a
            href="https://github.com/anipotts/pr-cart"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6">
            Shop your{' '}
            <span className="text-accent-primary">pull requests</span>
          </h1>
          <p className="text-lg sm:text-xl text-text-secondary mb-10">
            AI tools make massive PRs. Browse files like products.<br />
            Add to cart. Download only what you need.
          </p>

          {/* URL Input */}
          <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto">
            <div className="relative">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste a GitHub PR URL..."
                className="w-full px-5 py-4 bg-bg-secondary border border-border rounded-xl text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2 bg-accent-primary hover:bg-accent-primary/90 text-white font-medium rounded-lg transition-colors"
              >
                Shop →
              </button>
            </div>
            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-accent-danger text-sm mt-3"
              >
                {error}
              </motion.p>
            )}
          </form>

          {/* Example */}
          <p className="text-text-muted text-sm mt-4">
            Try:{' '}
            <button
              onClick={() => setUrl('https://github.com/facebook/react/pull/28000')}
              className="text-accent-primary hover:underline"
            >
              github.com/facebook/react/pull/28000
            </button>
          </p>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl w-full"
        >
          <FeatureCard
            emoji="🛍️"
            title="Browse files"
            description="See each changed file as a product with diff preview"
          />
          <FeatureCard
            emoji="🛒"
            title="Add to cart"
            description="Pick exactly which files you want to keep"
          />
          <FeatureCard
            emoji="📦"
            title="Download patch"
            description="Get a .patch file with only your selected changes"
          />
        </motion.div>

        {/* Terminal users */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <p className="text-text-muted text-sm">
            Prefer the terminal?{' '}
            <a
              href="https://github.com/anipotts/gh-cart"
              className="text-accent-primary hover:underline"
            >
              Try gh cart
            </a>
          </p>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-text-muted text-sm">
          <p>© 2025 PRCart. MIT License.</p>
          <div className="flex items-center gap-6">
            <a href="https://github.com/anipotts/pr-cart" className="hover:text-text-primary transition-colors">
              GitHub
            </a>
            <a href="https://github.com/anipotts/gh-cart" className="hover:text-text-primary transition-colors">
              CLI
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ emoji, title, description }: { emoji: string; title: string; description: string }) {
  return (
    <div className="p-6 bg-bg-secondary rounded-xl border border-border hover:border-border/80 transition-colors">
      <span className="text-3xl mb-4 block">{emoji}</span>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-text-secondary text-sm">{description}</p>
    </div>
  )
}
