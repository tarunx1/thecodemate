---
name: thecodemate-website
version: 3.7.1
last_updated: 2026-11-12
description: Maintain the dark Next.js public site and white dashboard over the existing FastAPI revisioned CMS.
---

# thecodemate — portable project skill

This file describes the **implemented local project**. It is self-contained for maintenance, but the preserved `skills/visa-house-project-blueprint/SKILL.md` remains the required engineering reference. The blueprint's Visa House branding, modules, data, accounts, infrastructure and historical checks do not apply to this product. The root `AGENTS.md` requires reading both skills before every change.

## 1. Project purpose and scope

Brand: **thecodemate** / **@thecodemate**. Tagline: **Technology, made visual.** Visitors browse visual technology topics and selected project work. A single authenticated owner creates, edits, previews, publishes and unpublishes entries. Delivery is local source only; no production deployment, real link verification or security certification is claimed.

## 2. Technology stack

- Frontend: Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4 (imported; layout styles are plain CSS in `globals.css`), `framer-motion` (Motion for React) for card hover, `@headlessui/react` 2.2.10 for overlays, Lucide React. Fonts: Sora (headings), Inter (body), JetBrains Mono (labels) self-hosted through `next/font/google` at build time — the build needs network access to Google Fonts.
- Hero background: owner-supplied `SilkWaves.tsx` (WebGL1, no dependency).
- Testing: `@playwright/test` 1.63.0 for browser journeys (`npm run test:e2e`). Playwright 1.63.0 is pinned because it matches the locally cached Chromium revision 1243.
- Backend: existing Python 3.11+ FastAPI, Pydantic, SQLAlchemy 2, Alembic, Jinja2 fallback pages, Pillow, Mistune and Bleach.
- Database: local SQLite for development/isolated tests; dedicated MySQL for a future production release after compatibility and concurrency checks.
- Authentication: Argon2 password hashes, opaque session cookies, digest-only server storage, session-bound CSRF.

## 3. Frontend architecture

`frontend/src/app` holds public and admin routes, metadata, robots and a dynamic sitemap. `frontend/src/components` holds shared UI, public, admin, editor, media, navigation and motion components. `frontend/src/lib/types.ts` contains full-detail and compact-list projections; `lib/api.ts` is the server fetch helper, while `lib/client-api.ts` centralizes browser admin POST/CSRF/error behavior; `lib/admin.ts` redirects unauthenticated admin page requests. `styles/tokens.css` owns colors; `styles/globals.css` owns layout and responsive treatments. Public routes use React Server Components with `cache: 'no-store'`; only navigation, overlays, forms, sidebar, hover motion and the liquid hero need Client Components. `frontend/next.config.ts` rewrites `/api/*` and `/media/*` to `TC_BACKEND_URL` on a single browser origin. `frontend/src/proxy.ts` applies per-request nonce CSP and response headers to Next pages; the root layout forces dynamic rendering so Next hydration scripts receive the nonce.

The original Jinja templates and CSS remain in `app/templates` and `app/static` as fallback and regression context. Do not port business rules into React. Avoid a second API client, validator or theme constant set.

## 4. Backend architecture

`app/content.py` remains the CMS authority for `ContentPayload`, slug/link/step/tag validation, revisions, publication, public filtering and settings. `app/security.py` owns sessions and CSRF. `app/main.py` retains legacy routes, headers, login limiter and media processing. `app/api.py` adds typed JSON/form-data routes and calls those same services. `app/models.py` and `alembic/versions/0001_initial.py` remain the schema authority. New API operations must reuse `content.py` and server permission checks; add negative tests alongside changes.

## 5. Design token rules

Use only `#0B0B0B`, `#FF7A00`, `#2A2A2A`, `#BDBDBD`, `#F8F8F8` (ink, accent, surface, muted, paper). `frontend/src/styles/tokens.css` is the only place hex values are declared; it also holds alpha variants (`--ink-12`, `--paper-82`, …), font stacks (`--font-heading/body/mono`), the spacing scale `--space-1..9` = 4/8/12/16/24/32/48/64/96 and `--gutter`. Components consume variables; SVG colour props of the liquid hero are validated against the palette in code. The Open Graph image keeps a static copy of the palette because its renderer cannot read CSS variables. Add no other hue, neon or status colour.

Theme map: the first homepage screen is ink with orange SilkWaves and paper text; **all other public sections and pages use ink/charcoal surfaces with paper text and orange accents**; the admin is paper with ink text. Focus rings use `--focus` (ink on light surfaces, orange on dark ones). The owner-supplied SilkWaves shader carries its documented palette exception; application UI must use the five brand colors.

