# AI Usage

I built the FlowPilot page with Claude Code. I worked in small steps: one section or one fix per prompt, then I checked
the result in the browser and in DevTools. I used my own prompts for almost all of the work. For the last round of
fixes I also asked for three separate Claude agents (planner, implementer, reviewer). The prompts for those three agents
were written by Claude Code from my instructions, not by me. I say clearly below which is which.

## Agents / roles

| Role | Job |
|---|---|
| Project Planner | Read the open issues, plan the work in order, flag risks. Writes no code. |
| Frontend Implementation Agent | Make the changes (React, TypeScript, Tailwind) and measure the result. |
| Reviewer / QA Agent | Review the finished code independently. Reports only, edits nothing. |

Most of the build (Figma, layout, form, carousel, rem conversion) happened in one Claude Code session. The three agents
ran at the end, after the page was built, so the planner planned the fix-up round, not the first build. Each agent started
with no memory except its prompt.

**Initial prompts (written by Claude Code, shortened).** Each opening is quoted as sent:

- Planner: "Role: Project Planner for a junior-level React landing page (FlowPilot). You must NOT write or edit any files;
  this is a planning-only task." It listed four open items from my QA report, the constraints (desktop must not change, no
  invented Figma values), and asked for a numbered plan with risks and how to verify each item.
- Implementer: "Role: Frontend Implementation Agent for the FlowPilot landing page ... Rules: use only the existing stack;
  style with the design tokens in src/index.css; sizes are in rem ...; do not touch anything outside the three tasks below."
  It ended with "VERIFY everything yourself, do not just claim it" and a list of measurements to report.
- Reviewer: "Role: independent Reviewer / QA agent. You did not write this code. REPORT ONLY ..." plus the brief, a check
  list (responsive, accessibility, hooks, validation, tests, docs) and "Run for real, do not trust claims".

**What each agent did**

| Role | Result | What I did with it |
|---|---|---|
| Planner | A numbered plan: tablet pricing fix (`md:items-stretch lg:items-start`, button `md:mt-4 lg:mt-0`), sample copy, footer overflow fix, docs update. It said it had not opened the slider and tabs files. | Claude Code (the lead session) used the plan and told the implementer to check those two files itself. It accepted a 16px tablet gap and invented sample names, as long as they are documented. |
| Implementer | Changed `Pricing.tsx`, `Footer.tsx`, `testimonials.ts`, `tabs.ts` and reported its measurements. | Claude Code re-measured its main claims in headless Chrome before accepting them: at 768px all pricing cards were 316px tall with gaps of 48/16/36px; desktop stayed 302px with the same offsets; the footer no longer overflowed. They matched. |
| Reviewer | 11 findings, for example: the mobile menu was not a dialog and the page behind it was not inert; no `onTouchCancel` on the slider; whitespace-only name and message passed; the double-submit guard returned early and re-enabled the button; no `aria-required`; a leftover px value; a weak slider test; missing validation tests; stale `CLAUDE.md`. | Claude Code fixed these and added tests (18 to 23). Not fixed, documented in the README: mobile testimonials cannot be changed by keyboard (I asked for no mobile controls), and the hero overflows at large browser font sizes. |

The reviewer was useful because it found real bugs in code that the first session had written and "checked", like the
early return in the submit guard.

## Strong prompt and why it worked

This is the prompt I used to start the Figma work (my own):

> "Try accessing this file and inspect the actual design, including frames, styles, typography, spacing, components, and
> responsive layouts. If access works, compare the design with our existing implementation and identify the remaining
> changes. If access fails, report the exact blocker. Do not guess design details or modify the code until you have
> inspected the design successfully."

It worked because it gave one clear task, said what to inspect, and covered both the success case and the failure case. It
also said not to guess and not to edit before looking. The first try failed on file permissions. Claude reported the exact
error and did not invent a design. After I fixed access it listed the real differences before changing any code.

## Weak prompt and improved version

**Example 1 (hero layout, both prompts are mine).**

