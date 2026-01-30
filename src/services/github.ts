import { Octokit } from '@octokit/rest'
import type { PRData, PRFile } from '@/types'

/**
 * Fetch PR data from GitHub API
 */
export async function fetchPR(
  owner: string,
  repo: string,
  number: number,
  token?: string
): Promise<PRData> {
  const octokit = new Octokit({
    auth: token,
  })

  // Fetch PR metadata and files in parallel
  const [prResponse, filesResponse] = await Promise.all([
    octokit.pulls.get({ owner, repo, pull_number: number }),
    octokit.pulls.listFiles({ owner, repo, pull_number: number, per_page: 300 }),
  ])

  const pr = prResponse.data
  const files = filesResponse.data

  // Map to our types
  const prFiles: PRFile[] = files.map(f => ({
    filename: f.filename,
    status: f.status as PRFile['status'],
    additions: f.additions,
    deletions: f.deletions,
    changes: f.changes,
    patch: f.patch,
    previousFilename: f.previous_filename,
    sha: f.sha,
    rawUrl: f.raw_url,
    blobUrl: f.blob_url,
  }))

  return {
    owner,
    repo,
    number,
    title: pr.title,
    body: pr.body || '',
    state: pr.merged ? 'merged' : (pr.state as 'open' | 'closed'),
    baseBranch: pr.base.ref,
    headBranch: pr.head.ref,
    baseSha: pr.base.sha,
    headSha: pr.head.sha,
    author: pr.user?.login || 'unknown',
    authorAvatar: pr.user?.avatar_url || '',
    files: prFiles,
    totalAdditions: pr.additions,
    totalDeletions: pr.deletions,
    htmlUrl: pr.html_url,
  }
}

/**
 * Create a new branch from a specific SHA
 */
export async function createBranch(
  owner: string,
  repo: string,
  branchName: string,
  sha: string,
  token: string
): Promise<void> {
  const octokit = new Octokit({ auth: token })

  await octokit.git.createRef({
    owner,
    repo,
    ref: `refs/heads/${branchName}`,
    sha,
  })
}

/**
 * Get the authenticated user
 */
export async function getAuthenticatedUser(token: string): Promise<{
  login: string
  avatarUrl: string
}> {
  const octokit = new Octokit({ auth: token })
  const { data } = await octokit.users.getAuthenticated()

  return {
    login: data.login,
    avatarUrl: data.avatar_url,
  }
}
