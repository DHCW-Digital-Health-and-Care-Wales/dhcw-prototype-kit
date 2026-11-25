import assert from 'node:assert/strict'
import { after, before, describe, it } from 'node:test'

import { startPrototype } from '../helpers.js'

describe('automatic routing', () => {
  let prototype

  before(async () => {
    prototype = await startPrototype()
  })

  after(() => prototype.stop())

  for (const [path, text] of [
    ['/', 'Fixture home'],
    ['/start', 'Start page'],
    ['/start.html', 'Start page'],
    ['/section', 'Section index'],
    ['/section/', 'Section index'],
    ['/page', 'Nunjucks page']
  ]) {
    it(`shows the page for ${path}`, async () => {
      const response = await prototype.get(path)
      assert.equal(response.status, 200)
      assert.match(response.body, new RegExp(text))
    })
  }

  it('says which file to create when there is no page', async () => {
    const response = await prototype.get('/missing/page')
    assert.equal(response.status, 404)
    assert.match(response.body, /specs\/test\/fixtures\/app\/views\/missing\/page\.html/)
  })

  for (const path of ['/..%2fconfig.js', '/%2e%2e/%2e%2e/package.json', '/..%5c..%5cpackage', '/%E0%A4%A', '/kit/template', '/button/macro.njk']) {
    it(`does not render anything outside the views folder for ${path}`, async () => {
      const response = await prototype.get(path)
      assert.equal(response.status, 404)
    })
  }

  it('makes design system components available without importing them', async () => {
    const response = await prototype.get('/start')
    assert.match(response.body, /<button type="submit" class="nhsw-button">Continue<\/button>/)
    assert.match(response.body, /<title>Start – Test prototype<\/title>/)
  })

  it('also supports importing a component, as in the design system code samples', async () => {
    const response = await prototype.get('/imported')
    assert.match(response.body, /class="nhsw-tag"/)
  })

  it('shows the template error while developing', async () => {
    const response = await prototype.get('/broken')
    assert.equal(response.status, 500)
    assert.match(response.body, /broken\.html/)
  })

  it('shows errors from routes while developing', async () => {
    const response = await prototype.get('/fail')
    assert.equal(response.status, 500)
    assert.match(response.body, /This route is broken/)
  })

  for (const [path, type] of [
    ['/nhsw/nhsw.min.css', /css/],
    ['/nhsw/nhsw-behaviours.min.js', /javascript/],
    ['/assets/nhsw-logo.svg', /svg/],
    ['/assets/nhsw-fonts.css', /css/],
    ['/assets/fonts/roboto-latin.woff2', /woff2/],
    ['/assets/kit.js', /javascript/],
    ['/assets/note.txt', /text/]
  ]) {
    it(`serves ${path}`, async () => {
      const response = await prototype.get(path)
      assert.equal(response.status, 200)
      assert.match(response.headers.get('content-type'), type)
    })
  }

  it('compiles the prototype stylesheet using design system tokens', async () => {
    const response = await prototype.get('/stylesheets/main.css')
    assert.equal(response.status, 200)
    assert.match(response.body, /\.fixture\s*\{\s*color:\s*#005aa8/)
  })

  it('tells search engines not to index the prototype', async () => {
    const response = await prototype.get('/')
    assert.equal(response.headers.get('x-robots-tag'), 'noindex, nofollow')
    assert.equal(response.headers.get('x-powered-by'), null)
  })

  it('does not ask for a password while developing', async () => {
    const response = await prototype.get('/start')
    assert.equal(response.status, 200)
  })
})
