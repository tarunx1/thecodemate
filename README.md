# thecodemate · Technology, made visual.

A local Next.js public site and white editorial dashboard backed by the existing FastAPI CMS. Content, sessions, CSRF, validation, media and publication remain server owned. The original FastAPI/Jinja pages remain in source as a fallback; Next.js is the intended public and admin frontend.

The public header uses the Aceternity navbar-menu demo adapted to thecodemate routes, brand tokens and keyboard/reduced-motion behavior. The whole header and public buttons use capsule shapes; the header is borderless and blurred. The existing shared drawer remains the mobile navigation.

## Architecture

- `frontend/`: Next.js App Router, React, TypeScript, Tailwind CSS, Motion for React (`framer-motion` package), Lucide React. Public pages render on the server; interactive admin forms and navigation are Client Components.
- `app/`: FastAPI, SQLAlchemy, Pydantic, Pillow, Mistune/Bleach, opaque server sessions and CSRF. `app/api.py` exposes JSON and form-data endpoints for Next.js. The existing `app/content.py` remains the CMS authority.
- `alembic/`: existing `0001` schema; this migration did not change the database schema or existing data.
- Next.js rewrites `/api/*` and `/media/*` to the private FastAPI origin. Browser cookies stay on one public origin. The Next server fetches public and authenticated data from FastAPI with no store caching; the browser sends CSRF on admin writes.

## Local setup

Use Python 3.11+ and Node.js compatible with the pinned Next.js version. From this directory:

```bash
python3 -m venv .venv
source .venv/bin/activate
export TC_ENV=development  # required explicit local runtime mode
pip install -r requirements-dev.txt
mkdir -p data media
alembic upgrade head             # only after confirming TC_DATABASE_URL is the intended local DB
python -m scripts.bootstrap_admin # enter your own owner credentials
cd frontend && npm ci
```

For sample cards in local development, run `python -m scripts.seed_demo` from the repository root. Samples are labelled and hidden outside development. The Visa House demonstration project is no longer seeded; a verified copy in the local development database was unpublished without deleting its revision or audit history. Never run seed or migration commands against an unidentified database.

Run the two services in separate terminals:

```bash
# terminal 1, repository root
TC_ENV=development TC_SITE_URL=http://127.0.0.1:3000 .venv/bin/uvicorn app.main:app --reload --host 127.0.0.1 --port 8000

# terminal 2, frontend/
TC_BACKEND_URL=http://127.0.0.1:8000 TC_SITE_URL=http://127.0.0.1:3000 npm run dev
```

Open `http://127.0.0.1:3000` and sign in at `/admin/login`. The FastAPI process must be running for content and authentication. Set `TC_DATABASE_URL` and `TC_MEDIA_DIR` before migrations and startup when using nondefault local paths. The app does not load `.env` automatically. `.env.example` lists backend setting names.

The canonical source for authored UI text and default CMS settings is `frontend/src/lib/site-copy.json`. Next reads it via `lib/copy.ts`; FastAPI reads the same JSON via `app/copy.py` and exposes its `legacy` copy to the retained Jinja templates. The fallback navigation script receives its accessible labels from rendered data attributes. All ten source HTML templates were audited for literal interface text; composed labels are also in the catalogue, and a backend test checks each template reference. Admin-edited hero/footer settings and published content remain in the CMS. Edit the catalogue for developer-owned interface copy, then run both frontend and backend checks. `TC_ENV` must be set explicitly on every backend startup; the app will fail closed when it is missing. The retired `headline` and `hero_effect` setting rows are retained in existing databases but no longer exposed or changed.

## Public routes

- `/`: dark hero with an orange SilkWaves background (`components/motion/LiquidAmbientHero.tsx`) behind the editable three-part headline, then dark editorial sections: featured published topics/projects, learning highlights, about, Instagram call to action.
- `/topics`, `/projects`: keyword search, category filters and paginated summaries.
- Topic and project cards use uploaded covers when present; otherwise they show locally stored [Unsplash photographs](docs/CARD_IMAGE_SOURCES.md). These are decorative stock images, not project screenshots. Borderless paper cards place large ink titles and summaries above photographs, with rounded corners and circular arrow indicators. All public pages use the black theme with larger text and controls; the admin remains white.
- `/topics/[slug]`, `/projects/[slug]`: published details, safe Markdown, steps, cover, tags, verified editor supplied links and related entries. Drafts return 404.
- `/opengraph-image`, `/robots.txt`, `/sitemap.xml`: Next-generated SEO surfaces; indexing is disabled unless production explicitly enables `TC_SEO_INDEXING=true`.

