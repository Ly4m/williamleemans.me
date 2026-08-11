---
name: williamleemans.me
description: "Le schéma vivant — a French-first personal site drawn in charcoal on paper, with one brass signal wire."
colors:
  charcoal: "#252525"
  paper: "#fafafa"
  faded: "#858585"
  faded-ink: "#6b6b6b"
  night: "#1a1a1a"
  signal: "#E4A94D"
  signal-ink: "#8f6a1a"
  # Guest inks — borrowed brand hues, hover-only, on the underline, never state.
  jetdev: "#ff772c"
  jetdev-ink: "#fe5a00"
  scanzee: "#e82483"
typography:
  headline:
    fontFamily: "Space Grotesk, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    letterSpacing: "0.03em"
  title:
    fontFamily: "Space Grotesk, sans-serif"
    fontSize: "0.85rem"
    fontWeight: 700
    lineHeight: 1.3
  body:
    fontFamily: "IBM Plex Mono, monospace"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.6
  longform:
    fontFamily: "IBM Plex Mono, monospace"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "IBM Plex Mono, monospace"
    fontSize: "0.7rem"
    fontWeight: 400
    lineHeight: 1.5
  note:
    fontFamily: "IBM Plex Mono, monospace"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  hairline: "2px"
  card: "3px"
  code: "4px"
  control: "6px"
components:
  card:
    rounded: "{rounded.card}"
    padding: "0.65rem 0.75rem 0.75rem"
  badge-done:
    textColor: "{colors.signal-ink}"
    rounded: "{rounded.hairline}"
    padding: "0.1rem 0.35rem"
  badge-progress:
    textColor: "{colors.charcoal}"
    rounded: "{rounded.hairline}"
    padding: "0.1rem 0.35rem"
---

# Design System: williamleemans.me

## Overview

**Creative North Star: "Le schéma vivant"**

The site is a technical drawing that breathes. Everything on it is drawn in
thin lines on a single sheet: hand-drawn circuit decorations, a dot-grid
ground like graph paper, hairline borders with registration ticks at the
corners, and — on the Now pages — a flow field of drifting streamlines, the
same ink still wet. The atmosphere is **organique, mécanique, étrange**:
mechanical vocabulary (circuits, traces, annotations) rendered by a hand, and
allowed to be slightly eerie rather than merely tasteful. The strangeness of
the flow field sets the tone — and since 2026-08 the constrained pages no
longer hold it in reserve: **la machine respire**. The sheet is never
perfectly still. A few grid intersections swell and fade like signals
testing the paper, pulse runs cross the graph, circuit traces lift off and
re-ink themselves as if a hand came back to correct a line, a dot of ink
walks a visible wire, and the reading hairline never quite dries. The
reserve was spent on the owner's decision, at the owner's volume
("unmistakably alive"), in the incumbent vocabulary only.

The palette is monochrome plus one conductor. Charcoal ink on paper (light),
paper ink on the night sheet (dark), a faded pencil grey for secondary text —
and a single brass wire, **Signal**, that carries every live state: the active
nav rail, the focus ring, the finished-state badge, a caption's tick. Signal
never colors running text; it rides on lines. Motion is entrance, draw-on,
and breath — headings slide down, content waves in with a staggered spring,
circuit traces draw themselves, and the ambient respire layer keeps the
drawing alive afterward — and every one of these defers completely to
`prefers-reduced-motion: reduce`.

**Key Characteristics:**

- One sheet, two registers: flowing (Now, flow field) and constrained
  (everything else, dot grid) — the same thin-line primitive, never a third.
- Monochrome plus one brass Signal, on lines and state only.
- Hairline construction: 1px borders, 3px rails, 6px corner ticks, 2px dots.
- Monospace body under grotesk headings; captions read as annotations.
- Motion draws the page like ink, then keeps it breathing (la machine
  respire); reduced-motion shows the finished drawing, perfectly still.

## Colors

Two inks, a pencil, two sheets, and one brass wire.

### Primary

