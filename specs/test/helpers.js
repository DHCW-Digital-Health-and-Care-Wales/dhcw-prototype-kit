import { once } from 'node:events'
import { join } from 'node:path'

import { createApp } from '../../src/kit/app.js'
import { rootDirectory } from '../../src/kit/paths.js'

export const fixtureDirectory = join(rootDirectory, 'specs/test/fixtures/app')
export const starterDirectory = join(rootDirectory, 'src/app')
export const exampleDirectory = join(rootDirectory, 'examples/question-journey')

export async function startPrototype({ prototypeDirectory = fixtureDirectory, environment = {}, watch = false } = {}) {
  const prototype = await createApp({ prototypeDirectory, environment, watch })
  const server = prototype.app.listen(0, '127.0.0.1')
  await once(server, 'listening')

  const address = `http://127.0.0.1:${server.address().port}`
  let cookies = new Map()

  async function request(path, { method = 'GET', form, headers = {} } = {}) {
    const response = await fetch(address + path, {
      method,
      redirect: 'manual',
      headers: {
        ...headers,
        cookie: [...cookies].map(([name, value]) => `${name}=${value}`).join('; '),
        ...(form && { 'content-type': 'application/x-www-form-urlencoded' })
      },
      body: form && new URLSearchParams(form).toString()
    })

    for (const cookie of response.headers.getSetCookie()) {
      const [name, value] = cookie.split(';')[0].split('=')
      cookies.set(name, value)
    }

    return {
      status: response.status,
      headers: response.headers,
      location: response.headers.get('location'),
      body: await response.text()
    }
  }

  return {
    address,
    get: (path, options) => request(path, options),
    post: (path, form = [], options = {}) => request(path, { ...options, method: 'POST', form }),
    forgetCookies: () => {
      cookies = new Map()
    },
    async stop() {
      prototype.close()
      server.closeAllConnections()
      server.close()
      await once(server, 'close')
    }
  }
}
