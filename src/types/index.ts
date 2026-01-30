/**
 * Core types for PRCart
 */

export interface PRFile {
  /** File path relative to repo root */
  filename: string;
  /** Change status */
  status: 'added' | 'modified' | 'removed' | 'renamed' | 'copied' | 'changed' | 'unchanged';
  /** Number of lines added */
  additions: number;
  /** Number of lines removed */
  deletions: number;
  /** Total changes */
  changes: number;
  /** Unified diff patch (may be undefined for binary files) */
  patch?: string;
  /** Previous filename (for renames) */
  previousFilename?: string;
  /** SHA of the blob */
  sha: string;
  /** Raw URL for the file */
  rawUrl?: string;
  /** Blob URL */
  blobUrl?: string;
}

export interface PRData {
  /** Repository owner */
  owner: string;
  /** Repository name */
  repo: string;
  /** PR number */
  number: number;
  /** PR title */
  title: string;
  /** PR description/body */
  body: string;
  /** PR state */
  state: 'open' | 'closed' | 'merged';
  /** Base branch */
  baseBranch: string;
  /** Head branch */
  headBranch: string;
  /** Base SHA */
  baseSha: string;
  /** Head SHA */
  headSha: string;
  /** Author username */
  author: string;
  /** Author avatar URL */
  authorAvatar: string;
  /** Files in the PR */
  files: PRFile[];
  /** Total additions across all files */
  totalAdditions: number;
  /** Total deletions across all files */
  totalDeletions: number;
  /** URL to the PR on GitHub */
  htmlUrl: string;
}

export interface CartState {
  /** Currently loaded PR data */
  pr: PRData | null;
  /** Set of selected filenames */
  selectedFiles: Set<string>;
  /** Loading state */
  isLoading: boolean;
  /** Error message if any */
  error: string | null;
  /** Currently previewed file */
  previewFile: string | null;
}

export interface CartActions {
  /** Load a PR from a GitHub URL */
  loadPR: (url: string, token?: string) => Promise<void>;
  /** Toggle a file's selection */
  toggleFile: (filename: string) => void;
  /** Select all files */
  selectAll: () => void;
  /** Deselect all files */
  deselectAll: () => void;
  /** Set the file to preview */
  setPreviewFile: (filename: string | null) => void;
  /** Clear the current PR */
  clearPR: () => void;
  /** Clear error */
  clearError: () => void;
}

export type CartStore = CartState & CartActions;

export interface ParsedPRUrl {
  owner: string;
  repo: string;
  number: number;
}

export interface CheckoutOptions {
  /** Type of checkout */
  type: 'patch' | 'branch';
  /** Branch name (for branch type) */
  branchName?: string;
  /** Commit message (for branch type) */
  commitMessage?: string;
}

export interface GitHubAuthState {
  /** Access token */
  token: string | null;
  /** Authenticated user */
  user: {
    login: string;
    avatarUrl: string;
  } | null;
  /** Is auth in progress */
  isAuthenticating: boolean;
}
