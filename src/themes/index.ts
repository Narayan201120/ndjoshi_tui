import type { Theme } from "./types.ts"
import everforest from "./everforest.ts"
import tokyoNight from "./tokyo-night.ts"

export type { Theme }

export const THEMES: Theme[] = [everforest, tokyoNight]

export const DEFAULT_THEME_ID = "everforest"

export function getTheme(id: string): Theme {
  return THEMES.find((t) => t.id === id) ?? THEMES[0]
}

export function nextThemeId(current: string): string {
  const i = THEMES.findIndex((t) => t.id === current)
  return THEMES[(i + 1 + THEMES.length) % THEMES.length].id
}
