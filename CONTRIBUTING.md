# Contributing

This guide is for changes to the kit. If you are building your own prototype,
start with the [README](README.md).

## Before you start

```sh
npm install
npm test
npm run lint
```

## Branches

We use trunk-based development. `main` must always be ready to release. Make a
short-lived branch from `main`, named as in the DHCW Software Engineering
Handbook:

| Type | Name | Example |
| --- | --- | --- |
| Feature | `feature/<work-item-number>-<feature-name>` | `feature/1234-add-date-filter` |
| Bug fix | `bugfix/<issue-number>-<description>` | `bugfix/56-fix-reset-link` |
| Urgent fix | `hotfix/<issue-number>-<description>` | `hotfix/78-fix-password-page` |

Delete the branch after it is merged.

## Commit messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```text
<type>[optional scope]: <description>

[optional body]

[optional footers]
```

- Use `feat`, `fix`, `build`, `chore`, `ci`, `docs`, `style`, `refactor`, `perf` or `test`.
- Keep the description to 50 characters or fewer, in the imperative mood.
- Add `!` after the type for a breaking change.
- Say why in the body, and link the work item.

Squash work-in-progress commits before merging.

## Code review

Reviews check quality and share knowledge. Every change reaches `main` through a
pull request. At least two reviewers must approve it.

Reviewers check that:

- the change does one thing and is easy to read
- new behaviour has tests
- documentation matches the change
- no passwords, keys, server names or personal information are included
- pages the kit provides meet WCAG 2.2 level AA

## Coding standards

- Follow `.editorconfig`.
- `npm run lint` must pass.
- Keep functions short, with one purpose.
- Use design system components and tokens rather than new styles.

## Where code goes

| Folder | Contains |
| --- | --- |
| `src/app` | The starter prototype. Keep it small: people copy it |
| `src/kit` | The server, middleware, templates and browser scripts |
| `specs/test` | Tests, in folders that match `src` |
| `specs/docs` | Guides |
| `decisions` | One file for each significant decision |

## Decisions

Record significant decisions in `decisions`, using the
[DHCW Architecture Decision Record template](https://gigcymru.github.io/architecture/design-authority/dhcw/architecture-decision-record-template/).
Name each file after its title, without a number. Do not rewrite an agreed
decision: add a new one that supersedes it.

## Releases

1. Update `version` in `package.json` and add an entry to `CHANGELOG.md`.
2. Merge to `main`.
3. Tag the merge commit `<major>.<minor>.<patch>`.

A breaking change is one that needs people to edit their own prototype.
