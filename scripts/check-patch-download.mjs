import { createHash } from 'node:crypto'
import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { basename, join, resolve } from 'node:path'
import { spawnSync } from 'node:child_process'

// Validate the original downloaded bytes. Never append/normalize/repair them.
const [baseFlag, base, ...downloads] = process.argv.slice(2)
if (baseFlag !== '--base' || !base || downloads.length === 0) {
  console.error('Usage: pnpm test:download --base <base-commit> <download.patch> [...]')
  process.exit(1)
}

function git(args, options = {}) {
  const result = spawnSync('git', args, { maxBuffer: 32 * 1024 * 1024, ...options })
  if (result.status !== 0) throw new Error(result.stderr?.toString() || `git exited ${result.status}`)
  return result.stdout
}

const receipt = []
try {
  const commit = git(['rev-parse', '--verify', `${base}^{commit}`]).toString().trim()
  const archive = git(['archive', '--format=tar', commit])
  for (const path of downloads) {
    const bytes = readFileSync(resolve(path))
    const entry = {
      download: basename(path),
      base: commit,
      bytes: bytes.length,
      sha256: createHash('sha256').update(bytes).digest('hex'),
      endsWithNewline: bytes.at(-1) === 10,
    }
    receipt.push(entry)
    if (!entry.endsWithNewline) throw new Error(`${entry.download}: missing final patch newline`)
    const dir = mkdtempSync(join(tmpdir(), 'prcart-download-'))
    try {
      const unpack = spawnSync('tar', ['-xf', '-'], { cwd: dir, input: archive })
      if (unpack.status !== 0) throw new Error('Could not extract the disposable base tree')
      entry.numstat = git(['apply', '--numstat', '-'], { cwd: dir, input: bytes }).toString().trim()
      git(['apply', '--check', '-'], { cwd: dir, input: bytes })
      git(['apply', '-'], { cwd: dir, input: bytes })
      entry.applied = true
    } finally {
      rmSync(dir, { recursive: true, force: true })
    }
  }
  console.log(JSON.stringify({ ok: true, downloads: receipt }, null, 2))
} catch (error) {
  console.error(JSON.stringify({ ok: false, downloads: receipt, error: error.message }, null, 2))
  process.exitCode = 1
}
