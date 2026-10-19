# AI Usage

> **How the work was done.** I directed Claude Code step by step with my own prompts, one section or one fix at a
> time (examples below), and checked the results in the browser. For the final fix-up batch I also had three
> separate Claude agents (planner, implementer, reviewer) run; I asked for that, and the lead session wrote their
> briefs from my instructions. That is recorded under "Agents / roles". Review the wording and correct anything that
> does not match what you remember before submitting.

## Agents / roles

**Honest status.** Most of the build (Figma inspection, layout, form, carousel, rem conversion) happened in one
Claude Code session, with the model switching between planning, implementing and reviewing as the conversation
needed. At the end, the remaining batch of work was run through three **separate** Claude agents, one per role,
each starting with no memory of the others except what was written in its prompt. They ran **after** the page was
built, so the Planner planned the fix-up batch, not the original build.

| Role | Responsibility |
|---|---|
| Project Planner | Read the brief and Figma, split the page into components, find reuse, order the work, flag risks. No code. |
| Frontend Implementation Agent | Build one section at a time (React, TypeScript, Tailwind, React Hook Form), with state, validation and responsive behaviour. |
| Reviewer / QA Agent | Independently review the finished work: responsiveness, accessibility, React structure, TypeScript, validation, interactions, maintainability, bugs. Reports only, does not edit. |

### What was actually run (3 separate agents, on the QA fix-up batch)

| Role | Prompt (written by Claude Code, project-specific) | What it returned | What I (the lead session) did with it |
|---|---|---|---|
| Project Planner (read-only) | Four open items from the QA report with file names, constraints (desktop must not change, no invented Figma values, sample copy must be documented as an assumption) and a request for an ordered plan with risks and verification per item. | A numbered plan: Pricing tablet fix (`md:items-stretch lg:items-start`, button `md:mt-4 lg:mt-0`), sample copy proposals, footer overflow fix, docs update. It said itself it had not opened the slider or tabs files. | Used the plan, told the Implementation agent to verify the slider/tabs parts itself. Its open questions were answered by me (16px tablet gap accepted, invented names allowed if documented). |
| Frontend Implementation | The plan, the exact sample copy, the rem rule, "do not touch README/CLAUDE.md", and a list of measurements it must report. | Changed `Pricing.tsx`, `Footer.tsx`, `testimonials.ts`, `tabs.ts`; reported heights/gaps at 768/800/1000, desktop unchanged, footer scrollWidth at 125% font, tests 18/18. | I re-measured its key claims in headless Chrome myself before accepting them (pricing 316px equal heights and gaps 48/16/36 at 768; desktop 302px and offsets unchanged; footer no overflow). They matched. |
| Reviewer / QA (read-only) | "You did not write this code, report only", the brief, the check list (responsive, a11y, React hooks, validation, tests meaningful, docs match), and the requirement to run tsc/tests/build/lint and drive a browser. | 11 findings: menu not a dialog and page not inert; mobile testimonials unreachable by keyboard; no `onTouchCancel`; hero overflows at 125% font on 1024-1100px; whitespace-only name/message passes; double-submit early-return bug; no `aria-required`; a leftover px value; weak slider test; missing validation tests; stale CLAUDE.md. | Fixed: dialog + inert page, `onTouchCancel`, trim validation, form-level double-submit guard, `aria-required`, the px value, the weak slider test, new tests (18 -> 23), stale docs. Not fixed, documented in the README: mobile testimonial keyboard access (you asked for no mobile controls) and the hero overflow at large font sizes. |

Evidence that the Reviewer was independent and not just agreeing: it found real defects in code the lead session had
written and "verified" (for example the early-return that re-enabled the button during a repeated submit).

### Generic role prompt templates (reusable)

### Draft prompt: Project Planner (template)
```
Role: Project Planner for a junior-level React landing page (FlowPilot).
Context: Stack is fixed: React 19, TypeScript, Tailwind CSS 4, React Hook Form, React Testing Library (Vitest).
The assessment brief (attached) is the source of truth for behaviour; the Figma file (link) is the source of
truth for visuals. Figma has a 1440 desktop page, 375 mobile references and a mobile menu; I must decide
responsive behaviour for the rest.
Task: 1) List the page sections and the components you would create, and which are reusable.
2) Propose an order of work in small steps (no "build everything" step). 3) List risks and open questions,
especially where the brief and Figma disagree.
Requirements: do not write code. Do not invent content or design values: mark unknowns as questions.
Output: a numbered plan, a component tree, and a risks/questions list.
```

### Draft prompt: Frontend Implementation Agent (template)
```
Role: Frontend implementation agent for the FlowPilot project.
Context: <paste the planner's plan, the section's Figma measurements, and the relevant files>.
Rules: use only the existing stack; style with the design tokens in src/index.css; content comes from typed
arrays in src/data; mobile-first with breakpoints at 768 and 1024; real <label>s, visible focus states.
Task: implement ONLY <one section>. Include its state/validation and add or update tests.
Output: the changed files and a short note of any assumption. Mark unknown design values TODO(figma).
```

