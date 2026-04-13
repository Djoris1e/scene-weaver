

# Recommendation: Option E — Hybrid of A + C

## Assessment of current variants

- **A** has the right structure — content source chips give clear affordance for blog/release/PDF/URL — but they sit above and feel disconnected from the prompt. Two separate zones.
- **B** takes too much vertical space. The large cards + divider + prompt creates decision paralysis. Two competing entry points.
- **C** is the cleanest and most inviting — one field, instant action. But it hides the content sources entirely (only mentioned in tiny subtitle text). Users won't discover "Blog to video" or "Release notes to video."
- **D** is functional but the accordions feel like work. Nobody wants to expand three sections before creating.

## The ideal: Option E

Take C's minimal single-field layout as the foundation, but surface A's content source chips *inside* the prompt card as a row of small pill buttons above the textarea. This gives you:

1. **One visual unit** — everything in a single card, no separate zones
2. **Source discoverability** — users immediately see "Blog to video", "Release notes", etc.
3. **Zero friction** — can ignore the pills entirely and just type/paste
4. **Smart detection** — still auto-detects URLs from the prompt text (from C)
5. **Expandable panels** — media buckets and brand settings behind toolbar icons (from C)

```text
┌─────────────────────────────────────────────┐
│  What should we make?                       │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │ [Blog] [Release notes] [PDF/Doc]    │    │
│  │ [URL] [Text]                        │    │
│  │                                     │    │
│  │ Describe your video, paste a URL,   │    │
│  │ or do both...                       │    │
│  │                                     │    │
│  │ [🔗 detected URL ✕]  (if pasted)   │    │
│  │                                     │    │
│  │ [📄] [🖼] [🎨]          [✨ Create] │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  ▼ expanded: media buckets (if clicked 🖼)  │
│  ▼ expanded: brand panel (if clicked 🎨)    │
└─────────────────────────────────────────────┘
```

## Key differences from existing variants

- Content source pills are **inside** the prompt card, not above it (unlike A)
- Selecting a pill (e.g., "Blog") shows a URL input **inline within the card**, between the pills and the textarea — keeping everything in one place
- URL auto-detection from C remains: typing a URL in the textarea shows a chip
- Subtitle text mentions the content types for discoverability
- The helper text "Pick one or combine" moves to a subtle tooltip or disappears — the UI itself makes it obvious

## Technical scope

Rewrite `src/pages/Create.tsx` to remove the four-variant switcher and implement Option E as the single layout. ~350 lines, reusing the existing shared components (`MediaBucketPanel`, `BrandPanel`, `ContentSourceInput`). No new dependencies.

