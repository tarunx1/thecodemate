---
name: visa-house-project-blueprint
description: Start or maintain a business website and CMS using the Visa House engineering blueprint. Includes architecture, required practices, project planning and future-update instructions in one standalone file. Adapt branding, stack, infrastructure and optional modules to the target project.
---

# Standalone project engineering blueprint

**This SKILL.md is the complete portable instruction file.** Copy this file alone into a new project at `skills/visa-house-project-blueprint/SKILL.md`. No reference folder, script, asset, installed skill or original Visa House checkout is required to use it. This is an implementation guide, not the application's source code or a runnable starter.

The user adopted this engineering baseline on 2026-11-11. It combines successful source patterns, required future practices and explicitly recorded gaps. It does not claim to cover every possible industry's requirements or certify security, accessibility, legal compliance or production readiness.

## Use this file

1. For a new project, read the company practices, starting-a-project and architecture sections. Fill the relevant brief fields below and implement the requested product. Follow the detailed domain sections as needed.
2. Put the future-project instructions below into the new repository's root `AGENTS.md`, merging existing instructions. This makes consultation of this file a requirement for future updates in that repository.
3. Before each update, read the mandatory practices and maintenance workflow once per task, then the affected sections. Re-read changed guidance. Verify the current project's source rather than treating the reference snapshot as current target behavior.
4. Keep this file as the canonical maintained reference in the adopting project. Record target-specific choices and verification separately from the original historical evidence.
5. Adapt the business identity, stack, optional modules and infrastructure. Do not copy client secrets, data, claims, legal text, service names or provider accounts.

This file supports authorized work; it does not grant permission to deploy, publish content, send real mail, make payments, mutate production data or touch unrelated services. Continue ordinary reversible work within the user's existing authorization.

### Contents

