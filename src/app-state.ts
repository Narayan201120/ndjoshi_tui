import { SCREEN_LABELS, type ScreenId } from "./keymap.ts"
import { DEFAULT_THEME_ID, nextThemeId } from "./themes/index.ts"
import { portfolio } from "../data/portfolio.ts"

export type FocusMode = "nav" | "main"
export type OverlayId = null | "help"

export type ToastKind = "info" | "ok" | "err"

export interface AppState {
  booted: boolean
  screen: ScreenId
  cursor: number
  focus: FocusMode
  overlay: OverlayId
  workIndex: number
  workDetailOpen: boolean
  themeId: string
  quitting: boolean
  quitConfirmed: boolean
  toast: { id: number; text: string; kind: ToastKind } | null
}

export const initialAppState: AppState = {
  booted: false,
  screen: "home",
  cursor: 0,
  focus: "nav",
  overlay: null,
  workIndex: 0,
  workDetailOpen: false,
  themeId: DEFAULT_THEME_ID,
  quitting: false,
  quitConfirmed: false,
  toast: null,
}

export type Action =
  | { type: "boot" }
  | { type: "goto"; id: ScreenId }
  | { type: "gotoIndex"; index: number }
  | { type: "openProject"; slug: string }
  | { type: "move"; delta: number }
  | { type: "focusMain" }
  | { type: "focusNav" }
  | { type: "open" }
  | { type: "back" }
  | { type: "toggleHelp" }
  | { type: "closeOverlay" }
  | { type: "cycleTheme" }
  | { type: "setTheme"; id: string }
  | { type: "requestQuit" }
  | { type: "cancelQuit" }
  | { type: "confirmQuit" }
  | { type: "toast"; text: string; kind?: ToastKind }
  | { type: "clearToast"; id: number }

let toastSeq = 0

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n))
}

export function reduce(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "boot":
      if (state.booted) return state
      return {
        ...state,
        booted: true,
        quitting: false,
        quitConfirmed: false,
      }

    case "goto": {
      const index = SCREEN_LABELS.indexOf(action.id)
      if (index < 0) return state
      return gotoIndex(state, index)
    }

    case "gotoIndex":
      return gotoIndex(state, action.index)

    case "openProject": {
      const i = portfolio.projects.findIndex((p) => p.slug === action.slug)
      if (i < 0) return state
      const next = gotoIndex(state, SCREEN_LABELS.indexOf("work"))
      return { ...next, workIndex: i, focus: "main", workDetailOpen: true }
    }

    case "move": {
      if (!state.booted) return state
      if (state.overlay) return state
      if (state.focus === "nav") {
        return gotoIndex(state, wrap(state.cursor + action.delta, SCREEN_LABELS.length))
      }
      if (state.screen === "work" && !state.workDetailOpen) {
        const count = portfolio.projects.length
        return { ...state, workIndex: clamp(state.workIndex + action.delta, 0, count - 1), quitting: false }
      }
      return state
    }

    case "focusMain":
      if (state.focus === "main") return state
      return { ...state, focus: "main", quitting: false }

    case "focusNav":
      if (state.focus === "nav" && !state.workDetailOpen) return state
      return { ...state, focus: "nav", workDetailOpen: false, quitting: false }

    case "open": {
      if (!state.booted || state.overlay || state.quitting) return state
      if (state.screen === "work") {
        if (!state.workDetailOpen) return { ...state, focus: "main", workDetailOpen: true }
        return state
      }
      if (state.focus === "nav") return { ...state, focus: "main", quitting: false }
      return state
    }

    case "back": {
      if (!state.booted) return state
      if (state.quitting) return { ...state, quitting: false }
      if (state.toast) return { ...state, toast: null }
      if (state.workDetailOpen) return { ...state, workDetailOpen: false }
      if (state.focus === "main") return { ...state, focus: "nav" }
      return state
    }

    case "toggleHelp":
      if (!state.booted) return state
      return { ...state, overlay: state.overlay === "help" ? null : "help", quitting: false }

    case "closeOverlay":
      if (!state.overlay) return state
      return { ...state, overlay: null, quitting: false }

    case "cycleTheme":
      return { ...state, themeId: nextThemeId(state.themeId), quitting: false }

    case "setTheme":
      if (!action.id || state.themeId === action.id) return state
      return { ...state, themeId: action.id, quitting: false }

    case "requestQuit":
      if (!state.booted || state.quitting) return state
      return { ...state, quitting: true }

    case "cancelQuit":
      if (!state.quitting) return state
      return { ...state, quitting: false }

    case "confirmQuit":
      if (!state.quitting || state.quitConfirmed) return state
      return { ...state, quitConfirmed: true }

    case "toast": {
      toastSeq += 1
      return { ...state, toast: { id: toastSeq, text: action.text, kind: action.kind ?? "info" } }
    }

    case "clearToast":
      if (!state.toast || state.toast.id !== action.id) return state
      return { ...state, toast: null }
  }
}

function gotoIndex(state: AppState, index: number): AppState {
  const clamped = clamp(index, 0, SCREEN_LABELS.length - 1)
  const id = SCREEN_LABELS[clamped]
  if (state.cursor === clamped && state.screen === id && state.focus === "nav") return state
  return {
    ...state,
    cursor: clamped,
    screen: id,
    focus: "nav",
    workDetailOpen: false,
    quitting: false,
  }
}

function wrap(n: number, len: number): number {
  return ((n % len) + len) % len
}

export interface Store {
  getState(): AppState
  subscribe(listener: () => void): () => void
  dispatch(action: Action): void
}

export function createStore(initial: AppState = initialAppState): Store {
  let state = initial
  const listeners = new Set<() => void>()
  return {
    getState() {
      return state
    },
    subscribe(listener) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    dispatch(action) {
      const next = reduce(state, action)
      if (next === state) return
      state = next
      for (const l of listeners) l()
    },
  }
}
