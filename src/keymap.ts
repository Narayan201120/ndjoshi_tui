export type KeyHint = { keys: string; label: string }

export const SCREEN_LABELS = ["home", "about", "work", "stack", "log", "github", "net"] as const
export type ScreenId = (typeof SCREEN_LABELS)[number]

export const HINTS_BASE: KeyHint[] = [
  { keys: "j/k", label: "move" },
  { keys: "\u21b5", label: "open" },
  { keys: ":", label: "shell" },
  { keys: "/", label: "cmd" },
  { keys: "t", label: "theme" },
  { keys: "?", label: "help" },
  { keys: "q", label: "quit" },
]

export const HINTS_WORK_LIST: KeyHint[] = [
  { keys: "j/k", label: "select" },
  { keys: "\u21b5", label: "detail" },
  { keys: "o", label: "repo" },
  { keys: "?", label: "help" },
  { keys: "q", label: "quit" },
]

export const HINTS_DETAIL: KeyHint[] = [
  { keys: "esc", label: "back" },
  { keys: "o", label: "repo" },
  { keys: "?", label: "help" },
  { keys: "q", label: "quit" },
]

export const KEYMAP_ROWS: [string, string][] = [
  ["j / k / \u2193 / \u2191", "next / prev item"],
  ["h / l / \u2190 / \u2192", "back / sidebar, forward"],
  ["\u21b5", "open / forward"],
  ["1 \u2013 7", "jump to screen"],
  ["g g / G", "top / bottom"],
  ["/", "command palette"],
  [":", "shell mode"],
  ["esc", "menu / close overlay"],
  ["t", "next theme"],
  ["T", "theme picker"],
  ["c", "copy email"],
  ["o", "open selected repo in browser"],
  ["r", "reload GitHub stats"],
  ["?", "help"],
  ["q / ctrl+c", "quit (confirm once)"],
  ["ctrl+x then t", "leader: theme picker"],
  ["ctrl+x then q", "leader: quit"],
]
