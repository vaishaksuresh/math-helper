import Anthropic from '@anthropic-ai/sdk'
import type { SubjectId } from './subjects'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export interface GeneratedQuestion {
  questionText: string
  questionType: string
  requiresPaper: boolean
  choices: string[]
  correctAnswer: string
  explanation: string
  hint: string
}

const subjectInstructions: Record<SubjectId, string> = {
  math: `Generate multiple-choice mathematics questions.
Focus on computation, problem-solving, and mathematical reasoning appropriate to the topic and grade level.
Grade-level guidance: grades 5–6 focus on arithmetic, fractions, and basic geometry; grades 7–8 introduce algebra and statistics; grades 9–10 cover algebra II and geometry proofs; grades 11–12 include pre-calculus and trigonometry.`,

  science: `Generate multiple-choice science questions appropriate for the grade level.
- For Biology: cover cells, ecosystems, genetics, the human body, and classification.
- For Chemistry: cover elements, chemical reactions, the periodic table, and states of matter.
- For Physics: cover forces, motion, energy, electricity, and waves.
- For Earth Science: cover weather, geology, the water cycle, space, and the environment.
Use precise scientific vocabulary. Include real-world applications where appropriate.`,

  english: `Generate multiple-choice English language arts questions appropriate for the grade level.
- For Grammar: test parts of speech, sentence structure, subject-verb agreement, and punctuation.
- For Vocabulary: present words in context; test meaning, synonyms, antonyms, and connotations.
- For Reading Comprehension: provide a short passage (3–5 sentences) then ask about main idea, inference, detail, or author's purpose. Include the full passage in questionText.
- For Writing: test paragraph structure, topic sentences, transitions, and editing.
Phrase questions as complete sentences. Avoid ambiguous answer choices.`,
}

const difficultyInstructions: Record<string, string> = {
  easy: 'Use straightforward problems with small numbers. Avoid multi-step reasoning. Focus on single-concept problems that can be solved quickly.',
  medium: 'Use problems that require 2-3 steps. Include some word problems. Numbers can be larger or involve fractions/decimals.',
  hard: 'Use complex multi-step problems, tricky word problems, and problems that require deeper thinking. Include problems where students may need scratch paper.',
}

export async function generateQuestions(params: {
  subject: SubjectId
  gradeLevel: number
  difficulty: string
  topic: string
  count: number
}): Promise<GeneratedQuestion[]> {
  const prompt = `${subjectInstructions[params.subject]}

Grade: ${params.gradeLevel}
Topic: ${params.topic}
Difficulty: ${params.difficulty}
${difficultyInstructions[params.difficulty]}

Generate ${params.count} questions. Return a JSON array only, no other text, with this shape:
[{
  "questionText": "...",
  "questionType": "...",
  "requiresPaper": false,
  "choices": ["A", "B", "C", "D"],
  "correctAnswer": "A",
  "explanation": "...",
  "hint": "..."
}]`

  const message = await client.messages.create({
    model: 'claude-opus-4-6',
    max_tokens: 4096,
    messages: [{ role: 'user', content: prompt }],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : ''

  // Extract JSON from response
  const jsonMatch = text.match(/\[[\s\S]*\]/)
  if (!jsonMatch) {
    throw new Error('Failed to parse questions from Claude response')
  }

  const parsed: GeneratedQuestion[] = JSON.parse(jsonMatch[0])

  // Validate and sanitize
  return parsed.slice(0, params.count).map((q) => ({
    questionText: String(q.questionText),
    questionType: String(q.questionType),
    requiresPaper: Boolean(q.requiresPaper),
    choices: Array.isArray(q.choices) ? q.choices.slice(0, 4).map(String) : [],
    correctAnswer: String(q.correctAnswer),
    explanation: String(q.explanation),
    hint: String(q.hint ?? ''),
  }))
}
