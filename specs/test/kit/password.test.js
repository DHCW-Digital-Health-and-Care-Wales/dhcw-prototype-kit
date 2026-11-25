import assert from 'node:assert/strict'
import { after, before, beforeEach, describe, it } from 'node:test'

import { toLocalPath } from '../../../src/kit/local-path.js'
import { startPrototype } from '../helpers.js'

const environment = { NODE_ENV: 'production', PROTOTYPE_PASSWORD: 'correct horse' }

describe('a published prototype', () => {
  let prototype

  before(async () => {
    prototype = await startPrototype({ environment })
  })

  beforeEach(() => prototype.forgetCookies())

  after(() => prototype.stop())

  for (const path of ['/', '/start', '/assets/note.txt', '/stylesheets/main.css', '/prototype-admin/reset']) {
    it(`asks for a password before showing ${path}`, async () => {
      const response = await prototype.get(path)
      assert.equal(response.status, 302)
      assert.equal(response.location, `/prototype-admin/password?returnURL=${encodeURIComponent(path)}`)
    })
  }

  it('shows the password page with its styles', async () => {
    const response = await prototype.get('/prototype-admin/password')
    assert.equal(response.status, 200)
    assert.match(response.body, /type="password"/)
    assert.equal((await prototype.get('/nhsw/nhsw.min.css')).status, 200)
  })

  it('refuses the wrong password', async () => {
    const response = await prototype.post('/prototype-admin/password', [['password', 'wrong']])
    assert.equal(response.status, 401)
    assert.match(response.body, /The password is not correct/)
    assert.equal((await prototype.get('/start')).status, 302)
  })

  it('lets someone in with the right password', async () => {
    const response = await prototype.post('/prototype-admin/password', [
      ['password', 'correct horse'],
      ['returnURL', '/start']
    ])
    assert.equal(response.status, 303)
    assert.equal(response.location, '/start')
    assert.match(response.headers.get('set-cookie'), /HttpOnly/)
    assert.equal((await prototype.get('/start')).status, 200)
  })

  it('does not send people to another website after signing in', async () => {
    const response = await prototype.post('/prototype-admin/password', [
      ['password', 'correct horse'],
      ['returnURL', '//example.com']
    ])
    assert.equal(response.location, '/')
  })

  it('redirects insecure requests to HTTPS', async () => {
    const response = await prototype.get('/start', { headers: { 'x-forwarded-proto': 'http' } })
    assert.equal(response.status, 302)
    assert.match(response.location, /^https:\/\//)
  })

  it('hides error details', async () => {
    await prototype.post('/prototype-admin/password', [['password', 'correct horse']])
    const response = await prototype.get('/fail')
    assert.equal(response.status, 500)
    assert.doesNotMatch(response.body, /This route is broken/)
  })

  it('does not reload pages automatically', async () => {
    const response = await prototype.get('/prototype-admin/password')
    assert.doesNotMatch(response.body, /live-reload/)
  })
})

describe('repeated wrong passwords', () => {
  it('are blocked after 10 attempts', async (context) => {
    const prototype = await startPrototype({ environment })
    context.after(() => prototype.stop())

    for (let attempt = 0; attempt < 10; attempt += 1) {
      assert.equal((await prototype.post('/prototype-admin/password', [['password', 'wrong']])).status, 401)
    }

    const response = await prototype.post('/prototype-admin/password', [['password', 'correct horse']])
    assert.equal(response.status, 429)
  })
})

describe('a published prototype without a password', () => {
  it('shows nothing but an explanation', async (context) => {
    const prototype = await startPrototype({ environment: { NODE_ENV: 'production' } })
    context.after(() => prototype.stop())

    const response = await prototype.get('/start')
    assert.equal(response.status, 401)
    assert.match(response.body, /PROTOTYPE_PASSWORD/)
    assert.doesNotMatch(response.body, /Start page/)
  })
})

describe('return addresses', () => {
  for (const unsafe of ['//example.com', 'https://example.com', '/\\example.com', '/\t/example.com', undefined, ['/a']]) {
    it(`replaces ${JSON.stringify(unsafe)} with the start page`, () => {
      assert.equal(toLocalPath(unsafe), '/')
    })
  }

  it('keeps a page in the prototype', () => {
    assert.equal(toLocalPath('/section/page?name=value'), '/section/page?name=value')
  })
})
