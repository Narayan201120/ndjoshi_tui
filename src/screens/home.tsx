import type { Theme } from "../themes/index.ts"
import { portfolio } from "../../data/portfolio.ts"
import { Rule, BlockBar, scrollTheme } from "../components/panel.tsx"

export function HomeScreen(props: {
  theme: Theme
  onOpenProject: (slug: string) => void
}) {
  const t = props.theme
  const p = portfolio.person
  return (
    <scrollbox flexGrow={1} flexDirection="column" gap={1} paddingLeft={1} {...scrollTheme(t)}>
      <ascii-font text={"NDJOSHI"} font="tiny" color={t.accent} backgroundColor={t.bg} />
      <text fg={t.fg}>{p.role}</text>
      <box flexDirection="row" gap={2}>
        <box flexDirection="row" gap={1}>
          <text fg={t.green}>{"\u25cf"}</text>
          <text fg={t.fg}>{p.availability}</text>
        </box>
        <text fg={t.muted}>{p.location.toLowerCase()}</text>
      </box>

      <Rule theme={t} label="projects" />
      {portfolio.projects.map((proj, i) => (
        <ProjectCard key={proj.slug} theme={t} index={i} name={proj.name} oneLiner={proj.oneLiner}
          stack={proj.stack.slice(0, 4)} status={proj.status} onOpen={() => props.onOpenProject(proj.slug)} />
      ))}

      <Rule theme={t} label="languages" />
      <box flexDirection="column" paddingLeft={2}>
        {portfolio.languages.map((lang) => (
          <box key={lang.name} flexDirection="row" gap={2}>
            <text fg={t.muted}>{lang.name.padEnd(12)}</text>
            <BlockBar theme={t} pct={lang.pct} width={20} />
            <text fg={t.muted}>{String(lang.pct).padStart(3)}%</text>
          </box>
        ))}
      </box>
    </scrollbox>
  )
}

function ProjectCard(props: {
  theme: Theme
  index: number
  name: string
  oneLiner: string
  stack: string[]
  status: string
  onOpen: () => void
}) {
  const t = props.theme
  const num = String(props.index + 1).padStart(2, "0")
  return (
    <box
      border
      borderStyle="rounded"
      borderColor={t.border}
      backgroundColor={t.bg}
      title={` ${num} \u00b7 ${props.name} `}
      titleColor={t.accent}
      flexDirection="column"
      marginLeft={2}
      onMouseUp={props.onOpen}
    >
      <text fg={t.fg}>{props.oneLiner}</text>
      <box flexDirection="row" justifyContent="space-between">
        <text fg={t.muted}>{props.stack.join(" \u00b7 ")}</text>
        <text fg={t.green}>{props.status}</text>
      </box>
    </box>
  )
}
