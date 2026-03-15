import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const profiles = sqliteTable('profiles', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  avatar: text('avatar').notNull(),
  gradePreference: integer('grade_preference'),
  difficultyPreference: text('difficulty_preference'),
  theme: text('theme').notNull().default('dark'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
})

export const sessions = sqliteTable('sessions', {
  id: text('id').primaryKey(),
  profileId: text('profile_id').references(() => profiles.id),
  studentName: text('student_name'),
  gradeLevel: integer('grade_level').notNull(),
  difficulty: text('difficulty').notNull(),
  mode: text('mode').notNull(),
  totalQuestions: integer('total_questions'),
  timeLimitMinutes: integer('time_limit_minutes'),
  status: text('status').notNull().default('active'),
  currentQuestionIndex: integer('current_question_index').notNull().default(0),
  score: integer('score').notNull().default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  completedAt: integer('completed_at', { mode: 'timestamp' }),
  lastActiveAt: integer('last_active_at', { mode: 'timestamp' }).notNull(),
  topic: text('topic'),
})

export const questions = sqliteTable('questions', {
  id: text('id').primaryKey(),
  sessionId: text('session_id').notNull().references(() => sessions.id),
  orderIndex: integer('order_index').notNull(),
  questionText: text('question_text').notNull(),
  questionType: text('question_type').notNull(),
  requiresPaper: integer('requires_paper', { mode: 'boolean' }).notNull().default(false),
  choices: text('choices').notNull(),
  correctAnswer: text('correct_answer').notNull(),
  explanation: text('explanation').notNull(),
  hint: text('hint').notNull().default(''),
})

export const answers = sqliteTable('answers', {
  id: text('id').primaryKey(),
  sessionId: text('session_id').notNull().references(() => sessions.id),
  questionId: text('question_id').notNull().references(() => questions.id),
  userAnswer: text('user_answer'),
  isCorrect: integer('is_correct', { mode: 'boolean' }),
  answeredAt: integer('answered_at', { mode: 'timestamp' }).notNull(),
  timeSpentSeconds: integer('time_spent_seconds'),
  hintUsed: integer('hint_used', { mode: 'boolean' }).notNull().default(false),
  solveUsed: integer('solve_used', { mode: 'boolean' }).notNull().default(false),
})

export type Profile = typeof profiles.$inferSelect
export type NewProfile = typeof profiles.$inferInsert
export type Session = typeof sessions.$inferSelect
export type NewSession = typeof sessions.$inferInsert
export type Question = typeof questions.$inferSelect
export type NewQuestion = typeof questions.$inferInsert
export type Answer = typeof answers.$inferSelect
export type NewAnswer = typeof answers.$inferInsert
