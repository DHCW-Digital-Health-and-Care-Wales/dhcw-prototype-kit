# Publish your prototype

## Before you publish

You must:

- use made-up or test information, never real patient or identifiable personal information
- check the prototype does not contain sensitive information
- keep the phase banner, or another clear sign that this is not a live service
- check with your digital team which hosting service to use

Save your work to GitHub first.

## Settings the hosting service needs

| Environment variable | Value |
| --- | --- |
| `NODE_ENV` | `production` |
| `PROTOTYPE_PASSWORD` | A password you choose. Without it, no page is shown |
| `SESSION_SECRET` | A long random value. Optional: one is created if you do not set it |

The build command is `npm ci` and the start command is `npm start`.

## Publish with Render

1. In Render, create a new Blueprint and connect your repository.
2. Set **Blueprint Path** to `deploy/render.yaml`.
3. Enter a value for `PROTOTYPE_PASSWORD` when asked.
4. Create the Blueprint, then open the web address Render gives you.

## What publishing changes

- People must enter the password. It is remembered for 30 days.
- After 10 wrong passwords, that person must wait 15 minutes.
- Insecure requests are redirected to HTTPS.
- Error details are hidden.
- Search engines are asked not to index the pages.

Answers are held in memory. They are lost when the service restarts, and are not
shared between several copies of the service. Render prints a warning about this
memory store, which is expected for a prototype.

A shared password is light protection. It is not suitable for real or sensitive
information.
