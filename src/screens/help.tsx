import type { Theme } from "../themes/index.ts"
import { KEYMAP_ROWS } from "../keymap.ts"
import { TextAttributes } from "@opentui/core"

const BOLD = TextAttributes.BOLD

export function HelpScreen(props: { theme: Theme; version: string }) {
  const t = props.theme
  return (
    <box
      position="absolute"
      top={0}
      left={0}
      width="100%"
      height="100%"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <box
        border
        borderStyle="double"
        borderColor={t.border}
        backgroundColor={t.bgPanel}
        title={` ? keymap \u00b7 ndjoshi-tui v${props.version} `}
        titleColor={t.accent}
        flexDirection="column"
        paddingLeft={3}
        paddingRight={3}
        paddingTop={1}
        paddingBottom={1}
      >
        {KEYMAP_ROWS.map(([k, d]) => (
          <box key={k} flexDirection="row">
            <text fg={t.yellow}>{k.padEnd(18)}</text>
            <text fg={t.fg}>{d}</text>
          </box>
        ))}
        <box height={1} />
        <text fg={t.muted} attributes={BOLD}>esc close</text>
      </box>
    </box>
  )
}
