# ykhan.org — Design & Requirements

## Overview

Personal website for Yousuf Khan, hosted on Cloudflare Pages, auto-deployed from GitHub (`ykhan71/ykhan-website`, `main` branch). Static HTML/CSS/JS — no frameworks, no build step.

---

## Site Structure

| Page | File | Status |
|---|---|---|
| Landing | `index.html` | Live |
| Poetry | `poetry.html` | Live |
| Music | `music.html` | Live |
| Books | `books.html` | Live |
| Signal | `signal.html` | Live |
| Markets | `stocks.html` | Live |

---

## Design System

- **Fonts:** Noto Serif (body), Noto Nastaliq Urdu (Urdu text via `var(--font-urdu)`), sans-serif system stack
- **Colors:** CSS custom properties — `var(--ink)`, `var(--ink-light)`, `var(--ink-faint)`, `var(--accent)`, `var(--bg-soft)`, `var(--line)`
- **RTL text:** `font-family: var(--font-urdu); direction: rtl; text-align: right`
- **Grid:** `repeat(auto-fill, minmax(185px, 1fr))` for poet cards
- **Responsive breakpoint:** 700px (two-column collapses to single)

---

## Poetry Page (`poetry.html`)

### Layout

On load, only the **Favourite Poets** section is visible. The personal poems section is hidden (`display:none`).

### Favourite Poets Section

Seven poet cards in a CSS grid. Cards are interactive buttons that reveal a feature panel below the grid. Clicking an active card toggles it off.

#### Card Rules
- Active cards get `border-color: var(--ink); background: var(--bg-soft)`
- The **"New" badge** marks the most recently updated card. It must move every time a poet's poem is added or changed — only one card carries it at a time. Current: **Ahmed Faraz**
- Badge HTML: `<span style="position:absolute; top:10px; left:10px; font-size:0.6rem; font-family:var(--font-sans); letter-spacing:0.1em; text-transform:uppercase; background:var(--accent); color:#fff; padding:2px 7px; border-radius:20px;">New</span>` — requires `style="position:relative;"` on the parent `<button>`
- To move the badge: remove the `<span>` from the old card and add it (with `position:relative` on the button) to the new card
- **Jaun Elia** is greyed out (`opacity: 0.38`, non-clickable `<div>`) — no poem content yet
- All other poets have content and are fully active

#### Poet Roster

| Poet | Urdu | Years | Featured Poem | Type | Status |
|---|---|---|---|---|---|
| Faiz Ahmed Faiz | فیض احمد فیض | 1911–1984 | گلوں میں رنگ بھرے | غزل | Active |
| Mirza Ghalib | مرزا غالب | 1797–1869 | ہزاروں خواہشیں ایسی | غزل | Active |
| Mir Taqi Mir | میر تقی میر | 1723–1810 | کیا بود و باش پوچھو ہو | قطعہ | Active |
| Ahmed Faraz | احمد فراز | 1931–2008 | سنا ہے لوگ اسے آنکھ بھر کے دیکھتے ہیں | غزل | Active |
| Sheikh Ibrahim Zauq | ذوق | 1790–1854 | لائی حیات آئے | غزل | Active |
| Jaun Elia | جون ایلیا | 1931–2002 | — | — | Greyed out |
| Muztar Khairabadi | مضطر خیرآبادی | 1865–1927 | بحرِ طویل | مسلسل غزل | Active |
| Mohsin Naqvi | محسن نقوی | 1947–1996 | ہم یوسفِ زماں تھے | غزل | Active · **New** |

#### Feature Panel — Standard Layout (all poets except Muztar)

Two-column panel:
- **Left column** (`.poet-feature-meta`): Urdu name, English name, years, intro paragraph, Rekhta link (if available)
- **Right column** (`.poet-feature-poem`): poem type label, then poem title as a clickable `<details>/<summary>` — click the title to expand the full poem below it
- If no poem yet (placeholder `<!-- -->`): shows "Featured poem coming soon." (title non-interactive)

#### Colour Standards — Site-Wide Rule

**`var(--ink)` is the default for all readable content.** This applies everywhere — poem text, book notes, signal entry notes, music notes, art panel intro text, and any other body copy.

- `var(--ink-light)` and `var(--ink-faint)` are **only** for purely decorative or metadata elements: painting captions, section eyebrow labels, date stamps, source names, small counter numbers. Never use them for substantive text the reader is meant to read.
- When in doubt, use `var(--ink)`. If text feels hard to read, the answer is always to remove the `-light` or `-faint` flag, not to adjust font size.

#### Urdu Font & Colour Standards

