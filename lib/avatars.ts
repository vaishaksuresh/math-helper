export const AVATARS = [
  '🐱', '🐶', '🦊', '🐸', '🐼', '🦁', '🐯', '🐻', '🐨', '🦄',
  '🐙', '🦋', '🐧', '🦉', '🐺', '🦖', '🐬', '🐳', '🦩', '🐝',
]

export function randomAvatar(): string {
  return AVATARS[Math.floor(Math.random() * AVATARS.length)]
}
