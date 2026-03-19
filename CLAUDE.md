# LearnLoop — CLAUDE.md

## Commands

```bash
npm run dev      # Start dev server (Next.js, port 3000)
npm run build    # Production build
npm run lint     # ESLint
```

## Database

SQLite via Drizzle ORM. DB file: `./data/sqlite.db` (or `DATABASE_URL` env var).

```bash
npx drizzle-kit generate   # Generate migration from schema changes
npx drizzle-kit migrate    # Apply migrations
npx drizzle-kit studio     # Visual schema browser
```

## Environment Variables

```
ANTHROPIC_API_KEY=...   # Required — used in lib/claude.ts for question generation
DATABASE_URL=...        # Optional — defaults to ./data/sqlite.db
```

## Architecture

Next.js 16 App Router. Three layers:
- **app/** — pages and API routes
- **components/** — UI components (question-card, setup-wizard, session-card, etc.)
- **lib/** — business logic (claude.ts, db/schema.ts, subjects.ts, utils.ts)

Key API routes:
- `POST /api/sessions` — creates session + generates all questions via Claude in one shot
- `POST /api/sessions/[id]/answers` — submits answer, updates score
- `POST /api/profiles/[id]/select` — sets `profile_id` cookie (cookie-based auth)

## Gotchas

- **Phosphor icons import**: Use `@phosphor-icons/react` (root import) — not `/dist/ssr`. Works in both server and client components.
- **SQLite column additions**: `drizzle-kit push/migrate` both fail on existing DBs when adding columns. Use sqlite3 CLI directly: `sqlite3 ./data/sqlite.db "ALTER TABLE <table> ADD COLUMN <col> <type> DEFAULT <val>;"`
- **Vercel incompatible with SQLite**: Vercel's serverless filesystem is ephemeral — SQLite DB is lost between requests. For Vercel, swap to Postgres (Neon/Supabase). For SQLite, use Fly.io or Railway with a persistent volume (Dockerfile already present).
- **Tailwind v4 static scanning**: `lib/subjects.ts` writes out full Tailwind class strings (no dynamic construction). Never use string interpolation for Tailwind classes — the scanner won't pick them up.
- **Claude JSON extraction**: `lib/claude.ts` extracts JSON with a regex (`/\[[\s\S]*\]/`) from raw Claude text. No structured output/tool use.
- **Auth is cookie-only**: `middleware.ts` checks the `profile_id` cookie. No session tokens or JWT.
- **Questions generated upfront**: All questions for a session are generated in a single Claude call at session creation (`POST /api/sessions`), not on-the-fly.
- **DB connection**: `lib/db/index.ts` — synchronous `better-sqlite3` (not async).

## Key Files

| File | Purpose |
|------|---------|
| `lib/subjects.ts` | Single source of truth for subjects, topics, card styles |
| `lib/claude.ts` | Anthropic SDK client + per-subject prompts |
| `lib/db/schema.ts` | All table definitions (profiles, sessions, questions, answers) |
| `middleware.ts` | Cookie-based auth guard (redirects to /profile-picker) |
| `components/question-card.tsx` | Core interactive UI — hint/solve/submit flow |
