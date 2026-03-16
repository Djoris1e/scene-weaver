

# Plan: Build V8–V11 — Four New UX Patterns

Each version reuses the existing `useSceneStore`, `Scene` types, and `ScenePreview` component. Routes and index page updated once for all four.

---

## V8 — Horizontal Filmstrip Timeline (CapCut/InShot style)

**Core idea:** Scene width = duration. Scrub by dragging. Tap a segment to edit via bottom sheet.

- Full-height 9:16 preview (top ~60%)
- Horizontal scrollable filmstrip bar below preview:
  - Each scene is a rounded rect with thumbnail background
  - Width is proportional to duration (e.g. `width = duration * 60px`)
  - A red vertical playhead line sits at center; filmstrip scrolls behind it
  - Drag filmstrip to scrub through time
- Tap a segment → bottom sheet slides up with text input, position, color, font, transition, duration controls
- Pinch-to-zoom on filmstrip to scale time (stretch = more detail)
- Add scene button (+) at end of filmstrip
- Top bar: back, undo/redo, export

---

## V9 — Full-Screen Swipe Editor (TikTok/Reels style)

**Core idea:** Preview IS the editor. Swipe between scenes. Controls appear as overlay trays.

- 100vh full-screen preview, swipe left/right to change scenes
- Dot indicators at bottom showing current scene position
- Tap preview → toggle overlay toolbar (fade in/out)
- Bottom toolbar row: Text, Style, Transition, Duration, Effects icons
- Tapping a tool icon slides up a tray (not a full sheet — just 120px) with that tool's controls
- Double-tap text on preview to edit inline
- Scene counter "2/5" in top-right corner
- Long-press → reorder mode with haptic-style visual feedback
- Minimal chrome — preview dominates 100% of viewport

---

## V10 — Storyboard Grid (Canva style)

**Core idea:** 2-column grid of scene thumbnails for overview. Tap to edit.

- Top: compact 9:16 preview (40% height) with play button overlay
- Below: 2-column scrollable grid of scene cards
  - Each card: 9:16 thumbnail, scene number badge, duration, first line of text truncated
  - Active card has primary ring highlight
  - Drag-to-reorder via long press (visual lift + shadow)
- Tap card → navigates to that scene in preview AND opens a slide-up editor panel (half-sheet) with full controls
- Floating "+" button bottom-right to add scene
- Great for storyboarding/planning — see all scenes at once

---

## V11 — Carousel + Focused Editor (Mojo style)

**Core idea:** One scene at a time, full focus. Swipe carousel to browse, dedicated editor below.

- Top 55%: large 9:16 preview of active scene
- Middle: horizontal carousel of small scene thumbnails (fixed ~56px wide, 9:16 ratio), active one scaled up with ring
- Bottom 35%: dedicated editor panel for active scene — always visible, no sheet needed
  - Segmented control: Text | Style | Motion
  - Each segment shows relevant controls inline
- Swipe carousel or tap thumbnail to switch scenes
- "+" at end of carousel to add
- This gives the deepest editing without any expand/collapse friction

---

## Shared Implementation

- **Routing:** Add `/v8`, `/v9`, `/v10`, `/v11` routes in `App.tsx`
- **Index page:** Add four new version cards with appropriate icons and descriptions
- **State:** All versions use `useSceneStore()` — no new state logic needed
- **Preview:** All use `ScenePreview` component with 9:16 ratio
- **Files created:** `src/pages/V8.tsx`, `src/pages/V9.tsx`, `src/pages/V10.tsx`, `src/pages/V11.tsx`
- **Files edited:** `src/App.tsx`, `src/pages/Index.tsx`

Each version is a self-contained ~400-500 line file following the same pattern as V7.

