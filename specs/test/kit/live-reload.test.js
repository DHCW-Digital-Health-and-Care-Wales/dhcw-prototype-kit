import assert from 'node:assert/strict'
import { cp, mkdir, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { describe, it } from 'node:test'

import { rootDirectory } from '../../../src/kit/paths.js'
import { fixtureDirectory, startPrototype } from '../helpers.js'

const workingDirectory = join(rootDirectory, 'build/live-reload-test')

async function nextVersion(reader) {
  const { value } = await reader.read()
  return new TextDecoder().decode(value).match(/data: (\S+)/)[1]
}

describe('live reload', () => {
  it('tells open pages when a view changes, and shows the new content', { timeout: 15000 }, async (context) => {
    await rm(workingDirectory, { recursive: true, force: true })
    await mkdir(workingDirectory, { recursive: true })
    await cp(fixtureDirectory, workingDirectory, { recursive: true })
    const prototype = await startPrototype({ prototypeDirectory: workingDirectory, watch: true })
    const stream = await fetch(`${prototype.address}/prototype-admin/live-reload`)
    const reader = stream.body.getReader()

    context.after(async () => {
      await reader.cancel()
      await prototype.stop()
      await rm(workingDirectory, { recursive: true, force: true })
    })

    assert.match((await prototype.get('/start')).body, /live-reload\.js/)
    const first = await nextVersion(reader)

    await writeFile(join(workingDirectory, 'views/start.html'), 'Changed page\n')

    assert.notEqual(await nextVersion(reader), first)
    assert.match((await prototype.get('/start')).body, /Changed page/)
  })
})
