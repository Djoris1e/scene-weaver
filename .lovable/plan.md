

# V12 — Scrollable Editor + Visual Settings

## Problem
1. When editing a scene, the editor panel has a fixed max-height that crushes the preview above it
2. Collapsible sections feel hidden and unengaging — users don't discover settings

## Solution

### 1. Full-page scroll instead of fixed panels
- Remove `h-screen` and `flex-1 min-h-0` constraints from the outer layout
- Preview gets a fixed height (`h-[55vh]`) so it's always a good size
- Filmstrip, editor, and AI prompt all flow naturally below — user scrolls the page to see everything
- No more `max-h-[60vh]` on editor; it renders at full content height
- Same approach for Settings panel — flows inline below filmstrip

### 2. Horizontal tab bar instead of collapsibles
Replace the `Section` collapsible pattern with a **pill tab bar** at the top of the editor:
- Tabs: **Text** · **Background** · **Motion** · **Timing**
- Only one tab's content visible at a time — keeps the editor compact but discoverable
- Each tab shows its content directly (no expand/collapse)
- Active tab uses `bg-primary text-primary-foreground`, inactive uses `bg-secondary`

### 3. Settings panel same treatment
- Settings panel also renders inline (scrollable) instead of overlay
- Uses tabs: **Brand Kit** · **End Screen**

## File changes
- **Edit**: `src/pages/V12.tsx`
  - Outer container: `min-h-screen` instead of `h-screen`, remove `flex-1 min-h-0` on preview
  - Preview: fixed `h-[55vh]` with `shrink-0`
  - Replace `Section` component with `TabBar` + tab content pattern
  - SceneEditor: remove `max-h-[60vh] overflow-y-auto`, render full content
  - SettingsPanel: same treatment
  - Editor/Settings render inline in page flow (not overlaid at bottom)

