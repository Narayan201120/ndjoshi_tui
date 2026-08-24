# ndjoshi-tui

```text
bunx ndjoshi-tui
```

Narayan Joshi's portfolio as a real full-screen terminal application — boxed
panels, vim keys, mouse, themes, command palette. Not a webpage that looks
like a terminal; an actual program that runs in yours.

## run it

| you have | command |
| --- | --- |
| bun >= 1.3 (published) | `bunx ndjoshi-tui` |
| this repo | `bun install && bun run src/cli.ts` |
| this repo, via bunx | `bun link` then `bunx ndjoshi-tui` |

Use a real terminal: Windows Terminal (not cmd.exe), Ghostty, iTerm2, Kitty,
Alacritty, or the VS Code terminal.

## keys

```text
j/k / arrows     move            1–7      jump to screen
l / ↵ / →        open            h / ←    back / sidebar
t                next theme      T        theme picker
/                command palette :        shell mode
c                copy email      o        open repo in browser
?                help            esc      menu / close overlay
q                quit (confirm once)
ctrl+x then t    leader → themes   ctrl+x then q   leader → quit
```

## themes

everforest (default) · tokyo-night · catppuccin · gruvbox · nord · synthwave84

`t` cycles, `T` opens the picker, `/ theme <id>` jumps straight there.
Your choice is saved to `~/.config/ndjoshi-tui/tui.json`.

## shell mode

Press `:` and the old static mock becomes a real parser:

```text
narayan@tui:~$ ls projects/
narayan@tui:~$ cat projects/meridian
narayan@tui:~$ mail
narayan@tui:~$ theme synthwave84
```

## headless modes

```text
ndjoshi-tui --json       machine-readable dump of the whole portfolio, exit 0
ndjoshi-tui --resume     resume.md printed to stdout
```

## engine

built on [OpenTUI](https://github.com/anomalyco/opentui) (cell-diff renderer,
zero flicker) running on Bun. no native toolchain needed — prebuilt packages.

## status

- [x] phase 0 — frame, home/about/work, everforest + tokyo night, launches via `bun run src/cli.ts` / linked `bunx ndjoshi-tui`
- [ ] phase 1 — all screens, 6 themes, palette, shell, mouse, config, --json/--resume
- [ ] phase 2 — publish to npm