- [Company engineering practices](#company-engineering-practices)
- [Future updates and maintenance](#future-updates-and-maintenance)
- [Starting a new project](#starting-a-new-project)
- [Architecture and ownership](#architecture-and-ownership)
- [CMS and content](#cms-and-content)
- [Frontend and accessibility](#frontend-and-accessibility)
- [Backend security and data](#backend-security-and-data)
- [Forms mail and CAPTCHA](#forms-mail-and-captcha)
- [SEO media and integrations](#seo-media-and-integrations)
- [Testing and release](#testing-and-release)
- [Evidence and known gaps](#evidence-and-known-gaps)
- [Future-project instructions template](#future-project-instructions-template)
- [Project brief template](#project-brief-template)
- [Reference contract catalogs](#reference-contract-catalogs)

### Core design decisions

Keep developer-owned schemas, interfaces and permissions separate from editor-owned content. Enforce authorization and validation on the server. Isolate drafts from immutable published revisions. Use stable content/media identities and safe centrally resolved links. Store enquiries and notification jobs atomically, then deliver asynchronously. Keep external systems authoritative for their own transactions. Reuse accessible semantic UI primitives and tokens. Verify actual outcomes at the appropriate layer and preserve evidence limits.

## Company engineering practices

This is the engineering baseline adopted by the user on 2026-11-11 for this project and future projects adopting this blueprint. It combines source-backed patterns with requirements for future work. It is not a claim that the current application already implements every requirement, an external company's internal policy, or a compliance certification.

Apply each requirement where its feature or risk exists. Mark a practice not applicable with a brief reason when appropriate; do not add authentication, payments, a CRM, a queue service or other modules merely to complete a checklist. Explicit user choices and higher-priority instructions control scope. Project-specific exceptions should name the choice, reason and affected checks, not silently remove a safeguard.

### 1. Reference, scope and ownership

- Read the master skill and this baseline before each update; consult the relevant domain section.
- Establish the requested outcome and observable acceptance. Make routine choices independently and ask only for material missing information.
- Preserve the current working tree and unrelated user changes. Inspect instructions and source before editing; do not replace an existing architecture or approved visual design without a task reason.
- Keep business identity, supported platforms, module owners, publication rights, provider authority and environment boundaries explicit.
- A local code change, a draft, a published page and a deployed release are different outcomes. Report the one actually achieved.

### 2. Source control, review and dependencies

- Keep changes focused, reviewable and reversible where possible. Explain the concrete behavior change, relevant checks and material limitations.
- Honor the repository's branch protections, review requirements and CI policy. Do not force-push, rewrite shared history, commit, merge or publish merely because a reference procedure mentions it; follow the authorized task and actual project workflow.
- Commit dependency manifests/lockfiles appropriate to the stack and use reproducible installation in CI/release. Check runtime compatibility when dependencies change.
- Add a dependency only when its concrete value justifies its cost, maintenance and browser/server footprint. Do not add or upgrade unrelated dependencies to satisfy a generic template.
- Keep credentials, runtime environment files, database dumps, real submissions, SSH identities and build caches out of source and reusable templates. Configuration examples contain names and safe placeholders, not real secrets.

### 3. Architecture and API contracts

- Maintain explicit public/admin/domain/provider boundaries. Put validation and transactions in the authoritative server/service layer, with typed client contracts and stable error/pagination behavior.
- Reuse shared primitives, schema registries, query conventions, storage interfaces and link resolution before introducing competing implementations.
- A feature includes the needed schema, authorization, data behavior, API, editor controls, public rendering and useful loading/empty/error states. Do not deliver only a visual shell while claiming the underlying workflow works.
- Preserve existing callers and stored configurations with compatible defaults or an explicit migration. Update connected schemas, types, renderers, editors and tests together.

### 4. Database and content integrity

- Verify the intended database, application ownership and migration namespace before applying schema/data operations. Tests use disposable data.
- Keep deterministic constraints, foreign keys, useful indexes, consistent timestamps and database precision semantics. Check real target-database behavior for DDL, locking and concurrency changes.
- Use transactions for related writes and their audit records. Enforce uniqueness and conflicts server-side; use idempotency where retries could duplicate business actions.
- Keep published page/article revisions immutable and drafts isolated. Publish the reviewed revision atomically with conflict detection.
- Distinguish immediate entity/settings/navigation changes from revisioned publication. If the target requires publisher approval for every public edit, restrict or revision all those paths explicitly.
- Preserve stable content/media identities, safe slug redirects, exact-list ordering and live/draft usage checks before deletion. Do not edit applied migrations or restore a database automatically during application rollback.

### 5. Authentication, authorization and security boundaries

- Enforce applicable permissions, ownership and CSRF on the server; hidden UI controls are not authorization. Include negative cases for privilege escalation and cross-owner access.
- Use the project's secure session/password mechanism, revocation and expiry behavior. Do not place server credentials or long-lived administrative session tokens in frontend storage.
- Limit access and credentials to what the application needs; separate development, test, staging and production identities and data.
- Validate untrusted input, URL targets, redirects and uploads. Keep external I/O bounded and constrain editable destinations to the intended trust boundary.
- Preserve appropriate TLS verification, security headers, cache boundaries, request-size limits, rate limits, safe error envelopes and sensitive-data redaction.
- Assess account recovery, MFA, tenancy and incident needs according to the product; do not advertise these as implemented because the reference mentions them. A 401, HTTPS or an audit scan alone does not prove comprehensive security.

### 6. Personal data and truthful content

- Collect only data required by the actual workflow, keep private fields/recipients out of public payloads, and avoid unnecessary applicant data in logs or analytics.
- Identify responsible owners for retention, deletion/export, backup access, provider privacy and recovery. Record unresolved requirements before claiming readiness for real collection.
- Use synthetic fixtures in tests. Never copy another client's accounts, submissions, stories, secrets or approved claims into a new project.
- Keep demo content labelled and segregated according to the target policy. Require the appropriate factual approval and client consent for real testimonials/outcomes.
- Legal/privacy copy, regulatory claims and certification statements require evidence appropriate to the target. This engineering baseline does not supply approved legal text or an automatic compliance guarantee.

### 7. Frontend, accessibility and performance

- Preserve semantic structure, meaningful headings, labels, visible focus, keyboard navigation, error/status announcements and correct modal/menu focus behavior.
- Test the affected flow at relevant desktop/mobile sizes, long content and large text. Avoid clipping, hidden essential controls, keyboard traps and unexpected scrolling.
- Use semantic design tokens, shared components and explicit responsive behavior. Adapt the client's palette/fonts/content; do not inherit Visa House branding accidentally.
- Respect reduced motion, stop obsolete observers/listeners/work and let visitor input interrupt automatic scrolling or animation.
- Reserve media dimensions, use appropriate responsive images and defer expensive optional visuals/feeds without making essential content depend on GPU or provider availability.
- Preserve form input and query context through recoverable errors and navigation. Check anchors, sticky-header offsets, repeated clicks, direct links and history when navigation changes.
- Assess performance against the actual affected journey using relevant measurements; do not claim Core Web Vitals or accessibility conformance from a build alone.

### 8. Forms and external services

- Validate forms server-side, rate-limit applicable abuse, check CAPTCHA tokens on the server and keep bypass/test providers outside production.
- Protect retries with logical idempotency. Persist an enquiry and intended notification job together; keep delivery failure from losing saved enquiries.
- Keep notification recipients/provider credentials server-owned, encrypted or otherwise protected by the selected secret system. Document key backup/rotation behavior.
- Use bounded retries, leases/recovery, useful admin status and audited retry where delivery is asynchronous. State SMTP acceptance and inbox receipt separately; do not promise exactly-once email.
- Keep external systems authoritative for their stock, payments, pricing and other business state. Validate/allowlist feed output, set timeout/size/cache/failure behavior and avoid forwarding browser credentials.
- Use mocks or a local stand-in in automation. Real mail, CAPTCHA, payments and provider configuration checks follow the user's actual authorization.

### 9. Testing, CI and evidence

- Choose checks from the actual change: static/type/style checks, meaningful unit/integration behavior, rendered interactions, database compatibility, provider outcomes and deployment checks are different layers.
- Add regression coverage for substantive behavior or demonstrated defects. Avoid tests that merely reproduce implementation details or unnecessary tests for trivial reversible edits.
- Verify rendered UI changes in a browser when the behavior depends on layout, interaction or browser APIs. Record relevant screenshots, console issues, keyboard/mobile behavior and missing browser coverage.
- Use isolated databases/uploads/providers. If a test cannot run because of tools or permissions, report that boundary and pursue authorized alternatives; do not relabel it as a pass.
- Protect production releases with appropriate required CI checks, including stable critical browser journeys for the shipped product. Disabled/skipped gates and unknown audit results are visible gaps, not successful evidence.
- After required checks pass, stop repeating or expanding tests unless a new change, failure or unresolved concern justifies it.

### 10. Release, operations and maintenance

- Release reproducible, identified artifacts that passed the required checks. Preserve runtime secrets and persistent media outside immutable build/release directories.
- Before an authorized live change, verify the exact service, environment and dependency scope. On a shared host, baseline and recheck unrelated services and change only the named application.
- Use suitable preflight, readiness, public-route/provider checks and an application rollback plan. Do not equate process liveness with business readiness.
- Maintain database/media/key backups with explicit access and recovery ownership; verify restoration appropriate to the release risk. Application rollback and data recovery are separate operations.
- Preserve useful request IDs, safe audit trails, actionable error/delivery/readiness signals and a target-specific monitoring/incident owner.
- Update affected configuration examples, contracts, run instructions, acceptance evidence and skill guidance as behavior changes. Retain historical evidence as historical; never invent fresh test results.

### Applying the baseline

Follow [the update workflow](#future-updates-and-maintenance) for change-specific reading and maintenance. The domain sections below supply implementation detail. [The evidence ledger](#evidence-and-known-gaps) records what the Visa House snapshot actually proves and where this future-work baseline is stronger than the existing implementation.

## Future updates and maintenance

### Before each update

1. Read root `AGENTS.md`, this file's use instructions and company engineering practices. Read once per task and re-read changed guidance; consult the relevant domain sections as needed.
2. Inspect the working tree, current implementation and evidence. Preserve unrelated work and the target project's chosen identity, architecture and ownership.
3. Identify the concrete outcome, affected contracts and the smallest set of checks that demonstrate it. Distinguish local changes, publication, provider actions and deployment using the actual authorization.
4. Implement the smallest coherent change. Do not remove protections or alter another application's resources to make a check succeed.

### What changes together

| Area | Maintain when the contract changes |
| --- | --- |
| API, schema, database | Types, validation, migrations, permissions, ownership and compatibility evidence |
| CMS and content | Registry, config schema, editor, renderer, draft/immediate semantics, links, media usage and publish checks |
| UI and navigation | Shared primitives, tokens, responsive behavior, keyboard/focus/motion behavior and rendered evidence |
| Forms, mail and CAPTCHA | Settings, secret source, token verification, idempotency, outbox and provider-test scope |
| SEO, media and integrations | Metadata/status/redirect policy, upload/storage limits, upstream contracts and authority |
| Dependencies, CI and release | Runtimes, lockfiles, enabled gates, artifact/configuration/recovery instructions |
| Project policy | Brief, root instructions, adopted decisions, scoped exceptions and acceptance |

Not every wording or CSS edit needs a new company rule. Update this file when a durable practice, contract, configuration, command, boundary or verification claim changes. Keep target-project decisions and evidence in a clearly named project-local section or project record. Preserve the original snapshot as historical; never replace it with an incompatible derivative catalog.

### Validation and handoff

Run the checks appropriate to the affected behavior. Distinguish attempted, passed, failed, blocked, skipped, mocked and live evidence. Do not infer runtime behavior from frontmatter validation. Check that this file remains self-contained: no instructions may require companion files or scripts. Source paths below are optional provenance, not dependencies.

If this skill is also installed in Codex, compare the repository and installed versions before intentionally syncing the skill. Preserve independent changes, use authorized filesystem permissions and report unresolved drift. Do not edit unrelated global instructions, other projects or memory files as a side effect.

State the user-visible outcome, relevant checks and remaining limitations. Name guidance changes when applicable. Record exceptions with their reason and effect; an exception does not automatically create an approval gate.

## Starting a new project

### Adaptation contract

Use the reference as a starting architecture, not a mandate to clone the immigration business, MySQL topology, branding, every section or its suppliers. Honor an explicit target stack or existing application. Transfer the validation/publication/ownership principles even when the new implementation uses different frameworks.

Populate the relevant parts of the project brief template in this file. Infer routine choices where the task gives enough information and keep moving. Ask only for missing business decisions that materially affect the requested result. An incomplete optional brief field is not a reason to block unrelated implementation.

Adopt [the company engineering baseline](#company-engineering-practices) and [update workflow](#future-updates-and-maintenance) as applicable project requirements. Copy this SKILL.md alone into the new project and merge the future-project instructions template below into its root AGENTS.md, preserving existing instructions. Record adoption and maintenance ownership in the project brief so future updates consult the reference without relying on this chat.

Record:
- Intended users, business purpose, conversion action and measurable acceptance.
- Public routes, content entities and what editors must change independently.
- Roles, publication rights and immediate-versus-draft settings.
- Brand identity, typography, responsive content priorities and language needs.
- Deployment environments, domains, persistence and ownership boundaries.
- Required providers and external systems, with secret references rather than values.
- Applicable personal-data handling, retention and content approval responsibilities.
- Scope of delivery: local build, repository changes, staged release or explicitly authorized production work.

### Foundation sequence

Choose the smallest coherent scope. A normal full CMS derivative can grow in this order:

1. Establish repository/runtimes, environment validation, database ownership, migration namespace, application shells and typed error/API contracts.
2. Implement sessions/CSRF, backend permissions, initial administrator bootstrap and audited privileged actions.
3. Add media IDs/storage, typed site settings, safe internal links and navigation.
4. Build page identity, stable section IDs, immutable live revisions, one working draft, authenticated previews and conflict-aware publication.
5. Register the needed section schemas/resolvers/editors/renderers and reusable primitives/tokens.
6. Implement entity content and owner-aware detail pages. Add articles/scheduling only if needed.
7. Add shared forms, server validation, spam controls, idempotency and durable notification delivery.
8. Add metadata, real public statuses, redirects, robots and sitemap with environment-specific indexing.
9. Add optional read-only adapters and enhancements behind clear ownership interfaces.
10. Exercise meaningful public/admin journeys; prepare reproducible tested artifacts and the agreed deployment/operations path.

Do not scaffold every optional module for a small landing page. Conversely, do not claim a CMS is complete when content is hardcoded and its editor/draft/preview/publish path is absent.

### Parameterization inventory

Replace these intentionally:
- Business/legal identity, public facts, contact details, branches, social accounts and messaging.
- Logos, imagery, font families, color roles, default text sizes and tone.
- Route vocabulary and content entity names; reserved paths and redirects.
- Table prefix and Alembic version-table name if not intentionally reusing the existing database.
- Admin cookie names, application-specific crypto domain separation and user-visible mail name.
- Public/site/API origins, CORS and canonical policy; staging indexing defaults.
- CAPTCHA hostname/action and credentials; SMTP sender/recipients and authentication records.
- External feed paths, response schemas, timeouts, caching and checkout destination.
- Runtime service names, paths, ports, private preflight address, database backup command, deploy identity and public health checks.
- Object storage/CDN if chosen, persistent upload paths, quotas and backup policy.
- Actual content approval/consent rules, legal pages, test/demo policy and operator responsibilities.

Never copy a runtime .env, database dump, administrator account, encryption key, SMTP password, SSH identity, real enquiry or a client's approved story into the next project.

### Feature completion contracts

For each feature, include its schema, database/migration if needed, backend authorization/validation, API payload, typed client, editor/display controls, public rendering, meaningful error/empty/loading states and relevant tests. A polished public card without its correct content/data ownership is incomplete.

If the target requires a distinct service publisher, adding services.publish is a target adaptation, not an existing reference permission. Wire it through the catalog, API, roles, UI and tests, or retain the reference's combined owner-edit plus pages.publish rule. Separately protect service card metadata/status, navigation and global settings if editors must never change public output without review.

For a new section, follow the coordinated registry contract. For a new permission, wire the entire catalog-to-API-to-UI path. For a new provider, preserve server secrecy, bounded I/O, safe errors, explicit source selection, test isolation and proof of actual outcomes.

### Practical review examples

**Different consultancy with no LMS:** keep pages, entity services, locations, articles if requested, forms and SMTP; remove voucher/reel dependencies, payment copy and menu availability assumptions.

**An existing React app needing the Visa House CMS workflow:** retain its visual identity and routing conventions. Add compatible revision/preview/publish behavior and server enforcement; do not replace its whole framework or styling merely because the reference differs.

**A new business requesting actual online sales:** the reference voucher adapter demonstrates authority separation and a link-out handoff. It is not an order/payment implementation. Design the new transaction/provider ownership explicitly instead of presenting the copied card as a functioning store.

**A request to reuse the current consultation scrolling fix:** inspect actual files and tests first. The audited checkout does not contain the interrupted candidate implementation. Preserve the requested UX as a specification, then implement and validate it separately.

### Acceptance and handoff

Use concrete proof appropriate to scope:
- An editor can update the intended content through the CMS.
- A draft cannot change the live page until a permitted publish action.
- An unauthorized user cannot bypass the UI through the API.
- Public navigation, anchors, large text, mobile menus and keyboard interactions work.
- A form validates, survives errors, saves once logically and creates the intended notification job.
- Missing providers have the documented safe failure behavior.
- Metadata and response statuses match public content state.
- Migrations apply to the intended database without touching another product.
- Tests run on disposable data; mock-provider proof is labeled as such.
- A deployed release, if requested, passes private/public checks and has an application rollback path with a separate data-recovery plan.

Deliver the code/artifact, exact commands checked, configuration names without credentials, evidence and limitations. Do not require the user to read earlier chat to understand completion.

## Architecture and ownership

### Reference shape

The source is a public business website plus a role-controlled content administration application. Its useful reusable unit is the CMS and delivery architecture, not the immigration industry or its exact visual design.

| Layer | Reference implementation | Responsibility |
| --- | --- | --- |
| Browser | React, TypeScript, Vite, React Router | Public rendering, administration, interactions |
| Server-state client | TanStack Query | Typed fetching, cache ownership, invalidation |
| API | FastAPI, Pydantic, SQLAlchemy | Validation, authorization, domain transactions |
| Schema evolution | Alembic | Ordered migrations and model agreement |
| Production database | MySQL | Persistent application state and concurrency |
| Test database | Isolated SQLite; disposable MySQL in CI | Fast behavior checks and actual SQL compatibility |
| Public delivery | FastAPI document layer plus built Vite assets | Server-generated metadata, real statuses, SPA rendering |
| Operations | Reverse proxy, systemd, immutable release directories | TLS, candidate preflight, application switch and rollback |

Versions in this guide are the inspected source versions, not a recommendation that they remain the newest or safest. Match supported runtimes and verify vendor documentation before upgrading.

### Ownership boundaries

- Developers define section schemas, renderer/editor registries, API contracts, permission keys, validation rules, URL resolution, design tokens, and storage/provider interfaces.
- Editors manage approved public facts, section values/order/visibility, page/article drafts, navigation, settings, forms, and publication according to permissions.
- Operators manage environment-specific origins, secrets, database access, uploads, DNS/TLS, backups, and deployment identity.
- The reference LMS owns exam-voucher offerings, monetary authority, stock, checkout, and PayU. The website consumes fixed read-only feeds and sends only an offering ID to its checkout.
- A new client may not have an LMS or need this integration. Omit that optional subsystem rather than deploying broken reference links.

Page/article content revisions are drafted. Global settings, navigation and some entity identity/data changes can apply immediately; do not describe the entire CMS as an approval queue.

### Directory map

Backend:
- app/core: configuration, database/session factory, password/token helpers, permission catalog, error envelope, ASGI protections, rate limiter.
- app/models: identity, content, revisions, media, forms/outbox, redirects and audit persistence.
- app/schemas and app/sections/schemas.py: input/output and typed section/block contracts.
- app/api/deps.py: session, CSRF and backend permission dependencies.
- app/api/admin: authenticated CMS operations, auth, user/role management, previews and integration tests.
- app/api/public: published projections, collections, read-only adapters and enquiry submission.
- app/api/site.py and app/services/document.py: robots, sitemaps, redirects, HTML status and metadata.
- app/services: domain transactions and resolution; avoid hiding those rules in React or route handlers.
- app/seeds: permission synchronization, initial system pages and explicitly distinct sample data.
- alembic/versions and tests: migration history and behavior coverage.

Frontend:
- app: providers, routing and error boundaries.
- api and types: request/error handling, endpoint clients, typed payloads.
- components/ui: shared primitives; components/layout: public/admin shells; components/sections: public CMS renderers.
- features/page-editor, section-editor and blog-editor: editing, draft/preview/publication workflows.
- features/auth, cms, forms, settings, media, pickers, lms and dashboard: subsystem UI and hooks.
- constants, hooks, utils and styles: common language, interactions, pure transformations and tokens.
- pages/public, pages/admin and pages/auth: route composition rather than duplicated domain logic.

### Database isolation

The original development foundation shares a server/schema with an LMS and protects website ownership through the website_ table namespace, website_alembic_version migration table and Alembic include_object filtering. The newer production deployment uses a dedicated public-site database. Preserve both distinctions: do not infer today's production topology from an old architecture sentence.

For a new app, prefer a dedicated database and least-privilege account when available. If a shared database is intentional, make table ownership and migration history explicit before generating migrations. Prefix filtering protects autogeneration; it does not make arbitrary hand-written SQL safe.

Namespace changes are coordinated changes to table declarations, literal foreign keys, migrations, seeds, tests, migration filters and backup/deployment commands. Many reference names are literal website_ strings; changing TABLE_PREFIX alone does not rename the application safely.

Preserve deterministic constraint names; UTC timestamp conventions; explicit foreign-key deletion rules; distinct identity, revision and presentation data. Use MySQL utf8mb4, pool pre-ping and connection recycle settings where that target remains appropriate. SQLite tests cannot validate MySQL locking, DDL or precision behavior.

### Environment boundaries

Production configuration rejects weak secrets, SQLite/test schemas, development origins, implicit indexing, missing built HTML and automatic sample seeding. Staging should use production security with indexing disabled.

Keep secrets on the server. Frontend VITE_ settings are public. Supply separate development/test/staging/production configurations; never copy runtime .env files into a starter, skill, deployment archive or another client's project.

Sources: backend/app/core/config.py, database.py; backend/app/models/base.py; backend/alembic/env.py; backend/app/main.py; frontend/src/app/router.tsx; frontend/src/api/client.ts; README.md; docs/PRODUCTION.md. Resolve conflicts using current code, workflow and deployment script; consult the evidence ledger for known stale prose.

## CMS and content

### Page identity and revisions

A page identity owns its slug, kind/status and live/draft revision pointers. Sections have stable identities so editor URLs and submission context survive revision changes. Revision rows carry content, SEO, section configuration, ordering and visibility.

Reusable rules demonstrated in services/pages.py and page revision tests:
- A page has one working draft. The first edit clones its published revision within the edit transaction.
- Published and superseded revisions are immutable. Public queries follow the published pointer.
- Save, duplicate, reorder and delete section operations affect the working draft.
- Publish locks the page, checks the reviewed revision ID/version when supplied, validates enabled sections and references, supersedes the former live revision, and switches pointers atomically.
- A stale review produces a conflict rather than publishing a colleague's unseen changes.
- Discard returns to the live version; do not discard the only revision of a never-published page.
- Preview is authenticated and permission-scoped to the page or its owning entity.
- Slug/identity changes are different from drafted content. Enforce the relevant publish permission and create redirects at the correct transition.

The owner can be homepage, general page, service, country or coaching course. Use owner-aware permission checks, not a generic pages.edit shortcut that grants access to every entity page.

The reference's exact page-publication checks are homepage.publish for the homepage, pages.publish for general pages, and the owning services.edit/countries.edit/coaching.edit **plus** pages.publish for entity pages. Blog publication uses blog.publish. There are no separate services.publish, countries.publish or coaching.publish catalog keys. Entity record metadata/status and global settings/navigation are not automatically revisioned; a new product requiring publisher approval for every public-facing edit must also restrict or revision those changes.

### Section registration contract

A new section is a coordinated change:
1. Add/extend a strict Pydantic config with safe defaults for old stored data.
2. Register its key, label, schema and resolver in backend/app/sections/registry.py.
3. Validate linked media, forms and referenced content on write.
4. Add the discriminated TypeScript config/data contract.
5. Add the public renderer and SECTION_RENDERERS entry.
6. Add the appropriate content/data/appearance editor and useful default config.
7. Verify unsaved preview, draft save, publication and public rendering.
8. Test absence, empty collections, invalid stored data and responsive behavior.

Public resolution attaches published content/media/forms server-side. Unknown or invalid stored sections are skipped rather than crashing the page. Resolver exceptions are logged; the React SectionBoundary isolates rendering failures. This resilience is not permission to silently accept bad admin writes.

All 24 inspected types:

| Family | Types |
| --- | --- |
| Entry and action | HERO_SLIDER, INNER_HERO, CTA_FORM, GUIDANCE_BANNER |
| Business directories | SERVICES, COACHING, COUNTRIES, WORLD_MAP |
| Editorial | RICH_TEXT, IMAGE_TEXT, FEATURE_GRID, STATS, MILESTONES, PROCESS_STEPS |
| Trust and media | TESTIMONIALS, SUCCESS_STORIES, GALLERY, VIDEO_TESTIMONIALS |
| Contact and help | FAQ, CONTACT_INFO, LOCATIONS |
| Publishing and feeds | BLOG, INSTAGRAM_REELS, EXAM_VOUCHERS |

The reference contract catalogs below record section registrations and condensed schema fields/default declarations. Rebuild and validate target contracts for the chosen product; the excerpts are not executable modules. Include only the families the new product needs.

### Shared section rules

SectionBase owns the anchor, optional text scaling, sample-content flag and optional validated hex background. Allowed anchors start with a lowercase letter and use lowercase letters/digits/hyphens, at most 40 characters. A section's General tab edits those values.

Small/medium/large/extra-large text maps to 0.9/1/1.1/1.2; phone scale can differ. A custom dark background must pair with an appropriate readable text treatment. On reset, restore the designed tone; do not preserve a stale dark-only text override.

Duplicate sections start hidden and clear their anchor to avoid duplicate IDs. Full-list reorder operations reject duplicate, missing or stale IDs and use a transaction/row locks.

### Articles and scheduling

Articles follow the same single-draft/immutable-live model, including revision-owned tags, related articles, structured body, media, byline, category, CTA and SEO. History restoration copies a revision into the working draft; it does not mutate live content.

Scheduling is a public-read timestamp condition: published status, a live revision and publication time at or before now. The same condition governs public collections, detail views, link resolution, counts and sitemap inclusion. Store publication timestamps consistently with the database's precision. Do not add an unnecessary cron-driven status transition.

Public bylines exclude linked admin email, ID and permissions. Search uses derived search_text/word count, server pagination and escaped LIKE wildcards. Cards avoid loading full bodies. Related content excludes itself and non-public records.

### Settings, navigation and identity links

The typed settings registry defines known keys, labels, control types, defaults and validation. Unknown keys are refused. Its 55 fields span notifications, protection, mail, general identity, branding, contact, social, header, footer and SEO. Secret controls are write-only.

Navigation stores typed page/service/country/coaching/article references where supported, order, visibility, nesting and new-tab behavior. Central resolution follows current slugs and hides unavailable content. Inline references to non-public content degrade to text instead of broken links. Use usage checks across both live and draft revisions before deletion.

Do not substitute hardcoded business copy for CMS-owned fields. The actual source contains centralized fixed UI copy and some route-specific helpers, so distinguish interface language from editable business content rather than claiming literally all text comes from the database.

### Content integrity and editorial approval

Use structured blocks and a limited inline parser, not arbitrary editor HTML. Validate link targets and image/media IDs on the server.

Real success stories require recorded consent before publication. Demo testimonials are excluded in production. Sample sections are blocked from production publication and filtered publicly. A separate SHOW_SAMPLE_SUCCESS_STORIES flag can explicitly expose labelled demo stories; this is an exception for an intentionally approved demonstration, not the default new-client policy. Demo reels have their own CMS opt-in and labeling behavior.

Legal copy, visa rules, achievements, client outcomes, prices and ownership claims need business approval appropriate to the target. The skill supplies architecture, not approved factual or legal content. Do not turn sample claims into real testimonials during cloning.

Sources: backend/app/services/pages.py, articles.py, public_site.py, links.py, navigation.py, site_settings.py; backend/app/api/admin/_crud.py and content.py; backend/app/sections; frontend/src/features/page-editor, section-editor, blog-editor; frontend/src/components/sections/SectionRenderer.tsx.

## Frontend and accessibility

### Reuse the system, adapt the brand

The inspected tokens use InterVariable/Inter for both display and body. Older Newsreader/Fraunces/Libre Baskerville references are not proof of the active default. frontend/index.html also requests multiple Google font families; audit that extra loading before copying it into a new project.

Reference visual choices:
- Muted crimson primary action: #af2334; burgundy hover: #941b2b.
- Neutral reading surfaces, paper #f6f3ef and charcoal #151517; blue is informational/focus color.
- Public content width 1240px; narrow reading column 760px; fluid gutters.
- Header 80px, scrolled sticky header 68px.
- Breakpoints 640/768/1024/1280px; CSS media queries use literal breakpoint values because custom properties cannot supply them there.
- Rem-based spacing follows a 4px rhythm with smaller half steps.
- Public primary actions are 52px desktop and 48px mobile; compact navbar action 44px.
- Semantic radius, elevation, field state, focus and z-index tokens define component behavior.

The design-token catalog below includes the inspected declarations. Treat the exact palette and font as a reference client identity, not mandatory corporate policy for every new site.

### Component contracts

Use CSS Modules with semantic token references. Stylelint rejects component hex colors, raw rgb/hsl channels and unknown custom properties; literal colors belong in the tokens source. Transparency uses existing RGB-channel tokens.

Reuse Button/ButtonLink, SmartLink, Field/Input/Select/Textarea/Checkbox, Section, Container, heading primitives, responsive Img, Badge, States, dialogs, tabs, sorting and pagination before inventing equivalents. Internal paths use the router; anchors, mailto and tel preserve their semantics; new-tab links use safe rel values.

PublicButtonContext provides the public button treatment without restyling admin actions. Preserve submit type, disabled/loading state, analytics handlers, accessible names, CMS hrefs and checkout behavior during visual changes.

Img carries dimensions, srcset and sizes. The hero uses responsive crops/focal points. Keep actual content and typed data separate from renderer composition.

### Responsive typography and content customization

Site-wide text scale is applied only on public pages, with separate desktop/mobile settings. Section wrappers multiply that scale rather than replacing it. Weights and colors belong to supported editor contracts, not arbitrary inline HTML.

Verify long headings, multiline business names, translated/long labels, missing images, empty feeds, large text and narrow devices. A single screenshot or successful typecheck does not verify responsive behavior. Do not hide essential content merely to make one reference image fit.

### Accessibility already represented in the source

Preserve and exercise:
- Skip link, semantic header/main/footer and an intelligible heading hierarchy.
- Programmatic labels, required/invalid states and descriptions for form errors.
- Focus-first-invalid on submission errors, useful loading/status feedback and retained input after failures.
- Keyboard-operable dropdowns, Escape behavior and visible focus.
- Mobile modal drawer: background inert, scroll lock, Tab trap, scrollable long menus, close behavior and focus restoration.
- Native dialogs/lightboxes with correct focus, dismissal and captions.
- Carousels with appropriate names, keyboard controls, pause behavior and motion preference support.
- Explicit list role where list-style removal would otherwise affect Safari/VoiceOver semantics.
- Decorative icons hidden from assistive technology; meaningful image alt and caption tracks where supplied.

These implementations and tests support accessibility work; they are not a full WCAG conformance audit or proof of every color combination.

### Motion and heavier visuals

Durations are semantic: quick/base/reveal/slide and stagger tokens. Reduced motion zeroes relevant durations and distances. Animation should support comprehension and respect user interaction, not delay access to forms.

Use near-viewport loading for below-fold feeds and visual enhancements. Keep WebGL capability detection separate from three.js import. Defer the globe, provide a useful non-WebGL fallback and do not make content availability depend on GPU support. Stop work/listeners on cleanup and avoid hidden-page autoplay or offscreen work where the component supports it.

### Consultation and anchor navigation

Correct reusable requirements:
- A CMS CTA's fragment must match a real enabled destination; IDs must be unique.
- Account for the actual sticky header, section padding, stacked introductory content, dynamic images/fonts/CAPTCHA and viewport size.
- Center useful form content only when it fits. Tall/stacked forms should start at their heading and first fields and remain naturally scrollable.
- Stop correction when the visitor takes control; avoid indefinite polling or repeated forced scrolling.
- Preserve query prefill, typed input, validation, keyboard focus, modified-click behavior and browser history.
- Treat hash removal as an explicit product decision. Native fragments normally persist; do not globally erase unrelated anchors.
- If one-time consultation hashes are requested, consume only the resolved hash through router-aware replacement, preserve state/query parameters, and test repeated clicks, direct links, Back/Forward and reload.

The earlier consultation-centering/hash-cleanup task was interrupted. Its candidate files are absent from the audited checkout, which still has the original PublicLayout interval/ResizeObserver implementation. Do not claim this enhancement ships or copy unverified candidate code from chat as a proven module.

Sources: frontend/src/styles/tokens.css, global.css; frontend/stylelint.config.mjs; frontend/src/components/ui; frontend/src/components/layout/SiteHeader.tsx and PublicLayout.tsx; frontend/src/hooks; frontend/src/features/globe; frontend/src/test.

## Backend security and data

### Session and credential model

The reference uses opaque random server sessions, not browser-stored bearer JWTs. Each session token is generated with secrets.token_urlsafe(32); only its SHA-256 digest is persisted. The session cookie is HttpOnly, Secure in production, SameSite=Lax by default and scoped to /api. The readable CSRF cookie is scoped to / so the SPA can echo it.

Bcrypt uses a configurable cost with production minimum 12. Passwords shorter than 10 characters or longer than 72 UTF-8 bytes are rejected; simple all-letter/all-number passwords are refused. Unknown-user checks use a dummy hash to reduce timing differences. Sign-in failure messages avoid account disclosure.

Sign-in replaces the browser's previous session; logout, deactivation and password/user management revoke sessions as implemented. Session expiry defaults to 12 hours. Last-seen touches are throttled rather than committed on every read.

Do not infer complete authentication hardening from one 401. For a new project, exercise issuance, rotation/replacement, expiration, logout, deactivation, password-change revocation, CSRF and permission changes. MFA and self-service reset are not included in this reference and need a separate product decision.

### CSRF and authorization

For mutating admin requests, the readable cookie must match X-CSRF-Token and its digest must match the active session's stored CSRF digest. Login requires JSON. CORS is an explicit allowlist; credentials plus wildcard origins are refused.

Server permission dependencies validate catalog keys at import time. require means all permissions; require_any means at least one. Page/preview operations also enforce the owning page/entity permission. UI guards and hidden buttons do not authorize requests.

The permission catalog has modules for dashboard, pages/homepage, navigation, services, countries, coaching, testimonials, FAQs, blog/taxonomy/authors, media, SEO/redirects, forms/submissions, settings, users, roles and audit logs. Expand a new feature's backend catalog, seed synchronization, API enforcement, frontend groups/navigation and negative tests together.

Only a Super Admin can grant/modify Super Admin access. Non-Super Admins cannot grant permissions or newly assign roles beyond their effective permissions. Prevent removal of the last active Super Admin; preserve system-role protections. Do not copy the starter Content Editor role without comparing its rights to the new business's needs.

### HTTP boundary controls

ASGI middleware ordering is significant: security headers wrap request context/exception handling, body limits, CORS and routes so error responses get appropriate protections.

The current HTML CSP explicitly allows Cloudflare challenges and Google Fonts, unlike outdated documentation claiming no third-party scripts. It forbids arbitrary script execution with self plus approved hosts, limits frames to known map/video/challenge origins, disallows objects and framing, and constrains base/form actions. API and media responses use distinct policies.

Headers include nosniff, DENY framing, referrer policy, permissions policy and same-origin opener policy. Production enables HSTS without automatically extending it to every subdomain. Admin API responses use no-store; API responses are not indexable. Validate the delivered proxy-plus-app policy rather than assuming source middleware proves live headers.

Body limits are enforced while streaming, including absent or dishonest Content-Length. Default JSON body limit is 1 MiB; uploads/video have separate limits plus multipart overhead. Keep proxy limits compatible with application limits.

Errors use a stable error code/message/details envelope; unhandled errors do not disclose SQL, paths or traces. Valid incoming request IDs can be echoed; otherwise generate one, attach it to responses and logging. Audit summaries and logs must exclude credentials, CAPTCHA tokens and unnecessary applicant payload.

### Data transactions

Use domain services and explicit commits. Validation errors occur before mutation; changes and their audit record commit together. Concurrent uniqueness conflicts map to useful 409 responses. PATCH merges existing values and revalidates the complete schema rather than allowing required fields to disappear.

Ordering operations require an exact, duplicate-free ID set and transaction/row-lock serialization. Publishing is pointer-based and conflict-aware. Usage checks inspect current live and working drafts; refusing deletion with a usage list is safer than leaving broken references.

Preserve deterministic constraint naming, foreign keys, indexes, UTC and database precision semantics. Record a schema evolution in a new migration; do not rewrite an applied migration. MySQL DDL and row locking need MySQL evidence, not only SQLite tests.

### Rate limiting and scaling

The bounded sliding-window limiter is process-local, thread-safe, sweeps stale keys and caps tracked identities. The source's one-worker deployment is required while that ownership remains local; adding workers silently multiplies effective limits.

Different limits apply to sign-in by account/IP, public forms, search, uploads, previews and provider test actions. 429 includes Retry-After. Ordinary page rendering is not blanket-throttled. A new multi-worker deployment should replace the limiter with shared storage and re-test policy before scaling.

### New-project security decisions still required

Document tenant separation if applicable, PII retention/deletion/export, data residency, backup encryption/access, external-resource privacy, account recovery/MFA, incident response and audit retention. None follows automatically from having these source modules. This blueprint is not a penetration-test report, privacy policy or legal compliance certificate.

Sources: backend/app/core/security.py, config.py, middleware.py, rate_limit.py, permissions.py, errors.py; backend/app/api/deps.py and admin/auth.py, users.py, roles.py, _crud.py; backend/app/services/auth.py, audit.py, pages.py, integration_settings.py; tests/test_auth.py, test_rbac.py, test_security.py.

## Forms mail and CAPTCHA

### Form contract

website_forms owns a validated field definition: text, email, telephone, select, textarea or checkbox; field identity, label, required/enabled state, order, width, limits, placeholder and approved options. Option sources can resolve published business entities. The shared EnquiryForm renders the definition and submits to /api/public/forms/{key}/submissions.

Preserve the same behavior across hero, callback, contact, service, country and coaching placements:
- Validate required values, length, email/telephone shape and select membership on the server.
- Refuse unexpected field names; normalize checkbox truth values.
- Use client validation for useful feedback, not as the security boundary.
- Honeypot and per-IP limiter are separate from CAPTCHA.
- Page/section references are contextual and checked for existence/ownership; the visitor cannot choose notification recipients.
- Prefill a valid option from the query or the entity page; do not accept arbitrary unknown options.
- Keep form values on failed verification, network/server errors and throttling.
- Block duplicate clicks while in flight, announce the outcome, focus invalid fields and support a deliberate send-another action.
- Save submissions as enquiries. Assignment pipelines, CRM sync and marketing consent workflows are separate additions.

### Idempotency and durable delivery

The frontend keeps an idempotency reference for a logical submission. The backend hashes normalized values plus form and origin context. Same reference/same request returns the saved success; same reference/different request conflicts. Database uniqueness handles concurrent retries.

Persist the enquiry and unique outbox job in one transaction, then return. SMTP is not on the public request's critical path. Missing SMTP does not prevent enquiry storage. Queue only when enabled and private recipients are saved.

The worker:
- Claims a pending/expired job atomically with a token and a five-minute lease.
- Delivers outside the visitor request; records success or generic failure.
- Tries at most five times with exponential delays (normally 60/120/240/480 seconds between failed attempts).
- Recovers expired leases after interruption.
- Retains the enqueue-time recipients/name; toggling notifications affects new enquiries rather than silently rewriting queued recipients.
- Retries only refused recipients after partial SMTP acceptance.
- Uses a stable Message-ID and a unique submission-to-outbox association.
- Exposes pending/sending/sent/failed/not_queued status and permission-checked, audited admin retry.

This is durable at-least-once-style delivery, not exactly-once mail. A crash after SMTP acceptance but before the success commit can cause another delivery. Sent means accepted by SMTP, not received in the inbox.

### Cloudflare Turnstile

The reference already renders the widget, obtains a token and verifies it on the server. Managed widgets may succeed automatically; requiring a click is not a security guarantee and the visible widget success does not prove the enquiry was saved.

Server checks:
- A configured private secret; no visitor-controlled bypass.
- Token presence and bounded length.
- Cloudflare verification success.
- Exact hostname equality with PUBLIC_SITE_URL.
- The expected action, enquiry.
- A challenge age between zero and five minutes.

Network/provider failure fails closed with a safe temporary error. An absent CAPTCHA configuration blocks new submissions rather than accepting unverified traffic. Test keys are rejected in production; CAPTCHA_DEVELOPMENT_BYPASS applies only outside production. Keep tokens in component memory, reset after an attempt or expiry, and never log/store them as applicant fields.

Create the widget for the correct hostname and verify from that origin. www, apex, localhost and 127.0.0.1 are different hostnames for the backend's equality check. Add the Cloudflare host to the actual delivered script/connect/frame CSP. Test with the real provider only within authorized scope; automated suites use the isolated mocked provider.

### Dashboard versus environment configuration

Each integration selects one complete profile: Dashboard or Environment. Do not combine a dashboard site key with an environment secret, or partially merge SMTP credentials.

Dashboard secrets are write-only, encrypted with Fernet using HKDF-derived key material, domain-separated and bound to the field identity. A dedicated SETTINGS_ENCRYPTION_KEY may be set before saving, otherwise the strong server SECRET_KEY supplies key material. Back up the relevant key securely; changing it requires an intentional rotation/re-entry plan. A database backup without the decrypting key cannot restore those settings.

Blank secret fields retain the saved value; replacement rotates it; the explicit remove action deletes it. Responses/audits expose configured state, not cleartext.

Dashboard changes apply to subsequent requests/attempts without restart. Environment changes require backend restart. Public payloads expose only the site key, never the CAPTCHA secret, SMTP password or private recipients.

### SMTP configuration and verification

Save the complete SMTP host/port/encryption/username/password and verified sender in Email delivery, then save a primary recipient, optional additional recipients (five total), sender display name and enabled flag in Email notifications.

Use the provider's current SMTP details: usually STARTTLS/587 or implicit TLS/465. The reference maps implicit SSL/TLS to tls; it has no plaintext mode and checks certificates. Do not enter the hosting-panel account password unless it is actually the mailbox credential requested by the provider. Configure sender authentication/DNS using that provider's current instructions rather than copying another client's records.

Dashboard destinations must resolve exclusively to public IPs and connections are pinned to a validated address while retaining the expected TLS hostname. Preserve this SSRF boundary in an editable SMTP UI.

Save both delivery and recipient settings before using Send test email. Tests are audited and limited to three attempts per ten minutes; missing-recipient attempts also consume that action limit. Configured means structurally complete, not authenticated with the provider. Verify test acceptance, actual receiving inbox/spam, a saved enquiry, its outbox state and its notification separately.

Sources: backend/app/schemas/forms.py; backend/app/api/public/routes.py and admin/forms.py, settings.py; backend/app/services/captcha.py, integration_settings.py, notifications.py; frontend/src/features/forms; docs/ENQUIRY_NOTIFICATIONS.md.

## SEO media and integrations

### One metadata authority

services/seo.py resolves metadata for the public API, server HTML and admin preview. Keep those paths consistent:
- Title: explicit SEO title, content title, then site name; append the suffix once.
- Description: explicit description, content summary, then site default.
- Social fields: explicit network field, common metadata/content, then site defaults.
- Social images: explicit social image, content image, then site fallback.
- Canonical: validated override or the page's address on the configured public origin.
- Robots: content switches plus environment-level indexing policy.

Canonical origins come from PUBLIC_SITE_URL, not an untrusted request Host header. Blog filtered/paginated views need deliberate metadata/canonical policy. Preview and unpublished content must not leak through metadata endpoints.

The public document service inserts escaped head tags and safely serialized JSON-LD into the built SPA shell. It is server-generated metadata/status delivery, not full React body SSR. Return real redirects and 404 statuses; do not let a static catch-all silently turn every nonexistent route into 200.

Public page payloads and HTML use revalidation/ETag semantics; static hashed assets can be immutable. Do not cache admin data or previews in a public cache.

### Robots, sitemap and redirects

Only production indexes by default; production requires SEO_INDEXING to be explicit. Staging uses production security and no indexing.

The sitemap includes genuinely public/indexable page, entity, article and category addresses, real modification dates and no draft/admin/preview/noindex/redirected records. Scheduling rules must match article visibility. Above 45,000 URLs, generate a sitemap index and chunks. Do not fabricate priority/changefreq.

Redirect management normalizes/validates internal paths, prevents reserved/home sources, external/protocol-relative destinations and loops, collapses chains and avoids hiding actual content. Slug changes create automatic redirects when the old path stops serving its content; edits/deletions update that relationship. Query handling must be intentional and tested. Source MAX_HOPS is ten; do not rely on chains being unbounded.

### Media ownership and validation

Content stores media IDs, not arbitrary filesystem paths. StorageBackend owns URL generation, byte/stream persistence and deletion. Local storage and external HTTPS records exist; S3/R2/Cloudinary are extension opportunities, not implemented adapters.

Image uploads:
- Decode with Pillow and require the actual format to match JPEG/PNG/WebP extension.
- Refuse SVG uploads and oversized/decompression-bomb images.
- Re-encode to strip EXIF/GPS; downscale to at most 2560px.
- Produce WebP renditions at 480/960/1600 widths where appropriate and publish srcset/dimensions.
- Use random, path-safe date-based storage keys; original filenames are display metadata.
- Enforce the 10 MiB default body/file limit and preserve deletion-after-commit behavior.

Uploaded MP4/WebM videos are size-limited and streamed to storage, with extension/header checks; no transcoding or comprehensive codec/malware analysis is provided. WebVTT captions are UTF-8, size-limited (512 KiB) and require the WEBVTT header. Apply a separate large-video route limit and a compatible proxy limit.

Deletion scans usage in live/draft page and article configs, entity fields, settings and video/caption associations. Refuse in-use deletion with useful locations; remove physical files only after the record transaction permits it.

YouTube sources are parsed against approved HTTPS hosts/IDs and use youtube-nocookie playback on visitor interaction. Maps use validated embed hosts. Do not grant arbitrary iframe or HTML capability to editors.

### Read-only external feeds

The LMS adapter defines two fixed upstream paths on a configured origin. It does not accept arbitrary URLs from the public request, follow redirects, forward browser cookies or expose upstream payloads unfiltered.

Preserve:
- Four-second default timeout, 512 KiB maximum body and 50-item input bound.
- JSON/content-type/status validation and allowlisted output fields/URLs.
- Per-feed lock so concurrent visitors share an upstream refresh.
- Two-minute fresh cache plus an additional one-hour stale allowance and failure backoff.
- Safe unavailable behavior after cached data expires, without delaying the base CMS page.
- Browser near-viewport fetching and menu visibility based on actual section/feed availability.

Instagram display can combine website-curated reels with LMS reels, hide selected IDs, deduplicate URLs and control position/limit. Sample reels require the explicit display setting and valid originating profile; they must not masquerade as real client outcomes.

Voucher presentation uses Decimal/string money, discounts only when a discount lowers price, itemized GST and total, stock/validity and useful sold-out behavior. When the LMS supplies its GST and total, display its authority rather than silently substituting another charge. The LMS rechecks stock/price at checkout; a displayed card reserves nothing.

Only offering ID travels in the checkout link. The public website stores no voucher code, payment credentials, order or stock transaction. A new project with payments requires its own deliberately designed payment integration; it does not inherit one by copying the voucher card.

Sources: backend/app/services/seo.py, document.py, sitemap.py, redirects.py, media.py, storage.py, video.py, lms_feeds.py; backend/app/api/site.py; frontend/src/features/cms/Meta.tsx; frontend/src/components/ui/Img.tsx; frontend/src/features/lms; frontend/src/components/sections/LmsSection.tsx, ExamVouchersSection.tsx.

## Testing and release

### Local setup

The reference expects Python 3.11+, a supported Node runtime (CI uses Node 22), npm with the committed lockfile, and MySQL 8 for production/migration parity. Verify current package engine requirements rather than assuming the README's minimum Node version supports every dependency.

From the repository root, run these in the appropriate directories:
- Start only the named development database with docker compose -f docker-compose.dev.yml up -d when that local service is required.
- Create backend/.venv and install backend/requirements-dev.txt; copy .env.example and supply local-only credentials directly.
- Apply Alembic to the intended development database; seed development deliberately.
- Start FastAPI on the intended loopback port (reference 8010) and Vite on 5173, proxying /api and /media to the API.
- The root npm start orchestrator can start local MySQL, apply migrations and launch both services. Read it before using it in an unfamiliar/shared environment.

Never run seed/migration convenience commands against a guessed or production database. New clients need their own secrets and initial admin. Production uses --system-only seeding; automatic sample seeding is development-only.

### Verification layers

| Layer | Commands or evidence | What it does not prove |
| --- | --- | --- |
| Frontend static | npm run typecheck; npm run lint; npm run lint:css | Rendered behavior, provider success |
| Component behavior | npm test | Browser layout, MySQL semantics |
| Build | npm run build | Deployed availability or complete performance |
| Backend | .venv/bin/pytest | Real MySQL locking/DDL when run on SQLite |
| Backend style | .venv/bin/ruff check .; .venv/bin/ruff format --check . | Security completeness |
| Migration agreement | alembic upgrade head and alembic check on disposable MySQL | Safe reversal of all data migrations |
| Browser | npm run e2e or selected Playwright projects after build | Real inbox/real payment/provider behavior when mocked |
| Dependency audit | pip-audit and npm audit --omit=dev --audit-level=high | Absence of unknown vulnerabilities |
| Deployment | Candidate readiness, switched private readiness, public HTTPS and actual page checks | Successful forms/providers without their own checks |

Use the relevant layers for the requested change. Do not repeatedly broaden testing once relevant checks pass without a new concern.

### Isolated tests

Backend tests explicitly override configuration, use in-memory SQLite by default, isolate uploaded media and rebuild tables. If TEST_DATABASE_URL is MySQL, its disposable schema name must contain test. This is a guard, not a reason to point tests at any schema with a convenient name.

pytest-xdist is declared in development requirements, but the audited local virtualenv did not have its -n option installed. Sequential pytest worked. Select commands based on the available environment; do not claim a parallel run passed if it failed before collection.

LMS feed tests create a loopback HTTP stand-in. If binding is restricted, distinguish an environment error from an application failure; request the tool-level permission for that local fixture or report the limit. Never redirect the test toward the live LMS.

Playwright's config creates a fresh temporary server/database per browser, a generated disposable admin and mocked CAPTCHA/mail. The source includes enquiry, notification, publishing and mobile navigation journeys. Keep real mail, provider secrets, customer data and live forms out of automation.

For rendered work, verify page identity, meaningful content, no framework overlay, console health, screenshots and the actual target interaction. Include desktop/mobile, reduced motion, keyboard focus, empty/error states and relevant browser engines. A browser launch failure is not a pass.

### Actual CI state

The inspected CI runs backend lint/format, MySQL migrations, SQLite/MySQL tests, frontend static checks/tests/build, dependency audits and deployment-script rehearsal. MySQL tests are sharded across four disposable runners; main deployments are serialized.

The browser E2E job currently has if: false. It is not in deploy-production.needs. Therefore the reference does not currently enforce three-browser journeys as a deployment gate. A new production project should enable appropriate browser journeys once stable and explicitly include them among release requirements; do not claim the original already does.

Frontend format:check exists, but the README acknowledges repository-wide formatting debt. Prefer scoped formatting during small changes.

### Artifact promotion and deployment

The source pipeline promotes the exact frontend build that passed CI, names it by commit SHA and packages only required backend runtime/migrations plus built assets. Production secrets and persistent media remain outside immutable release directories.

The deployment script:
1. Accepts a validated commit identifier, checks the uploaded archive checksum and takes an exclusive deployment lock.
2. Creates an immutable release, rejects unwanted archive content and attaches shared environment/media paths.
3. Installs dependencies before stopping live traffic.
4. Makes a pre-migration database backup and applies/checks migrations; system-only seed sync preserves existing content.
5. Starts a single-worker candidate on a separate private port and checks readiness.
6. Atomically switches current, restarts the named live service and checks private readiness plus public HTTPS.
7. Restores the previous application release on activation failure and reports failure.
8. Retains a bounded number of releases/backups.

The script uses Linux/systemd/GNU tools. Its rehearsal explicitly requires compatible tools or a Linux container; it was not run on this macOS host during this skill audit. Never invoke the real deploy script merely to test the blueprint.

Do not automatically restore a database during app rollback: that can discard newly received enquiries. Compatible migrations, backup/restore rehearsal and an operator-reviewed data recovery plan are distinct from swapping application code.

Reference service names, database name, root paths, ports, domain checks and Python binary path are infrastructure-specific. Parameterize them for a new client. Change only the explicitly targeted application; verify other services remain healthy when a shared host is involved.

### Operational acceptance

Differentiate /api/health/live (process) and /api/health/ready (database dependency); the reference /api/health aliases readiness. Readiness does not validate SMTP, Turnstile, every public page or LMS availability.

Check canonical host redirects, TLS, actual headers, crawler-readable HTML/status, 404/301 behavior, upload persistence, public enquiry storage, queue processing and real recipient delivery where authorized. Monitor request IDs, 5xx, failed sign-ins, outbox failures, dependency readiness and feed failures.

Back up database, media and encryption/configuration material consistently; practice restoration with the matching release. Decide RPO/RTO, retention, alerting and incident ownership for the target. None is proved by an unchecked launch checklist.

Sources: README.md; backend/pyproject.toml, requirements-dev.txt, tests/conftest.py, scripts/e2e_server.py; frontend/package.json, playwright.config.ts, vite.config.ts; .github/workflows/ci.yml; scripts/start.mjs, deploy-production.sh, test-deploy-production.sh; docs/PRODUCTION.md.

## Evidence and known gaps

### Snapshot identity

- Audit date: 2026-11-11, using the client's date.
- Reference checkout: Visa House Website & CMS.
- Git commit: 68868d72fea9bb83f41b4040a92db0fdf98f0f92.
- Source scope: 558 approved source/configuration/test/documentation files in the original audit; the portable catalogs below retain contracts rather than every file fingerprint or test declaration.
- Creation did not read runtime .env values, export databases/submissions or change production configuration.
- This is an engineering reference extracted from source and local checks, not an exhaustive security/legal/compliance certification.

### Confidence vocabulary

**Implemented:** present in the inspected source. **Tested here:** supported by the commands and outcomes below. **Historical/documented:** described by project docs or earlier work but not re-proved against live infrastructure in this audit. **Recommended:** appropriate target-design guidance, not a claim it already exists. **Unverified/gap:** requires its own evidence or implementation.

Apply those distinctions when using this file; do not erase them to make a new project look ready.

### Historical checks from the original audit

| Check | Observed result |
| --- | --- |
| Frontend typecheck | Passed: npm run typecheck. |
| Frontend ESLint | Passed: npm run lint. |
| Frontend token/CSS lint | Passed: npm run lint:css. |
| Frontend unit/component tests | Passed: 44 test files, 231 tests. jsdom reported expected missing-canvas capability messages; this is not rendered WebGL proof. |
| Full backend SQLite run in the restricted environment | 539 passed; 31 LMS-feed fixture setup errors because binding a loopback HTTP test server was restricted. |
| Isolated feed-suite rerun with local-server permission | 53 passed, covering the previously blocked feed cases and overlapping already-passing cases. No live LMS was used. |
| Parallel backend invocation | Could not start: the local virtualenv lacked pytest's -n plugin option. Sequential tests were used. |
| Source inventory builder | Executed against the recorded checkout; exports static declarations and fingerprints only. |
| Skill package | Built-in skill validation and package/source-fingerprint verification passed. Both YAML assets parsed. Helper behavior checks preserved unrelated JSON and rejected a deliberately broken reference in an isolated copy. |
| Independent forward-test | A separate agent used the skill to specify a blue-branded consultancy CMS with draft/publisher separation, fake local notification delivery and no LMS/payments. It found no blocking defects, resolved all 16 entry-point Markdown links, and distinguished target adaptations from implemented permissions. This exercised guidance, not a new application's runtime. |

The backend totals above are separate runs; do not add their passing counts or describe the first full run as a single green suite.

Not run as part of this skill audit: production deployment, production mail/CAPTCHA tests, a real payment, dependency network audits, disposable-MySQL migration checks, full browser E2E, Linux deployment rehearsal or a restore drill. Current runtime/deployment/provider health is therefore not established.

### Patterns supported by source plus relevant test coverage

- Server sessions/CSRF, RBAC/escalation guards and negative authorization cases.
- Immutable published revisions, working drafts, preview and conflict-aware publish.
- Typed section schemas/resolvers, content filtering, reference/deletion safety.
- Server form validation, idempotent enquiry persistence, encrypted integration settings and durable notification retries.
- Metadata/redirect/sitemap behavior, bounded feed adapters, media validation.
- Shared components, responsive/token rules, keyboard/menu and form behavior represented in component tests.

Review individual test names and their scope before making a narrower security or functional claim.

### Known documentation drift and implementation limits

1. README's broad CI description says all browsers run, but .github/workflows/ci.yml explicitly disables the E2E job with if: false. The production job needs backend, frontend, dependencies and deploy-script, not e2e.
2. Older architecture text names Newsreader/Fraunces or suggests server metadata is future work. Active tokens default to InterVariable/Inter and a server document/metadata service exists.
3. Older production threat-model prose says no outgoing mail, third-party scripts or server URL fetching. Current code has SMTP, Turnstile/Google Fonts and the bounded LMS adapter. Use current implementation when defining threat boundaries.
4. Foundation docs describe a shared LMS database; the newer production deployment backs up a dedicated visahouse_public database. Namespace/migration isolation is still useful, but topology must be verified.
5. The earlier consultation-centering/hash-cleanup implementation was interrupted; its candidate files and tests are absent from this checkout. PublicLayout still uses the older interval/ResizeObserver approach. This skill records requirements and risks, not a completed fix.
6. Source docs recognize formatting debt. Do not run whole-project formatting as an unrelated change or present format:check as already green.
7. The in-process limiter assumes one worker; it is not distributed rate limiting.
8. Storage abstraction exists, but no S3/R2/Cloudinary implementation is bundled.
9. Video header/extension checks are not transcoding, full codec verification or malware scanning.
10. Source MFA, self-service account recovery, full PII retention/export/deletion policy, detailed incident response and restore proof are not supplied as complete features.
11. Public HTML contains server-generated head metadata and real statuses; it is not full React body SSR.
12. A configured integration flag does not prove provider authentication, server-side CAPTCHA acceptance, inbox receipt or payment readiness.
13. Demo stories/reels have explicit opt-ins. The presence of such a flag is not permission to publish misleading client outcomes.
14. All source version numbers, domains, service names and ports are dated project details, not universal defaults.
15. Historical domain/IP/certificate and VPS notes have not been checked live here and must not become automatic actions on another client's host.

### Refresh rule

When later source changes any of these facts, inspect current implementation and relevant execution evidence, update the affected guidance and record clearly dated evidence. Keep target-project evidence distinct from this original snapshot.

### Historical governance update: 2026-11-11

The user required a reusable company-practice baseline and consultation of the skill before future project updates. The original package included the adopted baseline, update/maintenance workflow and a root-AGENTS template for new projects. These are now embedded in this standalone file. This reference repository also has a root AGENTS.md requiring consultation for every update. The project brief records adoption and maintenance ownership. An installed skill may be discovered automatically; project adoption is enforced through the adopting repository's instructions.

These are instructions and future-work requirements, not new application capabilities or proof that every current release gate meets the baseline. Application source and its dated 558-file catalog are unchanged by this governance-only update. Earlier test results remain historical; no new application test pass is implied.

Governance-package validation passed: the built-in skill validator, package links/registry/source-fingerprint checks, YAML/governance metadata parsing, all root AGENTS.md links, and a temporary new-project copy whose required skill/practice/workflow paths resolve correctly. This checks the reference setup; it does not mechanically prove that every future contributor will follow the instructions.

## Future-project instructions template

Create or merge root `AGENTS.md` with the following content. Store the single skill at the indicated project-relative path. Preserve any existing project instructions.

```markdown
# Required project engineering reference

This project adopts `skills/visa-house-project-blueprint/SKILL.md` as its engineering reference.

Before every feature, fix, UI, API, schema, configuration, dependency, test, documentation or release update, read that file's use instructions, company engineering practices and future-update workflow. Read once per task, then the relevant domain sections; re-read changed guidance.

Inspect current source and preserve unrelated work, the project's chosen identity/architecture, data ownership and existing user authorization. Validate the affected outcome and distinguish passed, failed, blocked, skipped, mocked and live evidence.

Keep the single skill file and project decisions/evidence current when reusable contracts or practices change. Preserve the original Visa House snapshot as historical and record this project's adaptations separately. No companion skill files are required.

If the required skill is missing, locate the actual installed copy or report the missing reference before dependent changes; safe independent inspection may continue. Higher-priority instructions and explicit user requirements take precedence. These instructions do not grant permission for production actions, real mail/payments or unrelated projects, and do not add confirmation for reversible work already authorized.

Adapt branding, business content, optional modules, providers and infrastructure to this project. Do not copy client credentials, data or unapproved claims.
```

## Project brief template

Use only fields relevant to the requested scope. Infer routine choices and proceed; ask only for material missing business decisions. Null means undecided, not a requirement to build every module. Credential references contain names/locations, never values.

```yaml
# Reusable planning input. Null means a target-specific decision remains open.
# Store credential references here, never credential values or real applicant data.
project:
  name: null
  slug: null
  business_goal: null
  primary_audience: []
  primary_conversion: null
  delivery_scope: local_implementation
  existing_repository: null
  reference_commit: 68868d72fea9bb83f41b4040a92db0fdf98f0f92

governance:
  reference_skill: visa-house-project-blueprint
  baseline_adopted_date: null
  required_before_each_update: true
  repository_instructions_file: AGENTS.md
  project_skill_source: skills/visa-house-project-blueprint/SKILL.md
  maintenance_owner: null
  scoped_exceptions_and_rationale: []

identity:
  legal_name: null
  approved_public_name: null
  approved_copy_source: null
  contact_and_locations_source: null
  logo_asset_source: null
  font_choice: null
  semantic_palette: {}
  languages: [en]
  approved_client_story_consent_source: null

architecture:
  reference_stack: React_TypeScript_Vite_FastAPI_SQLAlchemy_Alembic
  target_stack_override: null
  node_runtime: null
  python_runtime: null
  database_engine: null
  database_ownership: dedicated
  table_namespace: null
  migration_version_table: null
  public_and_admin_boundaries: null
  external_system_ownership: {}

content:
  public_routes: []
  entities: []
  required_section_types: []
  editable_global_settings: []
  navigation_groups: []
  page_draft_and_publish: true
  article_workflow_needed: null
  article_scheduling_needed: null
  immediate_changes_policy: null
  legal_content_approval_owner: null
  sample_content_policy: hidden_in_production

access:
  roles_and_permissions: {}
  publication_owner: null
  initial_admin_secret_reference: null
  account_recovery_decision: null
  mfa_decision: null
  audit_retention_decision: null

integrations:
  enquiry_forms: []
  captcha_provider: null
  captcha_hostname_and_action: null
  captcha_secret_reference: null
  smtp_provider: null
  smtp_secret_reference: null
  sender_domain_verification_owner: null
  private_recipient_configuration_owner: null
  external_feeds: []
  checkout_authority: null
  payment_integration_in_scope: false

data_and_operations:
  collected_personal_data: []
  retention_and_deletion_policy_owner: null
  data_residency_decision: null
  production_origin: null
  staging_origin: null
  media_storage: null
  upload_limits: {}
  persistent_upload_location: null
  encryption_key_backup_owner: null
  database_and_media_backup_owner: null
  restore_drill_and_recovery_targets: null
  rate_limiter_ownership: single_process_until_shared_store
  service_names_and_ports: {}
  release_preflight_and_rollback: null
  monitoring_and_incident_owner: null

acceptance:
  public_journeys: []
  editor_and_publisher_journeys: []
  negative_authorization_cases: []
  responsive_keyboard_and_motion_checks: []
  browser_targets: []
  database_migration_checks: []
  provider_outcomes_to_verify: []
  production_actions_already_authorized: []
  known_exclusions_and_unverified_items: []
```

## Reference contract catalogs

These are dated source contracts from 2026-11-11, commit `68868d72fea9bb83f41b4040a92db0fdf98f0f92`. They are naming and adaptation references, not requirements to implement every module. They contain no saved CMS values or runtime credentials. Source paths identify provenance in the original checkout; that checkout is optional. Model/schema expressions are condensed declarations, with inheritance and validators indicated; they are not independently executable definitions. Validate actual target behavior rather than pasting incomplete excerpts.

The original static audit counted 41 model/mixin/enum declarations plus three association tables, 127 schemas, 17 validation helpers, six TypeScript type-contract files, 58 permissions, 131 route decorators, 24 section registrations, 55 settings, 52 configuration fields and 21 migrations. Counts of declarations are not counts of runtime endpoints, database tables or parametrized test cases. Raw source bodies, file hashes and test-symbol indexes are not needed to adopt this single-file blueprint; consult the current target source for implementation authority.

### Section registry

| Key | Schema | Resolver | Purpose |
| --- | --- | --- | --- |
| HERO_SLIDER | schemas.HeroSliderConfig | _resolve_hero | Large visual slides with copy, CTAs and an optional enquiry form. |
| SERVICES | schemas.ServicesConfig | _resolve_services | Cards for published services. |
| COACHING | schemas.CoachingConfig | _resolve_coaching | Cards for published coaching courses (IELTS, PTE, LanguageCert…). |
| COUNTRIES | schemas.CountriesConfig | _resolve_countries | Destination cards for published countries. |
| CTA_FORM | schemas.CtaFormConfig | _resolve_cta_form | Conversion section with a website form. |
| TESTIMONIALS | schemas.TestimonialsConfig | _resolve_testimonials | Published client testimonials. |
| FAQ | schemas.FaqConfig | _resolve_faqs | Accordion of published FAQs, optionally by category. |
| RICH_TEXT | schemas.RichTextConfig | _no_data | Structured headings, paragraphs and lists. |
| INNER_HERO | schemas.InnerHeroConfig | _resolve_inner_hero | Opening band for inner pages with breadcrumbs; can inherit a service, destination or coaching course's details. |
| IMAGE_TEXT | schemas.ImageTextConfig | _resolve_image_text | A photograph beside formatted text, e.g. a story or mission. |
| FEATURE_GRID | schemas.FeatureGridConfig | _no_data | Short points with optional icons and links, e.g. reasons to choose us. |
| STATS | schemas.StatsConfig | _no_data | A few verified figures, or label/value facts. |
| MILESTONES | schemas.MilestonesConfig | _resolve_milestones | Full-screen panels, one per milestone (year, story, figures, background photo), that slide over each other as visitors scroll. |
| GUIDANCE_BANNER | schemas.GuidanceBannerConfig | _no_data | A dark rounded banner with a tag, heading, short text and up to two buttons. |
| PROCESS_STEPS | schemas.ProcessStepsConfig | _no_data | Numbered steps explaining how something works. |
| CONTACT_INFO | schemas.ContactInfoConfig | _resolve_contact_info | Phone, email, WhatsApp, hours and social links from Settings, with an optional form. |
| LOCATIONS | schemas.LocationsConfig | _resolve_locations | Published office locations with directions and optional maps. |
| BLOG | schemas.BlogConfig | _resolve_blog | Article cards (latest, featured or hand-picked), or the full searchable blog listing. |
| SUCCESS_STORIES | schemas.SuccessStoriesConfig | _resolve_success_stories | Client stories told with their permission: photo beside the story, alternating sides. |
| GALLERY | schemas.GalleryConfig | _resolve_gallery | Photographs in a masonry, mosaic or even grid, with captions and a full-screen viewer. |
| VIDEO_TESTIMONIALS | schemas.VideoTestimonialsConfig | _resolve_video_testimonials | Testimonials with a video (YouTube or uploaded), played only when a visitor presses play. |
| WORLD_MAP | schemas.WorldMapConfig | _resolve_world_map | Destinations pinned on a dotted world map; each flag links to its destination page. |
| INSTAGRAM_REELS | schemas.InstagramReelsConfig | _resolve_instagram_reels | Reels published in the LMS (any of which can be hidden here) and reels of the website's own, as covers that open Instagram. |
| EXAM_VOUCHERS | schemas.ExamVouchersConfig | _no_data | Exam-voucher offerings on sale in the LMS (prices, GST and stock from the LMS); buying opens the LMS checkout. |

### Permission catalog

Do not assume unlisted publication rights exist. These keys require coordinated catalog, role, API, UI and negative-test changes when adapted.

| Key | Meaning |
| --- | --- |
| dashboard.view | View dashboard |
| pages.view | View pages |
| pages.create | Create pages |
| pages.edit | Edit pages |
| pages.delete | Delete pages |
| pages.publish | Publish pages |
| homepage.view | View homepage |
| homepage.edit | Edit homepage |
| homepage.publish | Publish homepage |
| navigation.view | View navigation |
| navigation.edit | Edit navigation |
| services.view | View services |
| services.create | Create services |
| services.edit | Edit services |
| services.delete | Delete services |
| countries.view | View countries |
| countries.create | Create countries |
| countries.edit | Edit countries |
| countries.delete | Delete countries |
| coaching.view | View coaching courses |
| coaching.create | Create coaching courses |
| coaching.edit | Edit coaching courses |
| coaching.delete | Delete coaching courses |
| testimonials.view | View testimonials |
| testimonials.create | Create testimonials |
| testimonials.edit | Edit testimonials |
| testimonials.delete | Delete testimonials |
| faqs.view | View FAQs |
| faqs.create | Create FAQs |
| faqs.edit | Edit FAQs |
| faqs.delete | Delete FAQs |
| blog.view | View blog articles |
| blog.create | Create blog articles |
| blog.edit | Edit blog articles |
| blog.delete | Delete blog articles |
| blog.publish | Publish, schedule and feature blog articles |
| blog.categories.manage | Manage blog categories |
| blog.tags.manage | Manage blog tags |
| blog.authors.manage | Manage blog authors |
| media.view | View media |
| media.upload | Upload media |
| media.delete | Delete media |
| seo.view | View redirects and search settings status |
| seo.redirects.manage | Create, edit and delete redirects |
| forms.view | View forms |
| forms.edit | Edit forms |
| forms.submissions.view | View form submissions |
| settings.view | View site settings |
| settings.edit | Edit site settings |
| users.view | View users |
| users.create | Create users |
| users.edit | Edit users |
| users.disable | Disable users |
| roles.view | View roles |
| roles.create | Create roles |
| roles.edit | Edit roles |
| roles.delete | Delete roles |
| audit_logs.view | View audit logs |

### Typed CMS settings

Definitions and safe defaults only; secrets remain write-only.

| Key | Control | Definition |
| --- | --- | --- |
| protection.source | select | `SettingField('protection.source', 'CAPTCHA configuration', 'select', default='environment', options=('environment', 'dashboard'))` |
| protection.site_key | text | `SettingField('protection.site_key', 'Turnstile site key', 'text', max_length=200)` |
| protection.secret_key | secret | `SettingField('protection.secret_key', 'Turnstile secret key', 'secret', 'Leave blank to keep the saved key.', 2048)` |
| mail.source | select | `SettingField('mail.source', 'Email configuration', 'select', default='environment', options=('environment', 'dashboard'))` |
| mail.host | text | `SettingField('mail.host', 'SMTP hostname', 'text', "For example smtp.your-provider.com; use your provider's SMTP settings.", 253)` |
| mail.port | number | `SettingField('mail.port', 'SMTP port', 'number', '587 for STARTTLS or 465 for TLS, unless your provider specifies otherwise.', default=587)` |
| mail.encryption | select | `SettingField('mail.encryption', 'Encryption', 'select', default='starttls', options=('starttls', 'tls'))` |
| mail.username | text | `SettingField('mail.username', 'SMTP username', 'text', max_length=255)` |
| mail.password | secret | `SettingField('mail.password', 'SMTP password / app password', 'secret', 'Leave blank to keep the saved password.', 2048)` |
| mail.from_email | email | `SettingField('mail.from_email', 'Verified sender email', 'email')` |
| notifications.enabled | boolean | `SettingField('notifications.enabled', 'Enable enquiry notifications', 'boolean', default=False)` |
| notifications.primary_recipient | email | `SettingField('notifications.primary_recipient', 'Primary recipient', 'email')` |
| notifications.additional_recipients | textarea | `SettingField('notifications.additional_recipients', 'Additional recipients', 'textarea', 'One email per line; at most 5 recipients in total.', 1200)` |
| notifications.sender_name | text | `SettingField('notifications.sender_name', 'Sender display name', 'text', max_length=80, default='Visa House Enquiries')` |
| general.site_name | text | `SettingField('general.site_name', 'Site name', 'text', max_length=80, default='Visa House')` |
| general.company_name | text | `SettingField('general.company_name', 'Company name', 'text', 'Legal or trading name, e.g. for the copyright line.', 120)` |
| general.tagline | text | `SettingField('general.tagline', 'Tagline', 'text', max_length=120)` |
| general.site_description | textarea | `SettingField('general.site_description', 'Short description', 'textarea', max_length=300)` |
| branding.logo_media_id | media | `SettingField('branding.logo_media_id', 'Logo', 'media', 'Shown in the header (light background). A square icon works best; the site name is set next to it.')` |
| branding.logo_dark_media_id | media | `SettingField('branding.logo_dark_media_id', 'Logo (dark backgrounds)', 'media', 'Shown in the footer.')` |
| branding.show_name_with_logo | boolean | `SettingField('branding.show_name_with_logo', 'Show the site name next to the logo', 'boolean', 'Turn off if the logo image already contains the name.', default=True)` |
| branding.favicon_media_id | media | `SettingField('branding.favicon_media_id', 'Favicon', 'media')` |
| branding.text_size | select | `SettingField('branding.text_size', 'Text size', 'select', 'Scales the text across the whole website: S 90%, M 100% (standard), L 110%, XL 120%.', default='m', options=('s', 'm', 'l', 'xl'))` |
| branding.text_size_mobile | select | `SettingField('branding.text_size_mobile', 'Text size on phones', 'select', 'Used instead of the text size above on screens narrower than 640px (phones).', default='s', options=('s', 'm', 'l', 'xl'))` |
| contact.primary_phone | tel | `SettingField('contact.primary_phone', 'Primary phone', 'tel', max_length=30)` |
| contact.secondary_phone | tel | `SettingField('contact.secondary_phone', 'Secondary phone', 'tel', max_length=30)` |
| contact.email | email | `SettingField('contact.email', 'Email', 'email')` |
| contact.whatsapp | tel | `SettingField('contact.whatsapp', 'WhatsApp number', 'tel', 'International format, e.g. +91…', 30)` |
| contact.whatsapp_button | boolean | `SettingField('contact.whatsapp_button', 'Show floating WhatsApp button', 'boolean', 'A WhatsApp button in the bottom-right corner of every page. Needs the WhatsApp number above.', default=True)` |
| contact.whatsapp_message | textarea | `SettingField('contact.whatsapp_message', 'WhatsApp default message', 'textarea', "Pre-filled in the visitor's chat when they tap the WhatsApp button. They can edit it before sending.", 500, default="Hi Visa House, I'd like to know more about your services.")` |
| contact.address | textarea | `SettingField('contact.address', 'Head office address', 'textarea', 'Used only when no locations are published.', 300)` |
| contact.maps_url | url | `SettingField('contact.maps_url', 'Google Maps URL', 'url', 'For the head office address above.', 500)` |
| contact.office_hours | text | `SettingField('contact.office_hours', 'Office hours', 'text', max_length=120)` |
| social.facebook | url | `SettingField('social.facebook', 'Facebook', 'url', max_length=500)` |
| social.instagram | url | `SettingField('social.instagram', 'Instagram', 'url', max_length=500)` |
| social.youtube | url | `SettingField('social.youtube', 'YouTube', 'url', max_length=500)` |
| social.linkedin | url | `SettingField('social.linkedin', 'LinkedIn', 'url', max_length=500)` |
| social.instagram_demo_reels | boolean | `SettingField('social.instagram_demo_reels', 'Show demo reels', 'boolean', "Show the LMS's illustrative demo reels, labelled “Demo”, in the homepage's Instagram reels section until real reels are added. They open the LMS's Instagram profile.", default=False)` |
| header.sticky | boolean | `SettingField('header.sticky', 'Keep header visible while scrolling', 'boolean', default=True)` |
| header.show_phone | boolean | `SettingField('header.show_phone', 'Show phone number in header', 'boolean', default=True)` |
| header.cta_label | text | `SettingField('header.cta_label', 'Header button label', 'text', max_length=30)` |
| header.cta_href | url | `SettingField('header.cta_href', 'Header button link', 'url', 'Internal path like /#enquire or https URL', 500)` |
| footer.rotating_messages | textarea | `SettingField('footer.rotating_messages', 'Rotating footer messages', 'textarea', 'One message per line, shown after the site name in a repeating sequence. Leave empty for a static brand name.', max_length=3000)` |
| footer.description | textarea | `SettingField('footer.description', 'Footer description', 'textarea', max_length=300)` |
| footer.copyright_text | text | `SettingField('footer.copyright_text', 'Copyright text', 'text', 'Use {year} for the current year and {company} for the company name.', 200)` |
| footer.show_services | boolean | `SettingField('footer.show_services', 'List services in footer', 'boolean', default=True)` |
| footer.services_title | text | `SettingField('footer.services_title', 'Services column heading', 'text', max_length=40, default='Services')` |
| footer.show_countries | boolean | `SettingField('footer.show_countries', 'List countries in footer', 'boolean', default=True)` |
| footer.countries_title | text | `SettingField('footer.countries_title', 'Countries column heading', 'text', max_length=40, default='Destinations')` |
| footer.contact_title | text | `SettingField('footer.contact_title', 'Contact column heading', 'text', max_length=40, default='Contact')` |
| seo.title_suffix | text | `SettingField('seo.title_suffix', 'Title suffix', 'text', 'Appended to page titles, e.g. “ \| Visa House”', 60)` |
| seo.default_description | textarea | `SettingField('seo.default_description', 'Default meta description', 'textarea', max_length=320)` |
| seo.default_og_image_media_id | media | `SettingField('seo.default_og_image_media_id', 'Default social share image', 'media')` |
| seo.default_og_image_alt | text | `SettingField('seo.default_og_image_alt', 'Default social image description', 'text', 'Alternative text for the default share image.', 200)` |
| seo.twitter_handle | text | `SettingField('seo.twitter_handle', 'X (Twitter) account', 'text', "The site's @handle for share cards, e.g. @visahouse", 16)` |

### Environment configuration names

Types identify the original server contract. Do not invent secret values or treat optional settings as proof of provider readiness. Browser-exposed variables are public.

| Name | Type |
| --- | --- |
| APP_ENVIRONMENT | `Literal['development', 'test', 'production']` |
| AUTO_SEED_ON_STARTUP | `bool \| None` |
| SHOW_SAMPLE_SUCCESS_STORIES | `bool` |
| DATABASE_URL | `str` |
| DB_POOL_SIZE | `int` |
| DB_MAX_OVERFLOW | `int` |
| DB_POOL_RECYCLE_SECONDS | `int` |
| SECRET_KEY | `str` |
| SESSION_COOKIE_NAME | `str` |
| CSRF_COOKIE_NAME | `str` |
| SESSION_TTL_HOURS | `int` |
| PASSWORD_HASH_ROUNDS | `int` |
| COOKIE_SAMESITE | `Literal['lax', 'strict']` |
| CORS_ORIGINS | `str` |
| PUBLIC_SITE_URL | `str` |
| SEO_INDEXING | `bool \| None` |
| FRONTEND_DIST_DIR | `str \| None` |
| MAX_REQUEST_BYTES | `int` |
| HSTS_SECONDS | `int` |
| LOGIN_RATE_LIMIT | `int` |
| LOGIN_RATE_WINDOW_SECONDS | `int` |
| SEARCH_RATE_LIMIT | `int` |
| SEARCH_RATE_WINDOW_SECONDS | `int` |
| UPLOAD_RATE_LIMIT | `int` |
| UPLOAD_RATE_WINDOW_SECONDS | `int` |
| PREVIEW_RATE_LIMIT | `int` |
| PREVIEW_RATE_WINDOW_SECONDS | `int` |
| SETTINGS_ENCRYPTION_KEY | `str` |
| TURNSTILE_SITE_KEY | `str` |
| TURNSTILE_SECRET_KEY | `str` |
| CAPTCHA_DEVELOPMENT_BYPASS | `bool` |
| SMTP_HOST | `str` |
| SMTP_PORT | `int` |
| SMTP_MODE | `Literal['starttls', 'tls']` |
| SMTP_USERNAME | `str` |
| SMTP_PASSWORD | `str` |
| SMTP_FROM_EMAIL | `str` |
| MAIL_WORKER_ENABLED | `bool` |
| FORM_SUBMISSION_RATE_LIMIT | `int` |
| FORM_SUBMISSION_RATE_WINDOW_SECONDS | `int` |
| LMS_PUBLIC_URL | `str` |
| LMS_FEED_TIMEOUT_SECONDS | `float` |
| LMS_FEED_CACHE_SECONDS | `int` |
| LMS_FEED_STALE_SECONDS | `int` |
| MEDIA_ROOT | `str` |
| MEDIA_URL_PREFIX | `str` |
| MEDIA_STORAGE_BACKEND | `Literal['local']` |
| MEDIA_MAX_UPLOAD_BYTES | `int` |
| MEDIA_MAX_VIDEO_BYTES | `int` |
| BOOTSTRAP_ADMIN_EMAIL | `str \| None` |
| BOOTSTRAP_ADMIN_PASSWORD | `str \| None` |
| BOOTSTRAP_ADMIN_NAME | `str` |

### Model and association map

Inheritance remains significant; a declaration may be a mixin/enum rather than a table. Field names document responsibility, not sufficient DDL.

| Declaration | Table | Bases | Fields |
| --- | --- | --- | --- |
| WebsiteAuditLog | website_audit_logs | IdMixin, Base | user_id, action, entity_type, entity_id, summary, changes, ip_address, created_at, user |
| WebsiteUser | website_users | IdMixin, TimestampMixin, Base | email, full_name, password_hash, is_active, last_login_at, roles |
| WebsiteRole | website_roles | IdMixin, TimestampMixin, Base | key, name, description, is_system, is_super_admin, permissions, users |
| WebsitePermission | website_permissions | IdMixin, Base | key, module, label |
| WebsiteUserSession | website_user_sessions | IdMixin, Base | user_id, token_hash, csrf_token_hash, created_at, expires_at, last_seen_at, revoked_at, ip_address, user_agent, user |
| Base | None | DeclarativeBase |  |
| ContentStatus | None | StrEnum |  |
| IdMixin | None |  | id |
| TimestampMixin | None |  | created_at, updated_at |
| AuthorMixin | None |  | created_by_id, updated_by_id |
| SeoMixin | None |  | seo_title, seo_description, canonical_url, og_title, og_description, og_image_id, og_image_alt, twitter_title, twitter_description, twitter_image_id, robots_index, robots_follow |
| WebsiteBlogCategory | website_blog_categories | IdMixin, TimestampMixin, Base | name, slug, description, is_active |
| WebsiteBlogTag | website_blog_tags | IdMixin, TimestampMixin, Base | name, slug |
| WebsiteBlogAuthor | website_blog_authors | IdMixin, TimestampMixin, Base | user_id, display_name, slug, job_title, bio, avatar_media_id, is_active, avatar |
| WebsiteBlogPost | website_blog_posts | IdMixin, TimestampMixin, AuthorMixin, Base | slug, status, featured, published_revision_id, draft_revision_id, published_at, revisions |
| WebsiteBlogPostRelated | website_blog_post_related | Base | revision_id, related_post_id, position |
| WebsiteBlogPostRevision | website_blog_post_revisions | IdMixin, TimestampMixin, AuthorMixin, SeoMixin, Base | post_id, number, state, version, title, excerpt, body, search_text, word_count, featured_image_id, featured_image_alt, author_id, category_id, cta, based_on_revision_id, published_at, published_by_id, post, tags, related |
| PageType | None |  |  |
| RevisionState | None |  |  |
| WebsitePage | website_pages | IdMixin, TimestampMixin, AuthorMixin, Base | internal_name, slug, page_type, status, is_system, service_id, country_id, coaching_id, published_revision_id, draft_revision_id, published_at, revisions, sections |
| WebsitePageRevision | website_page_revisions | IdMixin, TimestampMixin, AuthorMixin, SeoMixin, Base | page_id, number, state, version, title, breadcrumb_label, based_on_revision_id, published_at, published_by_id, page, sections |
| WebsitePageSection | website_page_sections | IdMixin, Base | page_id, created_at, created_by_id, page, revisions |
| WebsitePageSectionRevision | website_page_section_revisions | IdMixin, TimestampMixin, Base | revision_id, section_id, section_type, internal_name, display_order, enabled, schema_version, config, updated_by_id, revision, section |
| WebsiteSiteSetting | website_site_settings | IdMixin, TimestampMixin, Base | key, category, value, updated_by_id |
| WebsiteNavigation | website_navigations | IdMixin, TimestampMixin, Base | key, name, title, items |
| NavDestination | None |  |  |
| WebsiteNavigationItem | website_navigation_items | IdMixin, TimestampMixin, Base | navigation_id, parent_id, label, destination_type, url, page_id, service_id, country_id, coaching_id, display_order, is_visible, open_in_new_tab, navigation |
| WebsiteSlugHistory | website_slug_history | IdMixin, Base | entity_type, entity_id, old_path, new_path, changed_by_id, changed_at |
| WebsiteService | website_services | IdMixin, TimestampMixin, AuthorMixin, SeoMixin, Base | name, slug, short_description, description, icon_key, icon_media_id, image_media_id, cta_label, featured, display_order, status, image, icon_media |
| WebsiteCoachingCourse | website_coaching_courses | IdMixin, TimestampMixin, AuthorMixin, SeoMixin, Base | name, slug, short_description, description, icon_key, icon_media_id, image_media_id, cta_label, key_facts, highlights, link_behavior, redirect_url, redirect_new_tab, featured, display_order, status, image, icon_media |
| WebsiteCountry | website_countries | IdMixin, TimestampMixin, AuthorMixin, SeoMixin, Base | name, slug, iso_code, short_description, description, flag_media_id, hero_media_id, cta_label, map_lat, map_lng, card_highlights, featured, display_order, status, flag, hero |
| WebsiteTestimonial | website_testimonials | IdMixin, TimestampMixin, AuthorMixin, Base | name, designation, testimonial_text, rating, photo_media_id, country_id, source_url, video_url, video_media_id, video_poster_media_id, video_captions_media_id, is_demo, featured, display_order, status, photo, country, video, video_poster, video_captions |
| WebsiteSuccessStory | website_success_stories | IdMixin, TimestampMixin, AuthorMixin, Base | client_name, headline, summary, story, quote, outcome, year, service_id, country_id, photo_media_id, gallery, consent_confirmed, consent_note, is_demo, featured, display_order, status, photo, service, country |
| WebsiteFaqCategory | website_faq_categories | IdMixin, TimestampMixin, Base | name, slug, display_order |
| WebsiteFaq | website_faqs | IdMixin, TimestampMixin, AuthorMixin, Base | question, answer, category_id, display_order, status, category |
| WebsiteLocation | website_locations | IdMixin, TimestampMixin, AuthorMixin, Base | name, address, phone, email, map_url, map_embed_url, opening_hours, image_media_id, display_order, status, image |
| WebsiteForm | website_forms | IdMixin, TimestampMixin, Base | key, name, description, fields, submit_label, success_message, consent_text, is_active |
| WebsiteFormSubmission | website_form_submissions | IdMixin, Base | form_id, idempotency_key, request_hash, data, page_id, section_id, source_path, ip_address, user_agent, submitted_at, form |
| WebsiteEmailOutbox | website_email_outbox | Base, IdMixin | submission_id, recipients, sender_name, status, attempts, available_at, lease_token, last_error, sent_at |
| WebsiteMedia | website_media | IdMixin, TimestampMixin, Base | storage_backend, storage_key, kind, original_filename, mime_type, size_bytes, width, height, alt_text, title, credit, caption, variants, uploaded_by_id |
| WebsiteRedirect | website_redirects | IdMixin, TimestampMixin, AuthorMixin, Base | source_path, destination, status_code, is_active, is_automatic, entity_type, entity_id, note |

```python
{'file': 'backend/app/models/auth.py', 'line': 8, 'name': 'website_user_roles', 'declaration': "Table('website_user_roles', Base.metadata, Column('user_id', ForeignKey('website_users.id', ondelete='CASCADE'), primary_key=True), Column('role_id', ForeignKey('website_roles.id', ondelete='CASCADE'), primary_key=True))"}
```

```python
{'file': 'backend/app/models/auth.py', 'line': 15, 'name': 'website_role_permissions', 'declaration': "Table('website_role_permissions', Base.metadata, Column('role_id', ForeignKey('website_roles.id', ondelete='CASCADE'), primary_key=True), Column('permission_id', ForeignKey('website_permissions.id', ondelete='CASCADE'), primary_key=True))"}
```

```python
{'file': 'backend/app/models/blog.py', 'line': 39, 'name': 'website_blog_post_revision_tags', 'declaration': "Table('website_blog_post_revision_tags', Base.metadata, Column('revision_id', ForeignKey('website_blog_post_revisions.id', ondelete='CASCADE', name='fk_website_blog_revision_tags_revision'), primary_key=True), Column('tag_id', ForeignKey('website_blog_tags.id', ondelete='CASCADE', name='fk_website_blog_revision_tags_tag'), primary_key=True, index=True))"}
```

### Schema field and validation map

Each entry lists its original bases, explicit field type/default constraints and validator names. Inherited fields and imported validation helpers still matter. Reimplement complete target validation; this map does not include every helper body or import.

#### LoginRequest

Original module: `backend/app/schemas/auth.py`. Bases: `BaseModel`.

```text
email: str = Field(min_length=1, max_length=255)
password: str = Field(min_length=1, max_length=200)
```

#### RoleRef

Original module: `backend/app/schemas/auth.py`. Bases: `ORMModel`.

```text
id: int
key: str
name: str
```

#### MeResponse

Original module: `backend/app/schemas/auth.py`. Bases: `BaseModel`.

```text
id: int
email: str
full_name: str
is_super_admin: bool
roles: list[RoleRef]
permissions: list[str]
```

#### Input

Original module: `backend/app/schemas/blog.py`. Bases: `BaseModel`.

#### ArticleCreate

Original module: `backend/app/schemas/blog.py`. Bases: `Input`.

```text
title: Annotated[str, Field(min_length=1, max_length=200)]
slug: ArticleSlug
excerpt: Annotated[str | None, Field(max_length=400)] = None
category_id: int | None = None
author_id: int | None = None
```

#### ArticleUpdate

Original module: `backend/app/schemas/blog.py`. Bases: `SeoPatch`.

```text
slug: ArticleSlug | None = None
title: Annotated[str | None, Field(min_length=1, max_length=200)] = None
excerpt: Annotated[str | None, Field(max_length=400)] = None
body: Annotated[list[dict] | None, Field(max_length=400)] = None
featured_image_id: int | None = None
featured_image_alt: Annotated[str | None, Field(max_length=200)] = None
author_id: int | None = None
category_id: int | None = None
cta: dict | None = None
tag_ids: Annotated[list[int] | None, Field(max_length=20)] = None
related_ids: Annotated[list[int] | None, Field(max_length=6)] = None
```

#### ArticlePublish

Original module: `backend/app/schemas/blog.py`. Bases: `BaseModel`.

```text
revision_id: int | None = None
version: int | None = None
publish_at: datetime | None = None
```

Validators: `_utc`.

#### FeatureRequest

Original module: `backend/app/schemas/blog.py`. Bases: `BaseModel`.

```text
featured: bool
```

#### NamedRef

Original module: `backend/app/schemas/blog.py`. Bases: `BaseModel`.

```text
id: int
name: str
```

#### TagRef

Original module: `backend/app/schemas/blog.py`. Bases: `BaseModel`.

```text
id: int
name: str
slug: str
```

#### RelatedRef

Original module: `backend/app/schemas/blog.py`. Bases: `BaseModel`.

```text
id: int
title: str
path: str
display_status: DisplayStatus
```

#### ArticleSummary

Original module: `backend/app/schemas/blog.py`. Bases: `BaseModel`.

```text
id: int
title: str
slug: str
path: str
status: str
display_status: DisplayStatus
has_draft: bool
featured: bool
published_at: datetime | None
created_at: datetime
updated_at: datetime
updated_by: UserRef | None
author: NamedRef | None
category: NamedRef | None
```

#### ArticleRevisionMeta

Original module: `backend/app/schemas/blog.py`. Bases: `BaseModel`.

```text
id: int
number: int
state: str
version: int
title: str
created_at: datetime
updated_at: datetime
updated_by: UserRef | None
published_at: datetime | None
published_by: UserRef | None
```

#### ArticleRules

Original module: `backend/app/schemas/blog.py`. Bases: `BaseModel`.

```text
can_schedule: bool
can_discard: bool
can_delete: bool
```

#### ArticleDetail

Original module: `backend/app/schemas/blog.py`. Bases: `ArticleSummary`.

```text
editing: Literal['draft', 'published']
excerpt: str | None
body: list[dict]
word_count: int
featured_image_id: int | None
featured_image_alt: str | None
author_id: int | None
category_id: int | None
cta: dict | None
seo_title: str | None
seo_description: str | None
canonical_url: str | None
og_title: str | None
og_description: str | None
og_image_id: int | None
og_image_alt: str | None
twitter_title: str | None
twitter_description: str | None
twitter_image_id: int | None
robots_index: bool
robots_follow: bool
tags: list[TagRef]
related: list[RelatedRef]
draft: ArticleRevisionMeta | None
live: ArticleRevisionMeta | None
rules: ArticleRules
```

#### CategoryInput

Original module: `backend/app/schemas/blog.py`. Bases: `Input`.

```text
name: Annotated[str, Field(min_length=1, max_length=100)]
slug: Annotated[str, Field(min_length=1, max_length=100)]
description: Annotated[str | None, Field(max_length=300)] = None
is_active: bool = True
```

#### CategoryOut

Original module: `backend/app/schemas/blog.py`. Bases: `BaseModel`.

```text
id: int
name: str
slug: str
description: str | None
is_active: bool
article_count: int
created_at: datetime
updated_at: datetime
```

#### TagInput

Original module: `backend/app/schemas/blog.py`. Bases: `Input`.

```text
name: Annotated[str, Field(min_length=1, max_length=60)]
slug: Annotated[str | None, Field(max_length=60)] = None
```

Validators: `_name`.

#### TagOut

Original module: `backend/app/schemas/blog.py`. Bases: `BaseModel`.

```text
id: int
name: str
slug: str
article_count: int
```

#### AuthorInput

Original module: `backend/app/schemas/blog.py`. Bases: `Input`.

```text
display_name: Annotated[str, Field(min_length=1, max_length=120)]
slug: Annotated[str, Field(min_length=1, max_length=120)]
job_title: Annotated[str | None, Field(max_length=120)] = None
bio: Annotated[str | None, Field(max_length=600)] = None
avatar_media_id: int | None = None
user_id: int | None = None
is_active: bool = True
```

#### AuthorOut

Original module: `backend/app/schemas/blog.py`. Bases: `BaseModel`.

```text
id: int
display_name: str
slug: str
job_title: str | None
bio: str | None
avatar_media_id: int | None
user: UserRef | None
is_active: bool
article_count: int
```

#### ORMModel

Original module: `backend/app/schemas/common.py`. Bases: `BaseModel`.

#### PageParams

Original module: `backend/app/schemas/common.py`. Bases: `BaseModel`.

```text
page: int = Field(1, ge=1, le=10000)
page_size: int = Field(20, ge=1, le=100)
```

Validators: `offset`.

#### Paginated

Original module: `backend/app/schemas/common.py`. Bases: `BaseModel, Generic[T]`.

```text
items: list[T]
total: int
page: int
page_size: int
pages: int
```

Validators: `build`.

#### Input

Original module: `backend/app/schemas/content.py`. Bases: `BaseModel`.

#### SeoInput

Original module: `backend/app/schemas/content.py`. Bases: `Input`.

```text
seo_title: Annotated[str | None, Field(max_length=70)] = None
seo_description: Annotated[str | None, Field(max_length=320)] = None
canonical_url: Annotated[str | None, Field(max_length=500)] = None
og_title: Annotated[str | None, Field(max_length=120)] = None
og_description: Annotated[str | None, Field(max_length=320)] = None
og_image_id: int | None = None
og_image_alt: Annotated[str | None, Field(max_length=200)] = None
twitter_title: Annotated[str | None, Field(max_length=120)] = None
twitter_description: Annotated[str | None, Field(max_length=320)] = None
twitter_image_id: int | None = None
robots_index: bool = True
robots_follow: bool = True
```

#### ServiceInput

Original module: `backend/app/schemas/content.py`. Bases: `SeoInput`.

```text
name: Name
slug: Annotated[str, Field(min_length=1, max_length=150)]
short_description: Short = None
description: LongBody = None
icon_key: Annotated[str | None, Field(max_length=50)] = None
icon_media_id: int | None = None
image_media_id: int | None = None
cta_label: CtaLabel = None
featured: bool = False
status: Status = 'DRAFT'
```

#### ServiceOut

Original module: `backend/app/schemas/content.py`. Bases: `BaseModel`.

```text
id: int
name: str
slug: str
short_description: str | None
description: str | None
icon_key: str | None
icon_media_id: int | None
image_media_id: int | None
cta_label: str | None
featured: bool
display_order: int
status: str
seo_title: str | None
seo_description: str | None
canonical_url: str | None
og_title: str | None
og_description: str | None
og_image_id: int | None
og_image_alt: str | None
twitter_title: str | None
twitter_description: str | None
twitter_image_id: int | None
robots_index: bool
robots_follow: bool
updated_at: datetime
```

#### KeyFact

Original module: `backend/app/schemas/content.py`. Bases: `Input`.

```text
label: Annotated[str, Field(min_length=1, max_length=40)]
value: Annotated[str, Field(min_length=1, max_length=40)]
```

#### CoachingInput

Original module: `backend/app/schemas/content.py`. Bases: `SeoInput`.

```text
name: Name
slug: Annotated[str, Field(min_length=1, max_length=150)]
short_description: Short = None
description: LongBody = None
icon_key: Annotated[str | None, Field(max_length=50)] = None
icon_media_id: int | None = None
image_media_id: int | None = None
cta_label: CtaLabel = None
key_facts: Annotated[list[KeyFact] | None, Field(max_length=6)] = None
highlights: Annotated[list[Annotated[str, Field(max_length=80)]] | None, Field(max_length=6)] = None
link_behavior: Literal['CONTENT', 'URL'] = 'CONTENT'
redirect_url: Annotated[str | None, Field(max_length=500, validate_default=True)] = None
redirect_new_tab: bool = False
featured: bool = False
status: Status = 'DRAFT'
```

Validators: `_redirect_url`, `_redirect_new_tab`, `_facts`, `_highlights`.

#### CoachingOut

Original module: `backend/app/schemas/content.py`. Bases: `BaseModel`.

```text
id: int
name: str
slug: str
short_description: str | None
description: str | None
icon_key: str | None
icon_media_id: int | None
image_media_id: int | None
cta_label: str | None
key_facts: list[dict] | None
highlights: list[str] | None
link_behavior: str
redirect_url: str | None
redirect_new_tab: bool
featured: bool
display_order: int
status: str
seo_title: str | None
seo_description: str | None
canonical_url: str | None
og_title: str | None
og_description: str | None
og_image_id: int | None
og_image_alt: str | None
twitter_title: str | None
twitter_description: str | None
twitter_image_id: int | None
robots_index: bool
robots_follow: bool
updated_at: datetime
```

#### CountryInput

Original module: `backend/app/schemas/content.py`. Bases: `SeoInput`.

```text
name: Annotated[str, Field(min_length=1, max_length=100)]
slug: Annotated[str, Field(min_length=1, max_length=100)]
iso_code: Annotated[str | None, Field(min_length=2, max_length=2)] = None
short_description: Short = None
description: LongBody = None
flag_media_id: int | None = None
hero_media_id: int | None = None
cta_label: CtaLabel = None
map_lat: Annotated[float | None, Field(ge=-85, le=85)] = None
map_lng: Annotated[float | None, Field(ge=-180, le=180)] = None
card_highlights: Annotated[list[Annotated[str, Field(max_length=80)]] | None, Field(max_length=4)] = None
featured: bool = False
status: Status = 'DRAFT'
```

Validators: `_highlights`, `_iso`.

#### CountryOut

Original module: `backend/app/schemas/content.py`. Bases: `BaseModel`.

```text
id: int
name: str
slug: str
iso_code: str | None
short_description: str | None
description: str | None
flag_media_id: int | None
hero_media_id: int | None
cta_label: str | None
map_lat: float | None
map_lng: float | None
card_highlights: list[str] | None
featured: bool
display_order: int
status: str
seo_title: str | None
seo_description: str | None
canonical_url: str | None
og_title: str | None
og_description: str | None
og_image_id: int | None
og_image_alt: str | None
twitter_title: str | None
twitter_description: str | None
twitter_image_id: int | None
robots_index: bool
robots_follow: bool
updated_at: datetime
```

#### LocationInput

Original module: `backend/app/schemas/content.py`. Bases: `Input`.

```text
name: Annotated[str, Field(min_length=1, max_length=80)]
address: Annotated[str, Field(min_length=1, max_length=300)]
phone: Annotated[str | None, Field(max_length=30)] = None
email: Annotated[str | None, Field(max_length=255)] = None
map_url: Annotated[str | None, Field(max_length=500)] = None
map_embed_url: Annotated[str | None, Field(max_length=1000)] = None
opening_hours: Annotated[str | None, Field(max_length=300)] = None
image_media_id: int | None = None
status: Status = 'DRAFT'
```

Validators: `_phone`, `_email`, `_embed`.

#### LocationOut

Original module: `backend/app/schemas/content.py`. Bases: `BaseModel`.

```text
id: int
name: str
address: str
phone: str | None
email: str | None
map_url: str | None
map_embed_url: str | None
opening_hours: str | None
image_media_id: int | None
display_order: int
status: str
updated_at: datetime
```

#### TestimonialInput

Original module: `backend/app/schemas/content.py`. Bases: `Input`.

```text
name: Annotated[str, Field(min_length=1, max_length=120)]
designation: Annotated[str | None, Field(max_length=200)] = None
testimonial_text: Annotated[str, Field(min_length=1, max_length=2000)]
rating: Annotated[int | None, Field(ge=1, le=5)] = None
photo_media_id: int | None = None
country_id: int | None = None
source_url: Annotated[str | None, Field(max_length=500)] = None
video_url: Annotated[str | None, Field(max_length=500)] = None
video_media_id: int | None = None
video_poster_media_id: int | None = None
video_captions_media_id: int | None = None
is_demo: bool = False
featured: bool = False
status: Status = 'DRAFT'
```

#### TestimonialOut

Original module: `backend/app/schemas/content.py`. Bases: `BaseModel`.

```text
id: int
name: str
designation: str | None
testimonial_text: str
rating: int | None
photo_media_id: int | None
country_id: int | None
source_url: str | None
video_url: str | None
video_media_id: int | None
video_poster_media_id: int | None
video_captions_media_id: int | None
is_demo: bool
featured: bool
display_order: int
status: str
updated_at: datetime
```

#### SuccessStoryInput

Original module: `backend/app/schemas/content.py`. Bases: `Input`.

```text
client_name: Annotated[str, Field(min_length=1, max_length=120)]
headline: Annotated[str, Field(min_length=1, max_length=160)]
summary: Annotated[str | None, Field(max_length=400)] = None
story: Annotated[list[RichTextBlock] | None, Field(max_length=60)] = None
quote: Annotated[str | None, Field(max_length=400)] = None
outcome: Annotated[str | None, Field(max_length=120)] = None
year: Annotated[int | None, Field(ge=1990, le=2100)] = None
service_id: int | None = None
country_id: int | None = None
photo_media_id: int | None = None
gallery: Annotated[list[GalleryItem] | None, Field(max_length=24)] = None
consent_confirmed: bool = False
consent_note: Annotated[str | None, Field(max_length=200)] = None
is_demo: bool = False
featured: bool = False
status: Status = 'DRAFT'
```

#### SuccessStoryOut

Original module: `backend/app/schemas/content.py`. Bases: `BaseModel`.

```text
id: int
client_name: str
headline: str
summary: str | None
story: list | None
quote: str | None
outcome: str | None
year: int | None
service_id: int | None
country_id: int | None
photo_media_id: int | None
gallery: list | None
consent_confirmed: bool
consent_note: str | None
is_demo: bool
featured: bool
display_order: int
status: str
updated_at: datetime
```

#### FaqInput

Original module: `backend/app/schemas/content.py`. Bases: `Input`.

```text
question: Annotated[str, Field(min_length=1, max_length=300)]
answer: Annotated[str, Field(min_length=1, max_length=4000)]
category_id: int | None = None
status: Status = 'DRAFT'
```

#### FaqOut

Original module: `backend/app/schemas/content.py`. Bases: `BaseModel`.

```text
id: int
question: str
answer: str
category_id: int | None
display_order: int
status: str
updated_at: datetime
```

#### FaqCategoryInput

Original module: `backend/app/schemas/content.py`. Bases: `Input`.

```text
name: Annotated[str, Field(min_length=1, max_length=100)]
slug: Annotated[str, Field(min_length=1, max_length=100)]
```

#### FaqCategoryOut

Original module: `backend/app/schemas/content.py`. Bases: `BaseModel`.

```text
id: int
name: str
slug: str
display_order: int
faq_count: int = 0
```

#### OrderInput

Original module: `backend/app/schemas/content.py`. Bases: `BaseModel`.

```text
ids: Annotated[list[int], Field(min_length=1, max_length=500)]
```

#### FormOption

Original module: `backend/app/schemas/forms.py`. Bases: `BaseModel`.

```text
value: Annotated[str, Field(min_length=1, max_length=100)]
label: Annotated[str, Field(min_length=1, max_length=100)]
```

#### FormFieldSpec

Original module: `backend/app/schemas/forms.py`. Bases: `BaseModel`.

```text
name: str
label: Annotated[str, Field(min_length=1, max_length=120)]
type: FieldType
enabled: bool = True
required: bool = False
placeholder: Annotated[str | None, Field(max_length=100)] = None
max_length: Annotated[int, Field(ge=1, le=5000)] = 200
width: Literal['full', 'half'] = 'full'
options: list[FormOption] = Field(default_factory=list, max_length=100)
options_source: Literal['services', 'countries', 'coaching'] | None = None
```

Validators: `_name`, `_consistent`.

#### FormUpdate

Original module: `backend/app/schemas/forms.py`. Bases: `BaseModel`.

```text
name: Annotated[str | None, Field(min_length=1, max_length=150)] = None
description: Annotated[str | None, Field(max_length=1000)] = None
submit_label: Annotated[str | None, Field(min_length=1, max_length=60)] = None
success_message: Annotated[str | None, Field(min_length=1, max_length=300)] = None
consent_text: Annotated[str | None, Field(max_length=500)] = None
is_active: bool | None = None
fields: Annotated[list[FormFieldSpec] | None, Field(min_length=1, max_length=20)] = None
```

#### FormCreate

Original module: `backend/app/schemas/forms.py`. Bases: `BaseModel`.

```text
key: str
name: Annotated[str, Field(min_length=1, max_length=150)]
description: Annotated[str | None, Field(max_length=1000)] = None
```

Validators: `_key`.

#### FormOut

Original module: `backend/app/schemas/forms.py`. Bases: `BaseModel`.

```text
id: int
key: str
name: str
description: str | None
fields: list[FormFieldSpec]
submit_label: str
success_message: str
consent_text: str | None
is_active: bool
updated_at: datetime
```

#### SubmissionRequest

Original module: `backend/app/schemas/forms.py`. Bases: `BaseModel`.

```text
captcha_token: Annotated[str | None, Field(max_length=2048)] = None
idempotency_key: Annotated[str | None, Field(pattern='^[a-f0-9-]{36}$')] = None
values: dict[str, str] = Field(max_length=40)
page_id: int | None = None
section_id: int | None = None
source_path: Annotated[str | None, Field(max_length=500)] = None
website: Annotated[str | None, Field(max_length=200)] = None
```

#### PageCreate

Original module: `backend/app/schemas/pages.py`. Bases: `BaseModel`.

```text
internal_name: Annotated[str, Field(min_length=2, max_length=150)]
title: Annotated[str, Field(min_length=1, max_length=200)]
slug: Slug
page_type: CreatablePageType = 'STANDARD'
```

#### PageUpdate

Original module: `backend/app/schemas/pages.py`. Bases: `SeoPatch`.

```text
internal_name: Annotated[str | None, Field(min_length=2, max_length=150)] = None
slug: Slug | None = None
page_type: CreatablePageType | None = None
status: StatusValue | None = None
title: Annotated[str | None, Field(min_length=1, max_length=200)] = None
breadcrumb_label: Annotated[str | None, Field(max_length=60)] = None
```

Validators: `_blank`.

#### PublishRequest

Original module: `backend/app/schemas/pages.py`. Bases: `BaseModel`.

```text
revision_id: int | None = None
version: int | None = None
```

#### SectionOut

Original module: `backend/app/schemas/pages.py`. Bases: `BaseModel`.

```text
id: int
section_type: str
internal_name: str
display_order: int
enabled: bool
config: dict
updated_at: datetime
```

#### UserRef

Original module: `backend/app/schemas/pages.py`. Bases: `BaseModel`.

```text
id: int
name: str
```

#### OwnerRef

Original module: `backend/app/schemas/pages.py`. Bases: `BaseModel`.

```text
type: Literal['service', 'country', 'coaching']
id: int
name: str
status: str
```

#### PageSummary

Original module: `backend/app/schemas/pages.py`. Bases: `BaseModel`.

```text
id: int
internal_name: str
title: str
slug: str | None
page_type: str
status: str
display_status: DisplayStatus
has_draft: bool
is_system: bool
path: str | None
section_count: int
published_at: datetime | None
updated_at: datetime
updated_by: UserRef | None
owner: OwnerRef | None = None
```

#### RevisionMeta

Original module: `backend/app/schemas/pages.py`. Bases: `BaseModel`.

```text
id: int
number: int
version: int
updated_at: datetime
updated_by: UserRef | None
published_at: datetime | None
```

#### PageRules

Original module: `backend/app/schemas/pages.py`. Bases: `BaseModel`.

```text
slug_editable: bool
type_editable: bool
can_unpublish: bool
can_delete: bool
```

#### PageDetail

Original module: `backend/app/schemas/pages.py`. Bases: `PageSummary`.

```text
editing: Literal['draft', 'published']
breadcrumb_label: str | None
seo_title: str | None
seo_description: str | None
canonical_url: str | None
og_title: str | None
og_description: str | None
og_image_id: int | None
og_image_alt: str | None
twitter_title: str | None
twitter_description: str | None
twitter_image_id: int | None
robots_index: bool
robots_follow: bool
sections: list[SectionOut]
draft: RevisionMeta | None
live: RevisionMeta | None
rules: PageRules
```

#### SectionCreate

Original module: `backend/app/schemas/pages.py`. Bases: `BaseModel`.

```text
section_type: Annotated[str, Field(max_length=40)]
internal_name: Annotated[str, Field(min_length=2, max_length=150)]
enabled: bool = True
config: dict
```

#### SectionUpdate

Original module: `backend/app/schemas/pages.py`. Bases: `BaseModel`.

```text
internal_name: Annotated[str | None, Field(min_length=2, max_length=150)] = None
enabled: bool | None = None
config: dict | None = None
```

#### SectionReorder

Original module: `backend/app/schemas/pages.py`. Bases: `BaseModel`.

```text
section_ids: Annotated[list[int], Field(min_length=1, max_length=100)]
```

#### PermissionOut

Original module: `backend/app/schemas/roles.py`. Bases: `ORMModel`.

```text
key: str
module: str
label: str
```

#### RoleOut

Original module: `backend/app/schemas/roles.py`. Bases: `BaseModel`.

```text
id: int
key: str
name: str
description: str | None
is_system: bool
is_super_admin: bool
permissions: list[str]
user_count: int
```

#### RoleCreate

Original module: `backend/app/schemas/roles.py`. Bases: `BaseModel`.

```text
key: Annotated[str, Field(min_length=2, max_length=64)]
name: Annotated[str, Field(min_length=2, max_length=100)]
description: Annotated[str | None, Field(max_length=500)] = None
permissions: list[str] = Field(default_factory=list)
```

Validators: `_key`.

#### RoleUpdate

Original module: `backend/app/schemas/roles.py`. Bases: `BaseModel`.

```text
name: Annotated[str | None, Field(min_length=2, max_length=100)] = None
description: Annotated[str | None, Field(max_length=500)] = None
permissions: list[str] | None = None
```

#### SeoPatch

Original module: `backend/app/schemas/seo.py`. Bases: `BaseModel`.

```text
seo_title: Annotated[str | None, Field(max_length=70)] = None
seo_description: Annotated[str | None, Field(max_length=320)] = None
canonical_url: Annotated[str | None, Field(max_length=500)] = None
og_title: Annotated[str | None, Field(max_length=120)] = None
og_description: Annotated[str | None, Field(max_length=320)] = None
og_image_id: int | None = None
og_image_alt: Annotated[str | None, Field(max_length=200)] = None
twitter_title: Annotated[str | None, Field(max_length=120)] = None
twitter_description: Annotated[str | None, Field(max_length=320)] = None
twitter_image_id: int | None = None
robots_index: bool | None = None
robots_follow: bool | None = None
```

#### RedirectInput

Original module: `backend/app/schemas/seo.py`. Bases: `BaseModel`.

```text
source_path: Annotated[str, Field(min_length=1, max_length=300)]
destination: Annotated[str, Field(min_length=1, max_length=500)]
status_code: Literal[301, 302] = 301
is_active: bool = True
note: Annotated[str | None, Field(max_length=200)] = None
```

#### RedirectPatch

Original module: `backend/app/schemas/seo.py`. Bases: `BaseModel`.

```text
source_path: Annotated[str | None, Field(min_length=1, max_length=300)] = None
destination: Annotated[str | None, Field(min_length=1, max_length=500)] = None
status_code: Literal[301, 302] | None = None
is_active: bool | None = None
note: Annotated[str | None, Field(max_length=200)] = None
confirm_automatic: bool = False
```

#### RedirectOut

Original module: `backend/app/schemas/seo.py`. Bases: `BaseModel`.

```text
id: int
source_path: str
destination: str
status_code: int
is_active: bool
is_automatic: bool
entity_type: str | None
entity_id: int | None
note: str | None
created_at: datetime
updated_at: datetime
```

#### SeoPreviewRequest

Original module: `backend/app/schemas/seo.py`. Bases: `BaseModel`.

```text
kind: Literal['page', 'service', 'country', 'coaching', 'article']
id: int
values: SeoPatch = Field(default_factory=SeoPatch)
```

#### UserOut

Original module: `backend/app/schemas/users.py`. Bases: `ORMModel`.

```text
id: int
email: str
full_name: str
is_active: bool
is_super_admin: bool
last_login_at: datetime | None
created_at: datetime
roles: list[RoleRef]
```

#### UserCreate

Original module: `backend/app/schemas/users.py`. Bases: `BaseModel`.

```text
email: EmailStr
full_name: FullName
password: str
role_ids: list[int] = Field(default_factory=list, max_length=20)
```

#### UserUpdate

Original module: `backend/app/schemas/users.py`. Bases: `BaseModel`.

```text
full_name: FullName | None = None
is_active: bool | None = None
role_ids: list[int] | None = Field(default=None, max_length=20)
```

#### EffectivePermissions

Original module: `backend/app/schemas/users.py`. Bases: `BaseModel`.

```text
user_id: int
is_super_admin: bool
permissions: list[str]
by_role: dict[str, list[str]]
```

#### StrictModel

Original module: `backend/app/sections/schemas.py`. Bases: `BaseModel`.

#### Link

Original module: `backend/app/sections/schemas.py`. Bases: `StrictModel`.

```text
label: Annotated[str, Field(min_length=1, max_length=40)]
href: Annotated[str, Field(min_length=1, max_length=500)]
```

#### TextStyle

Original module: `backend/app/sections/schemas.py`. Bases: `StrictModel`.

```text
size: Literal['s', 'm', 'l', 'xl'] = 'm'
size_mobile: Literal['s', 'm', 'l', 'xl'] | None = None
heading_weight: Literal['default', 'regular', 'medium', 'semibold', 'bold'] = 'default'
```

#### SectionBase

Original module: `backend/app/sections/schemas.py`. Bases: `StrictModel`.

```text
anchor_id: str | None = Field(default=None, description="In-page anchor, e.g. 'services'")
text: TextStyle | None = None
sample_content: bool = False
background_color: str | None = None
```

Validators: `_background_color`, `_anchor`.

#### HeadingFields

Original module: `backend/app/sections/schemas.py`. Bases: `SectionBase`.

```text
eyebrow: OptionalInlineShort = None
title: InlineShort
subtitle: OptionalInlineBody = None
```

#### HeroSlide

Original module: `backend/app/sections/schemas.py`. Bases: `StrictModel`.

```text
key: str = Field(description='Stable identifier used for ordering and analytics')
label: Annotated[str | None, Field(max_length=80)] = None
enabled: bool = True
eyebrow: OptionalShort = None
heading: ShortText
heading_emphasis: Annotated[str | None, Field(max_length=80)] = None
body: Annotated[str | None, Field(default=None, max_length=320)] = None
image_media_id: int | None = None
mobile_image_media_id: int | None = None
image_alt: Annotated[str | None, Field(max_length=200)] = None
image_position: ImagePosition = 'center'
overlay: Literal['strong', 'medium', 'soft'] = 'strong'
primary_cta: Link | None = None
secondary_cta: Link | None = None
```

Validators: `_key`, `_emphasis_in_heading`.

#### EmbeddedForm

Original module: `backend/app/sections/schemas.py`. Bases: `StrictModel`.

```text
enabled: bool = True
form_key: str
title: ShortText
subtitle: OptionalBody = None
```

#### HeroSliderConfig

Original module: `backend/app/sections/schemas.py`. Bases: `SectionBase`.

```text
slides: Annotated[list[HeroSlide], Field(min_length=1, max_length=10)]
autoplay: bool = True
interval_seconds: Annotated[int, Field(ge=4, le=20)] = 7
form: EmbeddedForm | None = None
layout: Literal['card', 'panel'] = 'card'
proof_points: Annotated[list[Annotated[str, Field(min_length=1, max_length=60)]], Field(max_length=3)] = Field(default_factory=list)
```

Validators: `_slides`.

#### ServicesConfig

Original module: `backend/app/sections/schemas.py`. Bases: `HeadingFields`.

```text
source: CollectionSource = 'featured'
service_ids: list[int] = Field(default_factory=list, max_length=24)
limit: Annotated[int, Field(ge=1, le=24)] = 6
cta: Link | None = None
layout: Literal['grid', 'list'] = 'grid'
background: Background = 'default'
```

#### CoachingConfig

Original module: `backend/app/sections/schemas.py`. Bases: `HeadingFields`.

```text
source: CollectionSource = 'featured'
coaching_ids: list[int] = Field(default_factory=list, max_length=24)
limit: Annotated[int, Field(ge=1, le=24)] = 6
card_cta_label: Annotated[str, Field(min_length=1, max_length=40)] = 'View course'
show_facts: bool = True
cta: Link | None = None
layout: Literal['grid', 'list'] = 'grid'
background: Background = 'default'
```

#### CountriesConfig

Original module: `backend/app/sections/schemas.py`. Bases: `HeadingFields`.

```text
source: CollectionSource = 'featured'
country_ids: list[int] = Field(default_factory=list, max_length=24)
limit: Annotated[int, Field(ge=1, le=24)] = 8
card_cta_label: Annotated[str, Field(min_length=1, max_length=40)] = 'Explore'
card_hover: Literal['reveal', 'none'] = 'reveal'
card_reveal_title: OptionalShort = None
card_click: Literal['enquire', 'page'] = 'enquire'
cta: Link | None = None
layout: Literal['editorial', 'grid'] = 'editorial'
background: Background = 'muted'
```

#### TestimonialsConfig

Original module: `backend/app/sections/schemas.py`. Bases: `HeadingFields`.

```text
source: CollectionSource | Literal['related'] = 'featured'
testimonial_ids: list[int] = Field(default_factory=list, max_length=12)
limit: Annotated[int, Field(ge=1, le=12)] = 6
layout: Literal['editorial', 'grid', 'carousel'] = 'editorial'
per_view: Literal[1, 2, 3] = 2
autoplay: bool = False
autoplay_interval: Annotated[int, Field(ge=4, le=12)] = 6
loop: bool = True
navigation: Literal['arrows', 'dots', 'both'] = 'both'
card_style: Literal['bordered', 'elevated', 'tinted'] = 'bordered'
quote_lines: Annotated[int, Field(ge=3, le=10)] = 5
show_rating: bool = True
show_photo: bool = True
background: Background = 'default'
```

#### FaqConfig

Original module: `backend/app/sections/schemas.py`. Bases: `HeadingFields`.

```text
source: Literal['all', 'selected'] = 'all'
faq_ids: list[int] = Field(default_factory=list, max_length=30)
category_slugs: list[str] = Field(default_factory=list, max_length=10)
limit: Annotated[int, Field(ge=1, le=30)] = 8
cta: Link | None = None
background: Background = 'subtle'
```

#### Stat

Original module: `backend/app/sections/schemas.py`. Bases: `StrictModel`.

```text
value: Annotated[str, Field(min_length=1, max_length=12)]
label: Annotated[str, Field(min_length=1, max_length=60)]
```

#### CtaFormConfig

Original module: `backend/app/sections/schemas.py`. Bases: `HeadingFields`.

```text
form_key: str
form_title: OptionalShort = None
highlights: list[Annotated[str, Field(min_length=1, max_length=90)]] = Field(default_factory=list, max_length=5)
stats: list[Stat] = Field(default_factory=list, max_length=4)
show_contact_details: bool = True
variant: Literal['ink', 'sand', 'light', 'editorial', 'black'] = 'ink'
image_media_id: int | None = None
steps_title: OptionalInlineShort = None
form_subtitle: OptionalInlineBody = None
submit_label: Annotated[str | None, Field(default=None, max_length=40)] = None
office_note: OptionalInlineShort = None
```

#### ParagraphBlock

Original module: `backend/app/sections/schemas.py`. Bases: `StrictModel`.

```text
type: Literal['paragraph']
text: Annotated[InlineText, Field(min_length=1, max_length=4000)]
```

#### HeadingBlock

Original module: `backend/app/sections/schemas.py`. Bases: `StrictModel`.

```text
type: Literal['heading']
level: Literal[2, 3] = 2
text: ShortText
```

#### ListBlock

Original module: `backend/app/sections/schemas.py`. Bases: `StrictModel`.

```text
type: Literal['list']
ordered: bool = False
items: Annotated[list[Annotated[InlineText, Field(min_length=1, max_length=500)]], Field(min_length=1, max_length=30)]
```

#### QuoteBlock

Original module: `backend/app/sections/schemas.py`. Bases: `StrictModel`.

```text
type: Literal['quote']
text: Annotated[InlineText, Field(min_length=1, max_length=1000)]
cite: Annotated[str | None, Field(max_length=120)] = None
```

#### CalloutBlock

Original module: `backend/app/sections/schemas.py`. Bases: `StrictModel`.

```text
type: Literal['callout']
tone: Literal['info', 'tip', 'warning'] = 'info'
title: Annotated[str | None, Field(max_length=120)] = None
text: Annotated[InlineText, Field(min_length=1, max_length=1500)]
```

#### RichTextConfig

Original module: `backend/app/sections/schemas.py`. Bases: `SectionBase`.

```text
eyebrow: OptionalInlineShort = None
title: OptionalInlineShort = None
subtitle: OptionalInlineBody = None
blocks: DocumentBlocks
width: Literal['narrow', 'regular'] = 'narrow'
table_of_contents: bool = False
effective_on: date | None = None
updated_on: date | None = None
```

#### HeroStat

Original module: `backend/app/sections/schemas.py`. Bases: `StrictModel`.

```text
icon_key: IconKey = None
value: Annotated[str, Field(min_length=1, max_length=12)]
label: Annotated[str, Field(min_length=1, max_length=60)]
note: Annotated[str | None, Field(max_length=120)] = None
```

#### InnerHeroConfig

Original module: `backend/app/sections/schemas.py`. Bases: `SectionBase`.

```text
eyebrow: OptionalShort = None
title: OptionalShort = None
description: Annotated[str | None, Field(default=None, max_length=400)] = None
layout: Literal['split', 'banner', 'minimal', 'editorial', 'closing'] = 'split'
image_side: Literal['left', 'right'] = 'right'
image_media_id: int | None = None
mobile_image_media_id: int | None = None
image_alt: Annotated[str | None, Field(max_length=200)] = None
image_position: ImagePosition = 'center'
overlay: Literal['soft', 'medium', 'strong'] = 'medium'
background: Literal['default', 'subtle', 'muted', 'ink'] = 'muted'
align: Literal['start', 'center'] = 'start'
show_breadcrumbs: bool = True
cta: Link | None = None
secondary_cta: Link | None = None
stats: list[HeroStat] = Field(default_factory=list, max_length=4)
```

#### ImageTextConfig

Original module: `backend/app/sections/schemas.py`. Bases: `SectionBase`.

```text
eyebrow: OptionalInlineShort = None
title: InlineShort
blocks: RichTextBlocks
image_media_id: int | None = None
image_alt: Annotated[str | None, Field(max_length=200)] = None
image_side: Literal['left', 'right'] = 'right'
image_shape: Literal['landscape', 'portrait', 'square'] = 'portrait'
layout: Literal['standard', 'editorial'] = 'standard'
cta: Link | None = None
background: Background = 'default'
```

#### FeatureItem

Original module: `backend/app/sections/schemas.py`. Bases: `StrictModel`.

```text
icon_key: IconKey = None
title: Annotated[str, Field(min_length=1, max_length=80)]
text: Annotated[InlineText | None, Field(max_length=400)] = None
link: Link | None = None
```

#### FeatureGridConfig

Original module: `backend/app/sections/schemas.py`. Bases: `HeadingFields`.

```text
items: Annotated[list[FeatureItem], Field(min_length=1, max_length=12)]
columns: Literal[2, 3, 4] = 3
style: Literal['cards', 'list', 'editorial'] = 'cards'
background: Literal['default', 'subtle', 'muted', 'inverse'] = 'default'
```

#### StatItem

Original module: `backend/app/sections/schemas.py`. Bases: `StrictModel`.

```text
value: Annotated[str, Field(min_length=1, max_length=40)]
label: Annotated[str, Field(min_length=1, max_length=80)]
note: Annotated[str | None, Field(max_length=160)] = None
```

#### StatsConfig

Original module: `backend/app/sections/schemas.py`. Bases: `SectionBase`.

```text
eyebrow: OptionalInlineShort = None
title: OptionalInlineShort = None
subtitle: OptionalInlineBody = None
items: Annotated[list[StatItem], Field(min_length=1, max_length=6)]
style: Literal['figures', 'facts'] = 'figures'
footnote: Annotated[str | None, Field(max_length=240)] = None
background: Background = 'subtle'
```

#### ProcessStep

Original module: `backend/app/sections/schemas.py`. Bases: `StrictModel`.

```text
title: Annotated[str, Field(min_length=1, max_length=80)]
text: Annotated[InlineText | None, Field(max_length=400)] = None
```

#### ProcessStepsConfig

Original module: `backend/app/sections/schemas.py`. Bases: `HeadingFields`.

```text
steps: Annotated[list[ProcessStep], Field(min_length=2, max_length=10)]
layout: Literal['timeline', 'columns', 'editorial'] = 'timeline'
cta: Link | None = None
background: Background = 'default'
```

#### ContactInfoConfig

Original module: `backend/app/sections/schemas.py`. Bases: `HeadingFields`.

```text
show_phone: bool = True
show_email: bool = True
show_whatsapp: bool = True
show_hours: bool = True
show_social: bool = True
form_key: str | None = None
form_title: OptionalShort = None
form_subtitle: OptionalBody = None
background: Background = 'default'
```

#### LocationsConfig

Original module: `backend/app/sections/schemas.py`. Bases: `HeadingFields`.

```text
source: Literal['all', 'selected'] = 'all'
location_ids: list[int] = Field(default_factory=list, max_length=20)
map: Literal['none', 'links', 'embed'] = 'links'
layout: Literal['cards', 'editorial'] = 'cards'
background: Background = 'subtle'
```

#### BlogConfig

Original module: `backend/app/sections/schemas.py`. Bases: `SectionBase`.

```text
eyebrow: OptionalShort = None
title: OptionalShort = None
subtitle: OptionalBody = None
source: Literal['index', 'latest', 'featured', 'selected'] = 'latest'
article_ids: list[int] = Field(default_factory=list, max_length=12)
category_id: int | None = None
limit: Annotated[int, Field(ge=1, le=12)] = 3
page_size: Annotated[int, Field(ge=3, le=24)] = 9
featured_count: Annotated[int, Field(ge=0, le=3)] = 1
show_search: bool = True
show_filters: bool = True
cta: Link | None = None
background: Background = 'default'
```

#### ImageBlock

Original module: `backend/app/sections/schemas.py`. Bases: `StrictModel`.

```text
type: Literal['image']
media_id: int
alt: Annotated[str | None, Field(max_length=200)] = None
caption: Annotated[str | None, Field(max_length=300)] = None
size: Literal['content', 'wide'] = 'content'
```

#### ButtonBlock

Original module: `backend/app/sections/schemas.py`. Bases: `StrictModel`.

```text
type: Literal['button']
link: Link
style: Literal['primary', 'secondary'] = 'primary'
```

#### DividerBlock

Original module: `backend/app/sections/schemas.py`. Bases: `StrictModel`.

```text
type: Literal['divider']
```

#### ArticleBody

Original module: `backend/app/sections/schemas.py`. Bases: `StrictModel`.

```text
blocks: Annotated[list[ArticleBlock], Field(max_length=400)]
```

#### ArticleCta

Original module: `backend/app/sections/schemas.py`. Bases: `StrictModel`.

```text
title: ShortText
text: Annotated[str | None, Field(max_length=400)] = None
link: Link | None = None
form_key: str | None = None
```

Validators: `_has_action`.

#### SuccessStoriesConfig

Original module: `backend/app/sections/schemas.py`. Bases: `HeadingFields`.

```text
source: CollectionSource = 'all'
story_ids: list[int] = Field(default_factory=list, max_length=24)
limit: Annotated[int, Field(ge=1, le=24)] = 6
layout: Literal['alternating', 'spotlight', 'cards'] = 'alternating'
show_full_story: bool = True
show_gallery: bool = True
cta: Link | None = None
background: Background = 'default'
```

#### GalleryItem

Original module: `backend/app/sections/schemas.py`. Bases: `StrictModel`.

```text
media_id: int
caption: Annotated[str | None, Field(max_length=200)] = None
alt: Annotated[str | None, Field(max_length=200)] = None
```

#### GalleryConfig

Original module: `backend/app/sections/schemas.py`. Bases: `SectionBase`.

```text
eyebrow: OptionalShort = None
title: OptionalShort = None
subtitle: OptionalBody = None
source: Literal['manual', 'stories'] = 'manual'
items: list[GalleryItem] = Field(default_factory=list, max_length=60)
limit: Annotated[int, Field(ge=1, le=60)] = 24
layout: Literal['masonry', 'mosaic', 'grid'] = 'masonry'
columns: Literal[2, 3, 4] = 3
show_captions: bool = True
background: Background = 'default'
```

Validators: `_items`.

#### VideoTestimonialsConfig

Original module: `backend/app/sections/schemas.py`. Bases: `HeadingFields`.

```text
source: CollectionSource = 'all'
testimonial_ids: list[int] = Field(default_factory=list, max_length=12)
limit: Annotated[int, Field(ge=1, le=12)] = 6
layout: Literal['feature', 'grid'] = 'feature'
show_quotes: bool = True
background: Background = 'muted'
```

#### WorldMapConfig

Original module: `backend/app/sections/schemas.py`. Bases: `HeadingFields`.

```text
source: CollectionSource = 'all'
country_ids: list[int] = Field(default_factory=list, max_length=40)
origin_label: OptionalShort = None
origin_lat: Annotated[float | None, Field(ge=-85, le=85)] = None
origin_lng: Annotated[float | None, Field(ge=-180, le=180)] = None
show_counts: bool = True
cta: Link | None = None
variant: Literal['red', 'ink'] = 'red'
```

Validators: `_origin`.

#### WebsiteReel

Original module: `backend/app/sections/schemas.py`. Bases: `StrictModel`.

```text
url: Annotated[str, Field(min_length=1, max_length=300)]
image_media_id: int
caption: Annotated[str | None, Field(max_length=300)] = None
kind: Literal['reel', 'post'] = 'reel'
```

Validators: `_caption`.

#### InstagramReelsConfig

Original module: `backend/app/sections/schemas.py`. Bases: `HeadingFields`.

```text
limit: Annotated[int, Field(ge=1, le=12)] = 4
show_profile_link: bool = True
background: Background = 'subtle'
hidden_reel_ids: list[ReelId] = Field(default_factory=list, max_length=100)
website_reels: list[WebsiteReel] = Field(default_factory=list, max_length=12)
website_reels_position: Literal['first', 'last'] = 'first'
```

Validators: `_reel_ids`.

#### ExamVouchersConfig

Original module: `backend/app/sections/schemas.py`. Bases: `HeadingFields`.

```text
tone: Literal['charcoal', 'paper'] = 'charcoal'
```

#### MilestoneStat

Original module: `backend/app/sections/schemas.py`. Bases: `StrictModel`.

```text
value: Annotated[str, Field(min_length=1, max_length=20)]
label: Annotated[str, Field(min_length=1, max_length=60)]
```

#### MilestoneBadge

Original module: `backend/app/sections/schemas.py`. Bases: `StrictModel`.

```text
icon: MilestoneIcon | None = None
label: Annotated[str, Field(min_length=1, max_length=60)]
```

#### Milestone

Original module: `backend/app/sections/schemas.py`. Bases: `StrictModel`.

```text
year: Annotated[str, Field(min_length=1, max_length=12)]
category: OptionalShort = None
tagline: Annotated[str | None, Field(default=None, max_length=80)] = None
title: ShortText
description: OptionalBody = None
stats: list[MilestoneStat] = Field(default_factory=list, max_length=3)
badges: list[MilestoneBadge] = Field(default_factory=list, max_length=4)
destinations: list[Annotated[str, Field(min_length=1, max_length=40)]] = Field(default_factory=list, max_length=8)
quote: Annotated[str | None, Field(default=None, max_length=300)] = None
image_media_id: int | None = None
theme: Literal['light', 'dark', 'midnight', 'navy'] = 'light'
```

#### MilestonesConfig

Original module: `backend/app/sections/schemas.py`. Bases: `SectionBase`.

```text
eyebrow: OptionalShort = None
summary_label: Annotated[str | None, Field(default=None, max_length=60)] = None
destinations_label: Annotated[str | None, Field(default=None, max_length=60)] = None
items: Annotated[list[Milestone], Field(min_length=1, max_length=8)]
```

#### GuidanceBannerConfig

Original module: `backend/app/sections/schemas.py`. Bases: `HeadingFields`.

```text
cta: Link | None = None
secondary_cta: Link | None = None
```

### Validation helper map

Original helper names and source locations (use the domain rules above for their purpose; implement and test the complete target equivalent):

- `slugify` — `backend/app/schemas/blog.py`
- `_blank` — `backend/app/schemas/blog.py`
- `validate_slug` — `backend/app/schemas/common.py`
- `validate_optional_slug` — `backend/app/schemas/common.py`
- `_https` — `backend/app/schemas/content.py`
- `_blank_to_none` — `backend/app/schemas/content.py`
- `partial` — `backend/app/schemas/content.py`
- `validate_fields` — `backend/app/schemas/forms.py`
- `_validate_slug` — `backend/app/schemas/pages.py`
- `_validate_optional_slug` — `backend/app/schemas/pages.py`
- `validate_canonical` — `backend/app/schemas/seo.py`
- `blank_to_none` — `backend/app/schemas/seo.py`
- `validate_href` — `backend/app/sections/schemas.py`
- `validate_target` — `backend/app/sections/schemas.py`
- `validate_inline` — `backend/app/sections/schemas.py`
- `_icon` — `backend/app/sections/schemas.py`
- `canonical_instagram_post` — `backend/app/sections/schemas.py`

### Design-token declarations

These are reference-client values to adapt, not mandatory branding. Repeated names represent source overrides; apply them in the intended responsive/reduced-motion scopes when implementing. This flat catalog does not preserve the CSS selector/media-query context and is not a stylesheet to paste.

```css
--color-mobile-nav-bg: #faf9f6;
--color-mobile-nav-text: #292728;
--color-mobile-nav-backdrop: rgb(15 15 15 / 0.48);
--color-red-700: #941b2b;
--color-red-600: #af2334;
--color-red-500: #c51f2f;
--color-red-400: #e5606b;
--color-red-300: #ffa5ad;
--color-red-200: #ffd6da;
--color-red-50: #fff1f2;
--color-blue-700: #2346a0;
--color-blue-600: #3059bd;
--color-blue-300: #b4caff;
--color-blue-50: #edf2fc;
--color-charcoal-950: #151517;
--color-charcoal-900: #202023;
--color-charcoal-800: #303034;
--color-charcoal-700: #46464c;
--color-neutral-500: #686870;
--color-neutral-200: #dddde0;
--color-neutral-100: #efefef;
--color-neutral-50: #f7f6f3;
--color-white: #ffffff;
--color-sand-100: #f0efec;
--color-sand-200: #e7e5e1;
--color-sand-300: #d4d1cd;
--color-gold-500: #b8893b;
--color-whatsapp: #25d366;
--rgb-white: 255 255 255;
--rgb-black: 0 0 0;
--rgb-charcoal-950: 21 21 23;
--rgb-red-500: 197 31 47;
--rgb-red-600: 175 35 52;
--rgb-blue-300: 180 202 255;
--rgb-blue-600: 48 89 189;
--rgb-neutral-50: 247 246 243;
--rgb-header-bg: 252 251 250;
--rgb-gold-400: 180 135 74;
--rgb-stone-300: 205 197 182;
--rgb-gray-950: 20 20 20;
--rgb-backdrop: 15 20 28;
--rgb-hero-scrim: 9 13 17;
--rgb-hero-shade: 11 27 38;
--rgb-lightbox: 12 12 14;
--rgb-sticker-shadow: 25 35 40;
--rgb-whatsapp: 37 211 102;
--color-bg: var(--color-white);
--color-bg-subtle: var(--color-neutral-50);
--color-bg-muted: var(--color-sand-100);
--color-bg-inverse: var(--color-charcoal-950);
--color-text: var(--color-charcoal-950);
--color-text-secondary: #505057;
--color-text-muted: #696970;
--color-text-inverse: var(--color-white);
--color-text-inverse-strong: rgb(var(--rgb-white) / 0.82);
--color-text-inverse-muted: rgb(var(--rgb-white) / 0.74);
--color-text-inverse-subtle: rgb(var(--rgb-white) / 0.62);
--color-danger-bg-inverse: rgb(var(--rgb-red-600) / 0.16);
--color-accent-wash: rgb(var(--rgb-red-600) / 0.08);
--color-accent-wash-faint: rgb(var(--rgb-red-600) / 0.035);
--color-text-accent: var(--color-red-700);
--color-text-accent-inverse: var(--color-red-300);
--color-border: #deddda;
--color-border-strong: #bdbbc0;
--color-border-inverse: rgb(var(--rgb-white) / 0.16);
--color-primary: var(--color-red-600);
--color-primary-hover: var(--color-red-700);
--color-primary-contrast: var(--color-white);
--color-accent: var(--color-red-600);
--color-accent-hover: var(--color-red-700);
--color-accent-contrast: var(--color-white);
--color-success: #17613f;
--color-success-bg: #e6f2eb;
--color-warning: #80500d;
--color-warning-bg: #fbefdc;
--color-danger: #a9222b;
--color-danger-hover: #861922;
--color-danger-bg: #fff0f1;
--color-info: var(--color-blue-700);
--color-info-bg: var(--color-blue-50);
--color-focus: var(--color-blue-600);
--color-info-border: #c9d8ee;
--color-warning-border: #efd6b0;
--color-danger-border: #f0c4bf;
--color-status-warning-dot: #c0841c;
--color-status-neutral-dot: #a3a3aa;
--color-rating: var(--color-gold-500);
--color-bg-paper: #f6f3ef;
--color-bg-stone: #efebe6;
--color-primary-tint: #fff6f6;
--color-active-tint: #fff2f3;
--color-highlight-bg: #fff5f6;
--color-highlight-bg-strong: #ffe3e6;
--color-header-bg: #fcfbfa;
--color-header-border: #ececec;
--color-footer-top: #8e2429;
--color-footer-mid: #791a1f;
--color-footer-bottom: #5a1015;
--color-footer-heading: rgb(var(--rgb-white) / 0.66);
--color-footer-text: rgb(var(--rgb-white) / 0.84);
--color-footer-muted: rgb(var(--rgb-white) / 0.74);
--color-footer-child: #ebc5c8;
--color-footer-child-rule: #ba626a;
--color-footer-rule: rgb(var(--rgb-white) / 0.15);
--color-overlay: rgb(var(--rgb-charcoal-950) / 0.55);
--color-milestone-light-bg: #f5f6f1;
--color-milestone-light-text: #111827;
--color-milestone-light-accent: #991b1b;
--color-milestone-dark-bg: #0f172a;
--color-milestone-midnight-bg: #0d131f;
--color-milestone-navy-bg: #080c16;
--color-milestone-on-dark: #f8fafc;
--color-milestone-amber: #f59e0b;
--color-milestone-sky: #38bdf8;
--color-cta-bg: #1a1a1a;
--color-cta-bg-hover: #333333;
--color-hero-field-border: #dcdad6;
--color-hero-field-border-hover: #b4b1ac;
--color-hero-field-placeholder: #8b8b92;
--color-hero-field-icon: #55555c;
--color-paper-rule: #cfc8c1;
--color-paper-rule-hover: #a59d95;
--color-paper-icon: #6b6b72;
--color-serp-url: #3c4043;
--color-serp-title: #1a0dab;
--color-serp-text: #4d5156;
--font-display: "InterVariable", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
--font-sans: "InterVariable", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
--font-mono: ui-monospace, SFMono-Regular, Menlo, monospace;
--font-weight-regular: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
--font-weight-extrabold: 800;
--font-weight-black: 900;
--line-height-tight: 1.1;
--line-height-display: 1.04;
--line-height-snug: 1.25;
--line-height-normal: 1.5;
--line-height-relaxed: 1.65;
--letter-spacing-tight: -0.015em;
--letter-spacing-eyebrow: 0.14em;
--space-0-5: 0.125rem;
--space-1: 0.25rem;
--space-1-5: 0.375rem;
--space-2: 0.5rem;
--space-2-5: 0.625rem;
--space-3: 0.75rem;
--space-4: 1rem;
--space-5: 1.25rem;
--space-6: 1.5rem;
--space-8: 2rem;
--space-10: 2.5rem;
--space-12: 3rem;
--space-16: 4rem;
--space-20: 5rem;
--space-24: 6rem;
--section-space: clamp(2.5rem, 1.75rem + 3.5vw, 7.5rem);
--section-space-tight: clamp(1.75rem, 1.25rem + 2.5vw, 5rem);
--measure-narrow: 32rem;
--action-min-width: 15rem;
--action-height: 52px;
--action-height-mobile: 48px;
--action-height-compact: 44px;
--action-padding: 26px;
--action-padding-mobile: 22px;
--action-padding-compact: 20px;
--color-border-inverse-strong: rgb(var(--rgb-white) / 0.6);
--color-inverse-wash: rgb(var(--rgb-white) / 0.1);
--glass-bg: rgb(var(--rgb-header-bg) / 0.72);
--glass-bg-strong: rgb(var(--rgb-header-bg) / 0.82);
--glass-filter: saturate(160%) blur(16px);
--glass-border: rgb(var(--rgb-charcoal-950) / 0.08);
--glass-filter-strong: saturate(160%) blur(24px);
--container-max: 1240px;
--container-narrow: 760px;
--container-gutter: clamp(1rem, 0.5rem + 2.5vw, 2rem);
--header-height: 80px;
--header-height-scrolled: 68px;
--admin-sidebar-width: 264px;
--admin-sidebar-collapsed: 72px;
--admin-topbar-height: 64px;
--radius-xs: 3px;
--radius-sm: 4px;
--radius-md: 6px;
--radius-public: 8px;
--radius-action: 6px;
--radius-lg: 10px;
--radius-full: 999px;
--border-width: 1px;
--shadow-xs: 0 1px 2px rgb(var(--rgb-charcoal-950) / 0.05);
--shadow-sm: 0 1px 3px rgb(var(--rgb-charcoal-950) / 0.06), 0 1px 2px rgb(var(--rgb-charcoal-950) / 0.04);
--shadow-md: 0 6px 16px -4px rgb(var(--rgb-charcoal-950) / 0.1), 0 2px 4px rgb(var(--rgb-charcoal-950) / 0.04);
--shadow-lg: 0 24px 48px -16px rgb(var(--rgb-charcoal-950) / 0.22), 0 4px 10px rgb(var(--rgb-charcoal-950) / 0.05);
--shadow-focus: 0 0 0 3px rgb(var(--rgb-blue-600) / 0.26);
--ease-out: cubic-bezier(0.22, 0.8, 0.24, 1);
--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
--ease-in-out-sine: cubic-bezier(0.45, 0, 0.55, 1);
--ease-out-soft: cubic-bezier(0.22, 1, 0.36, 1);
--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
--duration-fast: 150ms;
--duration-base: 240ms;
--duration-slow: 420ms;
--duration-slide: 600ms;
--duration-quick: 180ms;
--duration-action: 220ms;
--duration-press: 100ms;
--duration-reveal: 500ms;
--duration-stagger: 100ms;
--rise-distance: 20px;
--input-height: 46px;
--input-height-sm: 38px;
--input-bg: var(--color-white);
--input-border: var(--color-border-strong);
--input-border-hover: var(--color-neutral-500);
--input-border-focus: var(--color-focus);
--input-border-invalid: var(--color-danger);
--input-bg-disabled: var(--color-sand-100);
--input-placeholder: #69747d;
--input-height-lg: var(--action-height);
--input-focus-ring: var(--shadow-focus);
--color-text-glass: rgb(var(--rgb-charcoal-950) / 0.74);
--color-rule-glass: rgb(var(--rgb-charcoal-950) / 0.14);
--input-glass-height: 50px;
--input-glass-focus-ring: 0 0 0 3px rgb(var(--rgb-red-500) / 0.12);
--input-underline-height: 44px;
--input-underline-box-border: rgb(var(--rgb-gray-950) / 0.14);
--input-underline-box-bg: rgb(var(--rgb-white) / 0.32);
--input-underline-focus-ring: 0 0 0 3px rgb(var(--rgb-red-500) / 0.1);
--input-inverse-bg: rgb(var(--rgb-white) / 0.04);
--input-inverse-border: rgb(var(--rgb-white) / 0.2);
--input-inverse-border-hover: rgb(var(--rgb-white) / 0.38);
--input-inverse-placeholder: rgb(var(--rgb-white) / 0.5);
--input-inverse-focus-ring: 0 0 0 3px rgb(var(--rgb-red-600) / 0.35);
--z-header: 40;
--z-dropdown: 50;
--z-drawer: 60;
--z-dialog: 70;
--z-toast: 80;
--text-scale: the site-wide text size (Settings → Branding;
--site-text-scale: var(--site-text-scale-desktop, 1);
--text-scale: var(--site-text-scale);
--site-text-scale: var(--site-text-scale-mobile, var(--site-text-scale-desktop, 1));
--font-size-2xs: calc(0.6875rem * var(--text-scale));
--font-size-xs: calc(0.75rem * var(--text-scale));
--font-size-caption: calc(0.8125rem * var(--text-scale));
--font-size-sm: calc(0.875rem * var(--text-scale));
--font-size-base: calc(1rem * var(--text-scale));
--font-size-md: calc(1.0625rem * var(--text-scale));
--font-size-lg: calc(1.1875rem * var(--text-scale));
--font-size-xl: calc(1.375rem * var(--text-scale));
--font-size-2xl: calc(clamp(1.2rem, 1.05rem + 0.75vw, 1.875rem) * var(--text-scale));
--font-size-3xl: calc(clamp(1.375rem, 1.1rem + 1.4vw, 3rem) * var(--text-scale));
--font-size-4xl: calc(clamp(1.8rem, 1.25rem + 2.75vw, 4.35rem) * var(--text-scale));
--font-size-display: calc(clamp(1.85rem, 1.25rem + 2.8vw, 3.875rem) * var(--text-scale));
--action-font-size: calc(0.9375rem * var(--text-scale));
--text-scale: calc(var(--site-text-scale, 1) * var(--section-scale, 1));
--text-scale: calc(var(--site-text-scale, 1) * var(--section-scale-mobile, var(--section-scale, 1)));
--font-size-base: calc(0.9375rem * var(--text-scale));
--font-size-md: calc(1rem * var(--text-scale));
--font-size-lg: calc(1.0625rem * var(--text-scale));
--font-size-xl: calc(1.1875rem * var(--text-scale));
--duration-fast: 0ms;
--duration-base: 0ms;
--duration-slow: 0ms;
--duration-slide: 0ms;
--duration-quick: 0ms;
--duration-action: 0ms;
--duration-press: 0ms;
--duration-reveal: 0ms;
--duration-stagger: 0ms;
--rise-distance: 0px;
```

### Original migration chain

This is historical naming/order only. Create a new target migration history or inspect complete original operations before intentionally reusing them; do not execute names as migration code.

| Revision | Parent | Source |
| --- | --- | --- |
| 0001 | None | backend/alembic/versions/0001_website_cms_foundation.py |
| 0002 | 0001 | backend/alembic/versions/0002_phase_2_content_and_media_fields.py |
| 0003 | 0002 | backend/alembic/versions/0003_page_revisions.py |
| 0004 | 0003 | backend/alembic/versions/0004_website_locations.py |
| 0005 | 0004 | backend/alembic/versions/0005_country_links_and_slug_history.py |
| 0006 | 0005 | backend/alembic/versions/0006_blog_publishing.py |
| 0007 | 0006 | backend/alembic/versions/0007_seo_and_redirects.py |
| 0008 | 0007 | backend/alembic/versions/0008_success_stories_and_video_testimonials.py |
| 0009 | 0008 | backend/alembic/versions/0009_country_map_position.py |
| 0010 | 0009 | backend/alembic/versions/0010_country_card_highlights.py |
| 0011 | 0010 | backend/alembic/versions/0011_about_editorial_draft.py |
| 0012 | 0011 | backend/alembic/versions/0012_enquiry_notifications.py |
| 0013 | 0012 | backend/alembic/versions/0013_outbox_available_at_precision.py |
| 0014 | 0013 | backend/alembic/versions/0014_legal_document_drafts.py |
| 0015 | 0014 | backend/alembic/versions/0015_coaching_courses.py |
| 0016 | 0015 | backend/alembic/versions/0016_sample_coaching_courses.py |
| 0017 | 0016 | backend/alembic/versions/0017_lms_reels_and_vouchers.py |
| 0018 | 0017 | backend/alembic/versions/0018_demo_reels_on_live_site.py |
| 0019 | 0018 | backend/alembic/versions/0019_coaching_link_behavior.py |
| 0020 | 0019 | backend/alembic/versions/0020_about_hero_stats.py |
| 0021 | 0020 | backend/alembic/versions/0021_about_milestones_and_banner.py |

## Completion standard

Deliver the requested working artifact. Explain what changed, why, which relevant checks actually ran and what remains unverified. A new project needs its own identity, configuration examples without credentials, complete requested public/admin journeys and the agreed handoff scope. This file supplies a thorough reusable engineering baseline; current implementation, supported vendor documentation and real outcome evidence remain necessary for each project.

Standalone consolidation: 2026-11-11. This maintenance change combines guidance/templates/contracts into one file; it does not change application code, rerun application tests or establish live provider/deployment health. Earlier package-specific checks in the historical evidence refer to the original multi-file audit.
