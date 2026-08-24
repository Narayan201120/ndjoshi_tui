import type { ReactNode } from "react"
import { TextAttributes } from "@opentui/core"
import { useTerminalDimensions } from "@opentui/react"
import type { Theme } from "../themes/index.ts"

const BOLD = TextAttributes.BOLD

export function Panel(props: {
  theme: Theme
  title?: string
  titleColor?: string
  children: ReactNode
  flexGrow?: number
  paddingX?: number
  paddingY?: number
}) {
  const t = props.theme
  return (
    <box
      border
      borderStyle="rounded"
      borderColor={t.border}
      backgroundColor={t.bg}
      title={props.title}
      titleColor={props.titleColor ?? t.muted}
      flexGrow={props.flexGrow ?? 1}
      flexDirection="column"
      paddingLeft={props.paddingX ?? 2}
      paddingRight={props.paddingX ?? 2}
      paddingTop={props.paddingY ?? 0}
      paddingBottom={props.paddingY ?? 0}
    >
      {props.children}
    </box>
  )
}

export function Rule(props: { theme: Theme; label: string }) {
  const t = props.theme
  const { width } = useTerminalDimensions()
  const usable = Math.max(6, width - 36 - props.label.length)
  return (
    <box flexDirection="row" width="100%" gap={1}>
      <text fg={t.border}>{"\u2500\u2500"}</text>
      <text fg={t.accent} attributes={BOLD}>{props.label}</text>
      <text fg={t.border} flexGrow={1}>{"\u2500".repeat(usable)}</text>
    </box>
  )
}

export function BlockBar(props: { theme: Theme; pct: number; width: number }) {
  const t = props.theme
  const clamped = Math.max(0, Math.min(100, props.pct))
  const filled = Math.round((clamped / 100) * props.width)
  return (
    <text fg={t.accent}>
      {"\u2588".repeat(filled)}
      {"\u2591".repeat(Math.max(0, props.width - filled))}
    </text>
  )
}

export function Dot(props: { theme: Theme; color: string; text: string }) {
  const t = props.theme
  return (
    <box flexDirection="row" gap={1}>
      <text fg={props.color}>{"\u25cf"}</text>
      <text fg={t.fg}>{props.text}</text>
    </box>
  )
}

export function scrollTheme(t: Theme) {
  return {
    verticalScrollbarOptions: {
      trackOptions: { backgroundColor: t.bg, foregroundColor: t.border },
    },
  }
}
