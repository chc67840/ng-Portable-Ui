# VS Code + GitHub Copilot Setup Pack (Pro)
Generated on 2025-09-13.

## Install
1. Open your repo in VS Code.
2. Copy the contents of this pack to your project root (keep folders).
3. Install Recommended Extensions (prompt appears) and sign into GitHub for Copilot.
4. Update `.vscode/launch.json` paths to your API/Web folders.
5. Optional: set `dotnet.defaultSolution` in `.vscode/settings.json`.

## Daily Use
- In any file, type `codex-os` and press Tab -> insert header -> describe `// Task:` precisely.
- Open Copilot Chat (Ctrl+Alt+C) and use recipes from `docs/copilot-chat-recipes.md`.
- Run tasks from Terminal -> Run Task (build, test, lint).

## Updating
- Evolve `.vscode/snippets/codex-os.code-snippets` to encode your team's rules.
- Add new edge cases to `docs/edge-cases.md`.
- Keep checklists in `docs/security-checklist.md` and `docs/perf-checklist.md` fresh.