## Admin routes

- `/admin/login`, `/admin`: sign-in and dashboard with real topic/project counts and recent entries.
- `/admin/topics`, `/admin/projects`: searchable, filterable and paginated content lists.
- `/admin/topics/new`, `/admin/projects/new`, `/admin/topics/[id]`, `/admin/projects/[id]`: shared draft editor, cover picker/upload, preview, publish and unpublish.
- `/admin/preview/[id]`: authenticated private draft preview.
- `/admin/media`: authenticated media library and upload.
- `/admin/settings`: editable homepage copy, Instagram URL and footer statement. Settings apply immediately.

The underlying single-owner CMS supports one working draft per item and immutable published revisions. Slugs remain permanent. The editor's sample flag controls development-only public display. Do not treat illustrative data or unverified links as real portfolio work.

The editor sends an `editor_state` token with save, publish and unpublish requests. A stale tab receives HTTP 409 and must reload before changing content. Admin writes require CSRF; staging and production session cookies use `Secure`. Multipart requests are capped before parsing (9 MiB for upload routes, 64 KiB for other writes); approved images remain capped at 8 MiB. New files are removed if their database transaction rolls back. Public/admin lists return compact summaries with `page`, `page_size`, `total` and `has_next`; item details retain full content.

## Verification

```bash
.venv/bin/python -m compileall -q app scripts
.venv/bin/python -m pytest -q
# The backend suite checks a freshly migrated disposable database and Alembic agreement.
cd frontend
npm run typecheck
npm run lint
npm run build
# Starts a separate Next/FastAPI stack on ports 3011/8011 and creates disposable data:
npm run test:e2e
```

The browser runner clears only its dedicated generated `.next-e2e` cache before each run to avoid stale CSS. The test suite uses disposable SQLite databases. The browser launcher refuses occupied test ports and never points at the default local database. CI runs the pinned Python dependency set in `requirements-lock.txt`, frontend checks, build and isolated Chromium suite. The current browser suite covers 18 cases, including card image loading and the draft → publish → unpublish journey; it does not yet automate every settings or upload journey. The legacy `0001` migration uses live model metadata; a schema fingerprint test now detects drift, but a future schema change still needs a new migration.

## Security and release boundary

FastAPI alone validates content and external URLs, verifies sessions/CSRF, writes audit rows, re-encodes uploaded images, and controls public visibility. Private media requires an admin session; published cover media is public. `/api/admin/*` and media responses are not publicly cacheable. Next.js does not store tokens in localStorage.

The site is deployed at https://thecodemate.com (see `deploy/` and the project skill §15). A push to `main` goes live automatically within a few minutes once the GitHub checks pass; a commit whose checks fail is not deployed. The remaining production hardening is still open: provide a dedicated MySQL database, HTTPS public origin, strong `TC_SECRET_KEY`, persistent media storage, a single-worker rate-limit plan or shared limiter, backups/restore drill, MySQL migration/concurrency testing, proxy/cookie/CSP checks, and browser checks on the actual domain. Configure the proxy so the Next app owns public routes and FastAPI is private. See [the project skill](skills/thecodemate-site/SKILL.md) for current contracts and limitations.

## Engineering instructions

Read [AGENTS.md](AGENTS.md), the preserved [original engineering blueprint](skills/visa-house-project-blueprint/SKILL.md), and the maintained [thecodemate project skill](skills/thecodemate-site/SKILL.md) before modifying this application. The independent project-skill export is [thecodemate_project_SKILL.md](thecodemate_project_SKILL.md).

Featured/related cards use a single horizontal scroll rail with arrow controls. The learning section uses a numbered accordion. Public content reveals upward on viewport entry; reduced-motion visitors receive static content.
