Install the Design System From npm
==================================

> **Status**: Proposed
> **Level**: To be confirmed
> **Proposer**: Joel Andrew Howe
> **Authors**: Joel Andrew Howe
> **Stakeholders / Reviewers**: Joel Andrew Howe
> **Updated**: 2026-11-25

## Summary

The kit needs the design system's styles, scripts and macros. We propose
installing the published `dhcw-design-system` package from the npm registry.

## Drivers

- Setup guidance asks people to install GitHub Desktop and Node.js, not Git.
- Prototypes should only change design system version on purpose.
- Updates should be easy to find and apply.

## Options

### npm registry

Depend on a version range and record the exact version in `package-lock.json`.

### Release archive address

Depend on the archive of a version tag on GitHub.

### Git dependency

Depend on the Git repository at a tag.

## Options Analysis

### npm registry Assessment

**Pro:**

- Small download
- Dependabot suggests newer versions

**Con:**

- The package does not include the logo or fonts

### Release archive address Assessment

**Pro:**

- Includes every file in the repository

**Con:**

- Large download
- Versions are updated by hand

### Git dependency Assessment

**Pro:**

- Needs no published package

**Con:**

- Needs Git installed and on the path

## Recommendation

Install from the npm registry.

### Consequences

- Pro: `npm ci` installs the same version everywhere.
- Con: the kit keeps its own copy of the logo and fonts in `src/kit/assets`.

## More Information

Review the copied logo and fonts if the package starts to include them.
