import { stat } from 'node:fs/promises'
import { join } from 'node:path'

function templateNames(requestPath) {
  let path

  try {
    path = decodeURIComponent(requestPath)
  } catch {
    return []
  }

  const segments = path.split('/').filter(Boolean)
  const isUnsafe = segments.some(
    (segment) => segment.startsWith('.') || /[\\:]/.test(segment) || segment.includes('\0')
  )

  if (isUnsafe) {
    return []
  }

  const name = segments.join('/').replace(/\.(html|njk)$/, '') || 'index'
  return [`${name}.html`, `${name}.njk`, `${name}/index.html`, `${name}/index.njk`]
}

export function autoRouting(viewsDirectory) {
  return async (request, response, next) => {
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      next()
      return
    }

    for (const name of templateNames(request.path)) {
      const file = await stat(join(viewsDirectory, name)).catch(() => null)

      if (file?.isFile()) {
        response.render(name)
        return
      }
    }

    next()
  }
}
