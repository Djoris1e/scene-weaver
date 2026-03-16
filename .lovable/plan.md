

## Plan: Video Showcase + Asset Library Promotion

### 1. Replace Product Mockup with Video Showcase

Replace the static `ProductMockup` component (lines 164-228) and its section (lines 348-354) with a horizontally scrollable row of 9:16 video phone mockups.

**`VideoShowcase` component:**
- A horizontally scrollable flex container with `overflow-x-auto scrollbar-none`
- 5 phone-frame containers: `aspect-[9/16]`, `max-h-[420px]`, `rounded-3xl`, border, shadow
- Each contains a `<video autoPlay muted loop playsInline>` with a free Pexels vertical video URL
- Label overlay at the bottom of each frame (e.g. "Product Launch", "App Demo", "Event Promo", "Brand Story", "Social Teaser")
- Gradient fade on left/right edges of the scroll container
- On hover: slight scale-up and border glow

**Video sources** — free Pexels CDN vertical videos (tech, fitness, food, city, lifestyle themes).

### 2. New "Built-in Asset Library" Section

Add a new section between Features and Comparison (after line 383) promoting the free included assets.

**Design:** A horizontal strip of 4 glassmorphic cards, each showcasing one asset category:

| Card | Icon | Title | Description |
|------|------|-------|-------------|
| Audio | Music note | Curated Soundtracks | Royalty-free tracks synced to your cuts |
| Animations | Sparkles/Zap | Ready-made Animations | Counters, text effects, transitions |
| Backgrounds | Layers | Gradient Backgrounds | 12+ designer gradients, fully customizable |
| Stock | Image | Stock Footage | Search millions of clips from Pexels |

Each card gets a subtle animated preview element:
- Audio card: a small animated waveform (CSS bars)
- Animations card: a pulsing/scaling icon
- Backgrounds card: a mini gradient swatch strip
- Stock card: a small grid of colored rectangles

Section heading: **"Everything included. No extra cost."** with subtitle about all assets being royalty-free.

### 3. Files Changed

**`src/pages/Landing.tsx`:**
- Remove `ProductMockup` component
- Add `VideoShowcase` component with 5 phone-frame videos
- Add `AssetLibrary` section with 4 animated cards
- Update the page layout to include both new sections

**`src/index.css`:**
- Add `@keyframes waveform` for the audio card's animated bars

No new dependencies needed.

