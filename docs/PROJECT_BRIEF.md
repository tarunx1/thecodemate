# thecodemate project brief · 11 November 2026

## Purpose and audience

thecodemate is a visual technology education site and selected project portfolio for students, self-taught developers, curious technologists and prospective collaborators. The owner creates, previews and deliberately publishes topics/projects through a private CMS. The primary visitor actions are reading an explainer, exploring a project, or following @thecodemate.

## Current implementation

- **Frontend:** Next.js App Router, React, TypeScript, Tailwind CSS, Motion for React, Headless UI and Lucide React. Public pages are server rendered. The admin has a white fixed sidebar on desktop and a focus managed drawer on mobile.
- **Backend:** Existing FastAPI, SQLAlchemy, Pydantic, Alembic, session, CSRF, audit, media and CMS services are retained. `app/api.py` provides the same-origin JSON/form-data boundary. The old FastAPI/Jinja routes remain available but are not the intended public frontend.
- **Database:** Existing `0001` migration and tables are unchanged. SQLite is for local development/tests; production requires a dedicated MySQL database and its own migration/concurrency proof.
- **Content:** `ContentItem` identity with permanent slug, mutable draft revision and immutable published revision. Homepage settings change immediately. Only published content is public; sample content is hidden outside development. Arbitrary executable CMS code is unsupported.
- **Ownership:** Developers own schemas, validation, component contracts, tokens and allowed media/link behavior. The owner edits content, media, categories, featured flags and supported homepage settings. Operators own origins, secrets, database, backups and release.

## Visual rules

Five approved colors for the interface only: `#FF7A00`, `#0B0B0B`, `#2A2A2A`, `#BDBDBD`, `#F8F8F8`. The homepage opens on a dark first screen with owner-supplied orange SilkWaves WebGL behind centered text. All public sections and pages are black editorial with larger type and controls; admin remains white and free of decorative marketing effects. Topic/project cards use CMS covers or locally stored [Unsplash stock photographs](CARD_IMAGE_SOURCES.md) with HTML text over a borderless dark blurred gradient. Stock photos keep their natural colors and are not claimed as project screenshots. CSS tokens live in `frontend/src/styles/tokens.css`. Motion respects reduced-motion preferences. SilkWaves contains an explicitly recorded owner-supplied palette exception; it is the only live WebGL background.

## Scope and evidence

Local source implementation only; no production deployment or live domain verification. The original pre-change test baseline in this workspace was 6 passed and 2 failed because `bs4` was absent from the test environment. The latest card change passed TypeScript, ESLint, a Next production build and 18 isolated Chromium checks, including photo loading, borderless cards, black public pages, white admin, desktop/mobile layouts, keyboard focus, reduced motion and draft → publish → unpublish. Desktop and mobile card screenshots were inspected. Backend tests were not re-run for this CSS/component/asset-only change. The browser suite does not automate every CMS write path. The project skill records the exact scope and remaining caveats.

## Open decisions and limits

Project screenshots are a single cover image in the current schema; multi-image galleries, separate problem/solution/implementation fields, independent SEO field controls, CMS visualization selection, redirects for slug changes, multi-role approval, account recovery/MFA, and distributed rate limiting are not implemented. A developer-owned step visualization registry is present. Existing Markdown and steps can describe project context without schema changes. Real project claims, links and media require owner review. Production MySQL/proxy/TLS/backups/provider checks require a separate release task and actual environment evidence.

The original Visa House blueprint is an engineering reference; none of its branding, business modules, client data or credentials were adopted. The active user request supersedes the earlier Jinja-first frontend choice without altering the backend authority. The blueprint file remains separate and unchanged.

## 2026-11-12 consistency cleanup

Authored Next.js interface text and the seven current CMS setting defaults now live in `frontend/src/lib/site-copy.json`, read by Next and FastAPI. CMS-authored entries and owner-edited settings remain database-owned. `TC_ENV` is mandatory on backend startup. The Visa House sample is removed from future development seeds and the verified local copy was unpublished while preserving history. Card fallback photos are generic by content kind, not mapped to sample slugs. Retired `headline` and `hero_effect` settings are no longer exposed or edited; stored legacy rows remain. Unused visual demos, photos and their dependencies were removed.

The retained Jinja fallback templates now consume the same copy catalogue for their static labels, placeholders, accessible navigation names and page titles; CMS data and server validation messages remain separately owned.

All ten source HTML templates were audited; the remaining composed directory/detail/error labels were moved to the shared catalogue, and template copy references are checked in the backend suite.

2026-11-13: Shared public topic/project cards now use the owner-supplied Apple Store reference: rounded paper surfaces, top-aligned ink copy, large lower images, circular arrows and a responsive three/two/one-column grid on the existing black page background.

2026-11-13 follow-up: Featured cards now stay in one horizontal scroll rail with equal heights and navigation controls. Directories retain their responsive grid. Learning uses a centered numbered accordion; shared public viewport reveals rise from below and respect reduced motion.
