import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { extname, resolve, sep } from 'node:path'
import { parseArgs } from 'node:util'

const { values } = parseArgs({ options: { port: { type: 'string', default: '4173' } } })
const port = Number(values.port)
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('--port must be an integer between 1 and 65535.')
}
const root = resolve('dist')
const { base } = JSON.parse(await readFile(resolve(root, 'build.json'), 'utf8'))
const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ico': 'image/x-icon',
}

async function readOptional(path) {
  try {
    return await readFile(path)
  } catch (error) {
    if (error.code === 'ENOENT' || error.code === 'EISDIR' || error.code === 'ENOTDIR') return null
    throw error
  }
}

const server = createServer(async (request, response) => {
  try {
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      response.writeHead(405, { Allow: 'GET, HEAD' }).end('Method not allowed')
      return
    }
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname)
    if (!pathname.startsWith(base)) {
      response.writeHead(404).end('Not found')
      return
    }
    const relative = pathname.slice(base.length)
    let path = resolve(root, ...relative.split('/'))
    if (path !== root && !path.startsWith(`${root}${sep}`)) {
      response.writeHead(403).end('Forbidden')
      return
    }
    if (!relative || relative === 'en/' || relative === 'de/') {
      path = resolve(path, 'index.html')
    }
    let body = await readOptional(path)
    // Each language is an independent SPA with its own numeric and presenter routes.
    if (body === null && !extname(relative) && /^(en|de)\//.test(relative)) {
      path = resolve(root, relative.split('/')[0], 'index.html')
      body = await readOptional(path)
    }
    if (body === null) {
      response.writeHead(404).end('Not found')
      return
    }
    response.writeHead(200, {
      'Content-Type': contentTypes[extname(path)] ?? 'application/octet-stream',
      'Cache-Control': 'no-cache',
    })
    response.end(request.method === 'HEAD' ? undefined : body)
  } catch (error) {
    console.error('Preview request failed:', error)
    response.writeHead(error instanceof URIError ? 400 : 500).end('Preview request failed')
  }
})
server.on('error', error => {
  console.error('Preview server failed:', error)
  process.exitCode = 1
})
server.listen(port, '127.0.0.1', () => {
  console.log(`Preview: http://localhost:${port}${base}`)
})