### Draft prompt: Reviewer / QA Agent (template)
```
Role: independent reviewer. You did not write this code.
Task: review <section/diff> for responsiveness at 375/768/1440, accessibility (headings, labels, focus, keyboard,
contrast), React structure, TypeScript, form validation and obvious bugs. Run the app and the tests; do not
trust claims of correctness.
Rules: report only, make no changes. Rank findings by severity and give evidence (measurement, console output
or a reproduction) for each.
Output: a findings table: severity, where, what happened, evidence, suggested fix.
```

## Strong prompt and why it worked

*What actually happened.* The prompt that started the Figma work was:

> "Try accessing this file and inspect the actual design, including frames, styles, typography, spacing,
> components, and responsive layouts. If access works, compare the design with our existing implementation and
> identify the remaining changes. If access fails, report the exact blocker. Do not guess design details or
> modify the code until you have inspected the design successfully."

Why it worked: it gave a clear task, named what to inspect, defined success and failure paths, and forbade
guessing and editing before inspection. The first attempt failed on file permissions; Claude reported the exact error
instead of inventing a design, and after access was fixed it listed the real differences before any code changed.

## Weak prompt and improved version

*Weak (real):* "make button 19.5px". It could mean height, font size, padding, line-height or margin, and it did
not say which button or which screen size. Claude had to stop and ask.


*Second weak/improved pair (my own prompts, same layout problem).*

- **Weak (mine):** "Use a parent container with `height: 100%` and `display: flex; flex-direction: column; justify-content: space-between`... Ensure the parent takes the full available height of the left Hero section". I specified a mechanism (`height: 100%`) that cannot work when the parent only has a `min-height`: the column stayed at its content height and the badge and trust notes did not move apart. I found this by inspecting the element in DevTools (it showed `height: 100%` and 491px) and asked why it was not filling the section.
- **Improved (mine):** "Left section must stretch to fill 100% of the available parent content height using flexbox stretching, not `h-full` or `height: 100%`... Use the parent's flex/grid alignment instead of percentage heights that depend on an explicitly defined parent height." This named the cause and the mechanism to use, and it was fixed in one step with `items-stretch` and no `h-full`; verified by forcing the section taller and watching the column grow.

*Improved (what was then sent):* "on mobile make button 19.5px margin top", which names the property and the
breakpoint. The pricing "Get Started" buttons were changed in `Pricing.tsx` in one step.

## Claude recommendation rejected or modified

*Testimonial swipe on mobile.* Claude's first version only swapped the visible card when you swiped (all cards
stacked in one place, the others hidden). You tested it and said it "doesn't feel like cards are swapping, only
the content". Claude's version met the brief but was not the carousel behaviour you wanted, so it was rebuilt:
the cards now sit on a track that follows your finger while dragging and slides to the next card on release,
with resistance at the first and last card. It was verified with synthetic touch events in headless Chrome and a
unit test.

*Other modifications worth mentioning:* Claude first made the pricing Yearly button disabled (the brief says
monthly only). You wanted it to work, so a working toggle was added with placeholder yearly prices (monthly x 12),
clearly marked `TODO(figma)`.

## Debugging example

**Problem.** After pressing "Send Message" in a browser test, the button never showed "Submitting…": it went from
"Send Message" straight to the success message about one second later.

**Expected.** The button is disabled and reads "Submitting…" for about one second, then the success text appears
(brief, section 7).

**Actual (first reading).** The button still read "Send Message" and was enabled 60ms after the click.

**Evidence inspected.**
1. The unit test (`disables submit while processing, then shows success`) passed.
2. The sampled browser timeline showed "Send Message [enabled]" at 60ms and success at about 1020ms.
3. A finer timeline (every 10ms, button re-queried each time) in both the dev build and the production build showed
   "Submitting… [disabled]" at 10ms and success at about 1042ms.

**Claude prompt.** "The submitting state appears to be missing in the browser, check with finer sampling in both
dev and production builds."

**Cause and fix.** There was no bug in the form: the first test script kept a reference to the button element
from before the click and read stale values. No code change was needed. **Verification:** fresh element queries
every 10ms, in both builds, plus the existing test.

**Second, real bug found by the same kind of check.** Team Size was not preselected on a phone-sized screen:
the mobile default was chosen once at page load, so resizing after load left it empty while the placeholders
changed. Fix: the default now follows the screen size until the user picks a value, covered by a new test.

*(Earlier candidate from the foundation work: Vitest failing with "Cannot find native binding"; the fix was to delete
`node_modules` and `package-lock.json` and reinstall. Add the prompt you used, if you want to use this one instead.)*

## Where Claude helped most

*Draft, check and edit this to match your experience.* Reading the Figma file directly (frames, text, spacing) and
turning the numbers into Tailwind classes; measuring the real layout in headless Chrome (element positions, section
heights, overflow) instead of judging by eye; and the repeatable QA scripts for responsive, accessibility and form
checks. Claude was less reliable on layout details that only exist in your head, such as which breakpoint a
spacing change was meant for. Those needed a short follow-up each time.

## A decision I made myself

*Pick the ones that are true for you and say why.* Decisions made during the project:
- Removing the footer description even though the brief lists one (the design does not have it).
- Making the pricing Yearly toggle work although the brief scopes this handoff to monthly.
- Keeping mobile testimonials as swipe-only, without arrows or dots, to match the Figma mobile frame.
- Converting pixel values to rem so the page scales with the browser's font size.
- Giving the hero 17px side margins on mobile only.
