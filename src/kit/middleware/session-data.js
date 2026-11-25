const blockedNames = new Set(['__proto__', 'constructor', 'prototype'])
const uncheckedValue = '_unchecked'

function isRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

export function storeAnswers(data, input) {
  if (!isRecord(input)) {
    return
  }

  for (const [name, value] of Object.entries(input)) {
    if (blockedNames.has(name) || name.startsWith('_')) {
      continue
    }

    if (value === uncheckedValue) {
      delete data[name]
    } else if (Array.isArray(value)) {
      const answers = value.filter((answer) => answer !== uncheckedValue)

      if (answers.length) {
        data[name] = answers
      } else {
        delete data[name]
      }
    } else if (isRecord(value)) {
      if (!Object.hasOwn(data, name) || !isRecord(data[name])) {
        data[name] = {}
      }

      storeAnswers(data[name], value)
    } else {
      data[name] = value
    }
  }
}

export function sessionData(defaults) {
  return (request, response, next) => {
    request.session.data ??= {}

    for (const [name, value] of Object.entries(defaults)) {
      if (!Object.hasOwn(request.session.data, name)) {
        request.session.data[name] = structuredClone(value)
      }
    }

    storeAnswers(request.session.data, request.body)
    storeAnswers(request.session.data, request.query)
    response.locals.data = request.session.data
    next()
  }
}
