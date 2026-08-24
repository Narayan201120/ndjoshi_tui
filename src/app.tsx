import { useEffect, useSyncExternalStore, type ReactElement, type ReactNode } from "react"
import { createRoot, useKeyboard, useRenderer, type Root } from "@opentui/react"
import type { CliRenderer } from "@opentui/core"
import { getTheme } from "./themes/index.ts"
import type { Store } from "./app-state.ts"
import { Header } from "./components/frame.tsx"
import { Sidebar } from "./components/sidebar.tsx"
import { Footer } from "./components/footer.tsx"
import { Splash } from "./components/splash.tsx"
import { HomeScreen } from "./screens/home.tsx"
import { AboutScreen } from "./screens/about.tsx"
import { WorkScreen } from "./screens/work.tsx"
import { HelpScreen } from "./screens/help.tsx"
import type { ScreenId } from "./keymap.ts"
import { portfolio } from "../data/portfolio.ts"

export const SPLASH_MS = 1600

export function mountApp(
  renderer: CliRenderer,
  props: { store: Store; version: string; onQuit: () => void },
): Root {
  const root = createRoot(renderer)
  root.render(<App {...props} />)
  return root
}

export function implementedScreens(): ScreenId[] {
  return ["home", "about", "work"]
}

export function App(props: { store: Store; version: string; onQuit: () => void }) {
  const store = props.store
  const s = useSyncExternalStore(store.subscribe, store.getState)
  const t = getTheme(s.themeId)
  const renderer = useRenderer()

  useEffect(() => {
    renderer.setBackgroundColor(t.bg)
  }, [renderer, t])

  useEffect(() => {
    const id = setTimeout(() => store.dispatch({ type: "boot" }), SPLASH_MS)
    return () => clearTimeout(id)
  }, [])

  useEffect(() => {
    if (s.quitConfirmed) props.onQuit()
  }, [s.quitConfirmed])

  useKeyboard((key) => handleKey(key, store))

  if (!s.booted) {
    return <Splash theme={t} version={props.version} />
  }

  const ids = implementedScreens()
  const els: Record<string, ReactNode> = {
    home: (
      <HomeScreen
        theme={t}
        onOpenProject={(slug) => store.dispatch({ type: "openProject", slug })}
      />
    ),
    about: <AboutScreen theme={t} />,
    work: <WorkScreen theme={t} state={s} />,
  }

  return (
    <box width="100%" height="100%" backgroundColor={t.bg} flexDirection="column">
      <Header theme={t} version={props.version} />
      <box flexGrow={1} flexDirection="row">
        <Sidebar theme={t} items={ids} cursor={Math.min(s.cursor, ids.length - 1)} />
        <box flexGrow={1} flexDirection="column" paddingLeft={2} paddingRight={2} paddingTop={1}>
          {els[s.screen]}
        </box>
      </box>
      <Footer theme={t} state={s} />
      {s.overlay === "help" ? <HelpScreen theme={t} version={props.version} /> : null}
    </box>
  )
}

function handleKey(key: { name: string; ctrl: boolean; shift: boolean; meta: boolean }, store: Store) {
  const s = store.getState()

  if (!s.booted) {
    store.dispatch({ type: "boot" })
    return
  }
  if (s.quitConfirmed) return

  if (key.ctrl) {
    if (key.name === "c") store.dispatch({ type: "requestQuit" })
    return
  }

  if (key.name === "q") {
    store.dispatch(s.quitting ? { type: "confirmQuit" } : { type: "requestQuit" })
    return
  }

  if (s.overlay) {
    if (key.name === "?" || key.name === "escape") store.dispatch({ type: "toggleHelp" })
    return
  }

  if (key.name === "?") {
    store.dispatch({ type: "toggleHelp" })
    return
  }
  if (key.shift && key.name === "/") {
    store.dispatch({ type: "toggleHelp" })
    return
  }

  switch (key.name) {
    case "escape":
      store.dispatch({ type: "back" })
      return
    case "t":
      store.dispatch({ type: "cycleTheme" })
      return
    case "j":
    case "down":
      store.dispatch({ type: "move", delta: 1 })
      return
    case "k":
    case "up":
      store.dispatch({ type: "move", delta: -1 })
      return
    case "h":
    case "left":
      store.dispatch({ type: "back" })
      return
    case "l":
    case "right":
    case "return":
      store.dispatch({ type: "open" })
      return
  }

  if (/^[1-9]$/.test(key.name)) {
    const idx = Number(key.name) - 1
    if (idx < implementedScreens().length) store.dispatch({ type: "gotoIndex", index: idx })
  }
}
