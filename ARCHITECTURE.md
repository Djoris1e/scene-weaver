# Architecture & Design System

Deep reference for developers and AI agents working on VanillaSky.

---

## 1. Design System

### Color Tokens (HSL in `index.css` → Tailwind classes)

| Token | HSL | Usage |
|-------|-----|-------|
| `--background` | `240 100% 5%` | Page background (near-black blue) |
| `--foreground` | `0 0% 100%` | Primary text (white) |
| `--card` | `240 36% 11%` | Card surfaces |
| `--primary` | `338 72% 59%` | Brand pink — CTAs, highlights, links |
| `--accent` | `34 83% 55%` | Warm orange — secondary actions, badges |
| `--highlight` | `200 100% 50%` | Blue highlight for special elements |
| `--secondary` | `240 36% 17%` | Subtle backgrounds, hover states |
| `--muted` | `240 28% 21%` | Borders, disabled states |
| `--muted-foreground` | `255 8% 67%` | Secondary text |
| `--destructive` | `0 80% 62%` | Error/delete actions |

Custom tokens for editor: `--scene-strip`, `--console`, `--stage`.

### Typography

| Class | Font | Usage |
|-------|------|-------|
| `font-sans` | Manrope | Body text (default) |
| `font-heading` | Raleway | Headings (h1–h6) |
| `font-mono` | JetBrains Mono | Code/terminal blocks |

Loaded via Google Fonts import in `index.css`.

### Utility Classes (defined in `index.css`)

| Class | Effect |
|-------|--------|
| `.gradient-vs` | Primary→accent gradient background |
| `.gradient-vs-text` | Gradient text (background-clip) |
| `.glass-card` | Glassmorphic card (blur + semi-transparent bg + subtle border) |
| `.glow-orb` | Absolute-positioned blurred circle for ambient lighting |
| `.scrollbar-none` | Hidden scrollbar (cross-browser) |
| `.line-through-dim` | Strikethrough with reduced opacity |
| `.terminal-line` | Staggered fade-in for terminal animation |
| `.terminal-cursor` | Blinking cursor block |
| `.float-badge` / `.float-badge-delayed` | Floating Y-axis animation |

### Animations (CSS keyframes)

- `waveform` — vertical scale oscillation for audio visualizer
- `typeIn` — fade + slide up for terminal lines
- `blink` — cursor blinking
- `float` — gentle Y-axis bobbing

---

## 2. Component Architecture

### Landing Page (`src/pages/Landing.tsx`)

587 lines. Single file containing:

**Sections (top to bottom):**
1. **Nav** — logo + "Get Started" link
2. **Hero** — title, subtitle, `<CreationWizard>`. Hero collapses with scale+blur animation when wizard interaction starts (`chatStarted` state)
3. **Video Showcase** — horizontal scroll of 5 phone-frame video previews (Pexels sources)
4. **Terminal Block** — typing animation showing agent workflow
5. **Asset Library** — 4-card grid (Soundtracks, Animations, Gradients, Stock Footage)
6. **Features** — 2×2 glassmorphic grid
7. **Comparison** — strikethrough "old way → better way" list
8. **Pricing** — Free + Pro (coming soon) cards
9. **Use Cases** — 3×2 grid of use case cards

**Internal components (defined in Landing.tsx):**
- `AnimatedSection` — scroll-triggered fade-in wrapper using `useInView`
- `PromptCard` — legacy prompt input (defined but replaced by wizard)
- `VideoShowcase` — horizontal video carousel
- `AssetLibrary` — 4-card asset grid with animated previews
- `TerminalBlock` — typing animation terminal

### Creation Wizard (`src/components/create/CreationWizard.tsx`)

Chatbot-style multi-step flow embedded in the hero section.

**State machine phases:** `type → source → source-input → brand → brand-config → logo → generating`

**Flow:**
1. Bot asks video type → user picks from 6 options (Launch, Explainer, Promo, Social, Portfolio, Event)
2. Bot asks content source → URL / Upload / Describe
3. User provides content via inline input
4. Bot asks about brand colors → Yes/Skip
5. Optional: color pickers inline
6. Bot asks about logo → Upload/Skip
7. Generating animation → navigates to `/editor`

