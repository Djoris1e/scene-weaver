

## New "Create" Landing Page with AI Prompt Form

A new `/create` page inspired by the reference screenshots -- a cinematic landing with a large AI prompt input, optional URL scraping, and brand kit personalization.

### Design

```text
┌─────────────────────────────────────────┐
│                                         │
│      Turn any moment into a             │
│        cinematic video                  │  <- Raleway heading, "cinematic video" in primary pink
│                                         │
│   No footage needed — use built-in      │  <- Muted subtitle
│   animated backgrounds or your own      │
│   media. Pick a beat, add text, and     │
│   export in minutes.                    │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │ Describe your video…        ✈  │    │  <- Large input with pink border glow
│  └─────────────────────────────────┘    │
│                                         │
│     🔗 Add content from a URL           │  <- Toggle: shows URL input + Extract button
│                                         │
│     5 of 5 prompts remaining today      │  <- Muted counter text
│                                         │
│     🎨 Personalize with your brand  ▾   │  <- Toggle: shows brand color/logo fields
│                                         │
└─────────────────────────────────────────┘
```

### Changes

**`src/pages/Create.tsx`** (new)
- Full-screen centered layout with the deep navy background
- Large Raleway heading with "cinematic video" in `text-primary`
- Muted Manrope subtitle paragraph
- Prompt input: large rounded field with a pink border/glow, send icon button on right
- "Add content from a URL" toggle: click reveals a secondary input row with a link icon, URL input, "Extract" button (pink text), and X to dismiss
- "Personalize with your brand" collapsible: click expands to show brand color pickers and optional logo URL input (reusing brand kit state pattern)
- "5 of 5 prompts remaining today" static counter
- All interactions are mockup/UI-only (no real backend calls)

**`src/App.tsx`**
- Add route: `/create` -> `<Create />`

### Technical Details
- Uses existing theme colors (primary pink, secondary, muted, card backgrounds)
- Raleway for headings, Manrope for body -- already configured
- Collapsible sections use simple `useState` toggles with smooth height transitions
- Pink border glow on prompt input via `ring-primary/30 border-primary/50` styling
- Send button uses `Send` icon from lucide-react, styled in primary pink

