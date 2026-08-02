# Research: what verifies accessibility, internal links and page weight of a static Astro site in GitHub Actions, in 2026

Date: 2026-08-02. All sources accessed 2026-08-02. Primary sources fetched directly where possible; secondary reporting is flagged as such. Everything labelled **measured** was run locally against this repo's `dist/` on 2026-08-02 (Apple Silicon, Node v22.19.0, pnpm 10.18.0) in a scratch directory — `package.json` and `pnpm-lock.yaml` were not touched.

## TL;DR — **ADOPT three tools, one job, no browser**

**Recommendation: add a single `guard` job to `.github/workflows/ci.yml` that runs `lychee --offline` for links, `axe-core` driven by `jsdom` for accessibility, and a ~50-line Node script for a per-page shell budget. No headless browser. No third-party network call. Roughly +15 s of runner time.**

Reasoning, candidate by candidate:

- **Links: `lychee --offline --root-dir "$PWD/dist"`.** Measured: **4–9 ms** for the whole site (654 link instances, 235 unique) and it resolves slash-less root-relative hrefs against the filesystem correctly — `/blog` → `dist/blog/index.html` — which is the exact shape this site emits. It caught all three breaks I injected. It needs one exclusion (`--exclude '\.netlify/images'`) or it reports **206 false errors** from the Netlify Image CDN URLs Astro writes into `srcset`. Fragment checking (`--include-fragments`) works and is free.
- **Links: `linkinator` is disqualified, measured, on two independent grounds.** It has **no offline mode** — during a directory crawl it made real requests to `plausible.io`, four `youtube.com` URLs, `craftomancer.dev`, `devlille.fr` and `nownownow.com`, and the only way to stop it is to enumerate every external domain by hand. And it **never parsed the article pages at all**: across three flag combinations it found 11–46 links and missed the broken in-body link I planted in `blog/flux-rss`. Given a single HTML file instead of a directory it resolves `/talks` against _the file's own directory_, producing 13 false 404s. There is no `--root-dir` equivalent.
- **Accessibility: `axe-core` under `jsdom`, in a plain Node script.** Measured: **1.5 s** for all 15 pages, 28 MB / 34 packages of install, ~2.3 s to install. It **would have caught defect (i)** of issue #20 — I reintroduced the nested `<main>` and got three violations: `landmark-no-duplicate-main`, `landmark-main-is-top-level`, `landmark-unique`. It **would not have caught (ii)** — axe-core 4.12.1 has **no rule of any kind** matching `time` or `datetime` across its 105 rules — nor (iii), which no static tool can see.
- **Colour contrast under jsdom cannot fire, and that is the decisive argument for jsdom over a browser.** Measured: `color-contrast` errors out (`TypeError: Cannot read properties of null (reading 'canvas')`) and lands in `incomplete`, never in `violations`. The hand-arbitrated palette is therefore _structurally_ un-re-flaggable — not suppressed by a config line someone can delete, but impossible. Two other rules degrade the same way (`landmark-one-main`, `page-has-heading-one`, both via `document.elementFromPoint is not a function`); everything else runs.
- **The counterfactual, measured in real Chrome, is damning.** Driving the same 15 pages through `@axe-core/playwright` and a real Chrome gives **342 `color-contrast` violations** in light mode with `prefers-reduced-motion: reduce`, **100** without it, **14** in dark, **10** in dark with reduce. 243 of the 342 are Shiki's syntax colours, which `CLAUDE.md` explicitly places outside the palette; 87 are `--color-faded` (`#858585` on `#fafafa`, 3.53:1); and 2 are `#8f6a1a` on `#f7efe2` at 4.33:1 — `--color-brass-ink`, the value `CLAUDE.md` documents as deliberately arbitrated. A guard whose output swings from 100 to 342 findings on an animation preference, and whose findings are the site's own documented decisions, is a guard that gets disabled within a month.
- **A real, currently-shipping defect fell out of the experiment.** `heading-order` fires **4 times** on `main` today: `<h3 id="projets--travail">` follows the `<h1>` with no `<h2>` between, on `/now/`, `/now/janvier-2026/`, `/now/mai-2026/` and `/now/juillet-2026/`. It reproduces identically under jsdom and under real Chrome, in both themes. The guard is not purely regression-prevention: it has something to fix on day one.
- **`html-validate` is a _complement_, not an alternative, and needs work before it is usable.** It carries `no-multiple-main` (verified: it flags the nested `<main>`), but on `html-validate:recommended` it emits **1152 messages** on the current `dist/`, of which **995 are `no-inline-style` from Shiki's output**. Once that noise is off it leaves ~157 messages, a mix of genuine minor findings (two unlabelled `<nav>` landmarks; `<style>` inside `<body>`) and disputes with axe (`wcag/h30` rejects `title` as an accessible name where axe accepts it). Worth a follow-up, not worth blocking #25.
- **Every browser-driven candidate is ruled out on the same reasoning, not on install cost.** `ubuntu-24.04` runners already ship Chrome 150 and ChromeDriver, so the install argument is weaker than the ticket assumed — but `pa11y-ci` (`puppeteer ^24.37.5`), `@axe-core/cli` (`chromedriver: "latest"`, unpinned) and Lighthouse CI all buy you the contrast checking you specifically do not want, at 5–10× the runtime.
- **Weight: none of the off-the-shelf budget tools fit; a ~50-line script does.** Lighthouse CI's last release is **v0.15.1, 2025-06-26** — over a year old. `bundlesize` last published 2024-03, `bundlemon` 2024-10; both are effectively dormant. `size-limit` is healthy but is a JS-bundle tool. And the honest finding is that a naive budget would be wrong here anyway: my prototype charges every page **605 KiB of fonts** because @fontsource emits **62 font files** (Cyrillic, Greek, Vietnamese subsets included) that `unicode-range` guarantees a French page will never fetch. What a budget can usefully bound is **gzipped HTML + referenced CSS + referenced JS + the _latin_ font subsets**, per page; what it must not bound is total `dist/` bytes, because 6.1 MB of 7.7 MB is cover art and `CLAUDE.md` says flourish wins.
- **The `rel="me"` return loop does not belong in this guard**, and lychee cannot do it in any mode: lychee checks status codes, never response content, so an online lychee run against `https://github.com/Ly4m` would pass whether or not the profile still links back. The cheap correct check is one authenticated-free REST call — `GET /users/Ly4m/social_accounts`, which returns `{"provider":"generic","url":"https://lmns.fr"}` today (verified 2026-08-02) — on a `schedule:` workflow, never on a PR. Laid out in §6; deliberately not decided in.

