export function redirectAfterPost(request, response, next) {
  if (request.method === 'POST') {
    response.redirect(303, request.originalUrl)
    return
  }

  next()
}
