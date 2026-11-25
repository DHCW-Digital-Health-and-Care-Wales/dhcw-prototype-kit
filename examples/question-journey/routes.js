import express from 'express'

const router = express.Router()
const journey = '/question-journey'

router.get('/', (request, response) => {
  response.redirect(`${journey}/start`)
})

router.post(`${journey}/prescription`, (request, response) => {
  const { prescription } = request.session.data

  if (!prescription) {
    response.render('question-journey/prescription.html', {
      error: 'Select yes if you have a repeat prescription'
    })
    return
  }

  response.redirect(
    prescription === 'yes' ? `${journey}/medicine` : `${journey}/not-eligible`
  )
})

router.post(`${journey}/medicine`, (request, response) => {
  if (!request.session.data.medicine?.trim()) {
    response.render('question-journey/medicine.html', { error: 'Enter the name of your medicine' })
    return
  }

  response.redirect(`${journey}/check-answers`)
})

router.post(`${journey}/check-answers`, (request, response) => {
  response.redirect(`${journey}/confirmation`)
})

export default router
