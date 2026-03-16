

# V12 Evaluation — Issues and Improvements

## Critical Bug

**Settings panel state is broken.** `SettingsPanel` calls `useSceneStore()` on line 244, which creates a **completely separate state instance** (the hook uses `useState`, not a global store like Zustand). Any changes to Brand Kit or End Screen in the settings panel are lost — they never reach the main V12 component. Fix: pass `brandKit`, `setBrandKit`, `endScreen`, `setEndScreen` as props from the parent.

## Missing UI Controls

1. **No font or text color pickers** — the scene model has `textColorId` and `fontId` with 8 color pairings and 4 font options defined, but the Text tab has no UI to change them. These are important creative controls.

2. **No counter editing** — selecting "Counter" in the Media tab activates the counter asset type, but there's no form to edit `number`, `label`, or `unit`. The counter is stuck at defaults (0 / "Label").

3. **No scene duration control** — users can't adjust how long each clip lasts. A simple duration slider or input in the editor would help.

## Layout / UX Polish

4. **AI prompt bar should be sticky** — currently it sits inline between filmstrip and editor. When the editor opens and the user scrolls, the prompt bar scrolls away. Making it `sticky bottom-0` keeps it always accessible.

5. **Preview text position CSS conflict** — line 550 uses `items-start pt-8` for top position but also has `justify-center`, so vertical centering overrides the top alignment. Should use `justify-start` / `justify-end` instead.

6. **Filmstrip drag vs tap conflict** — `dragging.current` is set to `false` in `handleDragEnd` (mouseUp) before the click event fires, so `handleSegmentTap` never blocks a drag. Small drags register as taps.

## Proposed Changes

All in **`src/pages/V12.tsx`**:

- **Fix settings props**: Pass brand/endScreen state as props to `SettingsPanel` instead of calling `useSceneStore()` inside it
- **Add font + color selectors** to Text tab: horizontal scrollable swatches for colors, dropdown for fonts
- **Add counter fields** to Media tab when counter is active: number input, label input, unit input
- **Add duration control**: simple dropdown or small input in the editor header (e.g. "2.0s" / "3.0s")
- **Sticky AI bar**: `sticky bottom-0 z-20` on the prompt bar wrapper
- **Fix text position CSS**: replace `justify-center` with position-aware justify class
- **Fix drag/tap**: add a distance threshold before treating a mousedown as a drag

