# LearnLoop

AI-powered practice for students in grades 5–12. Generates personalised multiple-choice questions using Claude across Math, Science, and English — tuned to each student's grade level and difficulty preference.

## Features

- **Multi-subject** — Math (Algebra, Geometry, Statistics, Trigonometry…), Science (Biology, Chemistry, Physics, Earth Science), and English (Grammar, Vocabulary, Reading Comprehension, Writing)
- **AI-generated questions** — Claude creates unique, grade-appropriate problems every session with no repetition
- **Subtopic filter** — Focus a session on a specific area within each subject, or pick Mixed for variety
- **Adaptive difficulty** — Easy, Medium, and Hard tiers with distinct prompting strategies per subject
- **Two session modes** — Practice by question count or against a time limit
- **Hints & step-by-step solutions** — Optional help at any point, tracked per answer
- **Multiple profiles** — Switch between student profiles; each has its own session history and theme preference
- **Session history & scoring** — Full review of past sessions with per-question answer breakdown and subject badges
- **Public landing page** — No login required to explore; profile selection only happens when starting a session
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
| Icons | Phosphor Icons (duotone) + Lucide React |
| Fonts | Caveat (headings, handwritten) + Inter (body) via `next/font` |

## Project Structure

```
app/
  layout.tsx              # Root layout — fonts, nav, dark mode toggle
  page.tsx                # Public landing page — split hero with subject quick-pick
  subjects/page.tsx       # Subject picker (requires profile)
  setup/page.tsx          # Session setup wizard (grade → topic → difficulty → mode → start)
  session/[id]/page.tsx   # Active session — question card, progress, timer
  results/[id]/page.tsx   # Results summary with per-question review
  history/page.tsx        # Full session history with subject badges
  profile-picker/page.tsx # Profile selection / creation
  api/
    sessions/             # POST (create + generate questions), GET, PATCH
    sessions/[id]/answers # POST (submit answer, update score)
    profiles/             # POST (create profile), GET
    profiles/[id]/        # PATCH (update profile)
    profiles/[id]/select  # POST (set active profile cookie)

components/
  subject-picker.tsx      # Subject selection grid (Math / Science / English)
  question-card.tsx       # Interactive question with hint/solve/submit flow
  session-card.tsx        # Session summary card with status border + subject badge
  setup-wizard.tsx        # Multi-step form (grade → topic → difficulty → mode → start)
  results-summary.tsx     # Score breakdown and answer review
  timer.tsx               # Countdown timer with warning states
  profile-picker.tsx      # Profile grid with avatar display and skeleton loading
  user-menu.tsx           # Header dropdown — theme toggle, profile switch
  ui/                     # Base components: Button, Card, Badge, Dialog, Progress

lib/
  subjects.ts             # Single source of truth for all subjects, topics, and card styles
  claude.ts               # Anthropic SDK client + subject-specific question generation prompts
  db/index.ts             # SQLite connection, Drizzle setup
  db/schema.ts            # Table definitions: profiles, sessions, questions, answers
  utils.ts                # cn(), difficultyColor(), formatDate(), formatTime()
  avatars.ts              # Avatar emoji set for profiles
```

## Navigation Flow

```
/ (public landing)
  ├─ has profile cookie → /subjects
  └─ no cookie         → /profile-picker → /subjects

/subjects   (requires profile)
  └─ click subject → /setup?subject=math|science|english

/setup → /session/[id] → /results/[id]
```

## Database Schema

Four tables, all in a local SQLite file (`data/sqlite.db` by default):

- **profiles** — name, avatar, grade/difficulty preferences, theme
- **sessions** — grade level, difficulty, topic, **subject**, mode, status (`active` / `completed` / `quit`), score, progress index
- **questions** — generated question text, type, choices (JSON), correct answer, explanation, hint
- **answers** — user's answer per question, correctness, hint/solve usage flags

> **Existing database migration:** If you have a database created before the multi-subject update, add the `subject` column manually:
> ```bash
> sqlite3 ./data/sqlite.db "ALTER TABLE sessions ADD COLUMN subject TEXT NOT NULL DEFAULT 'math';"
> ```
> Fresh installs self-migrate on startup — no extra step needed.

## How Question Generation Works

On session creation (`POST /api/sessions`), the server calls `generateQuestions()` in `lib/claude.ts`. The prompt is tailored per subject:

- **Math** — Grade-appropriate topic list (e.g. Grade 9: linear functions, quadratic equations, basic trigonometry); optional subtopic focus; single-step / multi-step / complex word problem difficulty tiers
- **Science** — Age-appropriate Biology, Chemistry, Physics, or Earth Science concepts; conceptual and calculation questions
- **English** — Grammar rules, vocabulary in context, reading comprehension passages, or writing mechanics questions

Claude returns a JSON array of questions. Each question includes `questionText`, `questionType`, `choices[4]`, `correctAnswer`, `explanation`, and `hint`. Questions are validated, stored, and the session begins immediately.

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
