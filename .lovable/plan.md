

## Landing Page: Best-in-Class Redesign

The current page is structurally repetitive -- every section is "heading + subtitle + grid of identical cards." It reads like a wireframe, not a marketing page. Here is what needs to change fundamentally:

### Problems with current page
1. **No visual rhythm** -- every section has identical spacing, identical card grids, identical icon+title+desc patterns
2. **No atmosphere** -- the deep navy theme is wasted; no glows, no gradients, no depth
3. **No social proof or urgency** -- nothing builds trust or FOMO
4. **No product visualization** -- user never sees what VanillaSky actually produces
5. **Hero is passive** -- headline + paragraph + form, no energy
6. **Comparison section is weak** -- two plain text columns don't land the point

### Redesign Strategy

**Hero** -- Add a radial gradient glow behind the heading (pink-to-transparent), floating pill badges ("No editing skills needed", "60s to first draft") above the headline for social proof/hooks. The PromptCard stays but gets a subtle outer glow on hover.

**"How it works" section** -- Replace the 3 icon cards with a horizontal connected timeline: numbered steps connected by a gradient line, with the step descriptions alternating above/below on desktop. Much more visual, breaks the card monotony.

**Product mockup section** (NEW) -- A full-width section showing a fake editor screenshot or stylized browser frame with a video timeline inside it. This is the single biggest missing piece -- show the product. Built as a styled div with fake timeline bars, scene thumbnails, and waveform shapes using CSS.

**Features section** -- Keep the 2x2 grid but add a large gradient border glow on the entire grid container, and make each card have a glassmorphism effect (backdrop-blur + semi-transparent bg). Add a subtle pink radial glow behind the section.

**Comparison section** -- Replace the side-by-side text boxes with a single table-style layout: left column crossed out (line-through, dimmed), right column bright with a checkmark. More visceral contrast.

**Terminal section** -- Add a typing animation effect to the terminal lines (CSS keyframes that reveal lines sequentially). Add a pulsing cursor at the end.

**Social proof bar** (NEW) -- A simple horizontal strip: "Trusted by 500+ creators" with small avatar circles and a star rating. Even if mock data, it builds credibility.

**Final CTA** -- Add a large radial gradient background glow, make the heading larger, add the PromptCard again (or a "scroll to top" arrow) so users can act without scrolling.

**Ambient effects throughout** -- CSS-only decorative gradient orbs (absolutely positioned, blurred divs) placed behind key sections to create depth and atmosphere.

### Technical Changes

**`src/pages/Landing.tsx`** -- Full rewrite:
- Hero with radial gradient orbs, floating pill badges, PromptCard with glow
- Connected timeline for "how it works" (flexbox + gradient pseudo-element line)
- Product mockup section: styled browser frame with fake timeline UI inside
- Glassmorphic feature cards with backdrop-blur
- Strikethrough comparison table instead of side-by-side cards
- Terminal with CSS `@keyframes` sequential line reveal
- Social proof strip with mock avatars
- CTA section with large ambient glow and repeated prompt card
- Decorative gradient orbs (absolute positioned blurred divs) behind hero and features sections

**`src/index.css`** -- Add:
- `@keyframes typeIn` for terminal line animation
- `.glass-card` utility (backdrop-blur-xl, bg-white/5, border-white/10)
- `.glow-orb` utility for decorative gradient blurs
- `.line-through-dim` for comparison strikethrough styling

No new dependencies needed -- all CSS-driven effects.

