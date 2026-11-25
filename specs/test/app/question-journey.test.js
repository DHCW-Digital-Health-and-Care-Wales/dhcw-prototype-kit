import assert from 'node:assert/strict'
import { after, before, describe, it } from 'node:test'

import { exampleDirectory, startPrototype } from '../helpers.js'

describe('the question journey example', () => {
  let prototype

  before(async () => {
    prototype = await startPrototype({ prototypeDirectory: exampleDirectory })
  })

  after(() => prototype.stop())

  it('starts at the start page', async () => {
    assert.equal((await prototype.get('/')).location, '/question-journey/start')
    assert.equal((await prototype.get('/question-journey/start')).status, 200)
  })

  it('has an empty stylesheet when it does not add styles of its own', async () => {
    const response = await prototype.get('/stylesheets/main.css')
    assert.equal(response.status, 200)
    assert.equal(response.body, '')
  })

  it('shows an error when a question is not answered', async () => {
    assert.match((await prototype.post('/question-journey/prescription')).body, /There is a problem/)
    assert.match((await prototype.post('/question-journey/medicine', [['medicine', ' ']])).body, /There is a problem/)
  })

  it('sends someone without a prescription to a different page', async () => {
    const response = await prototype.post('/question-journey/prescription', [['prescription', 'no']])
    assert.equal(response.location, '/question-journey/not-eligible')
    assert.equal((await prototype.get(response.location)).status, 200)
  })

  it('carries answers through to the confirmation page', async () => {
    const first = await prototype.post('/question-journey/prescription', [['prescription', 'yes']])
    assert.equal(first.location, '/question-journey/medicine')

    const second = await prototype.post('/question-journey/medicine', [['medicine', 'Example medicine']])
    assert.equal(second.location, '/question-journey/check-answers')

    const answers = await prototype.get(second.location)
    assert.match(answers.body, /Example medicine/)
    assert.match((await prototype.get('/question-journey/prescription')).body, /value="yes" checked/)

    const sent = await prototype.post('/question-journey/check-answers')
    assert.match((await prototype.get(sent.location)).body, /Order sent/)
  })
})
