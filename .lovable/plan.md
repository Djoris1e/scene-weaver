

# V12 — Polished Filmstrip Editor (iterating on V8)

New file `src/pages/V12.tsx` plus route/index updates. Builds on V8's filmstrip paradigm with these improvements:

## Changes from V8

### 1. Bottom sheet editor — dynamic height, not fixed
- Remove `max-h-[45vh]` constraint on the editor sheet
- Use a scrollable full-content layout that sizes to content naturally (with a sensible max so it doesn't cover the whole screen — `max-h-[60vh]`)
- Group settings into collapsible sections (Text, Style, Background, Timing) so users scroll through only what they need

### 2. Brand Kit + End Screen settings
- Add a settings icon (gear) in the header bar
- Tapping it opens a full-height slide-up panel with:
  - Brand Kit section (colors, logo upload, slogan) — reuse existing `BrandKit` component logic inline
  - End Screen toggle + duration — reuse `EndScreenSettings` logic inline
- Panel uses same bottom-sheet pattern as the scene editor

### 3. Export button with progress
- Replace the plain "Export" button with a stateful export flow:
  - Idle: shows `Share2` icon + "Export"
  - Exporting: button expands to show a progress bar filling left-to-right inside it + percentage text, disabled state
  - Done: checkmark + "Done" for 2s, then resets
- Mock 3-second export with progress ticking from 0-100%

### 4. AI Prompt input
- When no editor sheet is open, show a compact prompt input bar at the bottom (above the info bar)
- Uses the `Sparkles` icon + text input + send button
- Placeholder: "Describe changes… e.g. make it more energetic"
- On submit: mock 2s loading, then toast "AI applied changes"
- Sits between filmstrip and bottom info bar

### 5. General polish
- Slightly larger filmstrip height (h-[72px] segments instead of h-14)
- Scene text preview on filmstrip uses better contrast overlay
- Playback controls get subtle hover/active states
- Header uses semibold "V12" label center-aligned

## Files
- **Create**: `src/pages/V12.tsx` (~500 lines)
- **Edit**: `src/App.tsx` (add `/v12` route)
- **Edit**: `src/pages/Index.tsx` (add V12 card)

