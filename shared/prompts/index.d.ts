export type Mode = 'lite' | 'standard' | 'expert' | 'compact'
export type PromptMode = Mode | 'auto'
export type Category = 'auto' | 'code' | 'mail' | 'content' | 'data' | 'image' | 'seo' | 'chat'
export interface PromptOptions {
  desktop?: boolean
  category?: Category
  preferencesContext?: string
}
export interface Preferences {
  tags: Record<string, string[]>
  sessions: readonly unknown[]
}
export const REFINEMENT_RULES: string
export const QUESTION_RULES: string
export const MODEL_RULES: string
export const REFINEMENT_PROMPTS: Readonly<Record<PromptMode, string>>
export const QUESTION_PROMPTS: Readonly<Record<'standard' | 'expert' | 'auto', string>>
export function skipsQuestions(mode: string): boolean
export function getCategoryGuidance(category?: Category, mode?: PromptMode): string
export function buildPreferencesContext(language: string, preferences?: Preferences): string
export function buildPreferenceTagsSystemPrompt(topicCategory: string): string
export function buildQuestionsSystemPrompt(mode?: string, options?: PromptOptions): string
export function buildRefinementSystemPrompt(mode?: string, options?: PromptOptions): string
