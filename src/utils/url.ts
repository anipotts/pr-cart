import type { ParsedPRUrl } from '@/types'

/**
 * Parse a GitHub PR URL into its components
 *
 * Supported formats:
 * - https://github.com/owner/repo/pull/123
 * - https://github.com/owner/repo/pull/123/files
 * - https://github.com/owner/repo/pull/123/commits
 * - github.com/owner/repo/pull/123
 * - owner/repo#123
 */
export function parsePRUrl(input: string): ParsedPRUrl | null {
  // Trim whitespace
  const url = input.trim()

  // Try owner/repo#123 format
  const shortMatch = url.match(/^([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)#(\d+)$/)
  if (shortMatch) {
    return {
      owner: shortMatch[1],
      repo: shortMatch[2],
      number: parseInt(shortMatch[3], 10),
    }
  }

  // Try full URL format
  try {
    // Add protocol if missing
    let normalizedUrl = url
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      normalizedUrl = 'https://' + url
    }

    const parsed = new URL(normalizedUrl)

    // Must be github.com
    if (!parsed.hostname.endsWith('github.com')) {
      return null
    }

    // Parse path: /owner/repo/pull/123[/...]
    const pathMatch = parsed.pathname.match(/^\/([^/]+)\/([^/]+)\/pull\/(\d+)/)
    if (pathMatch) {
      return {
        owner: pathMatch[1],
        repo: pathMatch[2],
        number: parseInt(pathMatch[3], 10),
      }
    }
  } catch {
    // Invalid URL
  }

  return null
}

/**
 * Build a GitHub PR URL from components
 */
export function buildPRUrl(owner: string, repo: string, number: number): string {
  return `https://github.com/${owner}/${repo}/pull/${number}`
}

/**
 * Build a GitHub compare URL for creating a new PR
 */
export function buildCompareUrl(
  owner: string,
  repo: string,
  base: string,
  head: string
): string {
  return `https://github.com/${owner}/${repo}/compare/${base}...${head}?expand=1`
}
