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
  // Combined light+dark class strings written out in full so Tailwind's static scanner picks them up
  cardClasses: {
    card: string      // card bg + border (light and dark combined)
    iconBg: string    // icon container bg (light and dark combined)
    iconText: string  // icon fill/text colour (light and dark combined)
  }
  topics: Topic[]
}

export const SUBJECTS: Subject[] = [
  {
    id: 'math',
    label: 'Math',
    description: 'Algebra, Geometry, Statistics & more',
    cardClasses: {
      card:     'bg-amber-50 border-amber-300 dark:bg-amber-950/30 dark:border-amber-800',
      iconBg:   'bg-amber-100 dark:bg-amber-900/50',
      iconText: 'text-amber-700 dark:text-amber-300',
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
      card:     'bg-emerald-50 border-emerald-300 dark:bg-emerald-950/30 dark:border-emerald-800',
      iconBg:   'bg-emerald-100 dark:bg-emerald-900/50',
      iconText: 'text-emerald-700 dark:text-emerald-300',
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
      card:     'bg-blue-50 border-blue-300 dark:bg-blue-950/30 dark:border-blue-800',
      iconBg:   'bg-blue-100 dark:bg-blue-900/50',
      iconText: 'text-blue-700 dark:text-blue-300',
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