## 6. Shared component catalog and reuse

- `components/ui.tsx` (server-safe): Button/ButtonLink (`primary | secondary | quiet | ghost`; ghost is for dark surfaces), Field, Input, SearchInput, Textarea, Select, Card, Badge (`neutral | accent`), PageHeader, EmptyState, ErrorState, Status, Pagination.
- `components/overlays.tsx` (client, Headless UI): **Drawer** (public mobile menu and admin mobile sidebar; `side`, `tone`) and **ConfirmDialog** (the editor's publish/unpublish dialog). Each mounts only while open — a closed Headless `Dialog` server-renders a hidden probe span with an inline `style`, which the nonce CSP blocks.
- `components/public.tsx`: PublicLayout (`overHero` floats the header over the dark hero; includes skip link), SiteFooter, ContentCard, FeaturedSection (`index`, `intro`), InstagramCallout (the "Explore more" CTA), Article. ContentCard renders the editor's cover or a locally stored stock photograph, then overlays readable text in a borderless dark blurred gradient.
- `components/site-header.tsx` re-exports the site-specific `components/navbar-menu-demo.tsx`, installed from `@aceternity/navbar-menu-demo`. Its desktop pill menu uses adapted primitives in `components/ui/navbar-menu.tsx`; `overlay` floats over the hero and `light` is sticky elsewhere. Topics, Projects and About use real routes; Topics and Projects expose small hover/focus panels. The existing shared Drawer handles mobile navigation.
- `components/motion/LiquidAmbientHero.tsx` + `SilkWaves.tsx`: the hero (see §8).
- `components/motion.tsx`: reduced-motion-aware CardHover.
- `components/admin-shell.tsx`: one `AdminNav` list rendered in the desktop sidebar and inside the mobile Drawer.
- `components/admin-content.tsx` (MetricCard, ContentTable), `admin-list.tsx`, `directory.tsx` (shared Pagination), `editor.tsx` (ContentEditor + ConfirmDialog), `settings-form.tsx`, `media-manager.tsx` (media picker lives in the editor), `login-form.tsx`, `visualizations.tsx`.

Headless UI conventions: use it for overlays/menus/listboxes that need focus management; keep native `<select>`, checkboxes and search inputs inside GET forms where they already work without JavaScript. Tabs, Listbox, Combobox, Switch and Menu are not used yet — add them through a shared wrapper in `overlays.tsx`/`ui.tsx` when a real need appears, never per page. Before adding a component, search for an equivalent and extend a typed variant first. No second dialog, button, API client or token system.

## 7. White admin design system and sidebar contract

The admin uses `#F8F8F8` background, ink text, thin `--ink-12` borders, compact metrics and plain tables. No liquid, glow or decorative effects. A 240px full-height sidebar contains Dashboard, Topics, Projects, Media and Settings, then View Website and Logout. Active state comes from `usePathname` (orange bar + `aria-current`). At ≤760px the sidebar is hidden and the same `AdminNav` opens in the Headless UI Drawer from a topbar button (focus trap, Escape/backdrop close, focus return, scroll lock, closes on navigation). Publish/unpublish open ConfirmDialog instead of `window.confirm`. There is no Audit Logs navigation because no audit-log viewer is exposed.

## 8. Public design and motion rules

**Homepage structure:** first screen = `LiquidAmbientHero` (dark, centered text without a card panel); then a dark `.editorial` wrapper: 01 Featured topics, 02 Interactive learning, 03 Featured projects, 04 About (live published counts), 05 Explore more CTA, footer. Topic/project directories, details and 404 are dark; admin preview uses the public article treatment. Hero eyebrow, two headline lines, highlight and description come from `SiteSetting` (edit in Admin → Settings); the learning/about copy is developer-owned. Section labels use JetBrains Mono with an orange rule. Keep WebGL confined to the first-screen SilkWaves; the footer is static.

Public card contract: `frontend/public/card-photos/` contains eight locally stored Unsplash photographs for the labeled development samples. Unknown topics reuse `topic-ai.jpg`; unknown projects reuse `project-learning.jpg`. These are decorative stock backgrounds, not factual screenshots or CMS media records. The source URLs and license are in `docs/CARD_IMAGE_SOURCES.md`. A CMS cover always takes priority. Card image dimensions reserve space; title, category, summary and link arrow remain HTML over a borderless dark `--ink-78` gradient with 12px backdrop blur. The card and copy area have no visible border; keyboard focus retains a visible outline. Photos retain natural photographic colors at the user's request; interface colors still use only the five brand tokens. Public pages use ink backgrounds with paper text; public buttons, inputs and supporting copy are larger than the admin treatment. Keep card text readable over bright uploaded images and verify narrow/long-title layouts after changes.

**Hero (`components/motion/LiquidAmbientHero.tsx`):** centred hero text (no card panel; soft text shadow, none on buttons) over the owner-supplied **SilkWaves** WebGL background (`components/motion/SilkWaves.tsx`, `colors={ORANGE}`, kept verbatim). The liquid-metal bubbles and the aurora were removed at the owner's request. `@paper-design/shaders-react` was uninstalled, and its nonce stylesheet in `app/layout.tsx` removed with it.
- SilkWaves: a zero-dependency WebGL1 component. It is decorative (`aria-hidden`, no pointer events), and pauses itself offscreen, in hidden tabs and under reduced motion. The hero also passes `speed 0` when paused or reduced. It renders on the client only: it sets inline `style` props, which the nonce CSP blocks in server HTML but allows when React applies them in the browser. Without WebGL, before hydration or without JavaScript, `.liquid-stage-fallback` shows a static orange glow. Its `ORANGE` palette includes `#050507`, `#3A1400` and `#FFB066`, outside the five brand colours: owner-supplied. `eslint.config.mjs` turns off `react-hooks/refs` for that file only.
- `data-liquid-state` (`running|paused|static`) and `data-liquid-layout` expose state for tests.
- `hero_effect` setting: the frontend no longer reads it. The backend still has the `hero_effect` setting (allowlist `{"liquid-metal"}` in `app/content.py`) and the API still returns it (`SiteSettings.hero_effect` in `lib/types.ts`). It was left in place because another agent was editing those files concurrently. Remove both, plus `tests/test_api.py::test_hero_effect_setting_is_allowlisted`, in a later backend change.
- CSS pipeline quirks: author only the standard `backdrop-filter`. The local `next dev` server sometimes keeps serving a stale `globals.css`; a further content change forces a recompile (`touch` does not). Verify the served CSS before judging a visual change.
- Known gaps: no real-device GPU, Safari or Firefox measurement.

**Typography:** headings Sora 650 with letter-spacing ≥ −0.035em and line-height ≥ 1.05 (the previous −0.085em/0.99 settings caused glyph collisions); body Inter 1.6; `clamp()` display sizes; `text-wrap: balance`; CMS headline parts are block spans, not forced `<br>`; reading widths in `ch`. E2E checks ratios on headings and paragraphs.

Other motion: subtle card hover via Motion for React, disabled under reduced motion; CSS strips transitions under `prefers-reduced-motion`. No scroll hijacking.

Navbar maintenance: the Aceternity registry source was adapted to `framer-motion`, existing brand CSS tokens, semantic Next links, Escape/focus behavior and reduced motion. The entire header is one borderless, fully rounded capsule with a 20px backdrop blur; the inner menu has no separate pill border or fill. Public buttons and icon buttons also use capsule radii; admin controls retain their compact workspace styling. The light variant uses translucent paper, and the hero overlay uses translucent ink. The demo's placeholder services/products/pricing and external assets are not used. Keep desktop and mobile destinations synchronized; verify keyboard, pointer and drawer navigation after edits. On 2026-11-12, two focused disposable Chromium tests passed for the capsule and button radii and desktop/mobile interaction.

## 9. CMS data ownership and publication

`ContentItem` has `kind`, permanent slug, independent draft and published pointers. `ContentRevision` stores title, summary, Markdown body, pipe-separated steps, category, tags, optional cover, HTTPS demo/repo/video links, featured and sample flags. The draft is editable; published rows are not. Publish compares the submitted draft ID, switches the live pointer and clears draft. Unpublish clears the public pointer while retaining history. Public API and pages use the published pointer only, and samples are hidden outside development. Settings change immediately and are explicitly described that way in the editor. Do not call prepared content published without checking live state.

Cover uploads accept JPEG/PNG/WebP up to 8 MiB, decode, resize and re-encode to WebP with metadata removed. Request bodies are limited before form parsing (9 MiB on upload routes, 64 KiB on other writes); a new file is unlinked on transaction rollback. Files have random keys and stable `Media` IDs. Private/unreferenced media requires an admin session; publicly referenced media is delivered only while published. Media responses use `no-store` to avoid stale access after unpublish. There is no media deletion or multi-image gallery yet.

## 10. API contracts

All routes are served by FastAPI and rewritten under the Next origin. Public: `GET /api/public/home`, `/api/public/settings`, `/api/public/topics`, `/api/public/projects` with `q`, `category`, `page` and `page_size`, and `/api/public/{topics|projects}/{slug}` with related entries. Detail returns 404 for missing, draft or hidden sample content. Admin: login token, login, me, logout, dashboard counts, content list/detail/create/save/publish/unpublish, settings get/save, and media list/upload under `/api/admin/*`. Public/admin content lists return compact revisions and `{items,total,page,page_size,has_next,categories}`; detail returns full Markdown/HTML/steps/links. Page size defaults to 24 and is capped at 48. Admin writes use `x-csrf-token` plus the existing session cookie and form data. Existing-item save/publish/unpublish also require `expected_state`; a mismatch returns 409. Errors are JSON `{detail}` with appropriate HTTP status, including 401, 403, 404, 409, 413 and 422. Admin responses use `no-store`. API data types are in `frontend/src/lib/types.ts`; update them with server projections.

`app/api.py` serializes trusted Markdown as `body_html` through the same Mistune/Bleach sanitizer used by the legacy renderer. React renders only that server-sanitized field as HTML. Never accept arbitrary CMS HTML, executable code, arbitrary embed URLs or client-supplied link destinations outside server validation.

## 11. Auth and CSRF behavior

The single owner is created explicitly by `scripts/bootstrap_admin.py`; no signup or default credential exists. The browser receives an HttpOnly SameSite=Lax session cookie and readable CSRF cookie, Secure in staging and production. Only token digests are stored in the database. Next forwards the request cookie to FastAPI on server-side admin reads; Client Components echo CSRF in the header on writes. Login has a pre-auth CSRF cookie and the existing in-process limiter. Logout revokes the session server-side. No localStorage token or browser-owned authorization. The in-process limiter requires a single worker until replaced by a shared store.

## 12. Database and migrations

The original `0001` migration is preserved. It calls `Base.metadata.create_all`, so future model additions would silently alter fresh installs unless a new forward migration is added. `tests/test_migrations.py` now upgrades a disposable SQLite database, runs Alembic check and asserts the initial table/column fingerprint to catch that drift. This change adds no model fields or schema migration. Never migrate a guessed production database, rewrite an applied migration or infer MySQL locking from SQLite. A new field needs a new Alembic migration, Pydantic validation, typed API, editor, public renderer and meaningful tests. Production needs a dedicated MySQL URL and actual migration/locking proof.

## 13. SEO, accessibility and performance

Public pages are server rendered and return real 404 statuses. Metadata includes page titles, descriptions, canonical paths and Open Graph fields; Next produces a default 1200 × 630 Open Graph image, robots and sitemap. Indexing is disabled unless `NODE_ENV=production` and `TC_SEO_INDEXING=true`. Published content only appears in the sitemap. Inputs have labels, status/error messages use live regions, focus is visible, mobile drawer traps focus, and reduced motion is respected. Covers have stored dimensions and responsive layout; the backend serves re-encoded WebP. The media path remains unoptimized by Next to preserve authentication and immediate unpublish behavior. Do not claim formal WCAG or Core Web Vitals compliance without audits.

## 14. Testing procedures and current evidence

Use disposable data and media paths. Backend: `.venv/bin/python -m compileall -q app scripts`, `.venv/bin/python -m pytest -q`; `tests/test_migrations.py` performs a fresh Alembic upgrade/check and verifies the initial schema contract. Frontend: `cd frontend && npm ci && npm run typecheck && npm run lint && npm run build`. Browser: `cd frontend && npm run test:e2e` invokes `scripts/run_e2e.sh`, which creates a temporary SQLite database/media directory, migrates and seeds labeled samples, bootstraps a synthetic owner, starts FastAPI on 8011 and Next dev on 3011 with separate `.next-e2e`, then cleans up. It refuses occupied ports and never uses the default local database. CI in `.github/workflows/ci.yml` installs `requirements-lock.txt` and the npm lockfile, then runs these checks. Next bakes rewrites at build time, so build with the intended `TC_BACKEND_URL`; the sitemap is dynamically rendered to reflect publication without rebuilding.

`tests/e2e/site.spec.ts` currently covers 18 Chromium cases: hero composition at 375/390/768/1024/1440/1920 (hero fills first screen, WebGL canvas appears after hydration, ≥20% of sampled pixels warm-lit, no horizontal overflow), card images load with borderless blurred text gradients, card links clickable, reduced-motion static frame, offscreen pause/resume, aria-hidden stage, public drawer focus/Escape/return, typography ratios, dark directory/detail/404 at 375/1440, white admin workspace, sidebar active state, publish ConfirmDialog cancel, admin mobile drawer, logout and a draft → publish → unpublish visibility journey. Browser checks exclude known `style-src` inline-style CSP console reports from the no-JavaScript-error assertion; these reports remain an unresolved issue, not a clean-console claim.

Dated local record, 2026-11-12 (black public theme and image cards): TypeScript, ESLint, isolated Next production build and 18/18 disposable Chromium tests passed. A 1440px local screenshot of the featured-topic section was visually inspected after restarting a stale Next dev cache; the local page then showed black surfaces, loaded SVG artwork and a computed 20px card-panel blur. The admin browser check remained white. Real-device contrast and performance measurements were not performed.

Dated local record, 2026-11-11 (company-practice repair): 18 backend tests passed, including migration agreement, TypeScript and ESLint passed, isolated Next production build passed with network access for font downloads, and the disposable Chromium suite passed 16/16. The first sandboxed build failed to fetch fonts; a later build failed because the sitemap was being prerendered against an unreachable backend; making the sitemap dynamic resolved the latter. The browser run observed the CSP inline-style reports noted above. CI was added but has not run on GitHub. Python lock versions were captured from the current Python 3.11 environment; Linux CI install remains unverified here.

Dated local record, 2026-11-12 (navbar replacement): TypeScript, ESLint and isolated production build passed. Two focused disposable Chromium checks passed: desktop hover/focus/Escape/route/current-state behavior and the mobile drawer's focus/Escape/return behavior. The full browser suite was not re-run for this navbar-only change.


## 15. Deployment prerequisites

No deployment is authorized or performed by this skill. For production: dedicated MySQL and migration/locking tests; strong server secret; HTTPS `TC_SITE_URL` matching the browser origin; private FastAPI behind the Next public origin; persistent media; TLS/proxy/cookie/CSP checks; backups and restore drill; a shared limiter or single worker; actual domain, public route, admin, media and SEO checks. Keep unrelated services and databases untouched. Never put credentials, runtime `.env`, databases or media in source or this skill.

## 16. Known limitations

No separate structured screenshot gallery, problem/solution/implementation or technology fields; use Markdown, steps, tags and one cover within the existing schema. Stock card photos do not replace verified project screenshots. No explicit SEO field editor, CMS visualization selection, slug redirects, audit-log UI, deletion, scheduling, multi-role approval, MFA, recovery, shared rate limiter, MySQL concurrency proof or production release. The original Jinja templates remain but are not visually synchronized with Next. No real project links or content publication were imported. No accessibility certification, image rendition set, real-device browser matrix or performance measurement has been completed. The original dynamic `0001` migration is only guarded against future drift, not rewritten. List endpoints limit response size but still assemble all matching rows on the server; larger catalogs need database-level filtered pagination. The browser suite currently does not automate every editor/media/settings write. Headless UI navigation still logs blocked inline-style CSP reports in Chromium; the suite excludes only those messages from its JavaScript error assertion, and the CSP remains strict. Liquid hero: no real-device GPU/frame-rate measurement or Safari/Firefox check; the orange-on-hero nav labels rely on a text shadow rather than measured contrast. The suggested hero copy ("Understand technology. See how it works.") is not applied — it is CMS-owned and must be set by the owner in Settings.

## 17. Future-change workflow

**READ SKILLS → INSPECT SOURCE → CHECK COMPONENT REUSE → IDENTIFY AFFECTED CONTRACTS → IMPLEMENT → VERIFY → UPDATE PROJECT SKILL → REPORT ACTUAL RESULTS.** Read root `AGENTS.md`, this skill and the original blueprint before each change. Preserve other work and the five-color brand. For a field, keep schema, migration, server validation, API type, editor, public view and tests coherent. For auth/media/publication changes, verify negative cases. Use exact evidence language: implemented locally, tested, prepared, blocked, untested or deployed.

## 18. Content continuity tracker

This is separate from website development and CMS publication status. Known prior content-production state:

| Topic | Prior state |
| --- | --- |
| API | Explanation/content covered |
| DNS | Explanation/content covered |
| Bubble Sort | Implementation confirmed previously |
| HTTP | Five-slide carousel prepared |
| How AI Works | Prompt, caption, cover and cheat sheet prepared |
| How Files Travel Across the Internet | Reel production prompt prepared |

Do not infer that these topics exist as published CMS records. At the end of every future **content-production** command, display this completed/prepared tracker with only verified status changes.
