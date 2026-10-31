# Slidev + .NET MAUI + Aspire

Developer-first presentations about [Slidev](https://sli.dev/), using my [.NET 10 MAUI Aspire TaskBoard](https://github.com/tsjdev-apps/maui-aspire-taskboard) as a real example.

- **18 matching slides in [English](decks/en.md) and [German](decks/de.md)**.
- **Light / dark switch**, inspired by [tsjdev-apps.de](https://www.tsjdev-apps.de).
- C# snippets, line highlighting, **Shiki Magic Move**, Mermaid, and speaker notes.
- Reusable local **[tsjdevapps theme](themes/tsjdevapps/README.md)** with bundled fonts.

## Start

Install **Node.js 22.12+** (Node 24 LTS recommended), then:

```powershell
git clone https://github.com/tsjdev-apps/maui-aspire-taskboard-slides.git
cd maui-aspire-taskboard-slides
npm ci
npm run dev
```

Open **[English](http://localhost:3030/en/)** or **[German](http://localhost:3031/de/)**. The top-right controls switch language and appearance, keeping the slide and click position. Both development servers must run for the language switch; `dev:en` / `dev:de` can run one language individually. Use  arrow keys for code steps and slides. No .NET SDK, MAUI workload, Docker, or Azure account is needed for the presentations.

## Build, export, check

| Command | Result |
| --- | --- |
| `npm run build` | Both web decks in `dist/en/` and `dist/de/`; landing page in `dist/` |
| `npm run preview` | Built site at <http://localhost:4173/> |
| `npm run export:en` / `npm run export:de` | Light PDFs in `exports/` |
| `npm run export:en:dark` / `npm run export:de:dark` | Dark PDFs in `exports/` |
| `npm run typecheck` | Check theme and component types |
| `npm test` | Browser tests against the built site; run `build` first |

For PDF export and browser tests, install Chromium once:
`npx playwright install chromium`. PDF is static; add `-- --with-clicks` to an
export command to include animation steps as separate pages.

Hosting in a subdirectory:
`npm run build -- --base /maui-aspire-taskboard-slides/`.
Upload the **whole** `dist/` directory. The host must rewrite non-file paths under
`en/*` to `en/index.html` and `de/*` to `de/index.html`, relative to that base.
The preview server already does this. Public builds omit speaker notes.

Dependency overrides patch DOMPurify/image-size and keep FloatingVue compatible
with Slidev's current TwoSlash integration.

## Your next deck

Create `decks/my-talk.md`:

```md
---
theme: ../themes/tsjdevapps
title: My next talk
layout: cover
themeConfig:
  language: en
---

# My next developer talk
```

Run `npx slidev decks/my-talk.md --port 3032`. The appearance switch is automatic; language links are optional. See the [theme guide](themes/tsjdevapps/README.md) for layouts, bilingual configuration, and using the theme in another repository.
