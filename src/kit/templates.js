import { join } from 'node:path'

import nunjucks from 'nunjucks'

import { designSystemDirectory, kitDirectory } from './paths.js'

function exportedMacros(environment) {
  return new Promise((resolve, reject) => {
    environment.getTemplate('all-components.njk', true).getExported((error, exported) => {
      if (error) {
        reject(error)
        return
      }

      resolve(exported)
    })
  })
}

function checked(name, value) {
  const answer = this.ctx.data?.[name]
  return Array.isArray(answer) ? answer.includes(value) : answer === value
}

export async function configureTemplates(app, { directory, filters }, production) {
  const loader = new nunjucks.FileSystemLoader(
    [
      join(directory, 'views'),
      join(kitDirectory, 'views'),
      join(designSystemDirectory, 'src/components')
    ],
    { noCache: !production }
  )

  const environment = new nunjucks.Environment(loader, {
    autoescape: true,
    trimBlocks: true,
    lstripBlocks: true
  })

  for (const [name, macro] of Object.entries(await exportedMacros(environment))) {
    environment.addGlobal(name, macro)
  }

  environment.addGlobal('checked', checked)

  for (const [name, filter] of Object.entries(filters)) {
    environment.addFilter(name, filter)
  }

  environment.express(app)
  app.set('view engine', 'html')

  return environment
}