---

## 1. The constraints, restated as pass/fail tests

The repo's constraints (from `.github/workflows/ci.yml` and `CLAUDE.md`) turn into five tests every candidate is judged against below.

| #   | Test                                                                          | Why                                                                                                                 |
| --- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| T1  | Does it work with **no third-party network call**?                            | `ci.yml` says so verbatim: "Fully offline: … nothing here calls a third-party API. A failure at this step is ours." |
| T2  | Does it need a **headless browser** on the runner?                            | The map (#19) parks the job's shape on this answer.                                                                 |
| T3  | Can it see **both themes**, given that dark is a class on `<html>`?           | `CLAUDE.md`; a static check never sees dark by accident.                                                            |
| T4  | Can **contrast rules be disabled** — or better, are they incapable of firing? | `--color-brass-ink` on `#fafafa` and the 4.3:1 nav rail are decided, not defects.                                   |
| T5  | Would it have caught the **three defects of #20**?                            | (i) nested `<main>`, (ii) `<time>` with no `datetime`, (iii) `toLocaleDateString()` with no locale.                 |

Two facts about the runner change the shape of T2 more than the ticket assumed:

- **`ubuntu-24.04` already has a browser.** The image manifest lists `Google Chrome 150.0.7871.128`, `ChromeDriver 150.0.7871.124`, `Chromium 150.0.7871.0`, plus `CHROMEWEBDRIVER=/usr/local/share/chromedriver-linux64` ([actions/runner-images, `images/ubuntu/Ubuntu2404-Readme.md`](https://github.com/actions/runner-images/blob/main/images/ubuntu/Ubuntu2404-Readme.md), fetched via the GitHub contents API 2026-08-02). So "needs a browser" costs _runtime_, not a 150 MB download — provided the tool is told to use the system Chrome rather than letting Puppeteer/Playwright fetch its own.
- **The repo is public** (`gh repo view Ly4m/williamleemans.me` → `"visibility":"PUBLIC"`, 2026-08-02), so GitHub-hosted standard runners are free of charge. Runner _minutes_ are therefore a wall-clock/attention cost on every PR, not a billing cost. That lowers the stakes but does not remove them: a 90 s job on a 6-articles-in-9-months blog is a job people learn to ignore.

The site as built (measured, `dist/` on 2026-08-02): 15 HTML files, largest `blog/flux-rss/index.html` at 64,405 B raw / **11,437 B gzip -9**. `dist` 7.9 MB, `dist/_astro` 7.1 MB, of which 6.1 MB images. JS 60 KB, CSS 72 KB, 62 font files totalling 740 KB (376 KB woff2 + 364 KB woff).

## 2. Family (a) — accessibility rules on static HTML

### 2.1 axe-core under jsdom — measured

Setup: `axe-core@4.12.1` (npm `latest`, published 2026-07-30; repo release `v4.12.1`, 2026-06-10, not archived) + `jsdom@29.1.1`, read each file in `dist/`, `window.eval(axe.min.js)`, `axe.run(document)`.

```
files: 15   violation nodes: 4
violations:  [ [ 'heading-order', 4 ] ]
incomplete:  [ [ 'color-contrast', 15 ], [ 'landmark-one-main', 15 ], [ 'page-has-heading-one', 15 ] ]
elapsed: 1467 ms
```

Install footprint, measured in a clean scratch project: `npm i axe-core jsdom` → **34 packages, 28 MB, 2.3 s**. On the CI runner that is inside `pnpm install --frozen-lockfile`, which already runs and is already cached by `actions/setup-node@v4`.

Total added wall clock for the a11y step on this machine: **~1.5 s**. On a GitHub standard runner assume 3–5 s.

### 2.2 The #20 acceptance test — measured, one out of three

I reconstructed defects (i) and (ii) on top of the fixed `dist/blog/index.html` (nested a second `<main>` inside the layout's; stripped `datetime=` from the list's `<time>`) and re-ran.

| #20 defect                       | Caught? | Rule id                                                                                   |
| -------------------------------- | ------- | ----------------------------------------------------------------------------------------- |
| (i) two `<main>` on one page     | **yes** | `landmark-no-duplicate-main`, and also `landmark-main-is-top-level` and `landmark-unique` |
| (ii) `<time>` with no `datetime` | **no**  | none exists                                                                               |
| (iii) date in the wrong locale   | **no**  | out of reach of any tool in this note                                                     |

On (ii): `axe.getRules()` over `wcag2a, wcag2aa, wcag21a, wcag21aa, wcag22aa, best-practice` returns **zero** rules whose id or description matches `time` or `datetime`, out of **105 rules total** (measured). `html-validate@11.4.0`'s 80-rule `recommended` config likewise has no `time`/`datetime` rule (measured via `html-validate --print-config`), and it does **not** flag `<time>01</time>` — I tested it directly. Nothing off the shelf catches (ii). Say it plainly rather than implying the guard covers #20.

On (iii): a locale bug produces well-formed HTML with correct semantics. No a11y or validity tool has a concept of "this string should have been rendered in `fr-FR`". Issue #19 already records the same shape of gap — a `pubDate` that was not zero-padded and was parsed in local time — and hands it to #25. Both belong to a **content/data assertion** family that none of the three families in this ticket covers. If #25 wants them, the mechanism is a project-specific Node assertion over the content collections and over `dist/`, not a tool.

### 2.3 What jsdom costs: exactly three rules, and they fail safe

Measured, by reading the `error-occurred` check data out of `results.incomplete`:

| Rule                   | Error under jsdom 29.1.1                                                                                                                                       | Consequence                            |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| `color-contrast`       | `TypeError: Cannot read properties of null (reading 'canvas')` (jsdom's `HTMLCanvasElement.getContext()` returns `null` without the optional `canvas` package) | never evaluated                        |
| `landmark-one-main`    | `TypeError: document.elementFromPoint is not a function`                                                                                                       | "page has **no** main" is not detected |
| `page-has-heading-one` | same                                                                                                                                                           | not detected                           |

Every other rule runs. Critically, axe routes a rule that throws into `incomplete`, not into `violations` — so a CI script that fails on `violations.length > 0` cannot be tripped by these. This is documented maintainer behaviour, not luck: on [dequelabs/axe-core#595](https://github.com/dequelabs/axe-core/issues/595) (opened 2017-11-01, closed), Deque's Marcy Sutton wrote _"I would just turn off the color contrast rule in JSDOM, because you're right that it won't ever work. We don't recommend testing color contrast in JSDOM due to the lack of support."_, and Dylan Barrell confirmed the results land _"in the `incomplete` array"_. Steve Straker later re-tested on jsdom 18 and 19 and reported the same skip, with a different message: <code>&#96;TypeError: range.getClientRects is not a function&#96; - feature unsupported in your environment. Skipping color-contrast rule</code> (2021-11-09 and 2022-01-03). On jsdom 29 the failure has moved from `Range` to `<canvas>` but the outcome is unchanged — measured above.

The `landmark-one-main` loss is the one real price. Under jsdom the guard detects _duplicate_ `main` (which is what #20 was) but not _missing_ `main`. Two cheap covers, if #25 wants it: `html-validate`'s `element-required-content`/landmark rules, or a three-line assertion in the same script (`document.querySelectorAll("main").length === 1`), which also subsumes `landmark-no-duplicate-main` and costs nothing.

Note the axe-core rule catalogue marks `color-contrast`'s Issue Type as **"failure, needs review"** ([axe-core `doc/rule-descriptions.md`](https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md)) — i.e. even in a browser it is a rule Deque expects a human to arbitrate. That is precisely what this repo already did.

### 2.4 The contrast counterfactual, measured in real Chrome

To be fair to the browser-based candidates I actually ran them: `playwright-core@latest` (13 MB, browser download skipped) driving the **system Chrome**, `@axe-core/playwright@4.12.1`, a 30-line static file server over `dist/`, theme seeded into `localStorage` via `context.addInitScript` _before_ navigation so the site's own inline theme script picks it up.

| Configuration                    | `color-contrast` violations   | `heading-order` |
| -------------------------------- | ----------------------------- | --------------- |
| light, motion allowed            | **100**                       | 4               |
| light, `reducedMotion: "reduce"` | **342**                       | 4               |
| dark, motion allowed             | **14** (stable over two runs) | 4               |
| dark, `reducedMotion: "reduce"`  | **10**                        | 4               |

Wall clock: **~4.6 s per theme** for 15 pages, plus **~200–320 ms** to launch Chrome. Both themes ≈ 10 s locally; budget 25–40 s on a runner.

The light-mode swing from 100 to 342 is not noise, it is the site's entrance animations: with motion allowed, `wave-enter` content is still at `opacity: 0` when axe samples, and axe skips invisible text. The guard's verdict would depend on whether the runner claims to prefer reduced motion. Grouping the 342 by colour pair (measured):

| count | ratio    | foreground    | background | what it is              |
| ----- | -------- | ------------- | ---------- | ----------------------- |
| 113   | 3.42     | `#b07d48`     | `#fafafa`  | Shiki `vitesse-light`   |
| 87    | 3.53     | `#858585`     | `#fafafa`  | `--color-faded`         |
| 56    | 3.92     | `#b56959`     | `#fafafa`  | Shiki                   |
| 47    | 4.06     | `#59873a`     | `#fafafa`  | Shiki                   |
| 14    | 3.74     | `#2e8f82`     | `#fafafa`  | Shiki                   |
| 13    | 3.54     | `#998418`     | `#fafafa`  | Shiki                   |
| 10    | 2.24     | `#a0ada0`     | `#fafafa`  | Shiki comments          |
| 2     | **4.33** | **`#8f6a1a`** | `#f7efe2`  | **`--color-brass-ink`** |

Dark mode's 10 are all `#697769` on `#1a1a1a` at 3.68:1 — `vitesse-dark` comments.

So a browser-driven contrast check on this site reports, in order of volume: (1) Shiki's palette, which `CLAUDE.md` puts outside the colour system by name; (2) `--color-faded`, a deliberate token; (3) `--color-brass-ink`, whose 4.33:1 measurement matches the ~4.3:1 the repo documents for the nav rail. All three are decided. This is the concrete form of the ticket's worry, and it settles T4 in favour of jsdom: **the best disable is one nobody can re-enable by accident.**

### 2.5 Dark mode (T3), per approach

- **axe + jsdom:** you can stage it — `document.documentElement.classList.add("dark")` before `axe.run` — for **zero cost**. But measured, it changes **nothing**: 4 `heading-order` violations in both themes, identical rule sets. That is expected, because the only rule whose verdict depends on colour is the one jsdom cannot run. Conclusion: with jsdom, **theme staging is pointless, and its pointlessness is the same fact as T4**. Structural rules (landmarks, names, roles, heading order) do not vary by theme on this site, because the theme is expressed entirely in colour tokens.
- **axe + Playwright/Chrome:** staging works and matters, but must be done _before_ load. Flipping the class after `goto` produces garbage — I measured **286** dark "violations" that way, with impossible pairs like `#ededed` on `#eaeaea`, because the class landed mid-repaint. Seeded via `addInitScript` + `localStorage` the same run gives 14. Cost: 2× the runtime, and 2× the contrast noise from §2.4.
- **html-validate:** the question does not arise. It never computes styles at all.

### 2.6 html-validate — a complement, with a noise problem

`html-validate@11.6.1` (npm, published 2026-08-02; repo pushed 2026-08-02, not archived; it publishes to npm rather than cutting GitHub releases, so `releases/latest` 404s). Pure Node, no browser, no network. It parses HTML itself rather than building a DOM.

Its accessibility rule set includes `no-multiple-main` ("Disallow multiple `<main>`"), `unique-landmark`, `heading-level`, and a `wcag/h30`…`wcag/h71` family ([html-validate rules index](https://html-validate.org/rules/index.html)).

Measured, `html-validate:recommended` over `dist/**/*.html`: **0.57 s**, 15 files, **1152 messages**.

| count | rule                        |
| ----- | --------------------------- |
| 995   | `no-inline-style`           |
| 60    | `wcag/h30`                  |
| 45    | `no-implicit-button-type`   |
| 30    | `unique-landmark`           |
| 15    | `no-raw-characters`         |
| 5     | `element-permitted-content` |
| 2     | `valid-id`                  |

Reading the sample:

- **`no-inline-style` (995)** — entirely Shiki, which writes `style="--shiki-light:…;--shiki-dark:…"` on every token span. Must be off. It is a code-style rule, not an a11y rule.
- **`unique-landmark` (30)** — two `<nav>` per page (desktop rail + mobile overlay) with no `aria-label`. **Genuine**, minor, and axe does not flag it (axe's `landmark-unique` accepts them because they differ elsewhere). Two navigation landmarks a screen-reader user cannot tell apart is a real if small thing; it is the kind of finding a guard is for.
- **`wcag/h30` (60)** — the four social/RSS/mail links, which are icon-only `<a>` carrying `title="GitHub"` and an `aria-hidden` `<i>`. axe's `link-name` passes them because `title` is a permitted accessible-name fallback; html-validate demands real text. **A genuine disagreement, not a bug in either.** `title` is a weak accessible name (not surfaced on touch, inconsistently announced). Worth a separate decision; not worth blocking on.
- **`element-permitted-content` (5)** — `<style>` emitted inside `<body>` on the Now pages. Real spec violation, harmless in practice.
- **`valid-id` (2)** — heading ids starting with a digit (`1-installation-de-la-dépendance`), from the markdown. **A false positive under HTML5**, which allows any non-empty id without whitespace; the constraint html-validate is applying is the HTML4 one. Turn it off.
- **`no-raw-characters` (15)**, **`no-implicit-button-type` (45)** — code style, not a11y.

Verdict: `html-validate` earns a place only after someone writes a `.htmlvalidate.json` that turns off six rules. It brings `no-multiple-main` (redundant with axe here), the `unique-landmark` finding (which axe misses), and HTML well-formedness (which axe does not check at all). **Recommend as a fast-follow, not as part of #25's first contract** — it needs a configuration decision per rule, and shipping it un-tuned means shipping 1152 red lines.

### 2.7 Candidates ruled out

| Candidate                                                                                                          | Browser?                                                                                                                                                                                                                  | Offline?                    | Verdict                                                                                                                                                                                                                                                                                                     |
| ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pa11y-ci@4.1.1` (npm 2026-05-12; repo pushed 2026-07-14, not archived)                                            | yes — `"puppeteer": "^24.37.5"` in its dependencies (npm registry, 2026-08-02)                                                                                                                                            | yes, against a local server | **Alive and fine, wrong tool.** It runs axe _and_ HTML_CodeSniffer in Chrome, i.e. it maximises exactly the contrast output of §2.4. Puppeteer also downloads its own Chrome at install unless `PUPPETEER_SKIP_DOWNLOAD` is set, which defeats the runner's preinstalled one.                               |
| `@axe-core/cli@4.12.1`                                                                                             | yes — `"chromedriver": "latest"` + `selenium-webdriver` (npm registry, 2026-08-02)                                                                                                                                        | needs a served URL          | **No.** An unpinned `latest` dependency that downloads a driver binary at install is the opposite of what `ci.yml` is defending.                                                                                                                                                                            |
| `@axe-core/playwright@4.12.1`                                                                                      | yes                                                                                                                                                                                                                       | yes, local server           | **Technically viable** (I ran it, §2.4) and the right choice _if_ you ever want contrast. Costs ~10 s for both themes, plus Playwright, plus the noise. Not now.                                                                                                                                            |
| IBM `equal-access` / `accessibility-checker@4.0.29` (npm 2026-07-20; repo release 4.0.29 2026-07-14, not archived) | its README describes driving it from "Selenium, Puppeteer, or Playwright" ([IBMa/equal-access](https://github.com/IBMa/equal-access))                                                                                     | —                           | **No.** Same browser dependency, a second rule vocabulary to arbitrate, and no upside over axe for 15 pages.                                                                                                                                                                                                |
| Lighthouse CI a11y category (`@lhci/cli@0.15.1`)                                                                   | yes; docs describe resolving Chrome from `chromePath` / `CHROME_PATH` / puppeteer / `chrome-launcher` ([lighthouse-ci configuration docs](https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/configuration.md)) | yes via `staticDistDir`     | **No for a11y** — its a11y category _is_ axe, run in a browser, i.e. §2.4 again, at Lighthouse's runtime. Also see §4 on its maintenance.                                                                                                                                                                   |
| Astro a11y dev-toolbar audit                                                                                       | —                                                                                                                                                                                                                         | —                           | **Cannot run in CI at all.** The docs state the toolbar "is a development tool only and will not appear on your published site" ([Astro dev toolbar guide](https://docs.astro.build/en/guides/dev-toolbar/)). It is `astro dev` only; there is no build or CLI entry point.                                 |
| `linkedom` as the DOM for axe                                                                                      | no                                                                                                                                                                                                                        | yes                         | **Does not work — measured.** `axe` is never installed on the `window` linkedom provides; the run dies with `TypeError: Cannot read properties of undefined (reading 'run')`. linkedom is a parser, not a `window` implementation, and axe reaches for far more of the platform than it exposes. Use jsdom. |

## 3. Family (b) — link checking

Repo facts this family has to survive: internal hrefs are slash-less (`href="/blog"`) while canonical/`og:url`/sitemap carry a trailing slash (`https://lmns.fr/blog/`); pages are emitted as `dist/blog/foo/index.html`; and I manually verified **zero internal links are broken today**, so this is regression-prevention. Only `related` frontmatter is validated, at compile time (`src/pages/blog/[slug].astro:16`); in-body article links are validated by nothing.

### 3.1 lychee — recommended, measured

`lychee 0.24.2` (repo release `lychee-v0.24.2`, 2026-05-01; last push 2026-07-31; 3801 stars; not archived). Single Rust binary, no runtime.

The two flags that matter, quoted from `lychee --help` on the installed binary (primary source, the binary itself):

- `--offline[=<false|true>]` — _"Only check local files and block network requests"_
- `--root-dir <ROOT_DIR>` — _"Root directory to use when checking absolute links in local files. This option is required if absolute links appear in local files, otherwise those links will be flagged as errors. This must be an absolute path (i.e., one beginning with `/`)."_

That second sentence is the whole answer to the trailing-slash question: `--root-dir "$PWD/dist"` maps `/blog` to `dist/blog`, and lychee then resolves the directory to its `index.html`. Verified by both a green run and an injected-break run.

Measured, `lychee --offline --root-dir "$PWD/dist" --no-progress --exclude '\.netlify/images' 'dist/**/*.html'`:

```
🔍 654 Total (in 5ms)  🔗 235 Unique  ✅ 278 OK  🚫 0 Errors  👻 376 Excluded
```

Adding `'dist/**/*.xml'` (feed + sitemap) → 676 total, still 0 errors, 9 ms.

**The exclusion is mandatory.** Without it the same run reports **206 errors**, every one of the form `file:///…/dist/.netlify/images?url=_astro%2Fresident-evil-3.DYiis4-X.jpg&w=215&h=123`. Those are the Netlify Image CDN URLs the Astro Netlify adapter writes into `srcset`; they are served at request time and correctly do not exist in `dist/`. This is a false-positive class #25's contract must name, because it will otherwise be the first thing that reds the build.

**Break detection, measured.** I copied `dist/`, broke three links, and re-ran:

| Injected                                                                              | Reported                                               |
| ------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| `href="/talks"` → `/talkz` in `404.html`                                              | `ERROR … /distcopy/talkz \| File not found`            |
| `href="/rss.xml"` → `/rss.xmlz` in `404.html`                                         | `ERROR … /distcopy/rss.xmlz \| File not found`         |
| `href="/blog/hello-world"` → `/blog/hello-wurld`, in the **prose body** of `flux-rss` | `ERROR … /distcopy/blog/hello-wurld \| File not found` |
| `#nope-not-here` fragment on a real page (with `--include-fragments`)                 | `ERROR … \| Cannot find fragment`                      |

All three plus the fragment, in 4–8 ms. Note `404.html` was caught: lychee globs the filesystem, so unreachable-by-crawl pages are still checked — a property the crawler-based tools do not have.

**What offline mode does _not_ check.** All `http(s)` URLs are reported as `EXCLUDED`. That includes the canonical, `og:url` and `sitemap` absolute URLs — so lychee offline is blind to the trailing-slash inconsistency between hrefs and canonicals. If #25 wants that consistency asserted, it is a separate string check, not a link check.

**In CI.** [`lycheeverse/lychee-action`](https://github.com/lycheeverse/lychee-action/blob/master/action.yml) (v2.9.0, 2026-07-09) downloads a pinned pre-compiled Linux binary from GitHub releases and puts it on `$GITHUB_PATH`; its `lycheeVersion` input defaults to `v0.24.2`. That download is a GitHub request, in the same class as `actions/checkout` — not a "third-party API" in the sense `ci.yml` means, but worth stating explicitly in #25 so nobody has to re-litigate it. Its default `args` is `--verbose --no-progress './**/*.md' './**/*.html' './**/*.rst'` and must be replaced wholesale.

### 3.2 linkinator — disqualified, measured

`linkinator@8.0.3` (npm 2026-07-30, repo pushed 2026-08-02 — the healthiest project in this note, which is why the failure is worth documenting rather than assuming).

**Failure 1 — it is not an offline tool.** There is no `--offline` flag; from `linkinator --help` (local binary), exclusion is `--skip` on URL patterns. Pointed at `dist/` it started a local server, crawled, and then made **real outbound requests** to `plausible.io`, three `music.youtube.com` playlists, three `youtube.com/watch` URLs, `craftomancer.dev`, `devlille.fr` and `nownownow.com`. Blocking them means maintaining a hand-written domain list that silently rots every time an article cites a new site — a guard that fails open. That alone fails T1.

**Failure 2 — it never read the articles.** Three flag combinations against the broken copy:

| Flags                                      | Links found | Parsed `flux-rss`? | Injected breaks found |
| ------------------------------------------ | ----------- | ------------------ | --------------------- |
| `--recurse --clean-urls --check-fragments` | 46          | no                 | **0 of 3**            |
| `--recurse`                                | 36          | no                 | **0 of 3**            |
| `--recurse --directory-listing`            | 11          | no                 | **0 of 3**            |

"Parsed `flux-rss`?" is decided by whether `feedly.com` and `rssboard.org`, which only appear in that article, show up in the results. They never do. `/blog/flux-rss` is reported `OK 200` — it is fetched and status-checked, but its links are never extracted. `404.html`, being unlinked, is never visited at all.

**Failure 3 — no root-dir concept.** Given the single file `distcopy/blog/flux-rss/index.html` it resolved every root-relative href against _that file's directory_: 13 BROKEN including `…/blog/flux-rss/talks`, `…/blog/flux-rss/rss.xml`, `…/blog/flux-rss/favicon.svg`. There is no `--root-dir`/`--base` in its help output.

### 3.3 The rest

| Candidate                                            | Status                                                                                          | Verdict                                                                                                                                                                                                                                                                                                               |
| ---------------------------------------------------- | ----------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `htmltest`                                           | last release **v0.17.0, 2022-11-04**; last push 2025-01-20 (GitHub API, 2026-08-02)             | **Dormant.** Functionally a good fit — Go binary, `CheckInternal`/`CheckInternalHash` on by default, `--skip-external` for offline ([wjdp/htmltest](https://github.com/wjdp/htmltest)) — but a link checker four years without a release, against lychee's three-month cadence, is not a dependency to adopt in 2026. |
| `hyperlink`                                          | npm `5.0.4` last published **2022-06-18**; last release v4.7.0 2021-08-09; last push 2022-07-09 | **Dead.** Rule out.                                                                                                                                                                                                                                                                                                   |
| `markdown-link-check@3.15.0` (npm 2026-07-28, alive) | —                                                                                               | **Wrong target.** It checks Markdown sources, not built HTML — so it would never see the rendered nav, the `srcset`, or `404.html`, and it would check links in `src/content/*.md` whose relative resolution differs from the routed output.                                                                          |

## 4. Family (c) — weight / performance budget

### 4.1 The tension, made concrete

6.1 MB of the 7.7 MB in `dist/` is cover art and decoration SVG. `CLAUDE.md` states flourish beats restraint by default. A total-bytes budget would therefore be a machine that argues with the site's design values on every PR that adds a Now entry — and it would lose, by being deleted.

What is worth bounding is the part a reader pays for **before any image**: the page's HTML, the CSS and JS it references, and the fonts it actually uses. That number should be stable; a jump in it means something regressed (a stray client component, a Tailwind purge failure, a font subset added).

### 4.2 A ~50-line Node script — measured prototype

Written and run against `dist/`: parse each HTML with jsdom, collect `link[rel=stylesheet][href]` and `script[src]`, gzip -9 each, plus the `woff2` referenced from those stylesheets. **0.55 s for 15 pages.**

```
page                                    htmlGz   cssGz    jsGz   fonts   TOTAL (KiB)
/blog/cap-pacelc-system-design/           12.2    10.8     5.6   605.2   633.8
/now/                                      9.2    12.1     5.4   605.2   631.8
/                                          6.8    10.8     5.6   605.2   628.4
/blog/                                     4.7    10.8     5.6   605.2   626.2
/404.html                                  3.7    10.8     5.6   605.2   625.3
```

**The prototype is wrong about fonts, and that is the useful finding.** 605 KiB per page is every `woff2` in every `@font-face` block: @fontsource emits **62 files** for Space Grotesk + IBM Plex Mono across latin, latin-ext, Cyrillic, Cyrillic-ext, Greek and Vietnamese subsets. `unicode-range` means a French page fetches two or three of them. The latin subsets alone total **220 KB across all weights**, and a real page load pulls a small fraction of that. A static analyser cannot know which, because the answer depends on the characters on the page.

So the contract #25 writes should be:

- **Bound:** gzipped HTML per page; total gzipped CSS referenced per page; total gzipped JS referenced per page. Measured today: max 12.2 / 12.1 / 5.6 KiB. Sensible first ceilings: 20 / 20 / 12 KiB per page — headroom for a long article without leaving room for a client-side framework to sneak in.
- **Bound, with care:** the **latin** font subsets only, or better, the _count_ of `@font-face` families — a third font family is the regression worth catching, not a byte.
- **Do not bound:** total `dist/` size, total image bytes, per-image size. That is an editorial decision, and the repo has already made it.

### 4.3 Off-the-shelf alternatives

| Candidate                                                                                           | Status                                                                                                                                     | Verdict                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Lighthouse CI + `budget.json`                                                                       | `@lhci/cli` last published **2025-06-25**; last GitHub release **v0.15.1, 2025-06-26**; repo last push 2026-03-27 (GitHub API, 2026-08-02) | **No.** It does what is asked — `staticDistDir` serves `dist/`, `budgetsFile` takes a `budget.json`, or assertions like `"resource-summary:document:size": ["error", {"maxNumericValue": 14000}]` ([lighthouse-ci configuration docs](https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/configuration.md)) — but it needs Chrome, drags in the a11y and contrast categories of §2.4 unless carefully scoped, its `resource-summary` buckets cannot separate "cover art" from "decoration", and 14 months without a release on a Google project is a signal. Note the unit trap the docs call out: assertion `maxNumericValue` is **bytes** while `budget.json` is **kilobytes**. |
| `size-limit@13.0.3` (npm 2026-07-30; release 13.0.3 same day; 6934 stars — healthiest of the three) | —                                                                                                                                          | **Close, but the wrong shape.** `@size-limit/file` "checks the size of files with Brotli (default), Gzip or without compression" and would happily take a glob of `dist/**/*.html`, but size-limit's model is _"this entry point, this limit"_, configured per path. It has no notion of "the assets this page references", which is the whole question here, and `@size-limit/time` "uses headless Chrome" ([ai/size-limit](https://github.com/ai/size-limit)). Using it would mean 15 hand-maintained entries that still ignore CSS/JS/fonts.                                                                                                                                             |
| `bundlesize`                                                                                        | npm `0.18.2`, last published **2024-03-15**                                                                                                | **Dormant.** No.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `bundlemon`                                                                                         | npm `3.1.0`, last published **2024-10-18**; last release 2024-10-18; repo push 2026-04-10                                                  | **Dormant, and it wants a hosted service** for history/PR comments. No.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |

The script wins by being the only option that can express the one rule that matters here: _count the shell, ignore the pictures._

## 5. Maintenance status of everything named (all checked 2026-08-02)

Sources: npm registry (`npm view <pkg> version time.modified`) and the GitHub REST API (`repos/{r}`, `repos/{r}/releases/latest`). None of the repos below is archived.

| Tool                          | npm latest / published | GitHub latest release       | Last push  | Read                                  |
| ----------------------------- | ---------------------- | --------------------------- | ---------- | ------------------------------------- |
| `axe-core`                    | 4.12.1 / 2026-07-30    | v4.12.1 / 2026-06-10        | 2026-08-01 | healthy                               |
| `html-validate`               | 11.6.1 / 2026-08-02    | _(npm-only releases)_       | 2026-08-02 | healthy                               |
| `lychee`                      | —                      | lychee-v0.24.2 / 2026-05-01 | 2026-07-31 | healthy                               |
| `lychee-action`               | —                      | v2.9.0 / 2026-07-09         | 2026-07-09 | healthy                               |
| `linkinator`                  | 8.0.3 / 2026-07-30     | v8.0.3 / 2026-07-30         | 2026-08-02 | healthy, but unfit (§3.2)             |
| `pa11y-ci`                    | 4.1.1 / 2026-05-12     | 4.1.1 / 2026-05-12          | 2026-07-14 | healthy, but browser-bound            |
| `pa11y`                       | 9.1.1 / 2026-02-26     | —                           | —          | healthy                               |
| `@axe-core/cli`               | 4.12.1 / 2026-07-27    | —                           | —          | healthy, but `chromedriver: "latest"` |
| `@axe-core/playwright`        | 4.12.1 / 2026-07-27    | —                           | —          | healthy                               |
| `accessibility-checker` (IBM) | 4.0.29 / 2026-07-20    | 4.0.29 / 2026-07-14         | 2026-07-30 | healthy, but browser-bound            |
| `size-limit`                  | 13.0.3 / 2026-07-30    | 13.0.3 / 2026-07-30         | 2026-07-30 | healthy, wrong shape                  |
| `markdown-link-check`         | 3.15.0 / 2026-07-28    | v3.15.0 / 2026-07-28        | 2026-07-28 | healthy, wrong target                 |
| `@lhci/cli`                   | 0.15.1 / 2025-06-25    | v0.15.1 / 2025-06-26        | 2026-03-27 | **slowing**                           |
| `bundlemon`                   | 3.1.0 / 2024-10-18     | v3.1.0 / 2024-10-18         | 2026-04-10 | **dormant**                           |
| `bundlesize`                  | 0.18.2 / 2024-03-15    | —                           | —          | **dormant**                           |
| `htmltest`                    | —                      | v0.17.0 / 2022-11-04        | 2025-01-20 | **dormant**                           |
| `hyperlink`                   | 5.0.4 / 2022-06-18     | v4.7.0 / 2021-08-09         | 2022-07-09 | **dead**                              |

## 6. The `rel="me"` return loop (from map #19) — the option, and its price

The claim to protect: `lmns.fr` links to `https://github.com/Ly4m` with `rel="me"`, and the GitHub profile links back to `https://lmns.fr`. The outbound half is in the repo and is already guaranteed by `SideNav.astro`'s `socialLinks` data. **The return half is not in the repo and can break with nobody touching the repo.**

Three honest findings:

1. **lychee cannot do this in any mode.** lychee checks reachability — a status code — never response content. An online lychee run against `https://github.com/Ly4m` would return `200 OK` whether or not the profile still lists `lmns.fr`. There is no `--expect-body` / content-assertion flag anywhere in `lychee --help`. The same is true of every other checker in §3. **This is not a link-checking problem wearing a disguise; it is a content assertion against a third party.** The families in this ticket do not contain a tool for it.
2. **The cheap correct check is the GitHub REST API, not scraping.** `GET /users/Ly4m/social_accounts` returns, verified 2026-08-02:
   ```json
   [
     { "provider": "twitter", "url": "https://twitter.com/WillLeemans" },
     { "provider": "generic", "url": "https://lmns.fr" }
   ]
   ```
   One unauthenticated request, stable JSON, no HTML parsing. It does not literally prove the rendered anchor carries `rel="me"` — but #30 already established on the page that GitHub renders social accounts with `rel="nofollow me"`, so presence in this list is the thing that can actually change. A four-line `gh api`/`curl` + `grep` step is the whole implementation.
3. **It still contradicts T1, and T1 is about _when_, not only _whether_.** `ci.yml`'s comment is not squeamishness about the network; it is a claim about attribution — _"A failure at this step is ours."_ A PR check that can red because GitHub is rate-limiting, or because api.github.com is degraded, breaks that claim and teaches people to re-run failed checks without reading them.

**The shape that preserves the claim** — laid out, not decided:

- a **separate workflow**, `on: schedule` (weekly) plus `workflow_dispatch`, never on `pull_request`;
- one `gh api users/Ly4m/social_accounts` call, assert `lmns.fr` is present;
- on failure it should **open an issue**, not fail a merge — nothing about a PR is wrong when GitHub's profile changes.

Cost: one workflow file, ~10 s a week, and a new failure mode (a rate-limited or flaky scheduled run filing a spurious issue) that has to be tolerated or debounced. Against a link that changed once, deliberately, in #30. **My reading: this is a decision for #25 to take on its own evidence, and the case for "nothing, and re-check it by hand when the IndieWeb position is next revisited" is respectable.** Either way it does not belong in the PR guard.

## 7. Recommendation

### Per family

| Family            | Tool                                                                                                                                                                           | Why                                                                                                              |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| (a) accessibility | **`axe-core` + `jsdom`, ~40-line Node script**, fail on `violations.length > 0`, ignore `incomplete`                                                                           | 1.5 s, no browser, no network; catches #20(i); contrast is structurally incapable of firing (§2.3–2.4)           |
| (a) supplement    | **one hand-written assertion**: exactly one `<main>` per page                                                                                                                  | covers the `landmark-one-main` rule jsdom cannot run                                                             |
| (a) fast-follow   | **`html-validate`**, after a `.htmlvalidate.json` disables `no-inline-style`, `no-implicit-button-type`, `no-raw-characters`, `valid-id` and a decision is taken on `wcag/h30` | brings `unique-landmark`, which axe misses; 0.57 s                                                               |
| (b) links         | **`lychee --offline --root-dir "$PWD/dist" --include-fragments --exclude '\.netlify/images'`** over `dist/**/*.html` and `dist/**/*.xml`                                       | 9 ms, 0 false positives once the Netlify CDN pattern is excluded, catches in-body prose links and unlinked pages |
| (c) weight        | **a ~50-line Node script**, per-page gzipped HTML + referenced CSS + referenced JS                                                                                             | the only option that can say "shell yes, cover art no"                                                           |
| extra             | **`rel="me"` loop: not in this job.** If ever: separate scheduled workflow, `gh api users/Ly4m/social_accounts`, opens an issue rather than failing                            | §6                                                                                                               |

### Two things #25's contract must name explicitly

1. **The Netlify Image CDN false-positive class.** `/.netlify/images?url=…` appears in every `srcset` on the Now pages and does not exist in `dist/`. Un-excluded, that is 206 red lines on the first run.
2. **`heading-order` is already failing, 4×, on `main`.** `<h3 id="projets--travail">` follows `<h1>` on `/now/` and the three dated Now entries. Either the markdown gains an `h2`, or the Now layout demotes its `<h1>`, or the rule is disabled with a reason — but the guard cannot go green without that decision being taken. Do not let it be taken by disabling the rule silently.

### The job, in outline

Appended to the existing `verify` job (it needs the `dist/` that `pnpm build` already produced, so a second job would mean rebuilding or an artifact hop — not worth it for 15 s):

```yaml
- run: pnpm build

# Everything below reads dist/ only. Still fully offline: lychee runs with
# --offline, and axe runs in jsdom, not a browser.
- run: node scripts/guard-a11y.mjs # axe-core + jsdom over dist/**/*.html
- run: node scripts/guard-weight.mjs # per-page gzipped shell budget

- uses: lycheeverse/lychee-action@v2
  with:
    args: >-
      --offline --no-progress --include-fragments
      --root-dir ${{ github.workspace }}/dist
      --exclude '\.netlify/images'
      'dist/**/*.html' 'dist/**/*.xml'
    fail: true
```

`axe-core` and `jsdom` go into `devDependencies`; nothing else is added. `pnpm install` grows by 34 packages / 28 MB, already inside the `actions/setup-node` pnpm cache.

### Cost

Measured locally: a11y 1.5 s, weight 0.55 s, lychee 0.009 s. Add the `lychee-action` binary download (a few seconds, from GitHub releases) and assume a standard runner is 2–3× slower than this machine.

**Estimate: +10 to +20 s of wall clock per PR, and no billed minutes** — the repo is public, so GitHub-hosted standard runners are free. Compare the browser route, measured: `@axe-core/playwright` alone is ~5 s per theme for these 15 pages, ~10 s for both, before Playwright's install and before Lighthouse.

Growth: all three steps are O(pages). At 15 pages they are noise; at 100 pages the a11y step would be ~10 s and lychee still under a second.

## 8. Sources

Measured locally against `dist/` (2026-08-02) — scripts in a scratch directory, not committed:

- `axe-core@4.12.1` + `jsdom@29.1.1` over 15 pages; the #20 defect reconstruction; the `error-occurred` check data; the `axe.getRules()` inventory; the dark-class staging comparison
- `@axe-core/playwright@4.12.1` + `playwright-core` + system Chrome, both themes, with and without `reducedMotion: "reduce"`
- `html-validate@11.4.0` / `11.6.1` over `dist/**/*.html` on `html-validate:recommended`; `--print-config`; the `<time>`/nested-`<main>` fixture
- `lychee 0.24.2` offline, clean and against a broken copy of `dist/`; `--include-fragments`; the Netlify-CDN exclusion
- `linkinator@8.0.3` in three flag combinations, plus the single-file entry point
- `linkedom` + axe-core (fails)
- the per-page gzipped shell-budget prototype
- `npm view` and `gh api repos/…` for every version and date in §5
- `gh api users/Ly4m/social_accounts`; `gh repo view Ly4m/williamleemans.me --json visibility`

Primary sources fetched directly:

- axe-core, "The color-contrast check doesn't work in JSDOM" — https://github.com/dequelabs/axe-core/issues/595 (comments by Deque maintainers marcysutton, dylanb, straker; fetched via the GitHub issues API)
- axe-core rule descriptions — https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md
- `lychee --help`, from the installed `lychee 0.24.2` binary
- lychee-action `action.yml` — https://github.com/lycheeverse/lychee-action/blob/master/action.yml
- lychee README — https://github.com/lycheeverse/lychee
- `linkinator --help`, from the installed `linkinator@8.0.3`
- html-validate rules index — https://html-validate.org/rules/index.html
- Astro, "Dev toolbar" — https://docs.astro.build/en/guides/dev-toolbar/
- Lighthouse CI configuration — https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/configuration.md
- size-limit README — https://github.com/ai/size-limit
- htmltest README — https://github.com/wjdp/htmltest
- IBM equal-access README — https://github.com/IBMa/equal-access
- pa11y-ci README — https://github.com/pa11y/pa11y-ci
- GitHub Actions runner image manifest, ubuntu-24.04 — https://github.com/actions/runner-images/blob/main/images/ubuntu/Ubuntu2404-Readme.md
- npm registry and GitHub REST API for all version/date/archived facts in §5

Not verified from a primary source, and flagged as such:

- **What `ubuntu-latest` currently resolves to.** GitHub's workflow-syntax documentation page I fetched does not state the mapping. §1 cites the `ubuntu-24.04` manifest and assumes `ubuntu-latest` currently points there; if that matters to #25, confirm it against GitHub's hosted-runners page or by echoing `$ImageOS` in a job.
- **Runner-relative timings.** Every duration in this note was measured on Apple Silicon. The 2–3× runner factor is an estimate, not a measurement.
- **`pa11y-ci` and IBM `equal-access` were not run.** Both are ruled out on their declared browser dependency (read from the npm registry and their READMEs) and on the contrast argument of §2.4, not on measured behaviour.
