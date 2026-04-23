

## Lovable/Replit-style responsive editor shell

Restructure `/editor` into a true two-pane workspace with a chat-driven left rail and a preview-driven right rail. On mobile, collapse to a segmented switch between Chat and Preview. Replace the top tabs with a cleaner header + a segmented mode switch, and add a proper composer with action buttons.

### Desktop layout (≥1024px)

```text
┌──────────────────────────────────────────────────────────────────────┐
│ Logo   ·   project name                          9:16 16:9   Export │  ← top bar (h-14)
├───────────────────────────┬──────────────────────────────────────────┤
│ [ Chat | Scenes | Audio ] │              Preview stage               │
│ segmented (icon+label)    │         (centered 9:16 phone frame)      │
│                           │                                          │
│ chat messages / scene     │                                          │
│ list / audio panel        │                                          │
│ (scrollable)              │                                          │
│                           │                                          │
│                           ├──────────────────────────────────────────┤
│                           │   0:00   ▶   0:12     transport          │
│ ─ composer ─              ├──────────────────────────────────────────┤
│ [Whole video ▾]           │ [1] textSlam · 3.0s | [2] ... | [3] | + │  ← filmstrip
│ ┌────────────────────┐    │                                          │
│ │ Ask the chat…    ➤ │    │                                          │
│ └────────────────────┘    │                                          │
│ Media  URL  Docs  Brand   │                                          │
└───────────────────────────┴──────────────────────────────────────────┘
   ~420px fixed                  flex-1
```

- Resizable split via existing `resizable.tsx` (left min 360, default 420, max 560).
- Left pane: header segmented switch (Chat / Scenes / Audio) using pill buttons (no underline tabs), scrollable body, sticky composer at bottom with the four action chips (Media, URL, Docs, Brand kit) — matches the Create page language.
- Right pane: Preview centered in a dark stage that fills available height, transport row beneath it, then Filmstrip docked at the bottom.

### Tablet (768–1023px)

Same two-pane split but composer chips collapse to icons only; segmented switch shows icons + short labels.

### Mobile (<768px)

```text
┌──────────────────────────────┐
│ ◐  project        ▦ 9:16  ⤓ │
├──────────────────────────────┤
│  ⌜ Chat | Preview ⌝          │  ← top segmented (sticky)
├──────────────────────────────┤
│                              │
│   active pane fills screen   │
│   (Chat = messages+composer  │
│    Preview = stage+transport │
│    +filmstrip)               │
│                              │
└──────────────────────────────┘
```

- Single full-screen pane controlled by a sticky top segmented switch (Chat ⇄ Preview). Scenes/Audio become buttons inside the Chat pane header (since on mobile they're sub-views of the left rail).
- Composer is sticky at the bottom of the Chat view; action chips wrap to a horizontal scroll row if needed.
- Preview view shows stage + transport + filmstrip stacked.

### Component changes

New components in `src/components/editor/`:
- `EditorShell.tsx` — handles the split layout, mobile pane switching, and `useIsMobile` branching. Uses `ResizablePanelGroup` on desktop.
- `ChatPane.tsx` — header segmented switch (Chat / Scenes / Audio), body slot, sticky `Composer`.
- `Composer.tsx` — scope dropdown ("Whole video"), textarea, send button, and the four action chips (Media, URL, Docs, Brand kit) reusing the same icons from Create.
- `PreviewPane.tsx` — wraps existing `Preview`, `PlaybackControls`, and `Filmstrip` with proper flex sizing so the stage grows to fill height instead of fixed `55vh`.
- `EditorHeader.tsx` — logo, project title, aspect-ratio toggle (9:16 / 16:9), `ExportButton`. Replaces the current bare Home button row.
- `MobilePaneSwitch.tsx` — sticky segmented Chat/Preview switch (mobile only).

Updated:
- `src/pages/Editor.tsx` — becomes a thin composition of `EditorShell` + the three pane bodies (Chat messages list, Scene list reusing `SceneEditor`, Audio panel placeholder). Removes the `max-w-[1200px]` cap so the workspace is full-bleed like Lovable/Replit.
- `Preview.tsx` — drop the hardcoded `h-[55vh]`; make it `h-full` and let the parent allocate space.

### Behavior

- Segmented switches (left pane + mobile) are pill-style with `bg-secondary` track and active `bg-background shadow` thumb.
- Chat pane shows the existing scene-action log as chat bubbles (system bubbles for `addScene`, `swapTrack`, etc., AI bubbles for the prose). Composer send is wired to a no-op for now (existing `AIPromptBar` logic can be lifted in).
- Scenes view inside the left pane = vertical list of scene cards; tapping one selects it in the preview AND opens `SceneEditor` inline below the card.
- Audio view = placeholder panel ("Track: Launch Sequence" + waveform stub).
- Aspect ratio toggle (9:16 / 16:9) just switches the preview frame's aspect class — no scene logic change.

### Out of scope

- Real chat backend, real audio waveform, real export — UI shell only.
- Changes to `/create` page.

