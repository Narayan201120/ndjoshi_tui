import type { Theme } from "../themes/index.ts"
import type { AppState } from "../app-state.ts"
import { HINTS_BASE, HINTS_DETAIL, HINTS_WORK_LIST, type KeyHint } from "../keymap.ts"
import { TextAttributes } from "@opentui/core"
import { portfolio } from "../../data/portfolio.ts"

const BOLD = TextAttributes.BOLD

function hintList(s: AppState): KeyHint[] {
  if (s.quitting) {
    return [
      { keys: "q", label: "confirm quit" },
      { keys: "esc", label: "cancel" },
    ]
  }
  if (s.workDetailOpen && s.screen === "work") return HINTS_DETAIL
  if (s.screen === "work" && s.focus === "main") return HINTS_WORK_LIST
  return HINTS_BASE
}

export function Footer(props: { theme: Theme; state: AppState }) {
  const t = props.theme
  const hints = hintList(props.state)
  return (
    <box
      height={3}
      border={["top"]}
      borderStyle="rounded"
      borderColor={t.border}
      backgroundColor={t.bg}
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
      paddingLeft={2}
      paddingRight={2}
    >
      <box flexDirection="row" gap={2}>
        {hints.map((h) => (
          <box key={h.keys} flexDirection="row">
            <text fg={t.bg} bg={t.yellow} attributes={BOLD}>{h.keys}</text>
            <text fg={t.muted}>{" " + h.label}</text>
          </box>
        ))}
      </box>
      <box flexDirection="row" gap={1}>
        <text fg={t.muted}>{props.state.screen}</text>
        <text fg={t.border}>{"/"}</text>
        <text fg={t.muted}>
          {props.state.screen === "work" && props.state.workDetailOpen
            ? portfolioSlug(props.state)
            : props.state.focus}
        </text>
      </box>
    </box>
  )
}

function portfolioSlug(s: AppState): string {
  const p = portfolio.projects[s.workIndex]
  return p ? p.slug : s.focus
}
