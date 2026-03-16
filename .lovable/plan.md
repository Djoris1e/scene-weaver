

## Auto-expand first clip + reduce blocky feel

### 1. Auto-expand scene editor on load
In `Editor.tsx`, initialize `editingScene` to `0` instead of `null` so the first clip's settings are visible immediately, showing users what's possible.

### 2. Visual breathing room (small CSS tweaks)
The blocky feel comes from all sections (preview, filmstrip, AI bar, editor) being flush against each other with hard borders. Fixes:

- **Add vertical gaps** between the major sections using `gap-1.5` or small `my` margins — separates preview, filmstrip, prompt bar, and editor into distinct visual zones
- **Soften borders** — replace hard `border-t border-border` dividers with subtle spacing and rounded section containers (`rounded-xl` with slight background tint differences)
- **Filmstrip section** — add small `mx-3 rounded-xl` to make it float slightly inside the layout
- **AI prompt bar** — add horizontal margin and slight rounding so it doesn't span edge-to-edge
- **Scene editor** — wrap in a container with `mx-3 mb-3 rounded-xl` for visual separation from the filmstrip above

### Files to edit
- `src/pages/Editor.tsx` — set `editingScene` default to `0`, add spacing/gaps to layout
- `src/components/editor/Filmstrip.tsx` — soften outer container styling
- `src/components/editor/SceneEditor.tsx` — round container edges

