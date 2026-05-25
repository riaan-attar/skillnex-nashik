# Skillnex — Full Frontend Redesign

A complete visual overhaul in **Swiss Editorial Bento** style with cinematic scroll-driven storytelling. Backend, auth, routing, and data layer stay untouched — only frontend / presentation code changes.

## Design system

**Palette (Paper & Ink)** — written into `src/styles.css` as oklch tokens:
- `--background` #f5f3ee (paper)
- `--card` #e8e4dd (linen)
- `--foreground` #0d0d0d (ink)
- `--muted-foreground` #2d2d2d
- `--accent` #0d0d0d on paper / inverts to paper on ink
- Single hairline rule color `--rule` at 12% ink

**Typography**:
- Display: **DM Serif Display** (oversized editorial headlines, tight tracking, mixed italics)
- Body / UI: **Fira Sans** (400/500/600)
- Numerals: Fira Sans tabular for prices, chapter numbers, durations

**Motion register (4/5 — cinematic but disciplined)**:
- Framer Motion + a custom `useScrollReveal` hook
- Hero: kinetic type — words enter on a stagger, italic word morphs in
- Sticky chapter rails with progress indicator down the left edge
- Pinned horizontal scroll for "Streams we teach"
- Parallax on bento tiles (subtle Y translate based on scroll progress)
- Marquee strip of student outcomes
- Magnetic CTA buttons, hover-lift on cards, underline grow on links
- `prefers-reduced-motion` collapses everything to fades

## Landing page (`/`) — bento storytelling

Chaptered narrative, each chapter announced by a numeral + italic kicker.

```
[ 00 — Skillnex ]   Sticky top rail w/ scroll progress
─────────────────────────────────────────────
HERO                Oversized serif: "Learn the
                    craft of /modern marketing/."
                    Kinetic word reveal, ticker of
                    streams below, dual CTA.
─────────────────────────────────────────────
[ 01 — Why ]        Bento 4-tile manifesto:
                    big quote tile · stat tile ·
                    image tile · founder note
─────────────────────────────────────────────
[ 02 — Streams ]    Pinned horizontal scroll —
                    one panel per stream (SMM,
                    Performance, Video Editing)
                    with serif numerals 01/02/03
─────────────────────────────────────────────
[ 03 — Course      Bento grid of 3 demo courses,
   showcase ]      mixed tile sizes, hover reveals
                    lesson count + preview play
─────────────────────────────────────────────
[ 04 — How it      4-step horizontal timeline
   works ]         with sticky progress dot
─────────────────────────────────────────────
[ 05 — Outcomes ]   Marquee of student wins +
                    bento testimonial grid
─────────────────────────────────────────────
[ 06 — Pricing     Inverted (ink) section:
   teaser ]        per-course vs All-Access
─────────────────────────────────────────────
[ 07 — FAQ ]        Editorial accordion, serif Qs
─────────────────────────────────────────────
[ 08 — CTA ]        Full-bleed serif takeover:
                    "Begin chapter one." → /signup
```

## Page-by-page changes

| Route | Redesign |
|---|---|
| `/` | Full bento + scroll narrative above |
| `/programs` | Editorial catalog: numbered list view toggle + bento grid view, filter chips, hover scrubbing on cover |
| `/programs/$slug` | Magazine layout — oversized title, italic kicker, sticky enroll rail, lesson list as numbered chapters, free-preview Vimeo embed with custom controls skin |
| `/about` | Long-form editorial — pull quotes, drop caps, founder portrait tile, mission manifesto |
| `/pricing` | Dark inverted bento — per-course tile vs All-Access feature comparison, animated toggle monthly/annual |
| `/faq` | Two-column: sticky category nav + animated accordion |
| `/contact` | Split: serif statement + minimal form with floating labels |
| `/login` `/signup` | Split-screen: left = rotating italic quote on paper, right = form on ink, Google button styled as editorial chip |
| `/dashboard` | Bento: continue-watching hero tile, progress ring, enrolled courses grid, next-up lesson, achievements strip |
| `/learn/$slug` | Cinematic player — full-bleed Vimeo, chapter list as right rail, auto-collapsing chrome on play, keyboard shortcuts overlay |
| `/account` | Minimal editorial settings stack |
| `/admin` | Keep functional, restyle to match: serif section headers, paper tables with hairline rules |

## Shared components to build/refresh

- `components/site/Header.tsx` — slim, serif wordmark, mix-blend-difference on dark sections, mobile drawer slides from right
- `components/site/Footer.tsx` — oversized serif sign-off + sitemap columns + tiny rule line
- `components/motion/ScrollReveal.tsx` — viewport-triggered fade/translate
- `components/motion/KineticHeadline.tsx` — word-stagger reveal w/ italic accent word
- `components/motion/Marquee.tsx` — infinite horizontal scroller
- `components/motion/PinnedHorizontal.tsx` — vertical-scroll-driven horizontal pan
- `components/motion/ChapterRail.tsx` — sticky left-edge progress indicator
- `components/site/BentoTile.tsx` — variant-driven card (size sm/md/lg/xl, tone paper/ink)
- `components/site/MagneticButton.tsx`
- `components/site/CoursePoster.tsx` — editorial course card with hover scrub

## Technical notes

- Add `framer-motion` if not present (verify in package.json first)
- All colors via tokens in `src/styles.css`; no hex in components
- Lazy-load heavy motion sections with `React.lazy` to keep TTI low
- Respect `prefers-reduced-motion` in every motion component
- SEO: keep per-route `head()` titles/descriptions; add `og:image` on `/programs/$slug` from course cover
- No backend, schema, auth, server-function, or routing changes — purely presentation layer
- Keep existing route file paths; only rewrite components / styles inside them

## Out of scope

- Stripe integration (separate decision pending)
- Real Vimeo IDs (still placeholders)
- Admin functionality changes (visual restyle only)
- Copy rewrite beyond what's needed to fit the new layouts

## Build order

1. Tokens + fonts in `src/styles.css`
2. Shared motion + bento primitives
3. Header / Footer
4. Landing page chapters (00 → 08)
5. Programs catalog + course detail
6. About / Pricing / FAQ / Contact
7. Auth pages
8. Dashboard + Learn player
9. Account + Admin restyle
10. Reduced-motion + responsive QA pass
