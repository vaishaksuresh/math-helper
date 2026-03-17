export type SubjectId = 'math' | 'science' | 'english'

export interface Topic {
  value: string
  label: string
  description: string
  icon: string  // emoji fallback
}

export interface Subject {
  id: SubjectId
  label: string
  description: string
  // All class strings written out in full so Tailwind's static scanner picks them up
  cardClasses: {
    light: { bg: string; border: string; text: string; iconBg: string; iconText: string }
    dark:  { bg: string; border: string; text: string; iconBg: string; iconText: string }
  }
  topics: Topic[]
}

export const SUBJECTS: Subject[] = [
  {
    id: 'math',
    label: 'Math',
    description: 'Algebra, Geometry, Statistics & more',
    cardClasses: {
      light: { bg: 'bg-amber-50',      border: 'border-amber-300',  text: 'text-amber-900',   iconBg: 'bg-amber-100',      iconText: 'text-amber-700'   },
      dark:  { bg: 'dark:bg-amber-950/30', border: 'dark:border-amber-800', text: 'dark:text-amber-200', iconBg: 'dark:bg-amber-900/50', iconText: 'dark:text-amber-300' },
    },
    topics: [
      { value: 'mixed',                   label: 'Mixed',                    description: 'A bit of everything',              icon: '🎲' },
      { value: 'algebra',                  label: 'Algebra',                  description: 'Equations and expressions',        icon: '🔢' },
      { value: 'geometry',                 label: 'Geometry',                 description: 'Shapes, angles, and proofs',       icon: '📐' },
      { value: 'fractions & decimals',     label: 'Fractions & Decimals',     description: 'Operations with fractions',        icon: '½'  },
      { value: 'statistics & probability', label: 'Statistics & Probability', description: 'Data analysis and chance',         icon: '📊' },
      { value: 'word problems',            label: 'Word Problems',            description: 'Real-world math scenarios',        icon: '📝' },
      { value: 'number sense',             label: 'Number Sense',             description: 'Patterns, factors, primes',        icon: '🔟' },
      { value: 'trigonometry',             label: 'Trigonometry',             description: 'Sine, cosine, and angles',         icon: '📏' },
    ],
  },
  {
    id: 'science',
    label: 'Science',
    description: 'Biology, Chemistry, Physics & Earth Science',
    cardClasses: {
      light: { bg: 'bg-emerald-50',      border: 'border-emerald-300',  text: 'text-emerald-900',   iconBg: 'bg-emerald-100',      iconText: 'text-emerald-700'   },
      dark:  { bg: 'dark:bg-emerald-950/30', border: 'dark:border-emerald-800', text: 'dark:text-emerald-200', iconBg: 'dark:bg-emerald-900/50', iconText: 'dark:text-emerald-300' },
    },
    topics: [
      { value: 'mixed',         label: 'Mixed',         description: 'Questions across all science areas', icon: '🎲' },
      { value: 'biology',       label: 'Biology',       description: 'Cells, ecosystems, genetics',        icon: '🧬' },
      { value: 'chemistry',     label: 'Chemistry',     description: 'Elements, reactions, compounds',     icon: '⚗️' },
      { value: 'physics',       label: 'Physics',       description: 'Forces, motion, energy',             icon: '⚡' },
      { value: 'earth science', label: 'Earth Science', description: 'Weather, geology, space',            icon: '🌍' },
    ],
  },
  {
    id: 'english',
    label: 'English',
    description: 'Grammar, Vocabulary, Reading & Writing',
    cardClasses: {
      light: { bg: 'bg-blue-50',      border: 'border-blue-300',  text: 'text-blue-900',   iconBg: 'bg-blue-100',      iconText: 'text-blue-700'   },
      dark:  { bg: 'dark:bg-blue-950/30', border: 'dark:border-blue-800', text: 'dark:text-blue-200', iconBg: 'dark:bg-blue-900/50', iconText: 'dark:text-blue-300' },
    },
    topics: [
      { value: 'mixed',                 label: 'Mixed',                 description: 'Questions across all English areas', icon: '🎲' },
      { value: 'grammar',               label: 'Grammar',               description: 'Parts of speech, punctuation',       icon: '✏️' },
      { value: 'vocabulary',            label: 'Vocabulary',            description: 'Word meanings and usage',            icon: '📚' },
      { value: 'reading comprehension', label: 'Reading Comprehension', description: 'Passages and inference questions',   icon: '👁️' },
      { value: 'writing',               label: 'Writing',               description: 'Structure, style, editing',          icon: '📄' },
    ],
  },
]

export function getSubject(id: SubjectId): Subject {
  const subject = SUBJECTS.find(s => s.id === id)
  if (!subject) throw new Error(`Unknown subject: ${id}`)
  return subject
}

export function getTopicsForSubject(id: SubjectId): Topic[] {
  return getSubject(id).topics
}
