import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'

const defaultConfig = { serviceName: 'Service name goes here', port: 3000 }

async function loadDefaultExport(directory, file, fallback) {
  const path = join(directory, file)

  if (!existsSync(path)) {
    return fallback
  }

  const module = await import(pathToFileURL(path))
  return module.default ?? fallback
}

export async function loadPrototype(directory) {
  if (!existsSync(join(directory, 'views'))) {
    throw new Error(`There is no views folder in ${directory}`)
  }

  const [config, routes, filters, sessionDataDefaults] = await Promise.all([
    loadDefaultExport(directory, 'config.js', {}),
    loadDefaultExport(directory, 'routes.js', null),
    loadDefaultExport(directory, 'filters.js', {}),
    loadDefaultExport(directory, 'data/session-data-defaults.js', {})
  ])

  return {
    directory,
    config: { ...defaultConfig, ...config },
    routes,
    filters,
    sessionDataDefaults
  }
}
