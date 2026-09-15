# Personal Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the personal portfolio site (`index.html`, `styles.css`, `scripts.js` at the repo root) as a Vite-built, Three.js-powered static site with the design already validated in the mockup, deployable to GitHub Pages via a `gh-pages` branch.

**Architecture:** A Vite vanilla-JS project. `index.html` holds the page markup. `src/styles.css` holds all CSS (design tokens + components). `src/scene/heroScene.js` owns the hero Three.js interaction (icosahedron gem, pulses, mouse-follow, hover trackball spin). `src/sections.js` owns GSAP ScrollTrigger reveal animations for the non-hero sections. `src/main.js` is the entry point that wires both up. `npm run build` produces static output in `dist/`; `npm run deploy` pushes `dist/` to a `gh-pages` branch for GitHub Pages to serve.

**Tech Stack:** Vite (vanilla JS template), Three.js (npm, not CDN), GSAP + ScrollTrigger (npm), `gh-pages` npm package for deployment. No CSS framework, no UI framework.

**Spec:** `docs/superpowers/specs/2026-09-15-portfolio-redesign-design.md`
**Validated mockup (source to port from):** `docs/superpowers/specs/2026-09-15-portfolio-redesign-mockup.html`

## Global Constraints

- Static site only — no backend, no CMS, no dynamic data fetching.
- Three.js and GSAP are installed via npm and bundled by Vite — never loaded from a CDN in the real site (the mockup used a CDN only because it's a single-file Artifact).
- No automated test suite for this project (per spec) — every task's "test" step is manual verification via the Vite dev server and the browser automation tool, not `pytest`/`vitest`.
- Design tokens, type choices (Fraunces / Work Sans / IBM Plex Mono), and all component CSS must be ported from the mockup file exactly — this is not a redesign pass.
- The hero 3D interaction (ambient cursor-follow tilt, hover trackball spin with the slowed-down sensitivity, continuous edge pulses, `prefers-reduced-motion` fallback) must be ported from the mockup's `<script>` block exactly — same constants, same behavior.
- `main` branch stays source-only. Build output only ever lives on the `gh-pages` branch, never committed to `main`.
- The repo is a GitHub *project* page (`theOrionxian/PersonalWeb`, not a `theOrionxian.github.io` user page), so it will be served at `https://theorionxian.github.io/PersonalWeb/` — Vite's `base` config must be set to `/PersonalWeb/` or asset paths will 404 in production.
- The "About Me" paragraph copy is a draft (already written in the mockup) — port it verbatim; wording changes are the user's editorial call, not an implementation task.
- Pushing to the `gh-pages` branch (Task 7) is a visible, hard-to-reverse action — do not run the deploy step without the user's explicit go-ahead at that point, even though it's the last task in this plan.

---

### Task 1: Scaffold the Vite project

**Files:**
- Create: `package.json`
- Create: `vite.config.js`
- Create: `.gitignore`
- Modify: none yet (existing root `index.html`, `styles.css`, `scripts.js` are replaced in Task 5, not this task)

**Interfaces:**
- Produces: an `npm run dev` script that serves the project on localhost, an `npm run build` script that outputs to `dist/`, an `npm run deploy` script (wired in Task 6, stubbed here).

- [ ] **Step 1: Initialize package.json**

Run:
```bash
npm create vite@latest . -- --template vanilla
```
When prompted about the current directory not being empty, choose to continue (the existing `index.html`/`styles.css`/`scripts.js`/`assets/` stay for now — they get replaced in Task 5). If the interactive prompt can't be satisfied non-interactively, instead hand-write `package.json`:

```json
{
  "name": "personal-web",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

- [ ] **Step 2: Install dependencies**

Run:
```bash
npm install three gsap
npm install -D vite gh-pages
```

- [ ] **Step 3: Create vite.config.js**

```js
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/PersonalWeb/'
});
```

- [ ] **Step 4: Create .gitignore**

```
node_modules
dist
.DS_Store
```

- [ ] **Step 5: Verify the dev server runs**

Run: `npm run dev` (in the background, or note the printed local URL).
Expected: Vite prints a local dev URL (e.g. `http://localhost:5173/`) with no errors in the terminal.

Use the browser automation tool to open that URL and confirm the page loads without a blank white screen or console errors (the default Vite scaffold page is fine at this point — it gets replaced in Task 5).

- [ ] **Step 6: Commit**

