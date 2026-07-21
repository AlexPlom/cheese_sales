# Issue Tracker: Local Markdown

Issues and specs for this repository live as Markdown files in `.scratch/`.

## Conventions

- One feature per directory: `.scratch/<feature-slug>/`
- The spec is `.scratch/<feature-slug>/spec.md`
- Implementation issues are one file per ticket at `.scratch/<feature-slug>/issues/<NN>-<slug>.md`, numbered from `01`
- Triage state is recorded as a `Status:` line near the top of each issue file
- Comments and conversation history append under a `## Comments` heading

## Publishing And Fetching

When a skill publishes to the issue tracker, create a file under `.scratch/<feature-slug>/`. When a skill fetches a ticket, read its referenced path or issue number.

## Wayfinding Operations

- **Map:** `.scratch/<effort>/map.md`
- **Child ticket:** `.scratch/<effort>/issues/NN-<slug>.md`, with `Type:` and `Status:` lines followed by its question
- **Blocking:** a `Blocked by: NN, NN` line; a ticket is unblocked when every listed ticket is resolved
- **Frontier:** open, unblocked, unclaimed tickets ordered by number
- **Claim:** set `Status: claimed` before doing any work
- **Resolve:** append the answer under `## Answer`, set `Status: resolved`, and append a linked gist to the map's Decisions-so-far section
