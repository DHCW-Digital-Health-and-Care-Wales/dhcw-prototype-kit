Keep the Kit and the Prototype in One Repository
================================================

> **Status**: Proposed
> **Level**: To be confirmed
> **Proposer**: Joel Andrew Howe
> **Authors**: Joel Andrew Howe
> **Stakeholders / Reviewers**: Joel Andrew Howe
> **Updated**: 2026-11-25

## Summary

The NHS prototype kit splits the starter prototype and the engine into two repositories. We propose one repository, with separate folders.

## Drivers

- The kit is new and has no published package.
- People create a prototype by using the repository as a template.
- The handbook asks for source code separated by dependency layer.

## Options

### One repository

The engine is in `src/kit` and the prototype in `src/app`.

### A package and a template

The engine is published to a package registry and the template depends on it.

## Options Analysis

### One repository Assessment

**Pro:**

- One place to change and test
- No package to publish

**Con:**

- Prototypes do not receive kit fixes automatically

### A package and a template Assessment

**Pro:**

- Prototypes can upgrade the kit with one command

**Con:**

- Needs a registry, release automation and two repositories

## Recommendation

Use one repository for now. This is deliberate technical debt.

### Consequences

- Pro: simple to start.
- Con: updating an existing prototype means copying `src/kit` and the dependencies.

## More Information

Review when more than a few prototypes need the same fix. `src/kit` only reads `src/app` through `load-prototype.js` and file paths, so it can become a package later.
