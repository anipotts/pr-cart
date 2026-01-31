import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PRCart - Shop your pull requests',
  description: 'Browse PR files like products. Add to cart. Download only what you need. No install required.',
  keywords: ['github', 'pull request', 'code review', 'developer tools', 'vibe coding'],
  authors: [{ name: 'Ani Potts' }],
  openGraph: {
    title: 'PRCart - Shop your pull requests',
    description: 'Browse PR files like products. Add to cart. Download only what you need.',
    url: 'https://prcart.dev',
    siteName: 'PRCart',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'PRCart - Shop your pull requests',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PRCart - Shop your pull requests',
    description: 'Browse PR files like products. Add to cart. Download only what you need.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-bg-primary text-text-primary antialiased">
        {children}
      </body>
    </html>
  )
}
