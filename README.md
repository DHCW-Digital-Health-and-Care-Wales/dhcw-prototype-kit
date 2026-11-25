# DHCW prototype kit

Create HTML prototypes of Digital Health and Care Wales services with the
[DHCW design system](https://dhcw-digital-health-and-care-wales.github.io/dhcw-design-system/).
Use prototypes to explore ideas and test them with users. They are not real
services: never enter real patient or identifiable personal information.

The kit works like the [NHS prototype kit](https://github.com/nhsuk/nhsuk-prototype-kit).

## Before you start

You need:

- [Node.js](https://nodejs.org/) 22.12 or later (the LTS version)
- [GitHub Desktop](https://desktop.github.com/)
- [Visual Studio Code](https://code.visualstudio.com/)

## Run your prototype

1. On GitHub, select **Use this template**, then **Create a new repository**.
2. Clone your new repository with GitHub Desktop.
3. Open it in Visual Studio Code and open a terminal.
4. Install what the kit needs:

   ```sh
   npm install
   ```

5. Start the prototype:

   ```sh
   npm run dev
   ```

6. Go to <http://localhost:3000>.

Pages reload when you save a change. To stop the prototype, press
<kbd>Ctrl</kbd> + <kbd>C</kbd> in the terminal.

## Where to make changes

Everything you change for your prototype is in `src/app`.

| To change | Edit |
| --- | --- |
| Pages | `src/app/views` |
| The service name | `src/app/config.js` |
| The layout shared by pages | `src/app/views/layout.html` |
| Where forms go | `src/app/routes.js` |
| Default data | `src/app/data/session-data-defaults.js` |
| Styles | `src/app/stylesheets/main.scss` |
| Scripts | `src/app/scripts/main.js` |
| Images and other files | `src/app/assets` |

## Guides

- [Make pages](specs/docs/make-pages.md)
- [Link pages and use answers](specs/docs/link-pages-and-use-answers.md)
- [Publish your prototype](specs/docs/publish-your-prototype.md)
- [How the kit works](specs/docs/how-the-kit-works.md)

To see a working journey with questions, errors and branching, run
`npm run example` and read [examples/question-journey](examples/question-journey/README.md).

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Starts your prototype and restarts it when code changes |
| `npm start` | Starts your prototype once, for hosting services |
| `npm run example` | Starts the question journey example |
| `npm test` | Runs the automated tests |
| `npm run lint` | Analyses the code |

## Folder structure

The layout follows the
[DHCW Software Engineering Handbook](https://gigcymru.github.io/dhcw-software-engineering-handbook/).

```text
dhcw-prototype-kit/
├── build/          Build outputs and build scripts
├── decisions/      Architecture decision records
├── deploy/         Hosting configuration
├── examples/       Example prototypes
├── specs/
│   ├── docs/       Guides and documentation
│   └── test/       Automated tests
├── src/
│   ├── app/        Your prototype
│   └── kit/        The kit that runs your prototype
├── .editorconfig
├── CHANGELOG.md
├── CONTRIBUTING.md
└── README.md
```

## Update the design system

The design system is the
[`dhcw-design-system`](https://www.npmjs.com/package/dhcw-design-system) package.
`package-lock.json` records the version you have. To move to a newer one:

```sh
npm install dhcw-design-system@latest
npm test
```

## Contributing, branches and versions

We use trunk-based development: short-lived branches, merged into `main` through
a pull request with two reviewers. Releases follow
[Semantic Versioning](https://semver.org/). See [CONTRIBUTING.md](CONTRIBUTING.md).

## Licence

The code is available under the [MIT licence](LICENSE).

The Digital Health and Care Wales and NHS Wales logos in `src/kit/assets` are not
covered by that licence. Do not use them without permission from the owner. The
Roboto font files are licensed separately by their authors.
