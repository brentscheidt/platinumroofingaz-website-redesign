# Platinum Roofing AZ Website Redesign

This repository is the managed redesign workspace for `platinumroofingaz.com`.

## Goals

- Keep a full static baseline copy of the current public site for reference.
- Support public demo hosting on GitHub Pages.
- Keep repo content safe for public visibility (no secrets, no private data).

## Structure

- `docs/`: GitHub Pages publish directory (current site mirror output).
- `tools/mirror_site.py`: Repeatable crawler to refresh the baseline copy.
- `redesign/`: Working area for new design iterations from Antigravity.

## Security Defaults

- Never commit secrets, private keys, tokens, or customer exports.
- Use repository visibility `Public` only after confirming no sensitive files are present.
- Keep GitHub Advanced Security / secret scanning enabled if available on the org/account.
- If a secret is committed, rotate it immediately and rewrite git history.

## One-Time Setup

1. Create an empty GitHub repository (recommended name: `platinumroofingaz-website-redesign`).
2. Add remote and push:
   - `git remote add origin git@github.com:<org-or-user>/platinumroofingaz-website-redesign.git`
   - `git branch -M main`
   - `git push -u origin main`
3. In GitHub repo settings, enable Pages:
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/docs`

## Refresh Current-Site Mirror

Run from repo root:

```bash
python3 tools/mirror_site.py --out docs
```

This pulls public pages and assets from `https://www.platinumroofingaz.com/` and writes a crawl report to `docs/crawl-report.json`.

## Notes For Demo Hosting

- The mirror rewrites known links/assets to local paths so the snapshot can render directly from `docs/`.
- For the cleanest production-like demo URL, point a demo subdomain to GitHub Pages.
