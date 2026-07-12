---
name: frontend-design
description: Guidance for distinctive, intentional visual design when building new UI or reshaping an existing one. Helps with aesthetic direction, typography, and making choices that don't read as templated defaults. Use for any look-and-feel, redesign, or new-screen work in this app.
source: anthropics/skills (skills/frontend-design/), fetched 2026-07-11
---

# Frontend Design

Approach this as the design lead at a small studio known for giving every client a visual identity that could not be mistaken for anyone else's. This client has already rejected proposals that felt templated, and is paying for a distinctive point of view: make deliberate, opinionated choices about palette, typography, and layout that are specific to this brief, and take one real aesthetic risk you can justify.

## Ground it in the subject

If the brief does not pin down what the product or subject is, pin it yourself before designing: name one concrete subject, its audience, and the page's single job, and state your choice. The subject's own world, its materials, instruments, artifacts, and vernacular, is where distinctive choices come from. Build with the brief's real content and subject matter throughout.

## Design principles

For web designs, the hero is a thesis. Open with the most characteristic thing in the subject's world, in whatever form makes sense for it: a headline, an image, an animation, a live demo, an interactive moment. A big number with a small label, supporting stats, and a gradient accent is the template answer; only use if that's truly the best option.

Typography carries the personality of the page. Pair the display and body faces deliberately, and set a clear type scale with intentional weights, widths, and spacing. Make the type treatment itself a memorable part of the design, not a neutral delivery vehicle for the content.

Structure is information. Structural devices — numbering, eyebrows, dividers, labels — should encode something true about the content, not decorate it. Question whether choices like numbered markers actually make sense before incorporating them.

Leverage motion deliberately. An orchestrated moment usually lands harder than scattered effects. Sometimes less is more; extra animation contributes to the feeling that the design is AI-generated.

Match complexity to the vision. Maximalist directions need elaborate execution; minimal directions need precision in spacing, type, and detail. Elegance is executing the chosen vision well.

## Process: brainstorm, explore, plan, critique, build, critique again

Calibration: AI-generated design clusters around three looks: (1) warm cream background (~#F4F1EA) with high-contrast serif display and terracotta accent; (2) near-black background with a single bright acid-green or vermilion accent; (3) broadsheet layout with hairline rules, zero border-radius, dense columns. All are defaults rather than choices. Where the brief leaves an axis free, don't spend that freedom on a default.

Work in two passes. First, brainstorm a compact token system: Color (4-6 named hex values), Type (2+ roles: characterful display used with restraint, complementary body, utility face for captions/data), Layout (one-sentence concept + ASCII wireframes), Signature (the single unique element this page will be remembered by).

Then review that plan against the brief before building: if any part reads like the generic default you'd produce for any similar page, revise it and say what changed and why. Only then write code, following the revised plan exactly.

When writing CSS, watch selector specificity — classes can cancel each other out (type-based vs element-based selectors), especially paddings/margins between sections.

## Restraint and self-critique

Spend your boldness in one place. Let the signature element be the one memorable thing; keep everything around it quiet and disciplined; cut decoration that does not serve the brief. Build to a quality floor without announcing it: responsive down to mobile, visible keyboard focus, reduced motion respected. Critique your own work as you build, taking screenshots when possible. Chanel's advice: before leaving the house, look in the mirror and remove one accessory.

## Writing in design

Words appear in a design to make it easier to understand, and therefore easier to use. Write from the end user's side of the screen: name things by what people control and recognize, never by how the system is built. Active voice by default; a control says exactly what happens when used ("Save changes," not "Submit"); an action keeps the same name through the whole flow. Treat failure and emptiness as moments for direction, not mood: explain what went wrong and how to fix it; an empty screen is an invitation to act. Plain verbs, sentence case, no filler; each element does exactly one job.
