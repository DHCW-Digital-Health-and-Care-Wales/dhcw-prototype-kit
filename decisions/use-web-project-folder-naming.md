Use Web Project Folder Naming
=============================

> **Status**: Proposed
> **Level**: To be confirmed
> **Proposer**: Joel Andrew Howe
> **Authors**: Joel Andrew Howe
> **Stakeholders / Reviewers**: Joel Andrew Howe
> **Updated**: 2026-11-25

## Summary

The handbook asks for Pascal case folder names and allows sensible adjustments outside .NET. We propose lower case names with hyphens inside `src` and `specs`.

## Drivers

- Node.js and web projects normally use lower case names.
- File names become web addresses.
- File names are case sensitive on hosting services but not on Windows.

## Options

### Lower case with hyphens

For example `src/app/views/check-answers.html`.

### Pascal case

For example `src/App/Views`.

## Options Analysis

### Lower case with hyphens Assessment

**Pro:**

- Matches web addresses and avoids case mistakes

**Con:**

- Differs from the handbook default

### Pascal case Assessment

**Pro:**

- Matches the handbook default

**Con:**

- Unusual for Node.js and gives mixed case web addresses

## Recommendation

Use lower case names with hyphens.

### Consequences

- Pro: addresses and files match.
- Con: differs from .NET repositories.

## More Information

[Follow our folder and file conventions](https://gigcymru.github.io/dhcw-software-engineering-handbook/organising-your-solution/follow-our-folder-and-file-conventions/) says the project type determines these conventions.
