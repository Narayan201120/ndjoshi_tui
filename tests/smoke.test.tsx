import { describe, expect, test } from "bun:test"
import { testRender, type TestRendererSetup } from "@opentui/react/test-utils"
import { parseKeypress } from "@opentui/core"
import { App } from "../src/app.tsx"
import { createStore, type Store } from "../src/app-state.ts"

const BOOT_KEY = " "

async function bootApp(width = 120, height = 40, onQuit?: () => void) {
  const store = createStore()
  const setup = await testRender(
    <App store={store} version="0.1.0-test" onQuit={onQuit ?? (() => {})} />,
    {
      width,
      height,
      exitOnCtrlC: false,
    },
  )
  await setup.flush()

  const splash = setup.captureCharFrame()
  expect(splash).toContain("press any key")
  expect(splash).toContain("portfolio")

  await press(setup, [BOOT_KEY])
  const home = setup.captureCharFrame()
  expect(home).toContain("ndjoshi-tui")
  return { store, setup }
}

async function press(setup: TestRendererSetup, keys: string[]) {
  await setup.mockInput.pressKeys(keys)
  await setup.flush()
}

function frameOf(setup: TestRendererSetup) {
  return setup.captureCharFrame()
}

describe("phase 0", () => {
  test("lone ESC parses as escape key (real-terminal contract)", () => {
    const key = parseKeypress(Buffer.from("\u001b"))
    expect(key?.name).toBe("escape")
  })

  test("splash boots into home dashboard", async () => {
    const { setup } = await bootApp()
    const home = frameOf(setup)
    expect(home).toContain("everforest")
    expect(home).toContain("open to work")
    expect(home).toContain("Backend Developer")
    expect(home).toContain("Meridian")
    expect(home).toContain("DocuMind")
    expect(home).toContain("ARGUS")
    expect(home).not.toContain("\u2588\u2588\u2588")
    setup.renderer.destroy()
  })

  test("j/k moves nav cursor across screens", async () => {
    const { store, setup } = await bootApp()
    await press(setup, ["j"])
    let f = frameOf(setup)
    expect(store.getState().screen).toBe("about")
    expect(f).toContain("02")
    expect(f).toContain("Sinhgad Institute")

    await press(setup, ["k"])
    f = frameOf(setup)
    expect(store.getState().screen).toBe("home")
    expect(f).toContain("01 home")
    expect(f).toContain("home / nav")
    setup.renderer.destroy()
  })

  test("digits jump to screens (1-3)", async () => {
    const { store, setup } = await bootApp()
    await press(setup, ["3"])
    expect(store.getState().screen).toBe("work")
    expect(frameOf(setup)).toContain("[ACTIVE]")

    await press(setup, ["1"])
    expect(store.getState().screen).toBe("home")

    await press(setup, ["2"])
    expect(store.getState().screen).toBe("about")
    expect(frameOf(setup)).toContain("identity")
    setup.renderer.destroy()
  })

  test("work: enter opens project detail, h returns to list", async () => {
    const { store, setup } = await bootApp()
    await press(setup, ["3"])
    await press(setup, ["l"])
    expect(store.getState().workDetailOpen).toBe(true)
    let f = frameOf(setup)
    expect(f).toContain("Narayan201120/meridian")
    expect(f).toContain("Offline-first")
    expect(f).toContain("[react native]")

    await press(setup, ["h"])
    expect(store.getState().workDetailOpen).toBe(false)
    expect(frameOf(setup)).toContain("[ACTIVE]")
    setup.renderer.destroy()
  })

  test("t cycles through the registered theme ring", async () => {
    const { store, setup } = await bootApp()
    await press(setup, ["t"])
    expect(store.getState().themeId).toBe("tokyo-night")
    expect(frameOf(setup)).toContain("tokyo-night")

    await press(setup, ["t"])
    expect(store.getState().themeId).toBe("catppuccin")

    // full ring returns home (4 more: gruvbox, nord, synthwave84, everforest)
    for (let i = 0; i < 4; i++) await press(setup, ["t"])
    expect(store.getState().themeId).toBe("everforest")
    setup.renderer.destroy()
  })

  test("? opens help overlay, ? closes it", async () => {
    const { store, setup } = await bootApp()
    await press(setup, ["?"])
    expect(store.getState().overlay).toBe("help")
    let f = frameOf(setup)
    expect(f).toContain("keymap")
    expect(f).toContain("command palette")
    expect(f).toContain("leader")

    await press(setup, ["?"])
    expect(store.getState().overlay).toBe(null)
    expect(frameOf(setup)).not.toContain("keymap")
    setup.renderer.destroy()
  })

  test("q asks once; any navigation cancels the confirmation", async () => {
    const { store, setup } = await bootApp()
    await press(setup, ["q"])
    expect(store.getState().quitting).toBe(true)
    expect(frameOf(setup)).toContain("confirm quit")

    await press(setup, ["j"])
    expect(store.getState().quitting).toBe(false)
    expect(frameOf(setup)).not.toContain("confirm quit")
    setup.renderer.destroy()
  })

  test("q q confirms quit and fires the onQuit lifecycle", async () => {
    let quitCalled = false
    const { store, setup } = await bootApp(120, 40, () => {
      quitCalled = true
    })
    await press(setup, ["q"])
    expect(store.getState().quitting).toBe(true)

    await press(setup, ["q"])
    expect(store.getState().quitConfirmed).toBe(true)
    // App effect runs on state change; flush settles it
    await setup.flush()
    await new Promise((r) => setTimeout(r, 20))
    await setup.flush()
    expect(quitCalled).toBe(true)
    setup.renderer.destroy()
  })

  test("80x24 renders work list and detail without errors", async () => {
    const { setup } = await bootApp(80, 24)
    await press(setup, ["3"])
    let f = frameOf(setup)
    expect(f).toContain("[ACTIVE]")
    expect(f).toContain("dates")

    await press(setup, ["l"])
    f = frameOf(setup)
    expect(f).toContain("highlights")
    expect(f).not.toContain("\u2588\u2588\u2588")
    setup.renderer.destroy()
  })
})
