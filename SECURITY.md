# SECURITY POLICY — DhanPedia

DhanPedia is a static, privacy-first site. This page documents how we handle
security.

## Reporting vulnerabilities

If you find a security issue (injection, broken link target, dependency
vulnerability, or a process that could leak data), please:

- **Email:** [chirag@oriz.in](mailto:chirag@oriz.in)
- Include: a short description, affected page/component, and any repro steps.

We aim to acknowledge reports within a reasonable time and to fix critical
issues before public deployment.

## Design principles

- **Static & serverless:** no backend, no user accounts, no login, no PII
  collection. The calculator library runs entirely in the browser.
- **No secrets in the repo:** API keys, tokens, and credentials are never
  committed. GitHub Actions use only the `GITHUB_TOKEN` it provides.
- **Dependency hygiene:** pinned ranges in `package.json`; `npm install`
  regenerates `package-lock.json`; periodic `npm audit` in CI.
- **Safe URL handling:** external links use `rel="noopener noreferrer"` when
  opening new tabs; no unvalidated user input is reflected into HTML.
- **Input validation:** calculator inputs are validated and clamped; no
  division-by-zero, overflow, or invalid-date crashes.

## Privacy

- No trackers by default. If analytics are ever added, they are optional,
  disclosed, and do not require a cookie wall.
- No calculator inputs are sent to any external service.

## Release notes

Security fixes are listed in `CHANGELOG.md` under the affected version.
