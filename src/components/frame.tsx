import type { Theme } from "../themes/index.ts"
import { TextAttributes } from "@opentui/core"
import { portfolio } from "../../data/portfolio.ts"

const BOLD = TextAttributes.BOLD

export function Header(props: { theme: Theme; version: string }) {
  const t = props.theme
  return (
    <box height={3} flexDirection="row" alignItems="center" justifyContent="space-between" paddingLeft={2} paddingRight={2}>
      <box flexDirection="row" gap={1}>
        <text fg={t.accent} attributes={BOLD}>{"\u258c"}</text>
        <text fg={t.fg} attributes={BOLD}>ndjoshi-tui</text>
        <text fg={t.muted}>v{props.version}</text>
      </box>
      <box flexDirection="row" gap={2}>
        <box flexDirection="row" gap={1}>
          <text fg={t.green}>{"\u25cf"}</text>
          <text fg={t.muted}>{portfolio.person.availability}</text>
        </box>
        <text fg={t.muted}>{t.id}</text>
      </box>
    </box>
  )
}