```bash
git add package.json vite.config.js .gitignore package-lock.json
git commit -m "chore: scaffold Vite project for portfolio redesign

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 2: Port page markup and CSS design tokens

**Files:**
- Modify: `index.html` (replace entirely)
- Create: `src/styles.css`
- Test: manual, via dev server + browser tool

**Interfaces:**
- Produces: the DOM structure and CSS classes/IDs that Tasks 3 and 4 attach behavior to — specifically `#site-header`, `.hero-frame`, `#hero-canvas`, `main section` (for scroll reveals), `.links-card`, `.grid-card`, `.ledger-row`.
- Consumes: nothing from earlier tasks.

- [ ] **Step 1: Copy the CSS**

Open `docs/superpowers/specs/2026-09-15-portfolio-redesign-mockup.html` and copy lines 4–208 (everything between the `<style>` and `</style>` tags — the `:root` tokens, dark-mode blocks, and every component rule) into a new `src/styles.css`. Do not wrap it in `<style>` tags — it's a plain `.css` file. Keep it byte-for-byte identical to the mockup's CSS; do not "improve" or reorder anything in this task.

- [ ] **Step 2: Copy the page markup into index.html**

Replace the existing `index.html` at the repo root with:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,440;9..144,520;9..144,600&family=Work+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap">
  <title>Oliverio Nathanael</title>
</head>
<body>
<!-- PASTE HERE: lines 211-370 of docs/superpowers/specs/2026-09-15-portfolio-redesign-mockup.html
     (from <header id="site-header"> through </footer>) -->
<script type="module" src="/src/main.js"></script>
</body>
</html>
```

Copy lines 211–370 from the mockup file (the full `<header>...</header><main>...</main><footer>...</footer>` block) verbatim into the marked spot. Change the profile photo `<img src="profile.png" ...>` to `<img src="/assets/profile.png" ...>` — the real image asset is added in Task 5, this task just needs the correct path.

- [ ] **Step 3: Create a placeholder main.js that only imports the stylesheet**

```js
import './styles.css';
```

Save as `src/main.js`. This is temporary — Task 3 and Task 4 expand it.

- [ ] **Step 4: Verify visually**

Run `npm run dev` and open the dev URL with the browser automation tool. Take a screenshot and confirm:
- The nav bar shows "OTN", and the five links About/Links/Education/Experiences/Publications.
- The hero shows "Hi, I am" / "Oliverio Theophilus Nathanael" / "Data Engineer · AI Researcher".
- The About Me, Links (4 cards), Education (1 row), Experiences (3 rows), and Publications (4 cards) sections all render with the fonts (Fraunces headings, monospace dates/labels) and the light color palette from the mockup.
- No console errors (check via the browser tool's console reader).

The hero frame box will be empty (no 3D scene yet) — that's expected until Task 3.

- [ ] **Step 5: Commit**

```bash
git add index.html src/styles.css src/main.js
git commit -m "feat: port page markup and design tokens from validated mockup

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 3: Port the hero 3D scene

**Files:**
- Create: `src/scene/heroScene.js`
- Modify: `src/main.js`
- Test: manual, via dev server + browser tool

**Interfaces:**
- Consumes: `.hero-frame` and `#hero-canvas` elements from Task 2's `index.html`.
- Produces: `export function initHeroScene()` — called once from `main.js`. No other module depends on this one.

- [ ] **Step 1: Write heroScene.js**

Open `docs/superpowers/specs/2026-09-15-portfolio-redesign-mockup.html` and find the second `<script>` IIFE — the one starting with the comment `// A single icosahedron "gem" in the hero frame...` (inside the `<script>` block spanning lines 373–515). Port that IIFE's body into `src/scene/heroScene.js`, wrapped as an exported function instead of an auto-running IIFE, and importing Three.js from the npm package instead of relying on a global:

```js
import * as THREE from 'three';

export function initHeroScene() {
  const container = document.querySelector('.hero-frame');
  const canvas = document.getElementById('hero-canvas');
  if (!container || !canvas) return;

  // --- PASTE HERE: the body of the mockup's second script IIFE,
  //     from `var css = getComputedStyle(...)` through the final
  //     `window.addEventListener('resize', size);` line.
  //     Keep every constant (STROKE_SENSITIVITY = 0.0026, MAX_DELTA = 40,
  //     friction 0.94, follow lerp factors 0.05/0.22/0.16) exactly as-is —
  //     these were tuned live and approved, including the "slower spin" fix.
  //     Replace every `THREE.X` reference — they already work as-is once
  //     `THREE` is the imported module rather than a CDN global.
}
```

