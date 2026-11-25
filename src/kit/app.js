import { createHash, randomBytes } from 'node:crypto'
import { join } from 'node:path'

import express from 'express'
import session from 'express-session'

import { createLiveReload } from './live-reload.js'
import { loadPrototype } from './load-prototype.js'
import { autoRouting } from './middleware/auto-routing.js'
import { handleError, pageNotFound } from './middleware/errors.js'
import { passwordProtection } from './middleware/password-protection.js'
import { redirectAfterPost } from './middleware/redirect-after-post.js'
import { resetData } from './middleware/reset-data.js'
import { securityHeaders } from './middleware/security-headers.js'
import { sessionData } from './middleware/session-data.js'
import { stylesheets } from './middleware/stylesheets.js'
import { designSystemDirectory, kitDirectory } from './paths.js'
import { configureTemplates } from './templates.js'

const sessionLifetime = 4 * 60 * 60 * 1000

function sessionName(serviceName) {
  return `prototype-${createHash('sha256').update(serviceName).digest('hex').slice(0, 12)}`
}

export async function createApp({ prototypeDirectory, environment = process.env, watch = false }) {
  const production = environment.NODE_ENV === 'production'
  const prototype = await loadPrototype(prototypeDirectory)
  const views = join(prototype.directory, 'views')
  const app = express()

  app.disable('x-powered-by')
  app.set('query parser', 'extended')

  if (production) {
    app.set('trust proxy', 1)
  }

  await configureTemplates(app, prototype, production)

  const liveReload = watch && !production ? createLiveReload(prototype.directory) : null

  app.use((request, response, next) => {
    response.locals.serviceName = prototype.config.serviceName
    response.locals.currentPage = request.path
    response.locals.liveReload = Boolean(liveReload)
    next()
  })
  app.use(securityHeaders(production))
  app.use('/nhsw', express.static(join(designSystemDirectory, 'dist')))
  app.use('/assets', express.static(join(kitDirectory, 'assets')))
  app.use(express.urlencoded({ extended: true, limit: '2mb', parameterLimit: 10000 }))

  if (production) {
    app.use(passwordProtection(environment.PROTOTYPE_PASSWORD))
  }

  if (liveReload) {
    app.get('/prototype-admin/live-reload', liveReload.connect)
  }

  app.use('/assets', express.static(join(prototype.directory, 'assets')))
  app.use('/scripts', express.static(join(prototype.directory, 'scripts')))
  app.get('/stylesheets/main.css', stylesheets(prototype.directory, production))

  app.use(
    session({
      name: sessionName(prototype.config.serviceName),
      secret: environment.SESSION_SECRET || randomBytes(32).toString('hex'),
      resave: false,
      saveUninitialized: true,
      cookie: { maxAge: sessionLifetime, sameSite: 'lax', secure: 'auto' }
    })
  )
  app.use(resetData())
  app.use(sessionData(prototype.sessionDataDefaults))

  if (prototype.routes) {
    app.use(prototype.routes)
  }

  app.use(redirectAfterPost)
  app.use(autoRouting(views))
  app.use(pageNotFound(views, production))
  app.use(handleError(production))

  return {
    app,
    config: prototype.config,
    close: () => liveReload?.close()
  }
}
