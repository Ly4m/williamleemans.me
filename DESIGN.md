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
    fontFamily: "Alegreya, Georgia, serif"
    fontSize: "1.875rem"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "0"
  headline-md:
    fontFamily: "Alegreya, Georgia, serif"
    fontSize: "2.25rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0"
  subhead:
    fontFamily: "Alegreya, Georgia, serif"
    fontSize: "1.125rem"
    fontWeight: 700
    lineHeight: 1.4
  title:
    fontFamily: "Alegreya, Georgia, serif"
    fontSize: "1.05rem"
    fontWeight: 700
    lineHeight: 1.3
  body:
    fontFamily: "Alegreya, Georgia, serif"
    fontSize: "1.25rem"
    fontWeight: 400
    lineHeight: 1.6
  longform:
    fontFamily: "Alegreya, Georgia, serif"
    fontSize: "1.375rem"
    fontWeight: 400
    lineHeight: 1.7
  longform-sm:
    fontFamily: "Alegreya, Georgia, serif"
    fontSize: "1.1875rem"
    fontWeight: 400
    lineHeight: 1.7
  ident:
    fontFamily: "Alegreya, Georgia, serif"
    fontSize: "0.8125rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.11em"
  expression:
    fontFamily: "Alegreya, Georgia, serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.55
  note:
    fontFamily: "Alegreya, Georgia, serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
  notation:
    fontFamily: "Azeret Mono, ui-monospace, monospace"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0"
    fontFeature: "tabular-nums"
  figure:
    fontFamily: "Azeret Mono, ui-monospace, monospace"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.4
    fontFeature: "tabular-nums"
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
    typography: "{typography.ident}"
    textColor: "{colors.signal-ink}"
    rounded: "{rounded.hairline}"
    padding: "0.1rem 0.35rem"
  badge-progress:
    typography: "{typography.ident}"
    textColor: "{colors.charcoal}"
    rounded: "{rounded.hairline}"
    padding: "0.1rem 0.35rem"
  article-signoff:
    rounded: "{rounded.card}"
    padding: "0.85rem 1rem 0.75rem"
    textColor: "{colors.charcoal}"
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
nav pad, the focus ring, the finished-state badge, a caption's tick. Signal
never colors running text; it rides on lines. Motion is entrance, draw-on,
and breath — headings slide down, content waves in with a staggered spring,
circuit traces draw themselves, and the ambient respire layer keeps the
drawing alive afterward — and every one of these defers completely to
`prefers-reduced-motion: reduce`.

The type is the drawing's other instrument: **la partition**, a graphic score.
Since 2026-08 the site sets two families in three registers — a roman voice
that both speaks and reads, its italic as the expression register, and a
monospace kept for notation and measurement. Type is assigned here by job,
not by size.

**Key Characteristics:**

- One sheet, two registers: flowing (Now, flow field) and constrained
  (everything else, dot grid) — the same thin-line primitive, never a third.
- Monochrome plus one brass Signal, on lines and state only.
- Hairline construction: 1px borders and traces, 6px corner ticks, 2px dots,
  4–7px pads.
- One roman voice for headings and prose, its italic for annotation, a
  monospace for figures alone — two families, three registers.
- Motion draws the page like ink, then keeps it breathing (la machine
  respire); reduced-motion shows the finished drawing, perfectly still.

## Colors

Two inks, a pencil, two sheets, and one brass wire.

### Primary

