import js from '@eslint/js'
import globals from 'globals'

export default [
  { ignores: ['build/**', 'node_modules/**'] },
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.node
    }
  },
  {
    files: ['src/kit/assets/**/*.js', 'src/app/scripts/**/*.js'],
    languageOptions: { globals: globals.browser }
  }
]
