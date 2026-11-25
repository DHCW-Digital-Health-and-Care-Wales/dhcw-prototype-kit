import { createHmac, timingSafeEqual } from 'node:crypto'

import { toLocalPath } from '../local-path.js'

const passwordPage = '/prototype-admin/password'
const cookieName = 'dhcw-prototype-access'
const maximumAttempts = 10
const attemptWindow = 15 * 60 * 1000
const cookieLifetime = 30 * 24 * 60 * 60 * 1000

function sign(password) {
  return createHmac('sha256', password).update(cookieName).digest('hex')
}

function isSame(left, right) {
  const first = Buffer.from(left)
  const second = Buffer.from(right)
  return first.length === second.length && timingSafeEqual(first, second)
}

function readCookie(header = '', name) {
  const pair = header
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`))

  return pair ? pair.slice(name.length + 1) : ''
}

function createAttemptLimiter() {
  const attempts = new Map()

  return {
    isBlocked(client) {
      const record = attempts.get(client)

      if (record && Date.now() - record.since > attemptWindow) {
        attempts.delete(client)
        return false
      }

      return Boolean(record) && record.count >= maximumAttempts
    },
    recordFailure(client) {
      const record = attempts.get(client) ?? { count: 0, since: Date.now() }
      attempts.set(client, { ...record, count: record.count + 1 })
    },
    clear(client) {
      attempts.delete(client)
    }
  }
}

export function passwordProtection(password) {
  const limiter = createAttemptLimiter()

  function checkSubmittedPassword(request, response) {
    const returnURL = toLocalPath(request.body?.returnURL)
    const submitted = request.body?.password

    function showError(status, error) {
      response.status(status).render('kit/password.html', { returnURL, error })
    }

    if (limiter.isBlocked(request.ip)) {
      showError(429, 'Too many attempts. Try again in 15 minutes')
      return
    }

    if (typeof submitted !== 'string' || !isSame(sign(submitted), sign(password))) {
      limiter.recordFailure(request.ip)
      showError(401, submitted ? 'The password is not correct' : 'Enter the password')
      return
    }

    limiter.clear(request.ip)
    response.cookie(cookieName, sign(password), {
      httpOnly: true,
      maxAge: cookieLifetime,
      sameSite: 'lax',
      secure: request.secure
    })
    response.redirect(303, returnURL)
  }

  return (request, response, next) => {
    if (!password) {
      response.status(401).render('kit/password-not-set.html')
      return
    }

    if (request.path === passwordPage) {
      if (request.method === 'POST') {
        checkSubmittedPassword(request, response)
        return
      }

      response.render('kit/password.html', { returnURL: toLocalPath(request.query.returnURL) })
      return
    }

    if (isSame(readCookie(request.headers.cookie, cookieName), sign(password))) {
      next()
      return
    }

    response.redirect(`${passwordPage}?returnURL=${encodeURIComponent(request.originalUrl)}`)
  }
}
