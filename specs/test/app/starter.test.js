import assert from 'node:assert/strict'
import { after, before, describe, it } from 'node:test'

import { starterDirectory, startPrototype } from '../helpers.js'

describe('the starter prototype', () => {
  let prototype

  before(async () => {
    prototype = await startPrototype({ prototypeDirectory: starterDirectory })
  })

  after(() => prototype.stop())

  it('shows the starter page', async () => {
    const response = await prototype.get('/')
    assert.equal(response.status, 200)
    assert.match(response.body, /<h1 class="nhsw-h1">Your prototype<\/h1>/)
    assert.match(response.body, /class="nhsw-site-header"/)
    assert.match(response.body, /class="nhsw-phase-banner/)
    assert.match(response.body, /id="maincontent"/)
    assert.match(response.body, /class="nhsw-site-footer"/)
  })

  for (const path of ['/stylesheets/main.css', '/scripts/main.js']) {
    it(`serves ${path}`, async () => {
      assert.equal((await prototype.get(path)).status, 200)
    })
  }
})
