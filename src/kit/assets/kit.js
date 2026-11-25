document.addEventListener('submit', (event) => {
  const form = event.target

  form.querySelectorAll('input[data-kit-unchecked]').forEach((input) => input.remove())

  const names = new Set(
    [...form.querySelectorAll('input[type="checkbox"][name]:not(:disabled)')].map(
      (checkbox) => checkbox.name
    )
  )

  names.forEach((name) => {
    const input = document.createElement('input')
    input.type = 'hidden'
    input.name = name
    input.value = '_unchecked'
    input.dataset.kitUnchecked = ''
    form.append(input)
  })
})
