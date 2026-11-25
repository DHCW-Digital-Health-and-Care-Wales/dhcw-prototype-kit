# Link pages and use answers

## Link to another page

```html
<a class="nhsw-link" href="/question">Continue</a>
```

## Send a form to the next page

Set the form's `action` to the next page:

```njk
<form method="post" action="/check-answers">
  {{ nhswInput({ id: "full-name", label: { text: "Full name" } }) }}
  {{ nhswButton({ text: "Continue", type: "submit", classes: "nhsw-button--primary" }) }}
</form>
```

## Use an answer

The kit saves every form field by its name. Show it on any later page:

```njk
<p class="nhsw-body">Your name is {{ data["full-name"] }}.</p>
```

Keep a radio or checkbox selected when someone comes back:

```njk
{{ nhswRadios({
  name: "contact",
  fieldset: { legend: { text: "How should we contact you?" } },
  items: [
    { value: "email", text: "Email", checked: checked("contact", "email") },
    { value: "phone", text: "Phone", checked: checked("contact", "phone") }
  ]
}) }}
```

Checkbox answers are always a list. Fields whose names start with `_` are not
saved.

## Set default data

Add values to `src/app/data/session-data-defaults.js`:

```js
export default {
  organisation: 'Example Health Board'
}
```

## Reset the answers

Select **Reset data** in the footer. Answers are also cleared when the prototype
restarts, which happens when you change a `.js` file.

## Send people to different pages

Add a route to `src/app/routes.js`, above `export default router`:

```js
router.post('/contact', (request, response) => {
  if (request.session.data.contact === 'email') {
    response.redirect('/email')
    return
  }

  response.redirect('/phone')
})
```

Then post the form to the same address:

```html
<form method="post" action="/contact">
```

To show an error, render the page again with a message:

```js
response.render('contact.html', { error: 'Select how we should contact you' })
```

See the [question journey example](../../examples/question-journey/README.md) for
a complete journey.

## Add a filter

Filters change how a value is shown. Add them to `src/app/filters.js`:

```js
export default {
  uppercase: (text) => String(text).toUpperCase()
}
```

```njk
{{ data.postcode | uppercase }}
```
