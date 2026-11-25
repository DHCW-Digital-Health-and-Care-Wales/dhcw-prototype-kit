export function toLocalPath(value) {
  const isLocal =
    typeof value === 'string' &&
    value.startsWith('/') &&
    !value.startsWith('//') &&
    !value.includes('\\') &&
    [...value].every((character) => character.charCodeAt(0) > 31)

  return isLocal ? value : '/'
}
