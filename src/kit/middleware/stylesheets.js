import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'

import * as sass from 'sass'

import { designSystemDirectory } from '../paths.js'

export function stylesheets(prototypeDirectory, production) {
  const source = join(prototypeDirectory, 'stylesheets/main.scss')
  let compiled

  return async (request, response, next) => {
    if (!existsSync(source)) {
      response.type('css').send('')
      return
    }

    if (!compiled || !production) {
      compiled = sass.compileAsync(source, {
        loadPaths: [dirname(designSystemDirectory)],
        style: production ? 'compressed' : 'expanded'
      })
    }

    try {
      const { css } = await compiled
      response.type('css').send(css)
    } catch (error) {
      compiled = undefined
      next(error)
    }
  }
}
