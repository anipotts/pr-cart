export interface PatchFile {
  filename: string
  patch?: string
}

/** Serialize selected GitHub text hunks as a line-terminated unified patch. */
export function generateSelectedPatch(files: readonly PatchFile[]): string {
  return files
    .filter((file) => file.patch)
    .map((file) => {
      const header = `diff --git a/${file.filename} b/${file.filename}\n--- a/${file.filename}\n+++ b/${file.filename}\n`
      const hunk = file.patch!
      // This terminates the diff record, not the source file. Preserve explicit
      // "No newline at end of file" markers and all context whitespace.
      return header + hunk + (hunk.endsWith('\n') ? '' : '\n')
    })
    .join('\n')
}
