# CLAUDE.md

Guidance for Claude Code sessions in this repo. Source of truth for requirements: `../FlowPilot_Candidate_Assessment_Brief.docx`. Do not invent requirements or design details; ask when unsure.

## Overview
FlowPilot Landing Page: a Technyx 4-hour, Claude-assisted frontend assessment (Junior Frontend level). Single-page responsive React site built from a Figma design (visual source of truth). No backend/API. The brief grades workflow, prompting quality, iteration and engineering judgment, not only the output. The candidate must be able to explain all code, and must verify behavior by running it, not trust Claude's claim of correctness.

## Stack (fixed by the brief; do not add or replace)
- React 19, TypeScript, Tailwind CSS 4 (`@tailwindcss/vite`), React Hook Form, React Testing Library.
- Allowed extra: a lightweight icon library (Lucide, `lucide-react`).
- Tooling: Vite 8 (bundler), Vitest 5 + jsdom + `@testing-library/jest-dom` / `user-event` (test runner for RTL), oxlint.
- Forbidden: full UI libraries, prebuilt templates, AI site builders, whole-project generators.

## Commands (run from this folder)
```
npm install
npm run dev         # dev server
npm test            # vitest run (once); npm run test:watch for watch mode
npm run build       # tsc -b && vite build
npm run lint        # oxlint
```
If Vitest/Vite fails with "Cannot find native binding" (rolldown) on Windows, delete `node_modules` and `package-lock.json` and run `npm install` again.

## Structure
```
src/
  components/ui/        Button + ButtonLink, Container, SectionHeading
  components/layout/    Header (includes mobile nav), Footer
  components/sections/  Hero, DashboardMockup, TrustedCompanies, Features, FeatureCard, FeatureTabs, TestimonialSlider, Pricing, ContactForm
  data/                 nav, hero, companies, features, tabs, testimonials, pricing, footer, form (constants)
  types/index.ts        NavLink, TabItem, Testimonial, PricingPlan
  test/                 setup.ts + *.test.tsx
  index.css             Tailwind import + @theme design tokens
  App.tsx               composes Header, <main> sections, Footer
README.md, AI-USAGE.md  required deliverables
```
Section ids (anchor targets): `top` (Hero), `features`, `how-it-works`, `testimonials`, `pricing`, `contact`.

## Conventions
- Function components, named exports, typed props; shared types in `src/types`.
- Content-driven sections (tabs, slider, pricing, nav) render from typed arrays in `src/data/`, with `items` props defaulting to that data. Do not duplicate section markup.
- Style only with Tailwind classes using design tokens from `@theme` (`bg-brand`, `text-muted`, `border-line`, ...). No hard-coded colors in components.
- Mobile-first; base is 375, `md` = 768 (tablet), `lg` = 1024 (desktop layout), 1440 is the Figma desktop width; small phones (<=360px) use `max-[22.5rem]`. Do not just stack the desktop layout.
- Accessibility: semantic landmarks, one `h1` (Hero) then ordered headings, real `<label>`s, errors tied via `aria-describedby`, visible focus styles (`focus-visible`), keyboard-usable menu/tabs/slider. Subtle transitions only.
- Use rem for sizes (Figma px / 16, e.g. `text-[0.8125rem]`); do not add px arbitrary values.
- Do not over-abstract; create components only when they improve readability.
- Mark any unknown design value or copy with `TODO(figma)`. Never guess it.

## Brief requirements and constraints (summary)
- Sections: Header, Hero (coded dashboard visual, two CTAs, trust notes), Trusted Companies strip, Features (4 cards, hover), Interactive Tabs (Plan/Automate/Collaborate), Testimonials slider, Pricing (Starter/Pro/Business; Monthly/Yearly toggle, yearly prices are placeholders), Contact Form, Footer.
- Mobile nav: opens/closes, shows all links, closes on link click, keyboard usable. Nav and CTA buttons scroll to the right section.
- Contact form rules: Full Name required, min 3; Work Email required, valid; Company Name required; Team Size required (1-10, 11-50, 51-200, 200+); Message required, 20-300 chars with live count; Terms must be accepted. Team Size 200+ shows a required Preferred Demo Time (Morning/Afternoon/Evening); changing away hides it and it no longer blocks submit. Submit: disabled and shows submitting state, ~1s simulated delay, no repeat submits, success text exactly "Thanks! Our team will contact you shortly."
- Tests: at least 3 meaningful (invalid form cannot submit; 200+ shows/requires demo time; tab interaction changes content).
- Deliverables: source, `README.md` (setup, run/test commands, tech, component structure, key decisions, known limitations), `AI-USAGE.md`, tests.
- `AI-USAGE.md` must contain: at least 3 Claude roles/agents (Project Planner, Frontend Implementation, Reviewer/QA) with responsibilities and initial prompts; one strong prompt and why; one weak prompt and its improved version; one Claude recommendation rejected/modified and why; one debugging example (problem, investigation, prompt, fix, verification); where Claude helped most; one decision the candidate made. Only record things that really happened; do not fabricate.
- Do not ask Claude to build the whole site in one prompt; work in small, contextual steps.
- Final checklist: no important console errors or React warnings; desktop/tablet/mobile usable; mobile nav, tabs, slider, form validation, conditional field, duplicate-submit prevention, success state, keyboard/focus all working; tests run; README and AI-USAGE accurate.

## Current status
Design integrated from Figma (file key WAHeIX5DCB0FAYZ2lOcr6d): tokens, Inter font, Button, Header + full-screen mobile menu, Hero + DashboardMockup (working sidebar tabs), TrustedCompanies, Features/FeatureCard, FeatureTabs, TestimonialSlider (sliding track, swipe on mobile, arrows/dots from 768px), Pricing (working Monthly/Yearly toggle), ContactForm (mobile follows the Figma 375 reference; rules unchanged), Footer. 23 tests passing; build passes; lint has the one RHF `watch()` warning. Sizes are in rem (no px arbitrary values; 1px borders and 2px outlines excepted).
Open: Automate/Collaborate copy and testimonials 2-3 are sample text documented as assumptions in the README; yearly prices, dashboard non-Overview panels, footer social links/targets are `TODO(figma)` in `src/data`; the brief's footer description/social links are not shown; AI-USAGE.md is a draft the candidate must review and finish (the three agent roles were run after the build, see that file). See README "Brief vs Figma" and "Assumptions" for the documented conflicts.

## Working rules
- Verify by running tests/build and inspecting behavior; do not claim correctness without it.
- Keep README.md and AI-USAGE.md truthful to what was actually built and done.
