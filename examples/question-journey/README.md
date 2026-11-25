# Question journey example

Shows how to ask questions, show errors, save answers and send people to
different pages.

```sh
npm run example
```

Then go to <http://localhost:3000>.

| Page | Shows |
| --- | --- |
| Start | A link styled as a button |
| Do you have a repeat prescription? | Radios, an error and branching |
| What is the name of your medicine? | A text input, an error and a saved answer |
| Check your answers | A summary list with change links |
| You cannot order online | The other branch |
| Order sent | A confirmation panel |

## Copy it into your prototype

1. Copy `views/question-journey` into `src/app/views`.
2. Copy the `router.get` and `router.post` lines from `routes.js` into
   `src/app/routes.js`. Leave out the first route, which replaces your start page.
3. Add `const journey = '/question-journey'` above them.
