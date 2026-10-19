# FlowPilot Landing Page

Responsive single-page marketing site (React + TypeScript + Tailwind CSS), built from the Flow-Pilot Figma file. The assessment brief is the source of truth for behaviour; Figma for visuals.

## Stack
React 19, TypeScript, Tailwind CSS 4, React Hook Form, React Testing Library (run with Vitest), Vite, Lucide icons (installed, currently unused). Fonts: Inter and Plus Jakarta Sans (the mobile menu) via `@fontsource-variable/*`, self-hosted.

## Commands
```
npm install
npm run dev      # dev server
npm test         # run tests once (npm run test:watch for watch mode)
npm run build    # type-check + production build
npm run lint
```
Tests: 23 in 6 files (contact form validation and conditional field, tabs, testimonial slider and swipe, header menu, pricing toggle, dashboard tabs, features, footer). Lint reports one known React Hook Form `watch()` compiler-compatibility warning.

## Structure
```
src/
  assets/icons/         SVGs exported from Figma (feature tiles, checks, chevrons, menu)
  components/ui/        Button/ButtonLink, Container, SectionHeading
  components/layout/    Header (full-screen mobile menu), Footer
  components/sections/  Hero, DashboardMockup, TrustedCompanies, Features, FeatureCard,
                        FeatureTabs, TestimonialSlider, Pricing, ContactForm
  data/                 nav, hero, companies, features, tabs, testimonials, pricing, footer, form
  types/                shared data types
  test/                 RTL tests
  index.css             Tailwind + design tokens (@theme) taken from Figma
```

## Key decisions
- Sections render from typed arrays in `src/data/`; content changes never touch components.
- All colours, fonts, radii and shadows are `@theme` tokens in `index.css`; components use token classes.
- Sizes are in `rem` (Figma pixel values divided by 16) so the page scales with the browser's default font size. 1px borders, 2px focus outlines, drag distances and image width/height attributes stay in px.
- Breakpoints: 375 (base), 768 (`md`: tablet), 1024 (`lg`: desktop layout). The desktop header and two-column sections start at `lg`; tablet gets the hamburger menu because the desktop nav does not fit at 768. Below 360px (`max-[22.5rem]`) the hero heading, badge, CTAs, dashboard card and company row are tightened.
- Contact form uses `shouldUnregister: true` so the hidden "Preferred Demo Time" field cannot block submission or leak a stale value.
- Tabs (How It Works and the hero dashboard sidebar) follow the WAI-ARIA tabs pattern with arrow-key navigation; the mobile menu closes on link click and Escape, moves focus in on open and back to the toggle on close, and locks body scroll.
- Testimonials are a sliding track of equal-height cards. From 768px up there are previous/next arrows and an indicator; below 768px (as in the Figma mobile frame) there are none and the card follows the finger and slides on a swipe of 40px or more, with resistance at the first and last card. Cards that are not current are `inert`.
- Pricing: from 1024px the cards are the Figma 356x302 size; from 768 to 1023px they stretch to one height with a 16px minimum gap above the button; below 768px they scroll horizontally (scrollbar hidden, full screen width) with Pro first.

## Brief vs Figma: conflicts and assumptions
- **Testimonials:** Figma has one testimonial (Jessica Lee); the brief needs a slider with previous/next and an indicator. Two **sample** testimonials follow the real one (see "Assumptions: sample copy"). The indicator requirement is only met from 768px up, because the Figma mobile frame has none.
- **Tabs (How It Works):** only the Plan tab's copy and its 40% metric are in Figma. The Automate and Collaborate copy is sample text (see below).
- **Pricing:** the brief scopes this handoff to monthly pricing, but Figma shows a Monthly/Yearly toggle and it was requested to work. Figma has no yearly prices, so `yearlyPrice` in `src/data/pricing.ts` is a placeholder (monthly x 12, no discount, `TODO(figma)`). Figma's mobile pricing frame has a duplicated grey "Pro" card where Business should be, so cards follow the brief (Starter, Pro, Business); on mobile Pro is shown first with a CSS `order`, so the visual order differs from the DOM/keyboard order.
- **Nav:** Figma lists "FAQ" but there is no FAQ section; it links to the contact form (mobile menu label: "FAQ & Contact").
- **Footer:** Figma has logo, copyright and Privacy/Terms/Security only. The brief also asks for a short description and social links; the description was removed on request (it is not in Figma) and social links are an empty list until supplied. Link targets (not in the design) point to the top of the page. The year is the current year (Figma shows 2025).
- **Contact form:** the brief's validation rules are unchanged. On mobile the form follows the Figma 375px reference: the "Contact form reference" subtitle, the mobile placeholders and Team Size preselected as "1 - 10 members" (the default follows the screen size until the user picks a size). Option labels read "1 - 10 members" etc., but the option values are the brief's (`1-10`, `11-50`, `51-200`, `200+`). The counter reads `0/300` as in Figma.
- **Hero dashboard:** the sidebar items are working tabs. Only Overview is designed in Figma; Tasks reuses the task list and Automations, Team, Analytics and Settings show a neutral "Nothing to show here yet." (`TODO(figma)`).
- **Hero margin:** the hero has a 17px side margin on mobile only, as requested.
- **Figma frame width:** the "1440" frame is 1280 wide; layouts use a 1440 max container with 64px padding.

## Assumptions: sample copy (not from Figma)
These texts are **not** confirmed design content; replace them when real copy exists (`src/data/testimonials.ts`, `src/data/tabs.ts`):
- Testimonial 2: "Our handoffs are smoother and nothing slips through the cracks anymore." (Alex Morgan, Operations Lead, Northwind). Testimonial 3: "Setup took minutes, and the whole team was using it by the end of the week." (Sam Patel, Engineering Manager, Globex). Names and companies are invented.
- Automate tab: "Automate repetitive work" / "Set rules once and let FlowPilot handle routine steps." / 30% "Fewer repetitive tasks". Collaborate tab: "Keep everyone aligned" / "Share plans and updates in one place so the team stays in sync." / 25% "Faster team handoffs".
- Yearly prices (monthly x 12) and the dashboard's non-Overview panels, as above.

## Known limitations
- Sample content as listed above; the footer has no description or social links.
- Some Figma colours fail WCAG contrast (orange "In Progress", green "Completed", the "Upcoming" grey, the star icons, white on the orange and green icon tiles); they are kept as designed.
- Header "Log In" and all footer links go to existing sections (no auth/pages exist).
- Below 768px the testimonials have no arrows or dots (as in the Figma mobile frame), so cards 2 and 3 are reachable only by touch swipe; keyboard and screen-reader users on small screens cannot change slides.
- At a root font size of 112.5% or more, the desktop hero layout (1024 to about 1100px wide) overflows horizontally because the left column and dashboard card have fixed rem widths.
- Footer links and the mobile menu toggle are small touch targets (16px / 34px tall).
- Visual comparison was done by eye and by measuring in headless Chrome at 375, 768, 1024 and 1440 (and 320/360 for small phones); no automated visual diff, no real-device or screen-reader testing.