**Key patterns:**
- `messages` array with `role: 'bot' | 'user'`
- `phase` ref tracks current step (not React state — avoids re-renders)
- Bot messages appear with 600ms typing delay (animated dots)
- `onInteraction` callback tells Landing.tsx to collapse the hero
- Auto-scroll to bottom with coordinated delays (700ms for first interactions to wait for hero collapse)

**Props:** `{ onInteraction?: () => void }`

### Editor (`src/pages/Editor.tsx`)

300 lines. Three layout variants (A/B/C) switchable via floating pill selector.

**Shared blocks across variants:**
- `Preview` — 9:16 scene canvas
- `PlaybackControls` — play/pause, scrub, time display
- `Filmstrip` — horizontal timeline segments
- `SceneEditor` — tabbed panel (Text/Media/Motion/Brand)
- AI prompt input (text field + Sparkles icon)

**Variants:**
- **A: Floating Action Bar** — minimal header, fixed bottom bar with "New Video" + "Edit with AI" buttons, expandable AI input
- **B: Split Header** — sticky two-row header with title + AI input always visible
- **C: Sidebar + Tab Bar** — desktop sidebar (left), mobile bottom tab bar

**State:** `useSceneStore()` hook provides all scene/brand state. `useAIPrompt()` handles mock AI submissions.

### Scene Store (`src/hooks/useSceneStore.ts`)

Central state management via React `useState`. No external state library.

```typescript
interface BrandKit {
  bgColor: string;
  accentColor: string;
  logoUrl: string | null;
  slogan: string;
}

// Returns:
{
  scenes, activeIndex, activeScene, totalDuration,
  setActiveIndex, addScene, deleteScene, updateScene, reorderScenes,
  brandKit, setBrandKit,
  endScreen, setEndScreen,
}
```

Max 10 scenes. Default scene duration: 2.2s.

### Scene Model (`src/types/scene.ts`)

Core `Scene` interface with 20+ fields:
- Text: `text`, `textPosition`, `textColorId`, `fontId`, `textEffect`
- Visual: `backgroundUrl`, `assetType`, `template`, `gradient`, `animation`, `overlays`
- Timing: `startTime`, `endTime`, `transition`
- Templates: `counter`, `socialProof`, `productLaunch`

**Constants exported:**
- `TEXT_COLOR_PAIRINGS` — 8 color options with shadow styles
- `FONT_OPTIONS` — 4 font families
- `GRADIENT_STYLES` — 12 gradient presets
- `TEMPLATE_OPTIONS` — 6 scene templates
- `createDefaultScene()` — factory function

### Export Done (`src/pages/ExportDone.tsx`)

Three variants of post-export confirmation:
- **A:** Compact card with Save/Share/Re-edit buttons
- **B:** Gradient card with bouncing check icon + ambient glow
- **C:** Full-width cinematic layout with large icon + gradient text

---

## 3. Patterns & Conventions

### A/B/C Variant Testing
All three pages use a floating variant switcher (A/B/C pills). State is local (`useState<Variant>`). Each variant is a distinct layout rendered conditionally.

### Animation Pattern
Scroll animations use `framer-motion`'s `useInView` + `motion.div` with `whileInView`. Standard ease: `[0.22, 1, 0.36, 1]`. Standard duration: 0.4–0.7s.

### Styling Rules
- **Always use Tailwind semantic tokens** (`text-foreground`, `bg-card`, `border-border`, etc.)
- **Never use raw colors** in components (`text-white`, `bg-black` — ❌)
- All custom colors defined in `index.css` as CSS variables, mapped in `tailwind.config.ts`
- Glassmorphic cards: use `.glass-card` utility class

### File Organization
- Pages are self-contained (Landing.tsx includes its own sub-components)
- Editor components are separate files in `src/components/editor/`
- UI primitives in `src/components/ui/` (shadcn — don't modify)
- No external state management library — all via hooks

---

## 4. Build & Config

- **Vite** config: `vite.config.ts` — port 8080, path alias `@/` → `src/`
- **TypeScript**: strict mode, path aliases configured in `tsconfig.app.json`
- **Tailwind**: `tailwind.config.ts` with custom fonts, colors, animations
- **Testing**: Vitest + Testing Library + Playwright
- **Linting**: ESLint 9 flat config with React hooks + refresh plugins
