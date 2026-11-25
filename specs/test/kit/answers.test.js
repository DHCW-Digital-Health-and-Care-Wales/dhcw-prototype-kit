import assert from 'node:assert/strict'
import { after, before, beforeEach, describe, it } from 'node:test'

import { storeAnswers } from '../../../src/kit/middleware/session-data.js'
import { startPrototype } from '../helpers.js'

describe('stored answers', () => {
  let prototype

  before(async () => {
    prototype = await startPrototype()
  })

  beforeEach(() => prototype.forgetCookies())

  after(() => prototype.stop())

  it('starts with the default data', async () => {
    const response = await prototype.get('/answers')
    assert.match(response.body, /organisation=Example Health Board/)
  })

  it('keeps answers from a form between pages', async () => {
    await prototype.post('/anything', [['name', 'Sam'], ['person[name]', 'Alex']])
    const response = await prototype.get('/answers')
    assert.match(response.body, /name=Sam/)
    assert.match(response.body, /nested=Alex/)
    assert.match(response.body, /shout=SAM/)
  })

  it('keeps answers from the web address', async () => {
    const response = await prototype.get('/answers?name=Jo')
    assert.match(response.body, /name=Jo/)
  })

  it('stores ticked checkboxes and forgets unticked ones', async () => {
    await prototype.post('/anything', [['colours', 'red'], ['colours', '_unchecked']])
    let response = await prototype.get('/answers')
    assert.match(response.body, /colours=red\n/)
    assert.match(response.body, /red=true/)

    await prototype.post('/anything', [['colours', '_unchecked']])
    response = await prototype.get('/answers')
    assert.match(response.body, /colours=\n/)
    assert.match(response.body, /red=false/)
  })

  it('redirects a form to a page after posting, so refreshing does not send it again', async () => {
    const response = await prototype.post('/start')
    assert.equal(response.status, 303)
    assert.equal(response.location, '/start')
  })

  it('lets routes send people to different pages', async () => {
    assert.equal((await prototype.post('/branch', [['answer', 'yes']])).location, '/yes')
    assert.equal((await prototype.post('/branch', [['answer', 'no']])).location, '/no')
  })

  it('clears answers when the data is reset', async () => {
    await prototype.post('/anything', [['name', 'Sam']])
    const confirmation = await prototype.get('/prototype-admin/reset?returnPage=/answers')
    assert.match(confirmation.body, /value="\/answers"/)

    const done = await prototype.post('/prototype-admin/reset', [['returnPage', '/answers']])
    assert.match(done.body, /Data has been reset/)
    assert.doesNotMatch((await prototype.get('/answers')).body, /name=Sam/)
  })

  it('only returns to pages in the prototype after a reset', async () => {
    const response = await prototype.get('/prototype-admin/reset?returnPage=//example.com')
    assert.doesNotMatch(response.body, /example\.com/)
  })

  it('ignores fields that could change how JavaScript objects behave', () => {
    const data = {}
    storeAnswers(data, JSON.parse('{"__proto__": {"polluted": "yes"}, "constructor": "x", "prototype": "y", "_csrf": "z", "safe": {"__proto__": {"polluted": "yes"}}}'))
    assert.deepEqual(Object.keys(data), ['safe'])
    assert.equal({}.polluted, undefined)
  })
})
