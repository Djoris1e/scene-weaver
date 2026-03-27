

# Three Editor Layout Versions with "New Video" + "Edit with AI" CTAs

We will create three distinct layout versions of the full editor page, switchable via a floating pill selector (like the ExportDone page pattern). Each version places the two core actions differently:

1. **"New Video"** — navigates to `/` to start fresh
2. **"Edit with AI"** — opens an inline prompt to modify the current video

---

## Version A: Floating Action Bar

A persistent floating bar anchored to the bottom of the viewport (over content). Contains two pill buttons side by side: "New Video" (outline, Plus icon) and "Edit with AI" (gradient, Sparkles icon). Clicking "Edit with AI" expands the bar into a full-width prompt input. The header is simplified to just the Home icon and Export button — no AI bar in the header.

```text
┌─────────────────────────────┐
│ [Home]              [Export] │  ← minimal header
│ ┌─────────────────────────┐ │
│ │       Preview           │ │
│ └─────────────────────────┘ │
│ [Playback Controls]         │
│ [Filmstrip]                 │
│ [Scene Editor]              │
│                             │
│  ╔═══════════════════════╗  │  ← floating bar
│  ║ + New   ✨ Edit w/ AI ║  │
│  ╚═══════════════════════╝  │
└─────────────────────────────┘
```

## Version B: Split Header

The header becomes a two-row sticky block. Top row: Home + project info + Export. Bottom row: full-width split between "New Video" button (left) and an AI prompt input (right, always visible as a text field). No separate bottom CTA area. The filmstrip and scene editor fill the remaining space.

```text
┌─────────────────────────────┐
│ [Home]  My Video    [Export] │  ← row 1
│ [+ New Video] [✨ Edit...  ]│  ← row 2 (prompt always visible)
│ ┌─────────────────────────┐ │
│ │       Preview           │ │
│ └─────────────────────────┘ │
│ [Playback Controls]         │
│ [Filmstrip]                 │
│ [Scene Editor]              │
│ 3 scenes · 8.2s             │
└─────────────────────────────┘
```

## Version C: Sidebar Actions

On wider viewports, a narrow left sidebar appears with vertically stacked icon buttons: Home/New Video (top), AI Edit (middle, opens a slide-out prompt panel), Export (bottom). The main content shifts right. On mobile widths, it collapses into a bottom tab bar with the same three actions.

```text
┌───┬──────────────────────────┐
│ + │  ┌────────────────────┐  │
│   │  │     Preview        │  │
│ ✨│  └────────────────────┘  │
│   │  [Playback Controls]     │
│   │  [Filmstrip]             │
│ ⬇ │  [Scene Editor]          │
└───┴──────────────────────────┘
```

---

## Technical Details

**File: `src/pages/Editor.tsx`**
- Add `variant` state (`'A' | 'B' | 'C'`) with a floating version switcher (three small buttons in top-right corner)
- Import `useNavigate` from react-router-dom
- Each variant renders the same core components (Preview, PlaybackControls, Filmstrip, SceneEditor) but with different wrapper layouts and CTA placements
- Remove existing `aiExpanded` state and header AI bar; each variant has its own AI prompt approach
- Add `optimizePrompt` state and `optimizeExpanded` state for the AI input

**File: `src/components/editor/AIPromptBar.tsx`**
- No changes needed; variants will use inline prompt inputs directly

**New shared logic (inside Editor.tsx):**
- "New Video" button: calls `navigate('/')`
- "Edit with AI" prompt: reuses the same mock submit pattern (loading spinner, toast on complete)
- Version switcher: three small labeled buttons ("A", "B", "C") in a fixed position

**Estimated scope:** ~250 lines modified in Editor.tsx, no other files changed.

