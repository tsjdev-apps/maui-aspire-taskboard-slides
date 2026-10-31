# slidev-theme-tsjdevapps

A reusable Slidev theme inspired by [tsjdev-apps.de](https://www.tsjdev-apps.de):
warm off-white, teal accents, rounded cards, Roboto body text, and JetBrains Mono
headings/code. Dark mode uses midnight blue surfaces and mint accent text.
Fonts are package dependencies and are bundled locally; no runtime font CDN is used.

## Use locally

In this repository, put your Markdown in `decks/`:

```md
---
theme: ../themes/tsjdevapps
title: My next talk
author: Thomas Sebastian Jensen
layout: cover
themeConfig:
  language: en
htmlAttrs:
  lang: en
---

# Slides as code

Your introduction.

::right::

A visual, a code block, or a callout.

---
layout: default
section: "01 / Introduction"
---

# One idea per slide
```

From the repository root: `npx slidev decks/my-talk.md --port 3032`.
The theme works without TaskBoard components, content, or bilingual configuration.
`themeConfig.language` localizes the controls (`en` by default, or `de`).

## Layouts and styling

| Layout | Slots | Use |
| --- | --- | --- |
| `cover` | default + `right` | Large introduction / closing statement |
| `default` | default | Full-width Markdown, cards, or diagrams |
| `two-cols` | default + `right` | Equal-width content columns |
| `code` | default + `right` | Wide code column with a narrower explanatory aside |

All layouts include the brand header, appearance control, author footer, and page
number. Optional `section` frontmatter adds the small chapter label.
Appearance controls are hidden in print/overview contexts. The initial appearance
follows Slidev's saved setting or the OS preference; users can toggle it in slide view.
The palettes and Shiki highlighting both respond to Slidev's native color mode.

Useful CSS classes: `tsj-card`, `tsj-cards`, `tsj-chips`, `tsj-note`,
`tsj-callout`, `tsj-source`, and `tsj-step-list` / `tsj-step`.
Modify `styles/theme.css` to change the brand tokens and sizing; configure the code
themes in `setup/shiki.ts`. Keep snippets short enough for the fixed slide canvas.
Mermaid uses matching colors from `setup/mermaid.ts`. Set a diagram's size with its
fence options (e.g. `mermaid {scale:0.6}`): its SVG lives in a shadow root, so ordinary
deck CSS cannot resize it.

## Optional bilingual controls

Create two decks with the **same slide order, names, and animation steps**. Set the
appropriate `language` in each deck:

```yaml
themeConfig:
  language: en
  languages:
    - { code: en, label: EN, path: en, devPort: 3030 }
    - { code: de, label: DE, path: de, devPort: 3031 }
```

`path` is the sibling URL directory for the built deck. `devPort` is used only by
Vite development servers. The example scripts start EN under `/en/` on 3030 and DE
under `/de/` on 3031. A production build keeps both languages on the same origin.
Subdirectory hosting is supported when both bases share a parent, e.g.
`/talks/taskboard/en/` and `/talks/taskboard/de/`.

The link retains the current route and query (including click position). The chosen
appearance is carried in a temporary `tsj-theme` URL parameter because browser
storage is separate for development ports. That parameter is consumed on arrival.
Without `languages`, only the appearance control is displayed.

## Use in another repository

1. In this repository run `npm run theme:pack`.
2. In another Slidev project, install the resulting package:
   `npm install --save-dev <path-to-slidev-theme-tsjdevapps-1.0.0.tgz>`.
3. Set `theme: tsjdevapps` in its headmatter.
4. Start Slidev normally. No source build of the theme is necessary.

The package includes its layouts, components, styles, Shiki setup, documentation,
and MIT license. Publishing to npm is optional and has **not** been performed.
Requires Slidev 53+. Use Node 22.12+.

For Slidev 53, the example's consuming project pins DOMPurify `3.4.17`, image-size
`2.0.4`, and FloatingVue `5.2.2` via npm overrides for current patch/compatibility
issues. Copy those overrides from the
[example package.json](https://github.com/tsjdev-apps/maui-aspire-taskboard-slides/blob/main/package.json)
when using the same toolchain elsewhere; npm does not inherit library overrides.

## Export

Slidev CLI exports support `--dark` and `--with-clicks`. PDF/PNG output is static;
token animation and language switching are available only in the web deck.
Print styles hide the header controls. Speaker notes are a deck concern, not part
of the theme.
