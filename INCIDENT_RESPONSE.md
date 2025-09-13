# Incident Response (Code & Dependency Issues)

## If a bad Copilot suggestion was merged
1) Revert the commit quickly or disable the feature behind a flag.
2) Add tests to reproduce the failure; fix with minimal diff.
3) Document lessons learned in PR description.

## If an npm package is compromised
1) Freeze CI; block new deployments.
2) Identify affected versions via lockfile.
3) Run `npm audit` and `npm pkg set` to pin safe versions; rotate API keys if exposed.
4) Purge caches (e.g., Vercel) and redeploy.
5) Postmortem: add a rule to check postinstall scripts and obfuscated payloads.

## If a secret leaked
1) Rotate immediately; invalidate tokens.
2) Force new deployment with rotated secrets.
3) Search git history for further leaks; add secret scanning.
