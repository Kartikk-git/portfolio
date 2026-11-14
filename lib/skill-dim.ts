/**
 * Shared event name for the stack explorer (brief section 4).
 *
 * SkillsSection dispatches `portfolio:skill-dim` with `{ slugs: string[] | null }`
 * whenever the active skill changes; ProjectsSection listens and dims the
 * project cards that do not use the skill to 35% opacity. `null` clears.
 */
export const SKILL_DIM_EVENT = "portfolio:skill-dim";

export interface SkillDimDetail {
  slugs: string[] | null;
}
