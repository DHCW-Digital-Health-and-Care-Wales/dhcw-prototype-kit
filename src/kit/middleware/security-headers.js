export function securityHeaders(production) {
  return (request, response, next) => {
    response.set({
      'Referrer-Policy': 'same-origin',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'SAMEORIGIN',
      'X-Robots-Tag': 'noindex, nofollow'
    })

    if (!production) {
      next()
      return
    }

    response.set('Strict-Transport-Security', 'max-age=31536000')

    if (request.get('x-forwarded-proto') === 'http') {
      response.redirect(302, `https://${request.get('host')}${request.originalUrl}`)
      return
    }

    next()
  }
}
