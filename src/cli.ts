import { createCliRenderer } from "@opentui/core"
import { mountApp, implementedScreens } from "./app.tsx"
import { createStore } from "./app-state.ts"
import { DEFAULT_THEME_ID, getTheme, THEMES } from "./themes/index.ts"
import { SCREEN_LABELS } from "./keymap.ts"

export const VERSION = "0.1.0"

const USAGE = `ndjoshi-tui v${VERSION} — narayan joshi's portfolio, as a real terminal app

usage:
  ndjoshi-tui                 open the dashboard
  ndjoshi-tui <screen>        jump straight to a screen
                              screens: ${SCREEN_LABELS.join(", ")}
  ndjoshi-tui --theme <id>    start with a theme
                              themes: ${THEMES.map((t) => t.id).join(", ")}

keys: j/k move  l open  h back  t theme  ? help  q quit

requires bun >= 1.3 and a real terminal (windows terminal, ghostty, iterm2,
kitty, alacritty, vs code terminal). not cmd.exe.`

interface CliOptions {
  themeId: string
  screen?: string
}

function parseArgs(argv: string[]): { options: CliOptions; error?: string; help?: boolean } {
  const options: CliOptions = { themeId: DEFAULT_THEME_ID }
  let i = 0
  while (i < argv.length) {
    const arg = argv[i]
    if (arg === "--help" || arg === "-h") return { options, help: true }
    if (arg === "--theme") {
      const value = argv[i + 1]
      if (!value) return { options, error: "--theme needs a value" }
      options.themeId = value
      i += 2
      continue
    }
    if (arg.startsWith("--theme=")) {
      options.themeId = arg.slice("--theme=".length)
      i += 1
      continue
    }
    if (arg.startsWith("--")) return { options, error: `unknown flag: ${arg}` }
    if (!options.screen) {
      options.screen = arg
      i += 1
      continue
    }
    return { options, error: `unexpected argument: ${arg}` }
  }
  return { options }
}

async function main(): Promise<number> {
  const argv = process.argv.slice(2)
  const { options, error, help } = parseArgs(argv)

  if (error) {
    console.error(`ndjoshi-tui: ${error}\n\n${USAGE}`)
    return 1
  }
  if (help) {
    console.log(USAGE)
    return 0
  }

  const theme = getTheme(options.themeId)
  if (theme.id !== options.themeId) {
    console.error(`ndjoshi-tui: unknown theme "${options.themeId}"\n\n${USAGE}`)
    return 1
  }

  const store = createStore()
  if (options.screen) {
    if (options.screen === "work") {
      store.dispatch({ type: "goto", id: "work" })
    } else {
      const idx = implementedScreens().indexOf(options.screen as never)
      if (idx < 0) {
        console.error(
          `ndjoshi-tui: unknown screen "${options.screen}"\navailable in this build: ${implementedScreens().join(", ")}\n`,
        )
        return 1
      }
      store.dispatch({ type: "gotoIndex", index: idx })
    }
  }

  let renderer
  try {
    renderer = await createCliRenderer({
      exitOnCtrlC: false,
      useMouse: true,
      screenMode: "alternate-screen",
      clearOnShutdown: true,
      backgroundColor: theme.bg,
    })
  } catch (err) {
    console.error("ndjoshi-tui: could not take over the terminal.")
    console.error(String(err))
    console.error("\nuse a real terminal — windows terminal on windows, not cmd.exe.")
    return 1
  }

  const root = mountApp(renderer, {
    store,
    version: VERSION,
    onQuit: () => {
      root.unmount()
      renderer.destroy()
      process.exit(0)
    },
  })
  return 0
}

process.exit(await main())