Do not port the mockup's first script IIFE (the header scroll-shadow toggle) into this file — that belongs in `main.js` (Step 3 below), since it's page chrome, not part of the 3D scene.

- [ ] **Step 2: Wire it up from main.js**

```js
import './styles.css';
import { initHeroScene } from './scene/heroScene.js';

initHeroScene();

const header = document.getElementById('site-header');
window.addEventListener('scroll', () => {
  header.classList.toggle('is-scrolled', window.scrollY > 4);
});
```

- [ ] **Step 3: Verify the scene renders**

Run `npm run dev`, open the dev URL with the browser tool, and screenshot the hero. Confirm:
- The faceted icosahedron with the thin indigo wireframe is visible inside the hero frame, matching the mockup's appearance.
- Small amber pulse dots are visible traveling along its edges.

- [ ] **Step 4: Verify the interaction**

Using the browser automation tool, simulate a swipe across the hero frame (a sequence of `hover` calls moving left-to-right across the frame's coordinates, as was done to validate the mockup), wait ~1 second, and screenshot again. Confirm the facet orientation visibly changed (the gem responded to the stroke) and that the spin looks gentle/slow rather than fast — this is the behavior specifically tuned down in the mockup.

- [ ] **Step 5: Verify reduced-motion fallback**

Using the browser tool's viewport/emulation controls, set `prefers-reduced-motion: reduce` (or re-check the mockup's equivalent code path by reading `heroScene.js` — the `reduced` branch should render once with a fixed rotation and no pulse/follow/spin behavior). Confirm no console errors occur in this mode.

- [ ] **Step 6: Commit**

```bash
git add src/scene/heroScene.js src/main.js
git commit -m "feat: port hero 3D icosahedron scene with cursor-follow and trackball spin

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 4: Section scroll-reveal animations

**Files:**
- Create: `src/sections.js`
- Modify: `src/main.js`
- Test: manual, via dev server + browser tool

**Interfaces:**
- Consumes: `main section:not(#hero)` elements and their `.links-card` / `.grid-card` / `.ledger-row` children from Task 2's `index.html`.
- Produces: `export function initSectionReveals()` — called once from `main.js`.

- [ ] **Step 1: Write sections.js**

```js
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initSectionReveals() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return;

  document.querySelectorAll('main section:not(#hero)').forEach((section) => {
    const cards = section.querySelectorAll('.links-card, .grid-card, .ledger-row');
    const targets = cards.length
      ? Array.from(cards)
      : [section.querySelector('.sec-head'), section.querySelector('.about-lede')].filter(Boolean);

    gsap.set(targets, { opacity: 0, y: 20 });
    gsap.to(targets, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power2.out',
      stagger: 0.08,
      scrollTrigger: {
        trigger: section,
        start: 'top 80%'
      }
    });
  });
}
```

- [ ] **Step 2: Wire it up from main.js**

Add to `src/main.js`:

```js
import { initSectionReveals } from './sections.js';

initSectionReveals();
```

(alongside the existing `initHeroScene()` call and header scroll listener from Task 3).

- [ ] **Step 3: Verify reveals fire on scroll**

Run `npm run dev`, open the dev URL with the browser tool. Scroll down slowly (in a few steps) and screenshot after each step. Confirm each section's cards/rows fade and slide up into place as they cross into view, rather than being visible immediately on load — except the hero, which must remain fully visible at rest (it's excluded via `:not(#hero)`).

- [ ] **Step 4: Verify reduced-motion**

With `prefers-reduced-motion: reduce` emulated, reload and confirm every section's content is immediately visible (no opacity:0 stuck state) since `initSectionReveals()` returns early in that mode.

- [ ] **Step 5: Commit**

