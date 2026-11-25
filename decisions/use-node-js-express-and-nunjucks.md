Use Node.js, Express and Nunjucks
=================================

> **Status**: Proposed
> **Level**: To be confirmed
> **Proposer**: Joel Andrew Howe
> **Authors**: Joel Andrew Howe
> **Stakeholders / Reviewers**: Joel Andrew Howe
> **Updated**: 2026-11-25

## Summary

The kit needs a way to run prototypes that designers can change with little code. We propose Node.js, Express and Nunjucks.

## Drivers

- The design system already provides Nunjucks macros and a compiled stylesheet.
- The NHS prototype kit, which teams may know, uses the same tools.
- Prototypes need forms, saved answers and branching, so static pages are not enough.

## Options

### Node.js, Express and Nunjucks

A small server renders Nunjucks pages.

### Static HTML

Pages are plain files.

### Depend on the NHS prototype kit package

Configure the NHS kit to load DHCW components.

## Options Analysis

### Node.js, Express and Nunjucks Assessment

**Pro:**

- Uses the design system macros directly
- Few dependencies

**Con:**

- Needs a host that runs Node.js

### Static HTML Assessment

**Pro:**

- Can be hosted anywhere

**Con:**

- Cannot save answers or branch without browser scripts
- Cannot use the macros without a build step

### Depend on the NHS prototype kit package Assessment

**Pro:**

- Less code to maintain

**Con:**

- Requires NHS.UK frontend
- Its templates and defaults are NHS England branded

## Recommendation

Use Node.js, Express and Nunjucks.

### Consequences

- Pro: teams can copy design system examples into pages.
- Con: DHCW maintains the server code, including password protection.

## More Information

Review if the design system stops providing Nunjucks macros.
