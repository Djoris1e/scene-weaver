

# Editor Redesign — Better Grouping

## Problem

The current editor stacks everything vertically in two tabs (Scene / Brand). The Scene tab mixes content editing, styling, transitions, and template selection. Brand mixes format, font, and colors. Music lives in a disconnected modal. The result: long scrolling, unclear hierarchy, and unrelated controls sitting next to each other.

## Proposed Layout

Replace the 2-tab system with a horizontal icon tab bar at the bottom of the scene editor, using 4-5 focused sections:

```text
┌─────────────────────────────────┐
│  Preview (9:16)                 │
│  Playback controls              │
│  Filmstrip                      │
├─────────────────────────────────┤
│  Scene 1/7 · 0.0s – 4.5s    🗑 │
├─────────────────────────────────┤
│  [✏️ Content] [🎨 Style] [🎬 Motion] [🎵 Audio] [💎 Brand] │
├─────────────────────────────────┤
│  (active tab content)           │
└─────────────────────────────────┘
```

### Tab breakdown

**Content** — What's in this scene
- Template picker (horizontal scroll of thumbnails, currently at bottom — move here as the first thing)
- Template-specific fields: text/quote/headline/number depending on template type

**Style** — How it looks
- Font selector
- Text color swatches
- Text position (top/center/bottom — currently missing from editor UI but exists in type)
- Background/gradient style (for gradient templates)

**Motion** — How it moves
- Transition type (cut, crossfade, zoom, flash, slide)
- Text effect (fade-in, typewriter, scale-up)
- Animation type (ken-burns, drift, pulse)

**Audio** — Inline instead of modal
- Current track display with play preview
- "Change track" opens inline list (not a modal) with vibe-match tags
- Per-scene volume or mute toggle (future-ready)

**Brand** — Global settings (with "applies to all" badge)
- Format toggle (9:16 / 16:9)
- Brand colors (background, primary, secondary)
- Font (global)
- Logo upload
- Slogan
- End screen toggle

### Other changes

- Remove the "Change music" button floating between playback and filmstrip — audio now lives in its own tab
- Template thumbnails move from the bottom of the Scene tab to the top of the Content tab as the primary selection method
- The A/B/C version switcher gets removed (lock in the best variant)

## Technical scope

### Files modified
- **`src/components/editor/SceneEditor.tsx`** — Major rewrite: replace 2-tab Scene/Brand with 5-tab icon bar using the existing `IconTabBar` component. Split current content into ContentTab, StyleTab, MotionTab, AudioTab, BrandTab sub-sections within the same file.
- **`src/pages/Editor.tsx`** — Remove variant switcher, lock in single layout (variant A's floating bar). Remove "Change music" button if present. Clean up unused variant code (~200 lines removed).
- **`src/types/scene.ts`** — No changes needed, all fields already exist.

### Estimated diff
- ~300 lines rewritten in SceneEditor (reorganization, not new logic)
- ~150 lines removed from Editor.tsx (variant B/C deletion)
- ~30 lines for inline audio track list (mock data, same style as the modal but embedded)

