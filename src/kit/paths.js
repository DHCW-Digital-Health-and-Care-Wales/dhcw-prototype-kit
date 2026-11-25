import { createRequire } from 'node:module'
import { dirname, resolve } from 'node:path'

const require = createRequire(import.meta.url)

export const kitDirectory = import.meta.dirname
export const rootDirectory = resolve(kitDirectory, '../..')
export const designSystemDirectory = dirname(require.resolve('dhcw-design-system/package.json'))
