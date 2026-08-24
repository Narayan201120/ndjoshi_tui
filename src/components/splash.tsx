import type { Theme } from "../themes/index.ts"

export function Splash(props: { theme: Theme; version: string }) {
  const t = props.theme
  return (
    <box
      position="absolute"
      top={0}
      left={0}
      width="100%"
      height="100%"
      backgroundColor={t.bg}
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <ascii-font text={"NDJOSHI"} font="tiny" color={t.accent} backgroundColor={t.bg} />
      <box height={1} />
      <text fg={t.muted}>narayan joshi {"\u00b7"} portfolio {"\u00b7"} v{props.version}</text>
      <box height={1} />
      <text fg={t.yellow}>press any key</text>
    </box>
  )
}
