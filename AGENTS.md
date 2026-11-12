# thecodemate — required project instructions

## Required engineering references

This repository adopts `skills/visa-house-project-blueprint/SKILL.md` as the original portable **company engineering baseline** and `skills/thecodemate-site/SKILL.md` as the **project-specific maintained skill**. They are separate files with different responsibilities.

Before **every** feature, bug fix, UI, API, schema, config, dependency, test, documentation or deployment change:
1. Read this `AGENTS.md`, the original skill's use/company-practice/maintenance sections, and the entire project skill once per task, then the affected original-skill sections.
2. Inspect current source, changes and verification. Preserve unrelated work and user-approved branding.
3. State the requested outcome and review public/admin/data boundaries.
4. Implement the smallest coherent change, validating schema + server auth + render + editor + tests together.
5. Report exactly what was built and what was actually tested. Do not claim deployed, certified, provider-tested or secure based on build alone.
6. Update `skills/thecodemate-site/SKILL.md` when a durable contract, command, behavior or gap changes. Preserve the original reference's historical evidence.

Required future workflow: **READ SKILLS → INSPECT SOURCE → CHECK COMPONENT REUSE → IDENTIFY AFFECTED CONTRACTS → IMPLEMENT → VERIFY → UPDATE PROJECT SKILL → REPORT ACTUAL RESULTS.** Keep `thecodemate_project_SKILL.md` synchronized as the independent export. Do not duplicate the full skills here.

The source skill is a **reference**, not executable app code. Do not copy Visa House brand colors, secrets, applicant data, providers, accounts, names or unapproved claims. Do not deploy, send mail, publish real content, mutate production databases or touch unrelated services without explicit authorization.

## Source-of-truth summary

- Brand palette ONLY: `#FF7A00`, `#0B0B0B`, `#2A2A2A`, `#BDBDBD`, `#F8F8F8`.
- Themes: dark public site with the SilkWaves WebGL background on the first homepage screen only; admin white. Hero rules live in the project skill §8.
- Stack: Next.js App Router + React + TypeScript + Tailwind CSS + Motion for React + Headless UI (shared overlays) + Lucide React for the intended public/admin frontend; existing FastAPI + SQLAlchemy + Alembic remain the authoritative backend. Jinja2/vanilla assets remain as fallback. SQLite is local development only; dedicated MySQL requires compatibility tests before production.
- Content: topics + projects, one mutable draft, immutable published revisions; explicit publish/unpublish; sample content hidden outside development.
- Routes: Next.js owns `/`, `/topics`, `/topics/{slug}`, `/projects`, `/projects/{slug}`, `/admin` and its editor/auth/media/settings routes. Next rewrites `/api/*` and `/media/*` to private FastAPI.
- Admin: single trusted owner, opaque hashed sessions, Argon2 password hashes, session CSRF; no public signup.
- Settings: immediate public edits, disclosed in admin UI; content drafts remain isolated.
- Scope: local runnable first version; no production deployment has been authorized or verified.
