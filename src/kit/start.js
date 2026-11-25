import { existsSync } from 'node:fs'
import { join, resolve } from 'node:path'

import { createApp } from './app.js'
import { rootDirectory } from './paths.js'

const environmentFile = join(rootDirectory, '.env')

if (existsSync(environmentFile)) {
  process.loadEnvFile(environmentFile)
}

const production = process.env.NODE_ENV === 'production'
const prototypeDirectory = resolve(rootDirectory, process.argv[2] ?? 'src/app')
const { app, config } = await createApp({ prototypeDirectory, watch: true })
const port = Number(process.env.PORT) || config.port
const host = process.env.HOST || (production ? '0.0.0.0' : '127.0.0.1')

app.listen(port, host, (error) => {
  if (error) {
    console.error(
      error.code === 'EADDRINUSE'
        ? `Port ${port} is already in use. Stop the other prototype with Ctrl + C, or set a different PORT.`
        : error.message
    )
    process.exit(1)
  }

  console.log(`Your prototype is running at http://localhost:${port}`)
})
