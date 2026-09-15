# Personal Portfolio Redesign — Design Spec

Status: approved via live mockup iteration. Reference mockup: https://claude.ai/artifact/PxUijxvs5xnNotQboargfD

## Goal

Replace the current rough, hand-built HTML/CSS/JS personal site (CV + portfolio +
links) with a professional, visually distinctive redesign that incorporates
Three.js, while staying a static site deployable to GitHub Pages.

## Stack

- **Build tool**: Vite (vanilla JS template — no framework). `npm run dev` for
  local development, `npm run build` outputs static files to `dist/`.
- **3D**: Three.js, installed via npm (not CDN) so it's bundled by Vite.
- **Animation**: GSAP + ScrollTrigger for section reveal-on-scroll (not used in
  the mockup, since the mockup is a single static snapshot — added in the real
  build).
- **No CSS framework** — hand-written CSS using custom properties as design
  tokens (see palette below).
- **Deployment**: `gh-pages` npm package. `npm run deploy` builds and pushes
  `dist/` to a `gh-pages` branch. GitHub Pages is configured (manually, one
  time, in repo Settings → Pages) to serve from that branch. `main` stays
  source-only — no build artifacts committed there.

## Content & structure

Same information as the current site, restructured into these sections, in
order:

1. **Hero** — name, "Data Engineer · AI Researcher", 3D centerpiece, profile
   photo badge.
2. **About Me** (new) — a short first-person paragraph. Draft copy already
   written (see mockup) and grounded in the CV facts (BINUS, ControlNet
   thesis, generative models / cognition interest) — needs the user's final
   pass on wording, not a content decision for implementation.
3. **Links** — LinkedIn, GitHub, Google Scholar, mail. Same four links as
   today, restyled as minimal icon cards with monoline SVG icons (not brand
   logo images).
4. **Education** — same single entry (Bachelor's, BINUS, thesis, GPA),
   restyled as a "ledger" row (label column + detail column).
5. **Experiences** — same three roles, same ledger treatment.
6. **Publications** — same four papers, restyled as a 2×2 card grid with
   abstract CSS-pattern placeholder thumbnails (no real figure images used).

No other content changes. No new pages/routing — still a single scrolling
page.

## Visual system

- **Palette** (light-first, with a full dark-mode token set — see mockup CSS
  for exact values): warm paper-white background, near-black ink, one muted
  indigo accent (`--accent`), one warm amber "signal" accent (`--signal`,
  used only by the 3D pulses).
- **Type**: Fraunces (display/headings), Work Sans (body), IBM Plex Mono
  (dates, labels, eyebrows, nav).
- **Layout**: single-column scrolling page, `max-width: 1080px` content
  column, generous whitespace, hairline rules instead of heavy card borders
  where possible.

All exact CSS (tokens, type scale, component styles) is already written and
validated in the mockup — implementation should port it directly rather than
redesign it.

## 3D hero interaction

A single low-poly icosahedron ("gem") sits in a bordered frame in the hero,
scoped to that frame (not a full-page canvas):

- **Geometry**: `IcosahedronGeometry(radius, 1)` — faceted solid mesh
  (`flatShading`, warm off-white) + wireframe edge overlay in the accent
  color.
- **Neuron-activation pulses**: ~6 small spheres in the "signal" amber color
  continuously travel along the gem's edges (one random edge at a time, looped),
  suggesting synapses firing.
- **Ambient behavior**: the gem continuously tilts toward the cursor's
  position anywhere on the page (not hover-gated) — a subtle "it's aware of
  you" effect.
- **Hover interaction**: while the cursor is over the hero frame and moving,
  the gem picks up rotational velocity proportional to the stroke direction
  (drag-to-spin, trackball-style) and decays gradually after the cursor
  stops or leaves — it does not snap back. **Spin sensitivity is tuned low
  (slow spin)** per final feedback — a stroke should produce a gentle turn,
  not a fast whirl.
- **No idle auto-rotation** — the gem only moves in response to the cursor
  (ambient tilt) or a stroke (spin), plus the always-on pulse animation.
- **Accessibility**: under `prefers-reduced-motion: reduce`, the gem renders
  once in a fixed orientation with no pulse animation, no follow, no spin.
- **Resize-safe**: canvas sizing and camera aspect update on window resize.

This exact behavior (structure, sensitivity, easing constants) is implemented
and tested in the mockup's `<script>` — implementation should port that logic
directly.

## File structure (target)

```
src/
  main.js          # entry: imports styles.css, boots the hero scene + section wiring
  scene/            # hero Three.js scene (gem, pulses, follow/spin interaction, resize)
  sections.js       # GSAP ScrollTrigger reveal wiring for non-hero sections
  styles.css        # design tokens (light + dark) + all component styles
public/
  assets/           # profile photo, favicon; static, copied as-is by Vite
index.html           # page markup (content structure from the mockup)
```

## Out of scope for this change

- No CMS/backend, no dynamic data.
- No new sections beyond "About Me".
- No automated test suite (static personal site) — verified manually: dev
  server, responsive breakpoints, 3D scene behavior (follow/spin/reduced-motion),
  production build served locally before deploy.
