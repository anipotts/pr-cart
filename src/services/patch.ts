import type { PRFile, PRData } from '@/types'

/**
 * Generate a unified patch from selected files
 */
export function generatePatch(pr: PRData, selectedFiles: Set<string>): string {
  const patches: string[] = []

  for (const file of pr.files) {
    if (!selectedFiles.has(file.filename)) continue
    if (!file.patch) continue

    // Build the patch header
    const header = buildPatchHeader(file)
    patches.push(header + file.patch)
  }

  return patches.join('\n')
}

/**
 * Build the git patch header for a file
 */
function buildPatchHeader(file: PRFile): string {
  const lines: string[] = []

  // Handle renames
  if (file.status === 'renamed' && file.previousFilename) {
    lines.push(`diff --git a/${file.previousFilename} b/${file.filename}`)
    lines.push(`rename from ${file.previousFilename}`)
    lines.push(`rename to ${file.filename}`)
  } else {
    lines.push(`diff --git a/${file.filename} b/${file.filename}`)
  }

  // Add status-specific headers
  switch (file.status) {
    case 'added':
      lines.push('new file mode 100644')
      lines.push('--- /dev/null')
      lines.push(`+++ b/${file.filename}`)
      break
    case 'removed':
      lines.push('deleted file mode 100644')
      lines.push(`--- a/${file.filename}`)
      lines.push('+++ /dev/null')
      break
    default:
      lines.push(`--- a/${file.filename}`)
      lines.push(`+++ b/${file.filename}`)
  }

  return lines.join('\n') + '\n'
}

/**
 * Download a patch file
 */
export function downloadPatch(
  content: string,
  filename: string = 'prcart-selection.patch'
): void {
  const blob = new Blob([content], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  URL.revokeObjectURL(url)
}

/**
 * Get stats for a patch
 */
export function getPatchStats(pr: PRData, selectedFiles: Set<string>): {
  files: number
  additions: number
  deletions: number
} {
  let additions = 0
  let deletions = 0

  for (const file of pr.files) {
    if (selectedFiles.has(file.filename)) {
      additions += file.additions
      deletions += file.deletions
    }
  }

  return {
    files: selectedFiles.size,
    additions,
    deletions,
  }
}
