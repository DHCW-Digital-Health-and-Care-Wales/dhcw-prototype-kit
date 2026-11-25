import { join, relative } from 'node:path'

import { rootDirectory } from '../paths.js'

export function pageNotFound(viewsDirectory, production) {
  const viewsFolder = relative(rootDirectory, viewsDirectory).replaceAll('\\', '/')

  return (request, response) => {
    const page = request.path.replace(/^\/|\/$|\.html$/g, '') || 'index'

    response.status(404).render('kit/not-found.html', {
      production,
      suggestedFile: join(viewsFolder, `${page}.html`).replaceAll('\\', '/')
    })
  }
}

export function handleError(production) {
  return (error, request, response, next) => {
    console.error(error)

    if (response.headersSent) {
      next(error)
      return
    }

    const status = error.status ?? 500
    const detail = production ? '' : error.message

    response.status(status).render('kit/error.html', { detail }, (renderError, html) => {
      if (renderError) {
        console.error(renderError)
        response.type('text').send('There is a problem with the prototype')
        return
      }

      response.send(html)
    })
  }
}
