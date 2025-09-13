# Copilot Playbook (Pro)

## Use the right tool
- Copilot inline: fast boilerplate, repeat patterns, tests from signatures.
- Copilot Chat: repo-aware analysis, refactors, test generation, diff summaries.
- ChatGPT (outside VS Code): architecture decisions, cross-stack contracts, deep reviews.

## Inline prompt patterns
// Implement Service with retry(3), ETag caching, strict typing.
// Use Angular signals + Tailwind classes; provide unhappy-path tests.

## Repo-aware chat patterns
/explain open files
/find usages of IProductRepository
/generate tests for **/*Service.ts focusing on error handling
/summarize changes since origin/main
/find potential security issues in this diff

## PR ritual (10 minutes)
1) /summarize changes
2) /find potential security issues in this diff
3) /generate tests for changed files
4) Apply top 2 improvements; re-run tests
