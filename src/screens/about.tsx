import type { Theme } from "../themes/index.ts"
import { TextAttributes } from "@opentui/core"
import { portfolio } from "../../data/portfolio.ts"
import { Rule, scrollTheme } from "../components/panel.tsx"

const BOLD = TextAttributes.BOLD

export function AboutScreen(props: { theme: Theme }) {
  const t = props.theme
  return (
    <scrollbox flexGrow={1} flexDirection="column" gap={1} paddingLeft={1} {...scrollTheme(t)}>
      <Rule theme={t} label="identity" />
      <text fg={t.fg} wrapMode="word">{portfolio.about.blurb}</text>

      <Rule theme={t} label="currently" />
      <text fg={t.accent}>{portfolio.about.currently}</text>

      <Rule theme={t} label="education" />
      {portfolio.about.education.map((e) => (
        <box key={e.school} flexDirection="column" paddingLeft={2}>
          <text fg={t.fg} attributes={BOLD}>{e.school}</text>
          <box flexDirection="row" justifyContent="space-between">
            <text fg={t.muted}>{e.program}</text>
            <text fg={t.muted}>{e.dates}</text>
          </box>
          {e.detail ? <text fg={t.aqua ?? t.accent}>{e.detail}</text> : null}
        </box>
      ))}

      <Rule theme={t} label="certifications" />
      {portfolio.certs.map((c) => (
        <box key={c.name} flexDirection="row" gap={2} paddingLeft={2}>
          <text fg={t.fg}>{c.name}</text>
          <text fg={t.muted}>{"\u2014 " + c.issuer}</text>
        </box>
      ))}
    </scrollbox>
  )
}
