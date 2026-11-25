import express from 'express'

const router = express.Router()

router.post('/branch', (request, response) => {
  response.redirect(request.session.data.answer === 'yes' ? '/yes' : '/no')
})

router.get('/fail', () => {
  throw new Error('This route is broken')
})

export default router