- **Font:** always `font-family: var(--font-urdu)` for all Urdu text — poem body, titles, card names, panel headers
- **Poem body text:** `font-size: 0.96rem; line-height: 2.4; color: var(--ink)`
- **Poem titles:** `font-family: var(--font-urdu); font-size: 1.5rem; color: var(--ink); font-weight: 400; line-height: 1.5`
- The Muztar verse style (0.96rem, 2.4 line-height, `var(--ink)`) is the reference standard for all poem rendering

#### Feature Panel — Muztar (special full-width layout)

Triggered when the POETS data entry has a `verses` array instead of a `poem` string. Renders three layers:

1. **Poet header** — name in Urdu (large), years, English name, bio
2. **Behr-e-Taweel note** — explains the metrical form (Fa'ilatun / فعلاتن), clarifies that Behr-e-Taweel is a *metrical form* within the ghazal structure, not a standalone genre
3. **8 collapsible verses** — `<details>/<summary>` accordions, each showing the verse label (پہلا مصرع through آٹھواں مصرع) and expanding to the full unbroken text

No Rekhta link for Muztar (poem not on Rekhta; source is a Medium article).

---

## Muztar Khairabadi — Behr-e-Taweel

**Classification:** Musalsal ghazal. Behr (بحر) means "meter" — Behr-e-Taweel is a metrical form, not a genre. The traditional genres (asnaf) are ghazal, qasida, masnavi, nazm, etc.

**Meter:** Fa'ilatun (فعلاتن) — short-short-long-long — repeated ~100 times per misra.

**Structure:** 8 verses, each a single unbroken line of nearly 100 metrical feet.

**Source:** Medium article by @kamathuday (Hindi/Devanagari transliterations used to verify Urdu text).

---

---

## Markets Page (`stocks.html`)

### Purpose
Personal watchlist with thesis notes. Explicit disclaimer: "This is not financial advice."

### Layout

1. **Live ticker tape** — TradingView ticker tape widget (top of page, all 5 symbols, light theme, transparent)
2. **Disclaimer** — muted left-bordered box: "Nothing on this page constitutes financial advice."
3. **Period + mode controls** — period tabs (1D / 1W / 1M / 3M / 6M / YTD / 1Y) and display mode toggle ($ / %)
4. **Watchlist table** — three columns: Ticker | Thesis | Price / Change
5. **Market notes** — live news feed below the watchlist, pulled from `/api/news`

### Watchlist — 5 Stocks

| Ticker | Name | Conviction | Thesis headline |
|---|---|---|---|
| AMD | Adv. Micro Devices | 4/5 | The GPU challenger |
| NVDA | NVIDIA Corp. | 5/5 | AI infrastructure, watching closely |
| AVGO | Broadcom Inc. | 4/5 | Custom silicon + software flywheel |
| LRCX | Lam Research | 3/5 | Semiconductor equipment leverage |
| SKHY | SK hynix Inc. | 4/5 | HBM memory leader, MU comp |

**Conviction** is shown as filled dots (accent colour) out of 5.

**NVDA language constraint:** Thesis copy must remain neutral/watching — never favoring NVDA. Yousuf works at AMD.

### Price Data

- Fetched from `/api/stock/{ticker}` (Cloudflare Pages Function at `functions/api/stock/[ticker].js`)
- Auto-refreshes every 30 seconds via `setInterval(loadAll, 30000)`
- Displays: current price, delta pill (green/red), extended hours (pre-market or after-hours) when market is closed
- Delta recalculates on period or mode change without re-fetching
- News ticker tags removed from news feed (tags were assigned by query ticker, not article subject — misleading)

### Chart Modal

- Clicking any ticker opens a TradingView full chart modal (920px wide, 520px tall)
- TradingView `tv.js` loaded lazily on first open
- Symbol map: `NASDAQ:AMD`, `NASDAQ:NVDA`, `NASDAQ:AVGO`, `NASDAQ:LRCX`, `NASDAQ:SKHY`
- Close on Escape key or clicking outside the modal

### Market Notes / News Feed

- Fetched from `/api/news` (Cloudflare Worker)
- Rendered as dated entries with ticker tag, headline (linked), and source name
- Falls back to "News unavailable — check back later." on error

### Responsive

At ≤640px: price column hidden, note entries collapse to single column.

---

## Art Feature — Paintings

Paintings appear on all pages. Images stored locally in `images/art/`. The first four pages use Osman Hamdi Bey; the Books page uses Fragonard (OHB's reading works have religious connotations — Quran reading — which doesn't fit a secular reading list).

| Page | File | Painting | Artist | Year | Orientation |
|---|---|---|---|---|---|
| `index.html` | `tortoise-trainer.jpg` | The Tortoise Trainer | Osman Hamdi Bey | 1906 | Landscape |
| `poetry.html` | `scholar.jpg` | Scholar | Osman Hamdi Bey | 1878 | Landscape |
| `music.html` | `musician-girls.jpg` | Two Musician Girls | Osman Hamdi Bey | 1880 | Portrait |
| `books.html` | `girl-reading.jpg` | A Young Girl Reading | Jean-Honoré Fragonard | c. 1776 | Portrait |
| `signal.html` | `wanderer.jpg` | Wanderer above the Sea of Fog | Caspar David Friedrich | 1818 | Portrait |
| `stocks.html` | `carpet-dealer.jpg` | The Carpet Dealer | Osman Hamdi Bey | 1888 | Landscape |

**Downloading the books page painting:** Fragonard's *A Young Girl Reading* is public domain. Download high-res from the [National Gallery of Art](https://www.nga.gov/collection/art-object-page.46189.html) or [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Fragonard,_Jean-Honor%C3%A9_-_A_Young_Girl_Reading_-_c._1776.jpg). Save as `images/art/girl-reading.jpg`.

### Layout Pattern — Art Panel

Full-width image above the main section content, with caption and intro text in a two-column row beneath it. **Two templates depending on painting orientation — always check before implementing.**

#### Landscape paintings (e.g. Scholar, Carpet Dealer)

Use `max-height` + `object-fit:cover` to constrain height while filling width:

```html
<div style="margin-bottom:64px; padding-bottom:56px; border-bottom:1px solid var(--line);">
  <img src="images/art/FILENAME.jpg" alt="TITLE — ARTIST, YEAR" style="width:100%; display:block; border-radius:2px; box-shadow:0 4px 20px rgba(0,0,0,0.09); max-height:520px; object-fit:cover; object-position:center top;" />
  <div style="display:grid; grid-template-columns:1fr 1fr; gap:32px; margin-top:16px; align-items:start;">
    <p style="font-size:0.67rem; color:var(--ink-faint); line-height:1.5; margin:0;">
      <em>TITLE</em>, YEAR &nbsp;·&nbsp;
      <a href="WIKI_URL" target="_blank" rel="noopener" style="color:var(--ink-faint); text-decoration:none; border-bottom:1px solid var(--line);">ARTIST</a>
    </p>
    <p style="font-family:var(--font-serif); font-size:1rem; font-weight:300; line-height:1.7; color:var(--ink); margin:0; text-align:right;">INTRO TEXT</p>
  </div>
</div>
```

#### Portrait paintings (e.g. Two Musician Girls, Wanderer above the Sea of Fog, A Young Girl Reading)

**Never use `max-height`/`object-fit:cover` on portrait paintings — it crops the subject.** Instead cap the width and center:

```html
<div style="margin-bottom:64px; padding-bottom:56px; border-bottom:1px solid var(--line);">
  <img src="images/art/FILENAME.jpg" alt="TITLE — ARTIST, YEAR" style="width:100%; max-width:560px; display:block; margin:0 auto; border-radius:2px; box-shadow:0 4px 20px rgba(0,0,0,0.09);" />
  <div style="display:grid; grid-template-columns:1fr 1fr; gap:32px; margin-top:16px; align-items:start;">
    <p style="font-size:0.67rem; color:var(--ink-faint); line-height:1.5; margin:0;">
      <em>TITLE</em>, YEAR &nbsp;·&nbsp;
      <a href="WIKI_URL" target="_blank" rel="noopener" style="color:var(--ink-faint); text-decoration:none; border-bottom:1px solid var(--line);">ARTIST</a>
    </p>
    <p style="font-family:var(--font-serif); font-size:1rem; font-weight:300; line-height:1.7; color:var(--ink); margin:0; text-align:right;">INTRO TEXT</p>
  </div>
</div>
```

### Landing Page (`index.html`) — Hero Layout

Two-column CSS grid (text left, painting right). Painting hides at ≤900px.

```css
.hero { grid-template-columns: 1fr 420px; gap: 64px; }
.hero-painting img { width:100%; max-height:580px; object-fit:cover; border-radius:2px; }
@media (max-width:900px) { .hero { grid-template-columns:1fr; } .hero-painting { display:none; } }
```

Credit caption sits below the painting image: italic title, year, linked artist name, one-line bio.

---

## Music Page (`music.html`)

Two sections of Spotify embeds rendered as a responsive card grid (`repeat(auto-fill, minmax(280px, 1fr))`). Each card has the embed iframe + an italic serif note below it.

### Urdu / South Asian — "Currently on repeat" (7 tracks)

| # | Title | Artist | Spotify Track ID |
|---|---|---|---|
| 1 | Chand Tanha | Meena Kumari | 43qYrY010Hd5QQjkxcoAoz |
| 2 | Aapki Yaad Aati Rahi Raat Bhar | Chhaya Ganguli | 2bCwBISaRkGc0CUY5t7X87 |
| 3 | Ham Tere Pyar Mein | Lata Mangeshkar | 2i59WVQlfjtScPqg3Y8Oor |
| 4 | Voh Baaten Teri Voh Fasane Tere | Tahira Syed | 7nxODFmY7EgsG6PQEjjv0J |
| 5 | Faasle | Kaavish & Quratulain Balouch | 6YNl1rXbhKvmbMrw9cp3RQ |
| 6 | Ae Ishq Hamen | Nayyara Noor | 7kElyPuukh0L4ypppyoRhL |
| 7 | Tum Apna Ranjh o Gham Apni | — | 57U2eQNEWPgMzIUhHVCVDq |

### English (4 tracks)

| # | Title | Artist | Spotify Track ID |
|---|---|---|---|
| 1 | Straight From The Heart | Bryan Adams | 6oqBRt8j0VSYtGdUsceSq7 |
| 2 | Sorry I'm Here For Someone Else | Benson Boone | 15zJeVUmKFnbrxm9dxcxYD |
| 3 | Highway to Hell | AC/DC | 2zYzyRzz6pRmhPzyfMEC8s |
| 4 | Livin' On A Prayer | Bon Jovi | 0J6mQxEZnlRt9ymzFntA6z |

Embed URL format: `https://open.spotify.com/embed/track/TRACK_ID?utm_source=generator`

---

## Books Page (`books.html`)

Personal reading list. Two sections: "Currently reading" and "Next". Each book displays as a card with title, linked author, and an italic serif note.

### Reading List

| Status | Title | Author | Amazon Author Link |
|---|---|---|---|
| Currently reading | The Secret of Secrets (Robert Langdon series) | Dan Brown | https://www.amazon.com/Dan-Brown/e/B000AP9DSU/ |
| Next | Meatless Days | Sara Suleri Goodyear | https://www.amazon.com/Sara-Suleri-Goodyear/e/B001HNZ1SK/ |

### Art Panel

Uses Fragonard's *A Young Girl Reading* (c. 1776) — secular, intimate, public domain. File: `images/art/girl-reading.jpg`. Portrait orientation — uses `max-width:560px; margin:0 auto` (never `max-height`/`object-fit:cover`, which would crop the subject).

---

## Signal Page (`signal.html`)

### Purpose

Curated reading list of articles, essays, and ideas on AI and what comes next. Not a blog — a selective, annotated list of things worth reading.

### Layout

1. **Page header** — eyebrow "Signal", h1 "Worth reading", subtitle
2. **Art panel** — Friedrich's *Wanderer above the Sea of Fog* (portrait, `max-width:560px` centered)
3. **Signal entries** — one section ("AI & the future"), entries listed newest first

### Art Panel

Caspar David Friedrich (1774–1840), *Wanderer above the Sea of Fog*, 1818. Kunsthalle Hamburg. File: `images/art/wanderer.jpg`. Portrait orientation — `max-width:560px; margin:0 auto`.

The artist intro: "A figure standing on a peak, looking out at a vast and uncertain landscape below. A painting about confronting the unknown — which is the only honest position anyone can take right now about what AI becomes."

### Entry Structure

Each entry has:
- Optional **"New" badge** — `display:inline-block` on its own line above the title (never `position:absolute`, which causes overlap)
- **Title** — linked, serif, 1.2rem
- **Meta** — source · author · date, in `var(--ink-faint)`
- **Note** — italic serif annotation in `var(--ink)` (never `-light`)

```html
<div class="signal-entry">
  <span style="display:inline-block; font-size:0.6rem; font-family:var(--font-sans); letter-spacing:0.1em; text-transform:uppercase; background:var(--accent); color:#fff; padding:2px 7px; border-radius:20px; margin-bottom:10px;">New</span>
  <p class="signal-title"><a href="URL">Title</a></p>
  <p class="signal-meta">Source &nbsp;·&nbsp; Author &nbsp;·&nbsp; Date</p>
  <p class="signal-note">Annotation...</p>
</div>
```

### Current Entries (newest first)

| # | Title | Source | Author | Date | Note |
|---|---|---|---|---|---|
| 1 | AI's First Autonomous Cyber Attack | Medium | Ignacio de Gregorio | July 2026 | **New** badge |
| 2 | AI 2027 | ai-2027.com | Daniel Kokotajlo et al. | — | — |
| 3 | AI 2040: Plan A | ai-2040.com | Thomas Larsen, Daniel Kokotajlo et al. | — | — |

---

## Landing Page (`index.html`)

### "What's Here" Section Cards

Five cards in a 2-column CSS grid. The 5th card (Markets) spans full width with `grid-column: 1 / -1`.

| # | Icon | Label | Link |
|---|---|---|---|
| 01 | ✦ | Poetry | `poetry.html` |
| 02 | ♪ | Music | `music.html` |
| 03 | 📖 | Books | `books.html` |
| 04 | ∆ | Signal | `signal.html` |
| 05 | ◈ | Markets | `stocks.html` |

Icon rationale: ∆ (delta) chosen for Signal — the mathematical symbol for change, appropriate for a page tracking technology shifts and AI futures.

---

## Pending / Future

- **Jaun Elia** — add a featured sher or ghazal; card will become active and lose grey-out
- **Personal poems** — section exists in HTML but is hidden; to be shown when Yousuf adds his own work
- **Featured sher of the day** — discussed, deferred
- **Books page image** — download `girl-reading.jpg` from NGA or Wikimedia Commons and save to `images/art/`

---

## Workflow Notes

- All edits go to `C:\Users\Owner\OneDrive\Documents\GitHub\ykhan-website\`
- Push to GitHub triggers Cloudflare Pages auto-deploy (can take a few minutes)
- Hard refresh (Ctrl+Shift+R) or incognito window if browser cache shows stale content
- **"New" badge** — update manually in HTML whenever a poet's content changes; only one card carries it at a time

## Claude's Working Rules

1. **Read `design.md` before making any change** — always load this file first to understand current design decisions, standards, and constraints before touching any code.
2. **Update `design.md` after any change** — after every edit, check whether it represents a design or requirement change and update this file accordingly. This keeps the document the single source of truth.

---

## API & Backend Rules (hard lessons)

### Rule: Verify data shape before writing code

Before modifying any code that depends on an external API (Yahoo Finance, Spotify, etc.):

1. **Establish ground truth first.** Use an independent source (Alpha Vantage, browser dev tools, a known-good value) to confirm what the correct output should be. E.g., "AMD 1D delta should be +$8.49" before touching anything.
2. **Inspect the actual API response.** Never assume field names. `chartPreviousClose` sounds like "yesterday's close" but is actually the close at the *start of the requested date range*. `regularMarketPreviousClose` sounds right but doesn't exist in the v8 chart API. Read the response, then write the code.
3. **State the expected output before pushing.** Write it down: "after this change, AMD 1D should show ~+$8.49." Verify after deploy. If it doesn't match, don't push another guess — re-inspect.

### Cloudflare Worker / Pages Functions

- Functions live in `functions/api/` and deploy automatically with the site.
- Cache header is `public, max-age=300` (5 minutes) — after a push, wait up to 5 min or test in a new incognito window.
- Workers run in UTC timezone — `new Date()` is UTC, relevant for any midnight/day-boundary logic.

### Yahoo Finance v8 Chart API — Known Behaviour

Endpoint: `https://query1.finance.yahoo.com/v8/finance/chart/{TICKER}?interval=1d&range=Xy`

- **`meta.regularMarketPrice`** — current live price. Reliable.
- **`meta.chartPreviousClose`** — close from the day *before the chart range starts*, NOT yesterday's close. With `range=1y`, this is the close from ~1 year ago. **Do not use for 1D delta.**
- **`meta.regularMarketPreviousClose`** — does NOT exist in the v8 chart API. Field name is a v7 quote API concept.
- **`result.indicators.quote[0].close`** — array of historical daily closes. May or may not include today's partial candle depending on market state.

### Correct approach for 1D delta

Fetch two parallel requests:
- `range=1y&interval=1d` → historical closes for 1W / 1M / 3M / 6M / YTD / 1Y periods
- `range=1d&interval=1d` → `meta.chartPreviousClose` from *this* response = yesterday's close (because the chart window is today, so the previous period is yesterday)

```javascript
const [res1y, res1d] = await Promise.all([
  fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1d&range=1y`, fetchOpts),
  fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1d&range=1d`, fetchOpts)
]);
const prevClose1D = data1d?.chart?.result?.[0]?.meta?.chartPreviousClose || null;
```

This is the current implementation in `functions/api/stock/[ticker].js`.

---

## Constraints

- Yousuf works at AMD. Any references to NVDA on the site must use neutral/watching language — never favoring NVDA.