- Weak: "Use a parent container with `height: 100%` and `display: flex; flex-direction: column; justify-content: space-between`
  ... Ensure the parent takes the full available height of the left Hero section."
  I chose the mechanism (`height: 100%`), and it cannot work when the parent only has a `min-height`. The column stayed at
  its content height (491px in DevTools) and the badge and trust notes did not move apart. I asked why it was not filling
  the section.
- Improved: "Left section must stretch to fill 100% of the available parent content height using flexbox stretching, not
  `h-full` or `height: 100%` ... Use the parent's flex/grid alignment instead of percentage heights that depend on an
  explicitly defined parent height."
  This named the cause and the mechanism to use. It was fixed in one step with `items-stretch` and no `h-full`. It was checked
  by forcing the section taller and watching the column grow.

**Example 2 (pricing button).**

- Weak: "make button 19.5px". It could mean height, font size, padding, line-height or margin, and it did not say which
  button or which screen size. Claude had to ask.
- Improved: "on mobile make button 19.5px margin top". This names the property and the breakpoint, and the pricing "Get Started"
  buttons were changed in one step.

**Lesson:** tell Claude the goal and the screen size, and do not choose a CSS mechanism unless I am sure it works.

## Claude recommendation I rejected or changed

**Testimonial swipe on mobile.** Claude's first version only swapped the visible card on swipe (all cards were stacked in one
place and the others hidden). I tested it and said it did not feel like the cards were swapping, only the content. It met the
brief but it was not the carousel I wanted, so it was rebuilt. The cards now sit on a track that follows my finger and
slides to the next card on release, with resistance at the first and last card. It was checked with synthetic touch events in
headless Chrome and a unit test (not on a real phone).

**Yearly pricing.** Claude first made the Yearly button disabled because the brief says monthly only. I wanted the toggle to
work, so Claude added a working toggle with placeholder yearly prices (monthly x 12), marked `TODO(figma)`.

## Debugging example

**Submit state looked missing.**

- Expected: after "Send Message" the button is disabled and shows "Submitting…" for about one second, then the success text
  appears (brief, section 7).
- Actual at first: in Claude's browser test the button still read "Send Message" and was enabled 60ms after the click, and the
  success text appeared at about 1020ms.
- Evidence: the unit test for the submitting state passed. A finer timeline (every 10ms, button queried again each time) in
  both the dev build and the production build showed "Submitting… [disabled]" at 10ms and success at about 1042ms.
- Cause and fix: there was no bug in the form. The first test script most likely read an old button reference. No code
  change was needed.
- Prompt: Claude found this on its own while doing the QA I asked for ("make a complete qa of mobile and desktop, and
  generate report, dont make any changes"). It was not a separate debugging prompt from me.

**Team Size was not preselected on a phone-sized screen.** I sent a screenshot with "fix the ui". The mobile placeholders
were showing but Team Size said "Select team size". Claude found that the mobile default was chosen once at page load, so
resizing the window afterwards left the field empty. Now the default follows the screen size until I pick a value myself.
There is a new unit test for it. Claude could not reproduce the resize in headless Chrome, so the unit test is the proof.

TODO: the foundation notes mention an earlier Vitest error ("Cannot find native binding", fixed by deleting `node_modules`
and `package-lock.json` and reinstalling). I did not see that in this session. Keep it only if I remember it, and add the
prompt I used. Otherwise delete this line.

## Where Claude helped most

Claude read the Figma file directly and turned the sizes into Tailwind classes. It also measured the real layout in headless
Chrome (positions, section heights, overflow) instead of guessing from screenshots, and wrote repeatable checks for
responsive layout, accessibility and the form. It was less reliable on details only I knew, like which screen size a spacing
change was for, so those needed a short follow-up each time.

TODO: confirm this matches my own view of where it helped most.

## A decision I made myself

These were my choices during the project:

- Remove the footer description, even though the brief lists one (the Figma design does not have it).
- Make the Yearly pricing toggle work, although the brief says monthly only for this handoff.
- No arrows or dots on mobile testimonials, with swipe only.
- Convert pixel values to rem so the page scales with the browser font size.
- 17px side margin on the hero on mobile only.

TODO: pick the one decision I want to highlight and write my own reason in one or two sentences. The reasons above are not
written down by me yet.
