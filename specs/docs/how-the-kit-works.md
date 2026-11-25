# How the kit works

`src/kit` runs the prototype in `src/app`. It uses Express for the web server,
Nunjucks for pages, Sass for styles and the `dhcw-design-system` package for
components.

## What happens to a request

Each step either answers the request or passes it on:

1. Security headers are added.
2. Design system and kit files are sent.
3. When published, the password is checked.
4. Prototype files and the stylesheet are sent.
5. The reset pages are handled.
6. Form fields and query values are saved to the session.
7. Your routes in `routes.js` run.
8. A form post that no route answered is redirected, so refreshing is safe.
9. A page in `views` that matches the address is shown.
10. Otherwise, the page not found screen is shown.

## Where templates are found

Nunjucks looks in this order, and uses the first match:

1. `src/app/views`
2. `src/kit/views`
3. the design system components

Only files in `src/app/views` can be reached from a web address.

## Developing

`npm run dev` restarts the server when a JavaScript file changes. Changes to
pages, styles, scripts and assets reload open browser tabs without a restart.

While developing, the prototype only accepts connections from your own computer.
Set the `HOST` environment variable to `0.0.0.0` to open it to your network. This
is not password protected unless `NODE_ENV` is `production`.

## Differences from the NHS prototype kit

- The kit and the starter prototype are in one repository, not a separate package.
- There is no phone frame view, and no built-in NHS number or date filters.
- Resetting data needs a confirmation button.
