import { spawn } from 'node:child_process'
import { copyFile, mkdir, rm, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { parseArgs } from 'node:util'

const { values } = parseArgs({ options: { base: { type: 'string', default: '/' } } })
const base = values.base
if (!/^\/(?:[a-zA-Z0-9_-]+\/)*$/.test(base)) {
  throw new Error('--base must start and end with / and contain only URL-safe path segments.')
}

const cli = resolve('node_modules', '@slidev', 'cli', 'bin', 'slidev.mjs')
for (const language of ['en', 'de']) {
  const output = resolve('dist', language)
  await rm(output, { recursive: true, force: true })
  const args = [cli, 'build', resolve('decks', `${language}.md`),
    '--out', output, '--base', `${base}${language}/`, '--without-notes']
  await new Promise((resolveBuild, reject) => {
    const child = spawn(process.execPath, args, { stdio: 'inherit' })
    child.once('error', reject)
    child.once('exit', (code, signal) => {
      if (code === 0) resolveBuild()
      else reject(new Error(`Slidev ${language} build failed (${signal ?? code}).`))
    })
  })
}
await mkdir('dist', { recursive: true })
await copyFile('landing.html', resolve('dist', 'index.html'))
await writeFile(resolve('dist', 'build.json'), JSON.stringify({ base }))
console.log(`Both decks built. Run npm run preview and open http://localhost:4173${base}`)