- **Signal** (#E4A94D): the site's single accent, in its true brass — dark
  mode only, where it reads against the night sheet. It marks state: the
  active nav pad and its spur, focus rings, the "done" badge, figcaption
  ticks, the home invitation's tick, and the WL mark. Decorations knock it
  back to 28–50% washes (`--ink-circuit`); the nav pad mixes it 65% toward the
  page to avoid glare.
- **Signal encré** (#8f6a1a): the same wire in light mode, inked down to clear
  3:1 on Paper — true brass manages only 1.9:1 there. Everything Signal does
  in dark, Signal encré does in light.

### Neutral

- **Charcoal** (#252525): the text ink on light pages; also the inline-code
  chip's ground in both themes (`--color-charcoal`), and the light-mode
  selection ground.
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
  hard-coded. The strong variant has two consumers and only two: decoration
  over the moving flow field, and the nav's hover pad — the step that lets
  hover read as _more ink_ before active adds brass.

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
state on lines — pads, spurs, rings, ticks, badges. It never colors running text,
and nothing else (no green, no blue) may carry state; a second accent is the
defect this rule exists to name.

**The Two Inks Rule.** One accent, two values: #E4A94D on Night, #8f6a1a on
Paper. Light mode never wears true brass — it fails contrast on #fafafa — and
the two are tokens (`--color-brass`, `--color-brass-ink`), mirrored for
non-CSS surfaces only in `src/lib/palette.ts`.

**The Inverted Selection Rule.** Dragged text takes ink and paper, inverted
per theme (`::selection`), never brass — a selection is not a live control,
and the platform blue is the one surface that gives an undesigned page away.

## Typography

**Voice (headings and prose):** Alegreya — roman 400 / 500 / 700, italic 400
(`--font-voice`, with Georgia then a generic serif behind it)
**Notation:** Azeret Mono 400 (`--font-notation`, with `ui-monospace` behind it)

Exactly two families, self-hosted via @fontsource, five real font files. The
count is enforced, not merely intended: `scripts/guard/weight.mjs` asserts two
families per page. Tokens are named for the **role**, never for the face — a
register may change its face, a face may not change its job. The old
`--font-space` / `--font-sans` are gone, and `--font-sans` is the cautionary
tale: it was bound to a monospace, which is how a mono ended up setting every
paragraph on the site. `--default-font-family` and `--default-mono-font-family`
now name the default explicitly so that cannot recur.

**Character:** A score, not a UI kit. The roman speaks and reads with the same
voice — a monograph sets a heading, it does not shout one — its italic
annotates in the margin the way an expression mark does, and the mono is kept
back for what it is genuinely better at: figures, dates, code. Nothing is
synthesised.

### Hierarchy

- **Headline** (Alegreya 700, 1.875rem → 2.25rem at `md`, tracking 0): page
  titles (h1), across all seven page files. At 36px over a 20px body that is
  1.8× — monograph reading scale, not display scale. The grotesk's 0.03em
  tracking is gone, because positive tracking on a seriffed bold breaks word
  shapes apart. h1 still enters with `slide-down`.
- **Subhead** (Alegreya 700, 1.5rem): section headings inside a page — the
  Now entries' h3 ("Lecture", "Gaming"). 24px, because they introduce a 20px
  body: at the old 1.125rem they sat _below_ the text they were heading.
- **Title** (Alegreya 700, 1.05rem, lh 1.3): list-row titles (AlbumRow) and
  MediaCard titles — one step, not two.
- **Body** (Alegreya 400, 1.25rem, lh 1.6): all running text, unclassed —
  the voice is the page default, which is why there is deliberately no
  `.register-voice`. 20px, arrived at in two corrections; see the x-height
  rule below. **`.prose` sets 20px explicitly** (lh 1.65) — left at
  Typography's own 1rem it rendered every non-article prose block at 16px,
  7.30px of x-height, below the 8.26px the old 16px monospace drew. The ramp
  is 20 / 20 / 22 (body / prose / article), never 20 / 16 / 22.
- **Longform** (Alegreya 400, 1.375rem, lh 1.7, dropping to 1.1875rem under
  768px): article prose (`.prose-longform`) — the surface the whole change
  exists for, so it carries the clearest step of the ramp. The measure lives
  on `.prose` and is inherited; this rule sets only the size. On a phone the
  viewport binds the line rather than the `ch` measure, so size alone decides
  how many characters fit. **The size is a token, `--size-longform`**, because
  two rules have to agree on it: the prose that reads at it, and
  `.article-measure`, which resolves the closing blocks' `55ch` against it (see
  Layout). The mobile step lives on the token too, so the closing blocks narrow
  with the prose rather than needing their own breakpoint.
- **Article heads** (`.prose-longform` h2 1.3em / h3 1.1em): 28.6px and
  24.2px against a 36px h1 and a 22px body — steps of 1.26× / 1.18× / 1.10×.
  Typography's 1.5em/1.25em defaults put h2 at 33px, **1.09× under the h1**
  (1.05× on mobile) in the same family, weight, colour and tracking, so a
  reader scanning for the next section got no landmark. The heads come down
  rather than the title going up: 36px over a 20px body is already the
  monograph scale this file argues for. The second axis is a MARK, never a
  weight, and only h2 gets one: a section trace across the whole measure,
  UNDERLINING the heading (see Components). h3 carries nothing, so the two levels
  differ in kind rather than by 4px. Typography asks `strong` for a 600
  Alegreya does not ship, which resolves to the same 700 the heads wear, so
  `.prose strong` names 700 outright.
- **Ident** (`.register-ident` — Alegreya 500, roman caps, tracking 0.11em):
  what names rather than speaks — nav items (0.875rem in the rail, 1.5rem in
  the mobile overlay), section labels ("À lire ensuite", 0.75rem), badges
  (0.8125rem). Caps get the tracking caps always need.
- **Expression** (`.register-expression` — Alegreya **italic** 400, 0.875rem
  typical, lh 1.55): captions, subtitles, notes, asides — the voice
  annotating itself, which is what an italic means on a score. It replaces
  the tracked uppercase mono the site used to label with, and it is the one
  register that must stay consistent or it stops reading as a system.
  `.prose figcaption`, `blockquote cite` and `blockquote footer` take it
  inside articles; typography's own italic already sets article blockquotes.
- **Note** (Alegreya roman 400, 0.875rem, lh 1.5): running text at card
  scale — the MediaCard note, the AlbumRow note. Sentences stay roman; only
  what annotates goes italic.
- **Notation** (`.register-notation` — Azeret Mono 400, 0.875rem typical,
  `tabular-nums`, tracking 0, **`font-size-adjust: var(--notation-aspect)`**):
  code, dates, reading times, figure and track numbers, the 404's number.
  Track numbers and the row arrow drop to 0.75rem — the row arrow was snapped
  onto that step rather than keeping a size of its own. The circuit plates'
  SVG annotations take the same face via `.circuit-label`, and are the one
  mono surface _without_ the adjustment: they never sit beside roman text, so
  there is no mismatch to correct and shrinking them would only cost
  legibility.
- **Year mark** (`.year-mark`, tracking 0.18em on notation): the blog index's
  year heading — a rehearsal mark. Its hierarchy comes from tracking plus the
  `.heading-trace-line` hairline, never from a weight.

**X-height sets the floor; rendered comparison sets the size.** Perceived size
tracks x-height, and Alegreya's is 0.456em against IBM Plex Mono's ~0.516em,
so a face swap at equal px ships a smaller page: 16px mono drew 8.26px of
x-height, a first pass at 17px Alegreya only 7.75px, while claiming to improve
readability. A second pass computed the floor back and set 19px (8.66px) —
right arithmetic, and the owner still called it small. Parity with a page that
was already hard to read is not the target; it is only the floor. The shipped
20px body and 22px article (x-height 10.03px, against the old 17px mono's
8.77px) were chosen from rendered comparisons at 19/20, 20/22 and 21/24. Both
corrections belong in the reasoning: the arithmetic was right twice and landed
short twice.

**The measure is 55ch, and it must be counted on FILLED LINES.** One value on
`.prose`, inherited by the article, because `ch` scales with the font: 55ch
lands ~70 characters at 20px _and_ at 22px, so both surfaces read at the same
width in characters while set at different sizes.

Counting the tail line of each paragraph is what made the earlier numbers
wrong. Every paragraph contributes one artificially short last line, so a
tail-included average under-reports by 12–20 characters — and it is wrong on
every post, which is why sampling more of them never caught it. Measured both
ways over four articles at the old 65ch: tail-included gave 64.0 / 66.3 /
71.9 / 71.1 (which is what got written down here), filled-lines-only gave
medians of **83 / 86 / 83 / 84**. The line had been running past the 65–75
band this file claims and past the 80 of WCAG 2.1 SC 1.4.8, and because the
constraint is expressed in `ch`, zoom could not rescue it: the character count
is invariant under zoom. At 55ch the same four articles measure **70 / 72 /
68 / 68**.

The per-post caveat survives, but it was guarding the wrong thing:
`garder-un-historique-git-propre` runs short paragraphs around its code blocks
and its _mean_ sits 7–13 characters below its own median — its median is not
an outlier at all. Count medians, on filled lines, over more than one article.

On a phone the viewport binds the line: **44–45 characters at 390px**,
deliberately under the 45 floor, because glyph size and character count cannot
both be satisfied there and the glyph wins — that is what the reader actually
complains about. (The "~41" previously recorded here was the same
tail-contaminated average.) The old 62ch was a concession to the mono and is
gone.

**Figures are lining, as a recorded decision.** The roman wants old-style
figures, and the rule was written — then measured: `0123456789` in Alegreya at
100px gives an identical 447.10 × 160 box under `normal` and `oldstyle-nums`,
because @fontsource's Alegreya ships no `onum` feature. The declaration would
have been a comment claiming a decision the page never made. Register
separation therefore rests on family and tracking. The falsifier is written
into `global.css`: re-run that measurement after a font bump, and if the boxes
ever differ, the rule goes back in.

### Named Rules

**The Real Cuts Rule.** Every weight and style the site sets is a real font
file (@fontsource, unicode-range gated); nothing is browser-synthesized. A new
weight means a new import in `global.css`, not a `font-weight` that smears 400
outlines. The rule has teeth now: `.register-notation` **pins**
`font-weight: 400`, so a notation element nested inside a rule that sets 700 —
the blog index's year sits under `h1,h2,h3` — cannot synthesise a bold the
site does not ship. The same trap was live on `p code`, which shared
`--font-notation` with the register but not the class: Typography's
`.prose code { font-weight: 600 }` landed on a face that ships 400 alone and
smeared a bold across 12 inline chips, plus an oblique on a `<code>` nested in
an `<em>`. It pins weight _and_ style now. Two more declarations asked for
cuts that do not exist and quietly resolved to a neighbour — blockquote's
italic 500 (Alegreya ships italic 400 only) and `strong`'s 600 (resolving to
700). Nothing was synthesised by those two, but a declaration that names a
weight the site does not ship is a lie the next reader will believe, so both
name the real cut.

**The Optical Size Rule.** `14px` does not mean one size on this site unless
it is made to. Azeret Mono's x-height is **0.550em** against Alegreya's
**0.456em**, so equal `px` renders the mono 20.6% larger — which is why the
dates outsized the labels beside them and the code outsized the prose around
it. `--notation-aspect` (0.456, the site's optical unit) is declared once and
applied with `font-size-adjust` wherever mono meets roman: the register keeps
its consumers' own sizes and the browser solves for the size at which Azeret
draws the x-height Alegreya would have. Inline code takes it at a literal
`1em` — the same size as the sentence it sits in.

Two exceptions, both measured rather than assumed. **`.circuit-label`** never
sits beside roman text, so there is nothing to match. **Fenced blocks** are
the interesting one: they take a direct `0.72em` (x-height 87% of the prose,
near the 88% the old pairing ran at, chosen from rendered candidates at
0.93 / 0.80 / 0.72 / 0.65) because a block is judged as an object rather than
as something inside a line — at x-height parity a wide, heavy mono still
carries far more ink per line than the prose. And because `font-size-adjust`
shrinks the glyphs but **not the box**: leading and padding resolve against
the _declared_ size, so 0.93em+adjust gave 35.07px of leading around 16.96px
glyphs, an effective 2.07 line-height that nothing in the CSS said out loud.
Keep the adjustment off anything that establishes its own line box.

**The Two Families Rule.** Two families, three registers, and the guard counts
them. Real small caps were **refused** for the identification register because
they would be a third family; roman caps with 0.11em tracking do that job
instead. This is a decision with a reason, not an omission.

**The Notation-Only Rule.** The mono sets code, data and measurement — never a
sentence, and never a costume for "technical". If it is being read rather than
counted, it is the voice's job.

## Layout

A fixed left rail and one centered column on the sheet. Desktop: the nav is a
sticky 6rem rail (`w-24`) with the content offset `md:ml-16`; content lives in
a `max-w-4xl` column with `px-4 / sm:px-6 / md:px-10` gutters and
`py-8 / md:py-12 / lg:py-16` vertical rhythm. Reading surfaces narrow further:
`max-w-2xl` for the blog index and a single 55ch measure on `.prose`,
inherited by the article (68–72 characters on filled lines at 1440px, counted
across four posts; 44–45 at 390px); the long-form step also drops a size under
768px, the one place type is responsive. Mobile (`< md`, 768px — the
single layout hinge): the rail becomes a fixed 3.5rem top bar with the
animated WL logo and a hamburger opening a full-screen overlay menu (slide-in,
`inert` while closed).

**The blocks that close an article share the article's column, and `ch` is the
trap.** `55ch` resolves against the element's _own_ font size, so a closing
block set at 0.8125rem comes out at well under half the width of 22px prose.
"À lire ensuite" carried a hand-tuned `max-w-[68ch]` for exactly this reason —
a number that looked close at the size it was tuned at, and overhung the
article by ~80px at 1440, which made the last thing a reader saw the one place
the page broke its own column. So the measure is declared once at the
_article's_ size — `.article-measure` (`max-width: 55ch`, `font-size:
var(--size-longform)`) wraps the article, the sign-off and the read-next
block — and the children declare their own sizes inside it. Measured after:
all three sit at 645px on desktop, 358px at 390px. Anything set in `em` inside
that wrapper would inherit 22px as its base, so the children name `rem`.

The ground is part of the layout: a fixed full-page dot grid (1px dots on a
20px cell, 13% ink light / 6% dark) on constrained pages, the flow-field
canvas on Now pages. Both sit behind everything at `z-0`, `pointer-events:
none`.

## Elevation & Depth

The system is flat today: not a single `box-shadow` exists. Depth is conveyed
by line weight (1px hairlines against 4–7px pads), ink opacity (13% grid → 65%
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
outside the border — the crop marks of a technical plate. State on the nav is
a round **pad** on a 1px trace (4px resting, 6px hover, 7px active) with a
spur reaching toward its label, never a bar; underlines are 1px hairlines that
ride 1px below text, never `text-decoration`.

## Components

The components are **schémas annotés** — annotated schematics. Each one reads
like a figure in a technical drawing: registration ticks for corners, italic
captions for annotations, mono for anything counted, and state changes drawn
as lines growing or borders waking, never as lifting or glowing.

### Navigation

**The nav is a printed circuit, not a rail.** Until 2026-08 the active item
wore a 3px brass bar on its left edge — a coloured `border-left`, which is
exactly the category default this file warns about, and the one place on the
site where brass was a _bar_ rather than a _wire_. It is gone, replaced from
the owner's sketch (2026-08-19) by the vocabulary the decorations already
speak.

- **The plate.** A bus runs the full height of the aside at x=8; a branch
  leaves it on a cubic S-curve, runs vertically at x=22 past the items, and
  returns to the bus below — one wire that goes out to fetch the labels
  (x=48) and comes back. Both in `--ink-circuit`, `stroke-width: 1`, with
  `r=2` junction dots and no end ticks on the bus (a tick marks an end, and
  the bus has none on screen). The whole plate is `aria-hidden` and
  `pointer-events: none`. **The SVG is laid 1:1 in pixels over the nav's
  box** — no `preserveAspectRatio`, no percentage width, or the alignment
  breaks.
- **The rail sits at the bottom** (`mt-auto`). Clustered in the first third it
  left two thirds of bare wire below it, which reads as a _remainder_; pushed
  down, the same length becomes an _approach_. `mt-auto` rather than absolute
  positioning, so on a short screen the margin retracts by itself.
- **Three states, and they differ by ink _and_ length.** Each item carries a
  round pad on the branch and a spur reaching toward its label. Rest: 4px pad
  in `--ink-circuit`, spur at `scaleX(0)`. Hover: 6px pad in
  `--ink-circuit-strong`, 9px spur. Active: 7px pad in `--nav-signal`, 18px
  spur. The old rule said hover and active differ by _length, not opacity_ —
  that held only because both wore the same brass. Now the length step stays
  and the ink step joins it, which _tightens_ the One Signal Rule: brass marks
  the live state alone, and the decoration ink carries everything provisional.
  The label steps 0.7 → 1 opacity and 4px right on hover; inactive items keep
  the sanctioned weight-400 deviation against the register's 500.
- **The state travels the wire; it does not slide over the page.**
  `view-transition-name: nav-rail` was removed deliberately — a view
  transition would glide the pad from one item to the next _across_ the page,
  when the gesture wants it to leave its seat and run the _wire_. So
  `travelNavSignal()` animates one piece in three phases on the outgoing DOM,
  in parallel with the fetch: retract (90ms, ease-in), travel (140–360ms
  scaled by distance, on the circuit curve `cubic-bezier(0.4, 0, 0.2, 1)`),
  seat (150ms, spring). **One piece, one journey** — a pad that slides and
  then a current that catches up was the previous version, and it told the
  same story twice. The current stays brass for the whole trip: it is the
  state moving, not an ambient signal.
- **The plate draws once per session, not per navigation.** The nav is chrome
  and identical from page to page, so `circuit.ts` skips any
  `data-draw-once` SVG and ownership sits in `SideNav.astro`, behind a
  module-level set that survives navigations. Draw speed is 260px/s clamped to
  0.4–1.1s, except the bus, which is pinned to 0.85s (at the common cadence a
  full-height wire took 3.9s).
- **Dots and labels are scheduled by where the ink is**, not by a fixed
  stagger: the path length at a dot's ordinate, run back through an inverted
  easing curve, gives the moment the drawing front actually crosses it. Two
  clocks was the previous state — the junction dots waited on a fixed 0.95s
  while the line passed them at 0.35s.
- **Mobile (`< md`):** the aside is `hidden md:flex`, and the overlay does not
  drop the vocabulary — it **mirrors and enlarges** it. A full plate on the
  right: its own bus at x=12 (with the two end ticks the desktop bus lacks),
  branch at x=30, labels at x=66, `r=2.5` dots, 5px/9px pads, 24px spurs, and
  1.5rem caps. The one deliberate subtraction is the hover spur (0px) — the
  whole hover block sits inside `@media (hover: hover)`, because on a touch
  screen the state sticks after a tap and two items look lit.
- **Dark-mode state ink:** Signal mixed 65% toward the page (full brass is the
  loudest thing on a dark page, where every other brass part lives at 28–35%;
  65% lands at 4.3:1, above the 3:1 a state indicator needs, without the
  glare).
- **The skip link branches onto the bus, not the branch** — which is the only
  reason its spur is longer (32px) than the rail's. Don't "harmonise" them.

### List Rows (blog index)

The dot-leader row: month (notation, tabular-nums, Faded) — a 2px-dot leader
line filling the gap — title — reading time. The title rests in full ink
(Charcoal/Paper) so the list leads with what it lists; month, leader and
reading time rest in Faded and ink up to match on hover, easing in but
snapping off (`group-hover:transition-none`). Years are group headings — the
year mark, tracked 0.18em with a hairline trace — so rows carry only the
month.

**The same row runs at the end of an article** ("À lire ensuite",
`ReadNext.astro`), and it obeys the same division: the title in full ink, the
month and leader in Faded. It had drifted — the title rested in Faded, so the
one thing a reader chooses from was the faintest ink on the page, and on touch
no hover ever revealed it. Rows are 44px targets, and the two are ordered
newest-first: a column of tabular figures asserts an order, so it renders in
one even though the _selection_ is date-proximate.

### Occurrence Rows (Talks)

The blog index's row, transposed: event name — dot leader — date (notation,
`shrink-0`) — a fixed `6.5rem` right-aligned slot for the video link. Same
`.dot-leader`, same eases-in / snaps-off hover, so both lists feel like one
object under the cursor.

**The row binds on interaction, never on proximity.** The blog index can hang
its hover on `.group` because the whole row is one anchor; an occurrence row
has _two_ destinations and stretches of nothing between them, so it hangs on
`:has(a:hover)` instead. Hovering the gap inks nothing, and the row never
claims to be clickable where it isn't.

**`.no-video`** is the page's one mark of its own: a 0.75rem 1px rule holding
the video slot's width when there is no recording. The slot keeps its width so
the absence sits in the column the way a struck-out figure would on a plate,
rather than reading as a row that ended early.

### Article Sign-off (blog post)

The article's colophon, and the counterweight to the header plate: the header
opens a post with `T:06` and `2026·05`, this closes it with who drew it and
when it was last corrected. A revision block is what an annotated technical
plate always carries, and the page had none — `dateModified` lived in the
schema, the JSON-LD and the OG payload and was displayed nowhere, so a
correction had to be hand-written into the prose to reach a reader.

- **Shape:** the standard container treatment — 1px hairline
  (rgba(37,37,37,0.15) light / rgba(250,250,250,0.1) dark), 3px radius,
  transparent ground, and registration ticks top-left and bottom-right.
- **Name** (`.register-ident`, 0.8125rem, full ink): `William Leemans ·
Lille` — the only place the visible page names its author.
- **Revision** (`.register-notation`, 0.75rem, Faded): `publié 2026·05 —
corrigé 2026·07`, in the same notation the header plate labels with. The
  correction is rendered only when the post carries one; a revision that isn't
  a revision is noise.
- **Links** (ident caps, 0.75rem — one step under the name, and the same step
  as the "À lire ensuite" label, so the two closing blocks label themselves at
  one size): `← Tous les articles` and `Flux RSS`, pushed to the two edges of
  the column so the block shares a grid with the read-next rows below it. Full
  ink resting, underline waking to Signal on hover — the owner's own surfaces,
  brass on the line and never on the text. 44px targets, bought with a
  negative block margin so the target grows and the plate doesn't.

### Cards (MediaCard — books & games)

- **Corner Style:** 3px radius, hairline border, registration ticks.
- **Background:** transparent — the card is drawn on the sheet, not laid on it.
- **Hover:** the border wakes (0.15 → 0.35 opacity); nothing lifts.
- **Cover:** aspect-locked (2/3 books, 16/9 games), object-fit cover, inset
  at 2px radius.
- **Body:** 0.65–0.75rem padding; badge (ident, 0.8125rem), then Title (roman
  700, 1.05rem), then an italic subtitle in the expression register — the
  subtitle annotates the title, so it slopes; the note below it is running
  text and stays roman at 0.875rem.

### Badges

Roman caps in the identification register at 0.8125rem, 0.11em tracking, 2px
radius, hairline border. **Done** wears Signal: an 8% brass wash with Signal
encré text in light (exactly 8% — the pair lands at 4.51:1 and fails at 12%),
a 15% wash with true Signal in dark. **In progress** stays neutral: 7% ink
wash, Charcoal/Paper text. Brass marks the finished state because state is
brass's whole job.

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
those rows is set in the expression register and carries the figcaption tick,
promoted: a 1px Signal border-left — the page's one address to the visitor
wears the site's one wire (decided 2026-08-10 over keeping home brass-silent).

### Signature: Circuit Decorations

Hand-drawn SVG circuit fragments (traces, dots, pads, labels) that draw
themselves on page entry (`circuit-draw` via stroke-dashoffset, then
`circuit-appear`). Ink comes only from `--ink-circuit`
(`--ink-circuit-strong` solely for NowDecoration over the moving flow field).
Their annotations — post counts, year spans, reading times — are measurement,
so they take the notation face through one shared `.circuit-label` rule rather
than a family literal per decoration. Each page family has its own plate: Home
(header, margin, footer), blog list, blog post, Talks, Now. Blog posts also
inject a **section trace** under each h2 — see below — and a 2px
reading-progress hairline at the viewport top, which keeps its width under
reduced motion and loses only its breath.

**The section trace** is the article's own plate: a full-measure wire built in
`src/scripts/blog-post.ts` at the heading's measured pixel width, carrying one
to three components — an arc, a tent, a pad, a via — and inking itself on from
the left as the heading arrives. It **underlines** the heading. It sat above it
until 2026-08-25, where it read as a separator floating over the title rather
than as the title's own rule; moved below, the accidents are flipped with a
`scaleY(-1)` on the box, because arcs, tents and vias are built ABOVE the
baseline (`Y - r`) and would otherwise poke into the descenders. The box is 3px
tall, so its transform origin falls at 1.5px — exactly the baseline: the wire
does not move by a pixel, only its accidents change side. The `0.9em` of air
moved from `padding-top` to `padding-bottom` with it; it never measured a
distance to the preceding paragraph, only the distance to the wire. Feature count comes from the measure: three
across a wide desktop column, two at 645px, one at 358px, because the run is
less than half as long on a phone and the trace should read as sparse
instrumentation rather than a busy strip.

It replaced a short trace injected INSIDE every h2 and h3, running off to the
right of the words, which took its length from whatever the heading left over:
39–100px on the long French headings this blog writes, and on a phone a stub
that stole a seventh of the line and forced an extra wrap. It also gave both
levels the same mark. A heading no longer contains its decoration; it sits
under one.

**The baseline is drawn in the SVG, not left to a CSS rule underneath, and
that is a decision with a cost.** The arcs and tents in this vocabulary
_replace_ a segment of the line — `BlogPostDecoration` goes line, arc dome,
line, and never both at once — so a continuous CSS hairline with an arc on top
would close the arc into a loop, a shape this drawing does not own. Keeping
the arcs means the trace is JavaScript's to make, and before it runs h2 and h3
are separated by their size step alone. Drawn at a measured width, it is also
redrawn on resize — without the entrance, because a resize is not an arrival.

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
- **L'appel de courant** (`toggleTheme` in `SideNav.astro`, `.theme-wipe` in
  `global.css`): the site's one gesture that answers the visitor rather than
  the clock — everything above runs on its own schedule, indifferent to
  whoever is reading. **The theme switch does not flash.** The new sheet is
  revealed by a hard-edged front expanding from the button itself, 600ms on
  `cubic-bezier(0.4, 0, 0.2, 1)` — the curve the circuit traces already draw
  themselves with. The toggle is the last item in the rail, bottom-left, so
  the change crosses the page diagonally toward the top-right: the current
  starts at the switch you just closed. It is a view transition, with the
  circle animated in JS where the button's position is known — **in
  percentages, never px**: `::view-transition-new(root)` is not guaranteed to
  sit in the CSS pixel scale (browser zoom and display scaling put its box in a
  larger space), so a centre written in `px` lands at a fraction of its
  intended position and the circle opens from the middle of the left edge
  instead of the button. It was written in px first, and a 1:1 machine never
  reproduced it — it took the owner's screenshot to see. The new sheet
  always arrives on top and always grows, in both directions, so the gesture
  reads the same going dark as going light — one sheet laid over another,
  never one draining away. It costs no markup and no new metaphor, so it
  holds on every page including `/now`, where the front reveals the flow
  field's brass streamlines against its charcoal ones, and on a phone, where
  it expands from the toggle inside the overlay menu.

  **The straight diagonal was built and rejected — this is a decision, not an
  oversight.** A 45° front sweeping corner to corner is the more legible
  geometry, and it answers a real measurement: the toggle is the fifth icon of
  a row that overflows the 96px rail, so its centre sits 200px from the left
  edge and the circle's corner phase lasts under 100ms. The owner chose the
  circle anyway (2026-08-13), on the ground that the diagonal has no origin and
  the origin is the part that carries meaning — the current leaves the switch
  you just closed. Don't re-derive the diagonal from the 200px offset; it has
  already been derived, seen, and declined.

  **Two rules keep it from breaking things it can't see.** The CSS is scoped
  to `.theme-wipe`, added for the length of the toggle only, because
  ClientRouter drives every page navigation through the same
  `::view-transition-*` pseudo-elements — an unscoped `animation: none` there
  would silently strip the cross-fade off every link on the site. And that
  same scope suppresses every `transition` beneath it: `html` fades its
  background over 0.2s and `body` its text colour, which is the flash this
  gesture replaces, and leaving them running wrecked it outright — a view
  transition captures the new page as a still, and the still was being taken
  mid-fade, so the front revealed a half-blended grey sheet. Those fades stay
  in the stylesheet for the fallback path (reduced motion, or a browser
  without the API), where the theme flips instantly and a fade is the kinder
  ending.

  **This is why the ambient layer has no fifth instrument.** A dot surge across
  the grid was built first and removed: a view transition renders static
  snapshots for its whole duration, so nothing in `respire.ts` can play
  underneath one. The two could never have run together, and the wipe carries
  the same story with the entire page as its payload.

- Hover transitions run 0.2–0.3s ease; syntax colors snap on theme toggle
  rather than transitioning.
- **Everything above yields to `prefers-reduced-motion: reduce`** — final
  states shown immediately, the flow field freezes, the progress bar hides.

## Do's and Don'ts

### Do:

- **Do** put every new state indicator in Signal — on a line, a ring, a pad,
  or a badge wash — with #8f6a1a in light and #E4A94D (often mixed toward the
  page) in dark.
- **Do** draw new decorations in `--ink-circuit`; reach for
  `--ink-circuit-strong` only over the flow field.
- **Do** give every container the hairline treatment: 1px border at 0.15/0.1
  opacity, 3px radius, and registration ticks if it frames content.
- **Do** pick a register by the job, not by the size: `.register-ident` for
  what names (nav, labels, badges), `.register-expression` for what annotates
  (captions, subtitles, asides), `.register-notation` for what is counted
  (code, dates, reading times, figure numbers). Running text needs no class —
  the voice is the default.
- **Do** take x-height as the floor for a new step (0.456em for Alegreya) and
  then settle the size by rendering the candidates side by side; count a new
  measure on more than one article.
- **Do** buy hierarchy with size, tracking or a hairline. The mono ships at
  400 and only 400; a bolder notation is a synthesised weight, which the
  system forbids.
- **Do** pair every animation with its `prefers-reduced-motion: reduce`
  ending: final state visible, information preserved (a pad keeps its size, a
  spur its length; only the travel goes).
- **Do** keep both themes honest in the same change: every color decision
  ships its `.dark` counterpart, and the mobile browser bar follows
  `--color-page`.

### Don't:

- **Don't** put the nav's state back as a bar. A brass `border-left` on the
  active item is the category default, and it was the one place on this site
  where the accent was a bar rather than a wire. State is a pad on a trace.
  Nor give it `view-transition-name` — the pad must travel the wire, not glide
  over the page.
- **Don't** size a closing block's measure in `ch` against its own font size.
  `55ch` at 0.8125rem is less than half the article's column; that is how the
  hand-tuned `68ch` got there. Put it inside `.article-measure`.
- **Don't** introduce a second accent. The green "done" badge was the site's
  only one, and it was removed for carrying state — brass's job.
- **Don't** put brass on running text, or true brass (#E4A94D) on Paper —
  it reads at 1.9:1.
- **Don't** add a third family. Two are counted by the guard, and a small-caps
  cut was already declined on exactly this ground — the identification
  register is roman caps with tracking.
- **Don't** set a sentence in the mono. It is notation and measurement; using
  it as a costume for "technical" is what made the long articles hard to read.
- **Don't** name a font token after its face. Tokens are roles
  (`--font-voice`, `--font-notation`); the last face-named token,
  `--font-sans`, silently pointed at a monospace for years.
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
