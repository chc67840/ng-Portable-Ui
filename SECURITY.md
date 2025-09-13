# Security Guidelines (Copilot-aware)

- Never paste secrets into prompts or code.
- Keep env and appsettings.*.json out of VCS (see .gitignore).
- Validate all inputs; encode outputs.
- Inspect npm postinstall scripts; prefer npm ci with lockfiles.
- EF Core: parameterize queries; avoid raw interpolated SQL.

## Quick security drills
- Before merging: run Copilot Chat `/find potential security issues in this diff`.
- For suspicious suggestion: explain rationale in comments; request tests.

## Edge Cases
See `docs/edge-cases.md` for detailed “jangle” scenarios and what to do.
