

# Create Page — Four Layout Options

## Context

The current Create page is a 3-step conversational wizard (Describe → Media → Brand) with bot bubbles, sequential reveals, and mandatory vibe/content-type selection before you can even type. It's overstructured for what's essentially "give us a prompt + optionally some assets."

Looking at the competitor references:
- **Pippit** (Screenshot 3): Single prompt field with inline action buttons below (attach, settings, format). Clean and fast.
- **Visla** (Screenshot 1): Prompt field + "Or start with a tool" grid of shortcut cards. Two-tier entry.
- **Pictory** (Screenshot 2): Action cards up top (Create new, Create clips, Record, etc.) + chat prompt below. Multiple entry points.

The key insight: **media and brand are optional enrichments, not gates.** The only required input is the prompt (or a URL). Everything else should be discoverable but not blocking.

---

## Four Options to Preview

### Option A — "Prompt-First with Toolbar" (Pippit-style)

Single page, no steps. A large textarea is the hero. Below it, a row of small icon buttons act as inline toggles: `+` (attach files), `🔗` (add URL), `🎨` (brand settings), `⚙️` (format/duration). Clicking one opens an inline expandable panel directly below the prompt. The "Create" button sits at the end of the input row. Everything is on one screen — no navigation, no steps.

```text
┌─────────────────────────────────────────┐
│  What video will you create?            │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │ Describe your video...          │    │
│  │                                 │    │
│  │                                 │    │
│  │ [+] [🔗] [🎨] [⚙️]    [Create] │    │
│  └─────────────────────────────────┘    │
│                                         │
│  ▼ expanded: attached files grid        │
│  ▼ expanded: brand color/logo picker    │
└─────────────────────────────────────────┘
```

**Pros**: Fastest path to generate. Zero friction. Optional panels only appear when needed.
**Cons**: Can feel dense if multiple panels are open.

### Option B — "Shortcut Cards + Prompt" (Visla-style)

Top half: a row of shortcut cards ("URL to video", "Text to video", "Images to video"). Clicking one pre-fills the prompt or opens a specialized input. Bottom half: a general-purpose prompt field with attach/brand buttons inside it. The prompt is always available regardless of which shortcut was picked.

```text
┌─────────────────────────────────────────┐
│  Get started                            │
│                                         │
│  [🔗 URL to video] [📝 Text to video]  │
│  [🖼 Images to video] [📄 Doc to video]│
│                                         │
│  ─── or describe anything ───           │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │ Describe your video...          │    │
│  │ [+] [🎨]               [Create] │    │
│  └─────────────────────────────────┘    │
└─────────────────────────────────────────┘
```

**Pros**: Good for users who know exactly what they have (a URL, images, etc.). Provides structure without forcing it.
**Cons**: Two competing entry points might confuse some users.

### Option C — "Single Smart Field" (Google-style)

One text input that auto-detects intent. Paste a URL? It detects it and shows a "URL detected" chip. Type text? It's a prompt. Drag files onto it? They appear as thumbnails. A small `⚙️` icon at the right opens a slide-out or dropdown for brand/format settings. Everything flows through one field.

```text
┌─────────────────────────────────────────┐
│  What should we make?                   │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │ Paste a URL, describe, or drop  │    │
│  │ files here...                   │    │
│  │                                 │    │
│  │ [🔗 example.com ✕]  [📷 3 imgs]│    │
│  │                          [⚙️] ↗│    │
│  └─────────────────────────────────┘    │
│                                         │
│  ⚙️ panel: brand colors, logo, font    │
└─────────────────────────────────────────┘
```

**Pros**: Absolute minimum UI. Feels magical when it auto-detects. Scales well.
**Cons**: Discoverability of features is low. Users may not know they can drop files.

### Option D — "Accordion Sections" (Structured but flat)

Single page with the prompt at the top (always visible), followed by collapsible accordion sections: "Add Media", "Brand & Style". Sections start collapsed with a summary line ("No media added", "Default brand"). Clicking expands them inline. No step navigation — just scroll.

```text
┌─────────────────────────────────────────┐
│  Create your video                      │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │ Describe your video...          │    │
│  │                          Create │    │
│  └─────────────────────────────────┘    │
│                                         │
│  ▸ Add media — No files added           │
│  ▸ Brand & style — Default              │
│  ▸ Source URL — Optional                │
└─────────────────────────────────────────┘
```

**Pros**: Clear hierarchy. Everything visible at a glance. Easy to scan. Nothing hidden.
**Cons**: Slightly more vertical space than Option A.

---

## Technical scope

All four options live in `src/pages/Create.tsx` (full rewrite, ~400-500 lines). Shared logic: prompt state, file upload handling, brand config state, navigation to `/editor` on submit. No new dependencies needed — framer-motion already installed for expand/collapse animations.

## Recommendation

**Option A** is the strongest for your use case. It's the fastest path, mirrors what power users expect from AI tools, and keeps optional features accessible without cluttering the default view. Option C is a close second if you want maximum minimalism.

