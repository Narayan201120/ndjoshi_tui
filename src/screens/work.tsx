import type { Theme } from "../themes/index.ts"
import type { AppState } from "../app-state.ts"
import { portfolio } from "../../data/portfolio.ts"
import { Rule, scrollTheme } from "../components/panel.tsx"
import { TextAttributes } from "@opentui/core"

const BOLD = TextAttributes.BOLD

export function WorkScreen(props: { theme: Theme; state: AppState }) {
  if (props.state.workDetailOpen) {
    return <ProjectDetail theme={props.theme} project={portfolio.projects[props.state.workIndex]} />
  }
  return <ProjectList theme={props.theme} state={props.state} />
}

function ProjectList(props: { theme: Theme; state: AppState }) {
  const t = props.theme
  const s = props.state
  return (
    <box flexGrow={1} flexDirection="column" paddingLeft={1}>
      <Rule theme={t} label={`projects \u00b7 ${portfolio.projects.length}`} />
      <box flexDirection="row" paddingLeft={1} gap={2}>
        <text fg={t.muted}>{"name".padEnd(14)}</text>
        <text fg={t.muted}>{"status".padEnd(10)}</text>
        <text fg={t.muted}>dates</text>
      </box>
      {portfolio.projects.map((p, i) => {
        const selected = i === s.workIndex
        if (selected) {
          return (
            <box key={p.slug} flexDirection="row" paddingLeft={1} gap={2} backgroundColor={t.selBg}>
              <text fg={t.selFg}>{p.name.padEnd(14)}</text>
              <text fg={t.selFg}>{"[" + p.status + "]"}</text>
              <text fg={t.selFg}>{p.dates}</text>
            </box>
          )
        }
        return (
          <box key={p.slug} flexDirection="row" paddingLeft={1} gap={2}>
            <text fg={t.fg}>{p.name.padEnd(14)}</text>
            <text fg={t.green}>{"[" + p.status + "]"}</text>
            <text fg={t.muted}>{p.dates}</text>
          </box>
        )
      })}
      <Rule theme={t} label={"\u21b5 detail"} />
    </box>
  )
}

function ProjectDetail(props: { theme: Theme; project: (typeof portfolio.projects)[number] }) {
  const t = props.theme
  const p = props.project
  return (
    <scrollbox flexGrow={1} flexDirection="column" gap={1} paddingLeft={1} {...scrollTheme(t)}>
      <Rule theme={t} label={`~/work/${p.slug}`} />
      <box flexDirection="row" gap={2}>
        <text fg={t.fg} attributes={BOLD}>{p.name}</text>
        <text fg={t.green}>{"[" + p.status + "]"}</text>
        <text fg={t.muted}>{p.dates}</text>
        <text fg={t.magenta}>{p.repo}</text>
      </box>
      <text fg={t.fg} wrapMode="word">{p.oneLiner}</text>

      <Rule theme={t} label="highlights" />
      {p.bullets.map((b, i) => (
        <box key={i} flexDirection="row" gap={1} paddingLeft={2}>
          <text fg={t.border}>{"-"}</text>
          <text fg={t.fg} wrapMode="word" flexGrow={1}>{b}</text>
        </box>
      ))}

      <Rule theme={t} label="stack" />
      <box flexDirection="row" flexWrap="wrap" flexShrink={1} paddingLeft={2} columnGap={1}>
        {p.stack.map((s) => (
          <text key={s} fg={t.aqua ?? t.accent}>{"[" + s.toLowerCase() + "]"}</text>
        ))}
      </box>
    </scrollbox>
  )
}