- **Signal** (#E4A94D): the site's single accent, in its true brass — dark
  mode only, where it reads against the night sheet. It marks state: the
  active nav rail, focus rings, the "done" badge, figcaption ticks, the home
  invitation's tick, and the WL mark. Decorations knock it back to 28–50% washes (`--ink-circuit`); the
  nav rail mixes it 65% toward the page to avoid glare.
- **Signal encré** (#8f6a1a): the same wire in light mode, inked down to clear
  3:1 on Paper — true brass manages only 1.9:1 there. Everything Signal does
  in dark, Signal encré does in light.

### Neutral

- **Charcoal** (#252525): the text ink on light pages; also the inline-code
  chip's ground in both themes (`--color-charcoal`).
- **Paper** (#fafafa): the light page, and the text ink on dark pages
  (`--color-primary-100`, aliased to `--color-page` in light).
- **Faded** (#858585): secondary text — dates, reading times, subtitles, the
  resting state of list rows (`--color-faded`) — on the night sheet, where it
  reads 4.7:1.
- **Faded encré** (#6b6b6b): the same pencil inked down for Paper, where the
  true pencil manages only 3.5:1 against the 4.5:1 its small text needs. One
  token, flipped by theme in `global.css`; the in-article SVG diagrams had
  already chosen this grey for their light-mode annotations.
- **Night** (#1a1a1a): the dark page (`--color-page` in dark). Deliberately
  not Charcoal: the dark sheet is deeper than the light ink.
- **Circuit ink** (rgba(107,107,107,0.65) light / brass washes dark): the
  decoration ink, always via `--ink-circuit` / `--ink-circuit-strong` — never
  hard-coded. The strong variant exists only for decoration over the moving
  flow field.

### Guest Inks

Two brands pass through the home page's prose and hover in their own colour —
on the underline, never the text, obeying the same ≥3:1 line rule as Signal.
**Jetdev orange** hovers its true brand #ff772c on Night, but #fe5a00 on
Paper, the nearest same-hue orange that clears 3:1 (the true brand manages
2.5:1 there). **Scanzee pink** (#e82483) clears 3:1 on both sheets as-is.
Guest inks are borrowed, not part of the palette: hover-only, never state,
never running text — the One Signal Rule still holds. The contact rows'
GitHub and LinkedIn deliberately do **not** wear their brands: GitHub's brand
is black and LinkedIn's blue fails on Night, so both hover in neutral ink;
only Jetdev and Scanzee, in the prose, are guests.

### Named Rules

**The One Signal Rule.** Brass is the only accent on the site, and it carries
state on lines — rails, rings, ticks, badges. It never colors running text,
and nothing else (no green, no blue) may carry state; a second accent is the
defect this rule exists to name.

**The Two Inks Rule.** One accent, two values: #E4A94D on Night, #8f6a1a on
Paper. Light mode never wears true brass — it fails contrast on #fafafa — and
the two are tokens (`--color-brass`, `--color-brass-ink`), mirrored for
non-CSS surfaces only in `src/lib/palette.ts`.

## Typography

**Heading Font:** Space Grotesk (400, 700)
**Body Font:** IBM Plex Mono (400, 400-italic, 500, 600, 700)

**Character:** A grotesk voice over a monospace hand — the headings speak,
the body annotates. The mono body makes every paragraph read like a note on a
schematic; letter-spaced uppercase mono labels are the system's annotation
register.

### Hierarchy

- **Headline** (700, 1.5rem → 1.875rem at `md`, tracking 0.03em): page
  titles (h1), in Space Grotesk; h1 enters with `slide-down`.
- **Title** (700, 0.85rem, lh 1.3): card titles — Space Grotesk shrunk to
  labeling size.
- **Body** (400, 16px, lh 1.6): all running text, IBM Plex Mono. Prose
  measure is 68ch; long-form articles tighten to 62ch at 1.0625rem, because
  mono flattens word shapes and wants the shorter line.
- **Label** (400, 0.7rem, lh 1.5): captions, card subtitles, notes and
  badges — the annotation voice, often uppercase with 0.06em tracking. 0.7rem
  (11.2px) is also the voice's floor: badges once sat at 0.6rem, whose 9.6px
  stopped being legible annotation.
- **Note** (400, 0.75rem, lh 1.5): multi-line running text at card scale —
  the MediaCard note and the skip link. Sentences get the 12px reading floor;
  0.7rem stays reserved for one-line labels.
- **Nav** (400/500, 0.875rem, uppercase, tracking-wide): the rail's items;
  500 marks the active page.

### Named Rules

**The Real Cuts Rule.** Every weight and style the site sets is a real font
file (@fontsource, unicode-range gated); nothing is browser-synthesized. A new
weight means a new import in `global.css`, not a `font-weight` that smears
400 outlines.

## Layout

A fixed left rail and one centered column on the sheet. Desktop: the nav is a
sticky 6rem rail (`w-24`) with the content offset `md:ml-16`; content lives in
a `max-w-4xl` column with `px-4 / sm:px-6 / md:px-10` gutters and
`py-8 / md:py-12 / lg:py-16` vertical rhythm. Reading surfaces narrow further:
`max-w-2xl` for the blog index, 68ch/62ch prose measures for articles. Mobile
(`< md`, 768px — the single layout hinge): the rail becomes a fixed 3.5rem
top bar with the animated WL logo and a hamburger opening a full-screen
overlay menu (slide-in, `inert` while closed).

The ground is part of the layout: a fixed full-page dot grid (1px dots on a
20px cell, 13% ink light / 6% dark) on constrained pages, the flow-field
canvas on Now pages. Both sit behind everything at `z-0`, `pointer-events:
none`.

## Elevation & Depth

The system is flat today: not a single `box-shadow` exists. Depth is conveyed
by line weight (1px hairlines vs 3px rails), ink opacity (13% grid → 65%
decoration → full text), and the register of the ground behind the content.
This is observed fact rather than doctrine — a future shadow is not banned,
but it would be the first one, and it must earn its place against a system
that has never needed it.

## Shapes

Near-square, drawn, and registered. Radii are hairline-small: 2px (badges,
inset images, the focus ring's rounding), 3px (cards, photo frames), 4px
(inline code chips), 6px (`rounded-md`, reserved for touch controls — icon
buttons, the hamburger). Borders are 1px hairlines at low opacity
(rgba(37,37,37,0.15) light / rgba(250,250,250,0.1) dark), waking to ~0.35/0.25
on hover.

The signature form is the **registration tick**: 6px L-shaped corner marks at
the top-left and bottom-right of cards and framed photos, drawn one pixel
outside the border — the crop marks of a technical plate. Rails are 3px solid
Signal; underlines are 1px hairlines that ride 1px below text, never
`text-decoration`.

## Components

The components are **schémas annotés** — annotated schematics. Each one reads
like a figure in a technical drawing: registration ticks for corners, mono
captions for annotations, and state changes drawn as lines growing or borders
waking, never as lifting or glowing.

### Navigation

- **Desktop rail:** uppercase mono items at 0.875rem, resting at 70% opacity;
  hover restores full ink and nudges the label 4px right. The active item
  carries a 3px Signal rail on its left edge; hover on inactive items grows a
  40%-height stub of the same rail — hover and active differ by _length_, not
  opacity. The rail slides between items across page navigations
  (`view-transition-name: nav-rail`); reduced motion keeps position and
  length, dropping only the travel.
- **Mobile:** full-screen overlay, 1.5rem uppercase items with the same rail
  laid on its side (3px underline, `scaleX` 0→1); no hover half-state — it's
  touch-only. Social links and theme toggle sit at the bottom.
- **Dark-mode rail:** Signal mixed 65% toward the page (full brass is the
  loudest thing on a dark page; 65% lands at 4.3:1, above the 3:1 a state
  indicator needs).

### List Rows (blog index)

The dot-leader row: month (tabular-nums, Faded) — a 2px-dot leader line
filling the gap — title — reading time. The title rests in full ink
(Charcoal/Paper) so the list leads with what it lists; month, leader and
reading time rest in Faded and ink up to match on hover, easing in but
snapping off (`group-hover:transition-none`). Years are group headings, so
rows carry only the month.

### Cards (MediaCard — books & games)

- **Corner Style:** 3px radius, hairline border, registration ticks.
- **Background:** transparent — the card is drawn on the sheet, not laid on it.
- **Hover:** the border wakes (0.15 → 0.35 opacity); nothing lifts.
- **Cover:** aspect-locked (2/3 books, 16/9 games), object-fit cover, inset
  at 2px radius.
- **Body:** 0.65–0.75rem padding; badge, then Title, then a Label-voice
  subtitle; the note is running text in the Note voice (0.75rem) — sentences
  don't wear annotation size.

### Badges

Uppercase mono at 0.7rem, 2px radius, hairline border. **Done** wears Signal:
an 8% brass wash with Signal encré text in light (exactly 8% — the pair lands
at 4.51:1 and fails at 12%), a 15% wash with true Signal in dark. **In
progress** stays neutral: 7% ink wash, Charcoal/Paper text. Brass marks the
finished state because state is brass's whole job.

### Icon Controls

Square touch targets (h-8 desktop / h-10–12 mobile), 6px radius, grey resting
ink; hover fills with a faint wash (gray-100/gray-800) and inks the icon to
full. Used for social links, the theme toggle, and the hamburger. Icon-only
controls always carry `aria-label` (and `title` as tooltip).

### Links

In-text links are hairline-underlined (1px, rgba(125,125,125,0.3)), inking to
Charcoal/Paper on hover over 0.3s. The home page's outbound links hover in
their brand's color (the Guest Inks, contrast-corrected to ≥3:1 on Paper);
the owner's own surfaces hover in Signal — brass on the line, never the text.
The exception is recorded, not an oversight: the contact rows (GitHub,
LinkedIn) hover in neutral ink — see Guest Inks. The invitation line above
those rows carries the figcaption tick, promoted: a 1px Signal border-left —
the page's one address to the visitor wears the site's one wire (decided
2026-08-10 over keeping home brass-silent).

### Signature: Circuit Decorations

Hand-drawn SVG circuit fragments (traces, dots, pads, labels) that draw
themselves on page entry (`circuit-draw` via stroke-dashoffset, then
`circuit-appear`). Ink comes only from `--ink-circuit`
(`--ink-circuit-strong` solely for NowDecoration over the moving flow field).
Each page family has its own plate: Home (header, margin, footer), blog list,
blog post, Talks, Now. Blog posts also inject heading traces — a 1px line
drawing itself after each h2 — and a 2px reading-progress hairline at the
viewport top (hidden entirely under reduced motion).

### Signature: The Flow Field

The Now pages' ground: slow drifting streamlines following a simplex flow
field, smearing tails, eerie and organic. Charcoal ink in light mode
(`#2C2C30`, set by eye — deliberately not a token), warm Signal in dark. It
reads the theme per frame, persists across page transitions, and renders a
single static frame under reduced motion.

### Motion Grammar

- `slide-down` (1s, cubic-bezier(0.23,1,0.32,1)): h1 entrance.
- `wave-enter` (0.7s, overshoot spring cubic-bezier(0.34,1.56,0.64,1), 60ms
  stagger, first twelve children only): content columns — everything below
  the first viewport is simply already there.
- `circuit-draw` / `circuit-appear`: decorations and heading traces.
- **La machine respire** (`src/scripts/respire.ts`): the always-on ambient
  layer, four instruments in the decoration ink — six breathing grid dots
  (6–12s cycles, 2–10s dormancy) with a four-dot pulse run every 20–35s;
  a visible trace re-inking every 12–26s (sometimes the whole plate, in
  entrance stagger; the beat is skipped, never spent off-screen); a walking
  signal traversing a visible trace every 18–36s (dynamic SMIL); and the
  reading hairline's 7s ink breath. Every instrument pauses in hidden tabs
  and the whole layer is absent under reduced motion.
- Hover transitions run 0.2–0.3s ease; syntax colors snap on theme toggle
  rather than transitioning.
- **Everything above yields to `prefers-reduced-motion: reduce`** — final
  states shown immediately, the flow field freezes, the progress bar hides.

## Do's and Don'ts

### Do:

- **Do** put every new state indicator in Signal — on a line, a ring, a rail,
  or a badge wash — with #8f6a1a in light and #E4A94D (often mixed toward the
  page) in dark.
- **Do** draw new decorations in `--ink-circuit`; reach for
  `--ink-circuit-strong` only over the flow field.
- **Do** give every container the hairline treatment: 1px border at 0.15/0.1
  opacity, 3px radius, and registration ticks if it frames content.
- **Do** write annotations in the Label voice: IBM Plex Mono, 0.7rem,
  uppercase with tracking when it's a status — never smaller; 0.7rem is the
  legibility floor.
- **Do** pair every animation with its `prefers-reduced-motion: reduce`
  ending: final state visible, information preserved (a rail keeps its
  length; only the travel goes).
- **Do** keep both themes honest in the same change: every color decision
  ships its `.dark` counterpart, and the mobile browser bar follows
  `--color-page`.

### Don't:

- **Don't** introduce a second accent. The green "done" badge was the site's
  only one, and it was removed for carrying state — brass's job.
- **Don't** put brass on running text, or true brass (#E4A94D) on Paper —
  it reads at 1.9:1.
- **Don't** add a third background metaphor. Flowing (flow field) and
  constrained (dot grid) are the same primitive in two registers; a new page
  picks one.
- **Don't** let anything float: no shadows exist today, and depth is drawn
  with line weight and ink opacity. (Current fact, not a ban — the first
  shadow must earn its place.)
- **Don't** hard-code a color a token owns: page grounds, decoration ink, and
  brass all have named sources (`global.css`, mirrored once in
  `src/lib/palette.ts`). The one blessed literal is the flow field's light
  ink (#2C2C30) — don't snap it to Charcoal.
- **Don't** thin the WL mark's strokes; the weight is tuned to survive a 16px
  favicon.
