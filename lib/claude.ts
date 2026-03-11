import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export interface GeneratedQuestion {
  questionText: string
  questionType: 'arithmetic' | 'fractions' | 'geometry' | 'word_problem' | 'algebra'
  requiresPaper: boolean
  choices: string[]
  correctAnswer: string
  explanation: string
}

const gradeTopics: Record<number, string> = {
  3: 'addition, subtraction, multiplication (up to 10x), division basics, simple word problems, telling time, basic fractions (halves, thirds, quarters)',
  4: 'multi-digit multiplication, long division, fractions (compare, equivalent), decimals introduction, area and perimeter, multi-step word problems',
  5: 'fractions (add, subtract, multiply, divide), decimals (all operations), percentages intro, area of triangles, volume of rectangular prisms, coordinate planes, word problems',
  6: 'ratios and rates, percentages, negative numbers, expressions and equations, area and volume, statistics (mean, median, mode), proportional relationships',
  7: 'proportions, percent problems, integers, algebra expressions, geometry (angles, triangles, circles), probability, multi-step equations',
  8: 'linear equations, systems of equations, functions, Pythagorean theorem, transformations, statistics (scatter plots, linear models), exponents and roots',
}

const difficultyInstructions: Record<string, string> = {
  easy: 'Use straightforward problems with small numbers. Avoid multi-step reasoning. Focus on single-concept problems that can be solved quickly.',
  medium: 'Use problems that require 2-3 steps. Include some word problems. Numbers can be larger or involve fractions/decimals.',
  hard: 'Use complex multi-step problems, tricky word problems, and problems that require deeper thinking. Include problems where students may need scratch paper.',
}

export async function generateQuestions(
  gradeLevel: number,
  difficulty: string,
  count: number
): Promise<GeneratedQuestion[]> {
  const topics = gradeTopics[gradeLevel] ?? gradeTopics[5]
  const difficultyGuide = difficultyInstructions[difficulty] ?? difficultyInstructions['medium']

  const prompt = `You are an experienced math teacher. Generate exactly ${count} math practice problems for a Grade ${gradeLevel} student.

Difficulty: ${difficulty.toUpperCase()}
${difficultyGuide}

Topics appropriate for Grade ${gradeLevel}: ${topics}

Requirements:
- Vary the problem types (don't repeat the same type more than 40% of the time)
- Include at least ${Math.max(1, Math.floor(count * 0.2))} word problems
- For hard difficulty, include some problems that require scratch paper
- All answer choices must be plausible (no obviously wrong answers)
- The correct answer MUST be one of the 4 choices exactly as written
- Keep question text clear and age-appropriate

Return a JSON array of exactly ${count} objects. Each object must have these exact fields:
{
  "questionText": "The full problem statement",
  "questionType": "arithmetic" | "fractions" | "geometry" | "word_problem" | "algebra",
  "requiresPaper": true or false,
  "choices": ["choice A", "choice B", "choice C", "choice D"],
  "correctAnswer": "the exact text of the correct choice",
  "explanation": "Brief, student-friendly explanation of how to solve it"
}

Return ONLY the JSON array, no other text.`

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
  return parsed.slice(0, count).map((q) => ({
    questionText: String(q.questionText),
    questionType: q.questionType as GeneratedQuestion['questionType'],
    requiresPaper: Boolean(q.requiresPaper),
    choices: Array.isArray(q.choices) ? q.choices.slice(0, 4).map(String) : [],
    correctAnswer: String(q.correctAnswer),
    explanation: String(q.explanation),
  }))
}