```bash
git add src/sections.js src/main.js
git commit -m "feat: add GSAP ScrollTrigger reveal animations for content sections

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 5: Real assets and final content wiring

**Files:**
- Create: `public/assets/profile.png`
- Modify: `index.html` (favicon link, if not already present)
- Delete: root-level `styles.css`, `scripts.js`, `assets/` (superseded — content now lives in `src/` and `public/assets/`)
- Test: manual, via dev server + browser tool

**Interfaces:** none — this task only moves/removes files and does not change any exported function signature from Tasks 2–4.

- [ ] **Step 1: Move the real profile photo into public/assets**

```bash
mkdir -p public/assets
cp assets/bw_self.png public/assets/profile.png
```

Confirm `index.html`'s hero photo `<img src="/assets/profile.png" ...>` now resolves to this real file (Vite serves `public/` at the site root, so `/assets/profile.png` maps to `public/assets/profile.png`).

- [ ] **Step 2: Remove the superseded root-level files**

```bash
git rm styles.css scripts.js
git rm -r assets
```

(`assets/bw_self.png` was already copied to `public/assets/profile.png` in Step 1 — the other icons in the old `assets/` folder, like `linkedin_icon.png`/`github_icon.png`, are unused now since the redesign uses inline monoline SVG icons instead.)

- [ ] **Step 3: Verify the full page end-to-end**

Run `npm run dev`, open the dev URL, and confirm:
- The real profile photo (not a broken image icon) shows in the hero photo badge.
- Every link in the Links section still points to the correct real URL (LinkedIn, GitHub, Google Scholar, mailto) — check `href` values via the browser tool's page-read, not just visually.
- No 404s in the network tab for any asset (photo, fonts, or the (now-removed) old icon files).

- [ ] **Step 4: Commit**

```bash
git add public/assets/profile.png
git commit -m "feat: wire real profile photo, remove superseded legacy assets

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 6: Production build verification

**Files:**
- Modify: `package.json` (add `deploy` script)
- Test: manual, via local static server

**Interfaces:** none — this task verifies output, it doesn't change source.

- [ ] **Step 1: Add the deploy script**

Edit `package.json`'s `scripts` block to add:

```json
"deploy": "vite build && gh-pages -d dist"
```

- [ ] **Step 2: Build for production**

```bash
npm run build
```

Expected: a `dist/` directory is created containing `index.html`, hashed JS/CSS asset files, and `assets/profile.png`, with no build errors or warnings about missing modules.

- [ ] **Step 3: Serve the production build locally and verify**

```bash
npx vite preview
```

Open the printed local preview URL (this respects the `/PersonalWeb/` base path from `vite.config.js`, unlike a plain static file server) with the browser tool. Confirm:
- The page loads with no console errors and no 404s (check the network tab specifically — this is the step that catches a wrong `base` path).
- Fonts, the hero 3D scene, and the scroll reveals all still work exactly as they did in `npm run dev`.

- [ ] **Step 4: Commit**

```bash
git add package.json
git commit -m "chore: add gh-pages deploy script, verify production build

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 7: Deploy to GitHub Pages

**Files:** none (this task only runs commands and changes repo/GitHub state).

**Interfaces:** none.

**⚠️ Do not run Step 1 of this task without the user explicitly confirming they want to deploy now** — it pushes a new `gh-pages` branch to the `origin` remote (`https://github.com/theOrionxian/PersonalWeb.git`), which is a visible, public action.

- [ ] **Step 1: Deploy (only after explicit user confirmation)**

```bash
npm run deploy
```

Expected: this builds the project and pushes `dist/` to a new/updated `gh-pages` branch on `origin`.

- [ ] **Step 2: Tell the user about the one-time GitHub Pages setting**

This is a manual step only the user can do (repo settings, not something committable): in the GitHub repo's **Settings → Pages**, set **Source** to **Deploy from a branch**, branch **gh-pages**, folder **/ (root)**. After saving, GitHub Pages will serve the site at `https://theorionxian.github.io/PersonalWeb/` within a few minutes.

- [ ] **Step 3: Verify the live site**

Once the user confirms the Pages setting is saved and has waited for the initial deploy, open `https://theorionxian.github.io/PersonalWeb/` with the browser tool and confirm it matches the local production preview from Task 6 — no 404s, 3D scene works, fonts load.

---

## Self-Review Notes

- **Spec coverage:** stack (Task 1), content/structure + visual system (Task 2), hero 3D interaction incl. the slower-spin tuning (Task 3), scroll reveals — called out in the spec as "added in the real build" (Task 4), real assets replacing mockup placeholders (Task 5), deployment via `gh-pages` branch with `main` staying source-only (Tasks 6–7). All spec sections are covered.
- **Placeholder scan:** every step has concrete commands or code; the two places that say "paste from the mockup" point at exact, currently-valid line numbers in a file already committed to the repo, not vague future work.
- **Type/name consistency:** `initHeroScene()` and `initSectionReveals()` are the only two cross-file exports in this plan, both defined once (Tasks 3 and 4) and called once each from `main.js` (also Tasks 3 and 4) — verified consistent.
