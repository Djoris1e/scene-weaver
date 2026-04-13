

# Refine Option D — Fix mobile labels + sticky Create button

## Problem
On mobile (390px), the accordion rows show the label (e.g. "Describe & add sources") and the summary text (e.g. "Blog, release notes, PDF, URL…") side by side, causing the label to wrap to two lines.

## Changes (all in `src/pages/Create.tsx`, OptionD function)

### 1. Fix accordion row layout for mobile
Change the accordion button layout from a single horizontal row to a stacked layout on mobile:
- **Label** on top (full width, `text-sm font-medium`)
- **Summary** below it (full width, `text-xs text-muted-foreground`)
- Icon on the left, chevron on the right — both vertically centered
- This prevents the two-line wrapping issue entirely

### 2. Move Create button to bottom, with activation logic
- Remove the Create button from inside the prompt card
- Add a sticky/fixed bottom Create button (full-width on mobile, centered on desktop) that sits below the accordion sections
- Button starts **disabled** (muted style, `opacity-50`, `pointer-events-none`) and becomes **active** (primary pink, full opacity) when either:
  - `state.prompt.trim().length > 0`, OR
  - `state.contentSource !== null` (a source has been selected), OR
  - `state.files.length > 0` (media uploaded)

### Technical detail
~30 lines changed within the `OptionD` function:
- Accordion button inner layout: replace single-line flex with a two-row structure (icon + div containing label + summary stacked)
- Create button: move outside the prompt card, add conditional `disabled` prop based on `state.prompt || state.contentSource || state.files.length`

