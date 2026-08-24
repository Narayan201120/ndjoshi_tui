import type { Theme } from "../themes/index.ts"
import { TextAttributes } from "@opentui/core"
import type { ScreenId } from "../keymap.ts"
import { portfolio } from "../../data/portfolio.ts"

const BOLD = TextAttributes.BOLD

export function Sidebar(props: {
  theme: Theme
  items: ScreenId[]
  cursor: number
}) {
  const t = props.theme
  return (
    <box
      width={22}
      border={["right"]}
      borderStyle="rounded"
      borderColor={t.border}
      backgroundColor={t.bg}
      flexDirection="column"
      paddingTop={1}
    >
      {props.items.map((id, i) => {
        const active = i === props.cursor
        const num = String(i + 1).padStart(2, "0")
        if (active) {
          return (
            <box key={id} flexDirection="row" gap={1} paddingLeft={1} paddingRight={1} backgroundColor={t.selBg}>
              <text fg={t.selFg}>{num}</text>
              <text fg={t.selFg} attributes={BOLD}>{id}</text>
            </box>
          )
        }
        return (
          <box key={id} flexDirection="row" gap={1} paddingLeft={1} paddingRight={1}>
            <text fg={t.muted}>{num}</text>
            <text fg={t.fg}>{id}</text>
          </box>
        )
      })}
      <box flexGrow={1} />
      <box flexDirection="column" paddingLeft={1} paddingBottom={1} gap={0}>
        <box flexDirection="row" gap={1}>
          <text fg={t.green}>{"\u25cf"}</text>
          <text fg={t.fg}>open to work</text>
        </box>
        <text fg={t.muted}> {portfolio.person.location.toLowerCase()}</text>
      </box>
    </box>
  )
}
