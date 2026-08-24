# ndjoshi-tui

A real full-screen TUI that *is* the portfolio. Not a webpage that looks like a terminal.

Current site: [narayan-joshi.netlify.app](https://narayan-joshi.netlify.app) — static mock (`cat about.md`, `ls projects/`). The upgrade is going from *looks like a TUI* to *is a TUI*.

```text
bunx ndjoshi-tui
```

Same content. Keyboard-driven. Feels like OpenCode, not like a fancy CLI.

---

## 1. Product

**`ndjoshi-tui`** — installable terminal app. Recruiters with Bun get a full-screen application. Node-only people get the same app once compiled binaries ship (v1.1). A web twin can later replace the Netlify mock so people who will not install still get the same UI.

### What to steal

| From | Steal |
| --- | --- |
| **btop++** | Full-screen boxed panels, mouse + vim keys, theme picker, footer with highlighted keys, braille/block graphs, ESC menu, resize-aware layout |
| **OpenCode** | `/` command palette, leader-key chords, sidebar + main pane, toast, `tui.json` config, help overlay, dual bun/npm install, cell-diff renderer (OpenTUI) |

What **not** to copy: OpenCode’s release-engineering empire on day one. v1 is `bunx`. Binaries and `npx` come after a stranger has actually run it.

### Two modes (this is the identity)

The current brand is `narayan@portfolio:~$ cat about.md`. Real TUIs are panel apps. Keep both.

**Dashboard mode** (default, btop / OpenCode)

```text
┌─ ndjoshi-tui  v0.1.0 ── everforest ── ● available ──────────┐
│  [1] home  [2] about  [3] work  [4] stack  [5] log  [6] net │
├──────────────┬──────────────────────────────────────────────┤
│ NAV          │  NARAYAN JOSHI                               │
│ ▶ home       │  Backend · AI/ML · RAG / LLM orchestration   │
│   about      │                                              │
│   work       │  ┌ Meridian ──────── ACTIVE ─┐               │
│   stack      │  │ Expo · FastAPI · Whisper  │               │
│   log        │  └───────────────────────────┘               │
│   github     │  ┌ DocuMind ──────── ACTIVE ─┐               │
│   contact    │  │ Django · FAISS · DeepEval │               │
│              │  └───────────────────────────┘               │
│              │  langs  ████████░░ py  ░░ ts  ░ c++          │
├──────────────┴──────────────────────────────────────────────┤
│ j/k move  ↵ open  / cmd  : shell  t theme  ? help  q quit   │
└─────────────────────────────────────────────────────────────┘
```

**Shell mode** (`:` or `i`) — current site, but a real parser

```text
narayan@tui:~$ ls
about.md  projects/  experience/  education.json  resume.pdf  contact
narayan@tui:~$ cat projects/meridian
narayan@tui:~$ open meridian
narayan@tui:~$ mail
narayan@tui:~$ theme synthwave84
```

Toggle like vim. Dashboard is the wow. Shell is the brand.

---

## 2. Engine: OpenTUI, not Ink

The product requirement is **feel**. OpenCode daily: keypress is instant, footer does not blink, scroll does not tear, layout does not reflow like a webpage. That is the bar.

Ink will not hit it. Ink is React → stringify the screen → reprint. Hard cap around 30 FPS. Fine for a spinner and a prompt. Wrong for “this is an app I live in.” Claude Code / Gemini CLI sit on Ink; those are the TUIs people call flickery.

OpenCode’s team already had a TUI (Go + Bubble Tea). They wanted TypeScript and **skipped Ink on purpose**. They built OpenTUI: a Zig renderer that updates **cells that changed**.

| What you feel in OpenCode | Ink | OpenTUI |
| --- | --- | --- |
| Keypress is instant | often a frame late | yes |
| No flicker on move/resize | common, especially Windows | cell-diff, like btop |
| Scroll region that stays put | bolted on | real scroll boxes |
| Mouse actually works | second-class | first-class |
| Panels don’t jump | Yoga, fights you | flexbox in the native core |
| Takes over the terminal | “CLI in fullscreen” | “application” |

A portfolio is mostly static, so Ink’s FPS cap hurts less than it hurts OpenCode. The shitty part is still there: selection strobing, footer redrawing, mouse feeling fake, resize looking drunk. That is the renderer. You cannot theme your way out of it.

**Decision: Bun + OpenTUI** (`@opentui/core` + `@opentui/react` or Solid — OpenCode uses Solid).

### What OpenTUI actually requires

Zig is **not** required for consumers. Prebuilt native libs ship as optional packages (`@opentui/core-darwin-arm64`, `linux-x64`, etc.).

| Runtime | Bar |
| --- | --- |
| **Bun** | ≥ 1.3 — first-class. This is the real target. |
| **Node** | ≥ 26.4.0 + `node --experimental-ffi app.mjs` |
| **Node, tested** | Linux x64 only |
| **CJS** | Hard fail |

That is why v1 is `bunx`, not “import OpenTUI from a normal Node CLI.” OpenCode itself does not run as JS in the user’s Node. It ships a compiled binary (`bun build --compile`) and the npm package is a wrapper. Same model here, later.

### Compile time (so this is not a mystery)

You almost never wait on a compile while building.

| When | Time |
| --- | --- |
| Daily dev (`bun run src/cli.ts`) | ~0 extra. No Zig. No `--compile`. |
| Same-machine `bun build --compile` | ~0.1–2 s (OpenTUI app: a few seconds) |
| Cross-compile, first time | ~4–8 s (downloads that target’s Bun) |
| Full matrix (5–8 targets) in CI | ~1–2 min |
| Wiring CI + npm stub + terminal testing | **~1 day, once** |

Binary size is the real tax: **~50–100 MB per platform** because Bun’s runtime is inside. Ink’s tarball is a few hundred KB. Do not pay this until v1.1.

---

## 3. One command

A person runs the full TUI in their terminal in one command. That is the point.

| They have | One command | What happens |
| --- | --- | --- |
| **Bun** | `bunx ndjoshi-tui` | Downloads, opens the TUI. v1. |
| **Node / npm** | `npx ndjoshi-tui` | Works **after** compiled binaries (v1.1). Without that, OpenTUI will not reliably start on their Node. |
| **Neither** | install script, or SSH later | Two steps, or zero local install. |

First run downloads. After that it is instant.

They need a real terminal (Ghostty, iTerm, Windows Terminal, VS Code terminal). Not a browser tab, not old `cmd.exe`. Same as OpenCode.

**v1:** `bunx ndjoshi-tui`  
**v1.1:** `npx ndjoshi-tui` via per-platform binaries  
**Phase 3 optional:** `ssh tui.yourdomain` — no Node, no Bun

---

## 4. Themes (6)

Default: **Everforest** (daily driver). `t` cycles. `/ theme <name>` jumps. `T` opens the picker.

| id | vibe |
| --- | --- |
| `everforest` | **default** — warm green, low contrast |
| `tokyo-night` | OpenCode-adjacent |
| `catppuccin` | mocha |
| `gruvbox` | dark |
| `nord` | cool |
| `synthwave84` | neon magenta/cyan on purple-black |

Each theme is a token file. Screens never hardcode hex.

```ts
type Theme = {
  id: string
  name: string
  bg: string        // canvas
  bgPanel: string   // panel fill
  fg: string        // body
  muted: string     // comments, dates
  accent: string    // titles, selected
  green: string     // ACTIVE, available
  yellow: string    // keys in footer
  red: string       // quit, errors
  magenta: string   // slugs, paths
  border: string    // box drawing
  selBg: string     // reverse-video selection
  selFg: string
}
```

### Everforest (dark medium)

| token | hex |
| --- | --- |
| bg | `#2d353b` |
| bgPanel | `#232a2e` |
| fg | `#d3c6aa` |
| muted | `#7a8478` |
| accent | `#a7c080` |
| green | `#a7c080` |
| yellow | `#dbbc7f` |
| red | `#e67e80` |
| magenta | `#d699b6` |
| border | `#4f585e` |
| aqua / blue | `#7fbbb3` |
| orange | `#e69875` |

### Synthwave ’84

| token | hex |
| --- | --- |
| bg | `#262335` |
| bgPanel | `#241b2f` |
| fg | `#f8f8f2` |
| muted | `#848bbd` |
| accent | `#ff7edb` |
| green | `#72f1b8` |
| yellow | `#fede5d` |
| red | `#fe4450` |
| magenta | `#ff7edb` |
| cyan | `#36f9f6` |
| border | `#495495` |
| orange | `#f97e72` |

### Tokyo Night (reference)

| token | hex |
| --- | --- |
| bg | `#1a1b26` |
| fg | `#c0caf5` |
| accent | `#7aa2f7` |
| green | `#9ece6a` |
| yellow | `#e0af68` |
| magenta | `#bb9af7` |
| muted | `#565f89` |
| red | `#f7768e` |
| border | `#3b4261` |

Persisted in `~/.config/ndjoshi-tui/tui.json`:

```json
{
  "theme": "everforest",
  "vim": true,
  "network": true
}
```

---

## 5. Screens

| Key | Screen | What it does |
| --- | --- | --- |
| `1` | **Home** | ASCII banner, one-liner, 3 project cards, availability, language bars |
| `2` | **About** | Bio, education, “currently building” |
| `3` | **Work** | Project list like btop’s process table. `j/k` select, `↵` detail (readme, stack, github, status) |
| `4` | **Stack** | Grouped skills with level bars (Backend / AI / Frontend / DevOps) |
| `5` | **Log** | Experience as `git log --oneline`, `↵` for the commit body |
| `6` | **GitHub** | Live stats if network is up; cached snapshot if not |
| `7` | **Net** | Email (copy), GitHub, web, availability. Optional QR later |
| `?` | **Help** | Full keymap |
| `t` / `T` | **Themes** | Cycle / picker for all 6 |
| `esc` | **Menu** | Theme, github fetch on/off, vim keys on/off |
| `/` | **Palette** | Fuzzy commands |
| `:` | **Shell** | Real parser |

Boot: short splash (`ndjoshi-tui` + version + “press any key”) then Home. Feels like a program, not a webpage.

---

## 6. Keymap

OpenCode-shaped. Lock this before writing screens.

```text
j / ↓ / n        next item
k / ↑ / p        prev item
h / ←            back / sidebar
l / → / ↵        open / forward
1–7              jump screen
g g / G          top / bottom
/                command palette
:                shell mode
esc              menu / close overlay
t                next theme
T                theme picker
c                copy email
o                open selected GitHub in browser
r                reload GitHub stats
?                help
q / ctrl+c       quit (confirm once, restore terminal)
ctrl+x then t    leader → themes
ctrl+x then q    leader → quit
```

Mouse: click sidebar, cards, footer hints, scroll wheels. Same as btop.

Palette commands: `about`, `projects`, `open meridian`, `theme everforest`, `theme synthwave84`, `resume`, `mail`, `quit`.

---

## 7. Visual system

btop discipline. OpenCode density.

- Every panel is a real box (`┌─┐│└┘`), never a CSS card pretending.
- Footer is inverted-key hints: `↵ open` not “Press Enter to open”.
- Selected row is reverse-video (`selBg` / `selFg`), not a left border.
- Graphs are braille (`⣿⣷⣤`) or block (`█▓▒░`), not emoji charts.
- No emoji in TUI chrome. Optional in content only.
- 80×24 must work. 120×40 is the designed size. Resize recalculates layout.
- Truecolor. Themes are 24-bit. Degrade only if the terminal cannot.

---

## 8. Data model

Edit once. Both TUI and any future web twin read this.

```ts
type Portfolio = {
  person: {
    name: string
    handle: string
    role: string
    location: string
    availability: string
    email: string
    links: { github: string; web: string; linkedin?: string }
  }
  about: {
    blurb: string
    currently: string
    education: { school: string; program: string; dates: string; detail?: string }[]
  }
  projects: {
    slug: string
    name: string
    status: "ACTIVE" | "ARCHIVED"
    dates: string
    oneLiner: string
    bullets: string[]
    stack: string[]
    repo: string
    demo?: string
  }[]
  skills: { group: string; items: { name: string; level: 1 | 2 | 3 | 4 | 5 }[] }[]
  experience: { org: string; title: string; dates: string; bullets: string[] }[]
  certs: { name: string; issuer: string }[]
  resume: { markdown: string; url?: string }
}
```

### Content (from the current site)

**Person**

- Name: Narayan Joshi
- Handle: `ndjoshi` / GitHub `Narayan201120`
- Role: Backend Developer & AI/ML Engineer (RAG, LLM orchestration, scalable APIs)
- Email: `joshi.narayan2004@gmail.com`
- Web: https://narayan-joshi.netlify.app
- GitHub: https://github.com/Narayan201120
- Availability: Available for work

**About**

Final-year B.E. at Sinhgad Institute of Technology & Science, Pune. Bridges complex AI logic with backend infrastructure (Django, Python, vector DBs). Currently building Meridian and DocuMind.

**Projects**

1. **Meridian** — Full-stack productivity platform (Jan 2026 – Present, ACTIVE). Offline-first Expo/FastAPI, Supabase Realtime, Whisper transcription, two-way Google Calendar + Outlook sync. Tech: React Native, Expo, FastAPI, Supabase, PostgreSQL, Redis, Whisper API, FCM. Repo: `Narayan201120/meridian`
2. **DocuMind** — Production RAG / MLOps (Nov 2025 – Present, ACTIVE). Multi-tenant React/Django, FAISS + cross-encoder rerank, BYOK LLM routing, DeepEval. Tech: Django, React, FAISS, PostgreSQL, DeepEval, RAG, JWT. Repo: `Narayan201120/rag_web_app`
3. **ARGUS** — AI orchestration framework (Sept 2025 – Present, ACTIVE). Route across models by complexity/cost/quality. Tech: Python, AI Agents, LLM routing. Repo: `Narayan201120/argus`

**Skills**

- Backend: Python, Django, DRF, FastAPI, Node.js, JWT, Celery + Redis, PostgreSQL, Supabase, WebSockets
- AI/ML: RAG, LLMs (OpenAI, Gemini, Llama), Whisper, Semantic Search, pgvector, FAISS, AI Agents, DeepEval
- Frontend / mobile: React, React Native, Expo
- Tools: Docker, Git, Linux, Postman, Power BI, FCM

**Experience**

- Power BI Intern, KasNet Technologies, Pune (Jan–Mar 2025)
- Data Science & Analytics Intern, Zidio Development, Remote (May–Aug 2024) — 40% less manual prep

**Education**

- B.E. Electronics & Telecommunication, SITS Narhe, 2026, T.E. CGPA 8.55
- HSC, S B Junior College Jalna, 2022, 58.83%

**Certifications**

- IBM – Enterprise Grade AI
- Deloitte Australia – Data Analytics Job Simulation
- Spoken Tutorial – C / C++

GitHub live data is a **cache with TTL**, never a hard dependency:

```text
~/.cache/ndjoshi-tui/github.json    # 1h TTL
```

If fetch fails, show the snapshot and a dim `offline` badge. A portfolio that crashes without Wi‑Fi is unusable in an interview.

---

## 9. Repo layout

```text
ndjoshi-tui/
├── package.json                 # name: ndjoshi-tui
│                                # bin: { "ndjoshi-tui": "./bin/ndjoshi-tui.js" }
├── bin/ndjoshi-tui.js           # #!/usr/bin/env bun  (or node stub later)
├── src/
│   ├── cli.ts                   # bun entry
│   ├── app.tsx                  # OpenTUI root: header, sidebar, main, footer
│   ├── screens/
│   │   ├── home.tsx
│   │   ├── about.tsx
│   │   ├── work.tsx
│   │   ├── stack.tsx
│   │   ├── log.tsx
│   │   ├── github.tsx
│   │   ├── net.tsx
│   │   └── help.tsx
│   ├── components/
│   │   ├── frame.tsx
│   │   ├── sidebar.tsx
│   │   ├── footer.tsx
│   │   ├── panel.tsx
│   │   ├── palette.tsx
│   │   ├── menu.tsx
│   │   ├── splash.tsx
│   │   └── shell.tsx
│   ├── commands/
│   │   ├── palette.ts
│   │   └── shell.ts             # cat, ls, open, mail, theme, help, quit
│   ├── keymap.ts
│   └── themes/
│       ├── index.ts
│       ├── everforest.ts        # default
│       ├── tokyo-night.ts
│       ├── catppuccin.ts
│       ├── gruvbox.ts
│       ├── nord.ts
│       └── synthwave84.ts
├── data/portfolio.ts            # single source of content
└── README.md                    # bunx ndjoshi-tui at the top
```

Core idea: `data/` and view-model (screen, selection, keymap, commands) have **zero** `process.stdout` / DOM. The OpenTUI renderer subscribes. A future web twin can subscribe to the same model.

`package.json` shape:

```json
{
  "name": "ndjoshi-tui",
  "version": "0.1.0",
  "type": "module",
  "bin": { "ndjoshi-tui": "./bin/ndjoshi-tui.js" },
  "files": ["dist", "bin", "src", "data"],
  "engines": { "bun": ">=1.3" }
}
```

Entry file starts with a shebang. That is the difference between a library and a program.

---

## 10. CLI flags

```text
ndjoshi-tui                      interactive TUI
ndjoshi-tui work                 jump to projects
ndjoshi-tui --theme everforest
ndjoshi-tui --theme synthwave84
ndjoshi-tui --resume             print resume markdown, exit
ndjoshi-tui --json               machine-readable dump, exit 0
ndjoshi-tui --no-color
ndjoshi-tui --no-network         skip GitHub fetch
```

`--resume` and `--json` matter: a hiring bot or a human who hates TUIs still gets the data.

---

## 11. Distribution

| Channel | Command | Who | When |
| --- | --- | --- | --- |
| bunx | `bunx ndjoshi-tui` | anyone with Bun | v1 |
| global bun | `bun add -g ndjoshi-tui` | daily use | v1 |
| npx | `npx ndjoshi-tui` | Node-only | v1.1 (compiled binaries) |
| GitHub README | `bunx ndjoshi-tui` at the top | discovery | v2 |
| web twin | existing Netlify URL | everyone else | Phase 3 |
| SSH | `ssh tui.yourdomain` | the flex | Phase 3 |

Put this at the top of GitHub profile README and, later, the Netlify site:

```text
bunx ndjoshi-tui
```

That one line *is* the portfolio.

OpenCode-style binary shipping (v1.1):

1. Develop on Bun + OpenTUI
2. `bun build --compile` per target (mac arm/x64, linux x64/arm, win x64)
3. npm `ndjoshi-tui` is a thin stub that runs the matching binary
4. `bunx` in dev still runs source
5. Do not `import @opentui/core` from a stranger’s Node 22

---

## 12. Phases

### Phase 0 — it launches

- `data/portfolio.ts` with current content
- OpenTUI frame: header, sidebar, main, footer
- Home + About + Work list/detail
- Everforest (default) + Tokyo Night
- `j/k`, `↵`, `1–3`, `q`, `?`
- `bunx .` / `bun run src/cli.ts` opens a real TUI

**Exit:** someone clones the repo and `bunx .` gets a real TUI.

### Phase 1 — it feels like OpenCode

- Stack, Log, Net, GitHub (cached) screens
- All 6 themes, `t` / `T` / `/ theme`
- Command palette `/`
- Shell mode: `cat`, `ls`, `open`, `mail`, `theme`, `help`, `quit`
- Mouse clicks
- Leader key `ctrl+x`
- Config `~/.config/ndjoshi-tui/tui.json`
- `--resume` / `--json`

### Phase 2 — other people can run it

- Publish `ndjoshi-tui` to npm
- README + GitHub profile lead with `bunx ndjoshi-tui`
- Copy email, `o` opens repo
- GitHub stats cache with TTL
- Splash + clean quit (terminal restored, no garbage)

### Phase 3 — Node people + flex

- `bun build --compile` per platform so `npx ndjoshi-tui` works
- Web twin replacing the Netlify mock (same data, same keys)
- Optional `ssh tui.yourdomain`
- QR for contact, resume viewer polish
- Easter eggs (`htop` showing projects as processes, `sudo rm -rf /`, etc.)

Do not start Phase 3 before a stranger has run `bunx ndjoshi-tui`.

---

## 13. v1 done when

A stranger with Bun runs:

```text
bunx ndjoshi-tui
```

They get:

1. Splash → Home in **Everforest**
2. `t` hits **Synthwave ’84** and cycles the rest of the set
3. `j/k` through the sidebar, `↵` into Meridian, `o` opens GitHub
4. `/` then `mail` copies `joshi.narayan2004@gmail.com`
5. `:` then `ls projects/` lists meridian, documind, argus
6. `q` quits cleanly (terminal restored, no garbage)
7. `ndjoshi-tui --json` prints the portfolio and exits 0

If those 7 work, it is a TUI. Everything else is polish.

---

## 14. Risks

- **Windows terminals** — test in Windows Terminal, not cmd.exe. Box-drawing fallbacks if needed.
- **Native optional deps skipped** — `npm` may omit `@opentui/core-<platform>`. First render then throws. v1 is bunx; bun installs optionals. v1.1 binaries avoid this class of bug.
- **Alpine / musl** — `OPENTUI_LIBC` must be set *before* import. Do not care in v1.
- **GitHub rate limits** — unauthenticated 60 req/hr. Cache. Never block render on fetch.
- **Content drift** — one `data/portfolio.ts`. Any web twin imports it, does not copy it.
- **Overbuilding the shell** — v1 parser is ~12 commands. Not bash.
- **npx without binaries** — do not advertise `npx ndjoshi-tui` until v1.1. Advertising a command that dies on Node 22 is worse than not having it.
- **Binary size** — 50–100 MB each. Acceptable for OpenCode; heavy for a portfolio. That is why binaries are v1.1, not v1.

---

## 15. Not in v1

Compiled binaries, SSH, web twin, easter eggs, live uncached GitHub as a hard dependency, i18n, music, 3D (`@opentui/three`).

---

## 16. Decisions (locked)

| # | Decision |
| --- | --- |
| Engine | OpenTUI on Bun. Not Ink. |
| v1 command | `bunx ndjoshi-tui` |
| Default theme | Everforest |
| Extra themes | Synthwave ’84 + Tokyo Night, Catppuccin, Gruvbox, Nord |
| v1 surfaces | TUI only. Web twin is Phase 3. |
| v1 depth | Dashboard + shell + 6 themes + palette |
| Package name | `ndjoshi-tui` |

---

## 17. Architecture (for later swap / web twin)

```text
┌─────────────────────────────────────────┐
│  data/portfolio.ts   (single source)    │
│  core: screens, keymap, commands, theme │
└──────────────┬──────────────┬───────────┘
               │              │
        ┌──────▼─────┐  ┌─────▼──────┐
        │ OpenTUI    │  │ Web twin   │
        │ bunx / bin │  │ (Phase 3)  │
        └────────────┘  └────────────┘
```

Core has no I/O. OpenTUI is the v1 renderer. A CSS or xterm twin can attach later without rewriting content or keybinds.
