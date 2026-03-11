# Math Helper

AI-powered math practice for students in grades 3–8. Generates personalized multiple-choice questions using Claude, tracks progress across sessions, and supports multiple student profiles.

## Features

- **AI-generated questions** — Claude creates unique, grade-appropriate problems every session (arithmetic, fractions, geometry, word problems, algebra)
- **Adaptive difficulty** — Easy, Medium, and Hard tiers with distinct prompting strategies
- **Two session modes** — Practice by question count or against a time limit
- **Hints & step-by-step solutions** — Optional help at any point, tracked per answer
- **Multiple profiles** — Switch between student profiles; each has its own session history and theme preference
- **Session history & scoring** — Full review of past sessions with per-question answer breakdown
- **Dark / light mode** — Per-profile theme preference, persisted via cookie

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| AI | Anthropic Claude API (`claude-opus-4-6`) |
| Database | SQLite via `better-sqlite3` |
| ORM | Drizzle ORM |
| Styling | Tailwind CSS v4 |
| UI primitives | Radix UI (Dialog, Progress, Slot) |
| Icons | Lucide React |
| Fonts | Bricolage Grotesque (headings) + Nunito (body) via `next/font` |

## Project Structure

```
app/
  layout.tsx              # Root layout — fonts, header, dark mode
  page.tsx                # Home dashboard — hero, stats, session list
  setup/page.tsx          # 4-step session setup wizard
  session/[id]/page.tsx   # Active session — question card, progress, timer
  results/[id]/page.tsx   # Results summary with per-question review
  history/page.tsx        # Full session history
  profile-picker/page.tsx # Profile selection / creation
  api/
    sessions/             # POST (create + generate questions), GET, PATCH
    sessions/[id]/answers # POST (submit answer, update score)
    profiles/             # POST (create profile)
    profiles/[id]/        # PATCH (update profile)
    profiles/[id]/select  # POST (set active profile cookie)

components/
  question-card.tsx       # Interactive question with hint/solve/submit flow
  session-card.tsx        # Session summary card with status accent border
  setup-wizard.tsx        # Multi-step form (grade → difficulty → mode → start)
  results-summary.tsx     # Score breakdown and answer review
  timer.tsx               # Countdown timer with warning states
  profile-picker.tsx      # Profile grid with avatar display
  user-menu.tsx           # Header dropdown — theme toggle, profile switch
  ui/                     # Base components: Button, Card, Badge, Dialog, Progress

lib/
  claude.ts               # Anthropic SDK client + question generation prompt
  db/index.ts             # SQLite connection, Drizzle setup, auto-migration
  db/schema.ts            # Table definitions: profiles, sessions, questions, answers
  utils.ts                # cn(), difficultyColor(), formatDate(), formatTime()
  avatars.ts              # Avatar emoji set for profiles
```

## Database Schema

Four tables, all in a local SQLite file (`data/sqlite.db` by default):

- **profiles** — name, avatar, grade/difficulty preferences, theme
- **sessions** — grade level, difficulty, mode, status (`active` / `completed` / `quit`), score, progress index
- **questions** — generated question text, type, choices (JSON), correct answer, explanation, hint
- **answers** — user's answer per question, correctness, hint/solve usage flags

The database self-migrates on startup — no migration step needed.

## How Question Generation Works

On session creation (`POST /api/sessions`), the server calls `generateQuestions()` in `lib/claude.ts`. This sends a structured prompt to `claude-opus-4-6` specifying:

- Grade-appropriate topic list (e.g. Grade 6: ratios, percentages, negative numbers…)
- Difficulty instructions (single-step / multi-step / complex word problems)
- Output schema: `questionText`, `questionType`, `requiresPaper`, `choices[4]`, `correctAnswer`, `explanation`, `hint`

Claude returns a JSON array. The questions are validated, stored in the database, and the session begins immediately.

## Getting Started

### Prerequisites

- Node.js 18+
- An [Anthropic API key](https://console.anthropic.com/)

### Setup

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
# Add your key: ANTHROPIC_API_KEY=sk-ant-...

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The SQLite database and `data/` directory are created automatically on first run.

### Environment Variables

| Variable | Required | Description |
|---|---|---|
| `ANTHROPIC_API_KEY` | Yes | Your Anthropic API key |
| `DATABASE_URL` | No | Path to SQLite file (default: `./data/sqlite.db`) |

### Scripts

```bash
npm run dev      # Development server (Turbopack)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint
```

## API Routes

| Method | Route | Description |
|---|---|---|
| `POST` | `/api/sessions` | Create session and generate questions via Claude |
| `GET` | `/api/sessions/[id]` | Fetch session, questions, and answers |
| `PATCH` | `/api/sessions/[id]` | Update session status (complete / quit) |
| `POST` | `/api/sessions/[id]/answers` | Submit an answer, update score |
| `GET` | `/api/profiles` | List all profiles |
| `POST` | `/api/profiles` | Create a new profile |
| `PATCH` | `/api/profiles/[id]` | Update profile preferences or theme |
| `POST` | `/api/profiles/[id]/select` | Set active profile (writes cookie) |
