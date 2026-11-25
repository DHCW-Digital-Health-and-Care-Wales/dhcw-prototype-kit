import { randomUUID } from 'node:crypto'
import { watch } from 'node:fs'

const reloadFolders = new Set(['assets', 'scripts', 'stylesheets', 'views'])
const settleTime = 100

export function createLiveReload(prototypeDirectory) {
  const instance = randomUUID()
  const clients = new Set()
  let changes = 0
  let timer

  function send(client) {
    client.write(`data: ${instance}-${changes}\n\n`)
  }

  const watcher = watch(prototypeDirectory, { recursive: true }, (event, file) => {
    if (!file || !reloadFolders.has(file.split(/[\\/]/)[0])) {
      return
    }

    clearTimeout(timer)
    timer = setTimeout(() => {
      changes += 1
      clients.forEach(send)
    }, settleTime)
  })

  return {
    connect(request, response) {
      response.writeHead(200, {
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        'Content-Type': 'text/event-stream'
      })
      clients.add(response)
      request.on('close', () => clients.delete(response))
      send(response)
    },
    close() {
      clearTimeout(timer)
      watcher.close()
      clients.forEach((client) => client.end())
    }
  }
}
