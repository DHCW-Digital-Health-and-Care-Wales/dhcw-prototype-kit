import express from 'express'

import { toLocalPath } from '../local-path.js'

const resetPage = '/prototype-admin/reset'

export function resetData() {
  const router = express.Router()

  router.get(resetPage, (request, response) => {
    response.render('kit/reset.html', { returnPage: toLocalPath(request.query.returnPage) })
  })

  router.post(resetPage, (request, response, next) => {
    const returnPage = toLocalPath(request.body?.returnPage)

    request.session.regenerate((error) => {
      if (error) {
        next(error)
        return
      }

      response.render('kit/reset-done.html', { returnPage })
    })
  })

  return router
}
