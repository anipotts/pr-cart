import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { copyFileSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import test from 'node:test'
import { generateSelectedPatch } from '../src/lib/patch.ts'

const fixtures = join(dirname(fileURLToPath(import.meta.url)), 'fixtures')
const cases = [
  ['package.json', 'preview-package.patch'],
  ['wrangler.toml', 'production-wrangler.patch'],
]
const files = cases.map(([filename, fixture]) => ({
  filename,
  // GitHub's patch field starts at the hunk, without file headers or final LF.
  patch: readFileSync(join(fixtures, fixture), 'utf8').split('\n').slice(3).join('\n'),
}))

function git(dir, args, input) {
  return spawnSync('git', args, { cwd: dir, input, encoding: 'utf8' })
}

function baseTree(t) {
  const dir = mkdtempSync(join(tmpdir(), 'prcart-patch-test-'))
  t.after(() => rmSync(dir, { recursive: true, force: true }))
  assert.equal(git(dir, ['init', '--quiet']).status, 0)
  for (const [filename] of cases) copyFileSync(join(fixtures, 'base', filename), join(dir, filename))
  return dir
}

function apply(dir, patch) {
  const stats = git(dir, ['apply', '--numstat', '-'], patch)
  assert.equal(stats.status, 0, stats.stderr)
  const check = git(dir, ['apply', '--check', '-'], patch)
  assert.equal(check.status, 0, check.stderr)
  const result = git(dir, ['apply', '-'], patch)
  assert.equal(result.status, 0, result.stderr)
  return stats.stdout
}

for (const [filename, fixture] of cases) {
  test(`real ${filename} download regression: Git rejects original, accepts serialized Blob`, async (t) => {
    const dir = baseTree(t)
    const original = readFileSync(join(fixtures, fixture))
    assert.notEqual(original.at(-1), 10)
    assert.notEqual(git(dir, ['apply', '--numstat', '-'], original).status, 0)

    const selected = files.filter((file) => file.filename === filename)
    const patch = generateSelectedPatch(selected)
    const blob = new Blob([patch], { type: 'text/plain' })
    const downloaded = Buffer.from(await blob.arrayBuffer())
    assert.equal(downloaded.at(-1), 10)
    assert.equal(downloaded.toString(), patch)
    assert.match(apply(dir, downloaded), new RegExp(filename.replace('.', '\\.')))
    assert.deepEqual(readFileSync(join(dir, filename)), readFileSync(join(fixtures, 'expected', filename)))
    const other = cases.find(([name]) => name !== filename)[0]
    assert.deepEqual(readFileSync(join(dir, other)), readFileSync(join(fixtures, 'base', other)))
  })
}

test('multiple selected files apply without duplicate headers or lost boundaries', (t) => {
  const dir = baseTree(t)
  const stats = apply(dir, generateSelectedPatch(files))
  assert.equal(stats.trim().split('\n').length, 2)
  for (const [filename] of cases) {
    assert.deepEqual(readFileSync(join(dir, filename)), readFileSync(join(fixtures, 'expected', filename)))
  }
})

test('explicit no-newline markers preserve source-file bytes', (t) => {
  const dir = baseTree(t)
  writeFileSync(join(dir, 'message.txt'), 'before')
  const patch = generateSelectedPatch([{
    filename: 'message.txt',
    patch: '@@ -1 +1 @@\n-before\n\\ No newline at end of file\n+after\n\\ No newline at end of file',
  }])
  apply(dir, patch)
  assert.equal(readFileSync(join(dir, 'message.txt'), 'utf8'), 'after')
})

test('context whitespace and an existing hunk terminator remain intact', (t) => {
  const dir = baseTree(t)
  writeFileSync(join(dir, 'spaces.txt'), 'keep  \nbefore\n')
  const hunk = '@@ -1,2 +1,2 @@\n keep  \n-before\n+after\n'
  apply(dir, generateSelectedPatch([{ filename: 'spaces.txt', patch: hunk }]))
  assert.equal(readFileSync(join(dir, 'spaces.txt'), 'utf8'), 'keep  \nafter\n')
})

test('empty or unavailable GitHub patches do not fabricate patch data', () => {
  assert.equal(generateSelectedPatch([]), '')
  assert.equal(generateSelectedPatch([{ filename: 'binary.png' }, { filename: 'empty.txt', patch: '' }]), '')
})

test('download validator applies untouched bytes to a disposable real base and rejects corrupt download', (t) => {
  const dir = baseTree(t)
  assert.equal(git(dir, ['add', 'package.json', 'wrangler.toml']).status, 0)
  assert.equal(git(dir, ['-c', 'user.name=PRCart test', '-c', 'user.email=prcart@example.invalid', 'commit', '--quiet', '-m', 'synthetic test base']).status, 0)
  const checker = fileURLToPath(new URL('../scripts/check-patch-download.mjs', import.meta.url))
  const path = join(dir, 'browser-download.patch')
  writeFileSync(path, generateSelectedPatch(files))
  const valid = spawnSync(process.execPath, [checker, '--base', 'HEAD', path], { cwd: dir, encoding: 'utf8' })
  assert.equal(valid.status, 0, valid.stderr)
  assert.equal(JSON.parse(valid.stdout).downloads[0].applied, true)
  // Checker applies only inside its own disposable copy, never the source tree.
  assert.deepEqual(readFileSync(join(dir, 'package.json')), readFileSync(join(fixtures, 'base', 'package.json')))
  writeFileSync(path, readFileSync(join(fixtures, 'preview-package.patch')))
  const invalid = spawnSync(process.execPath, [checker, '--base', 'HEAD', path], { cwd: dir, encoding: 'utf8' })
  assert.notEqual(invalid.status, 0)
  assert.match(invalid.stderr, /missing final patch newline/)
})
