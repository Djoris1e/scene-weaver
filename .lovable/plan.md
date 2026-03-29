

# Three Guided Video Creation Wizards

Three distinct UX approaches to the same multi-step creation flow, switchable via a floating A/B/C pill selector (same pattern as the Editor page). Each collects: video type, content source (URL/upload/prompt), optional brand kit, then generates.

---

## Version A: Chatbot Style (Landbot-inspired)

A friendly conversational interface. Messages appear one at a time in a chat bubble layout. The system asks a question, the user taps a response (chips/cards), and the next message slides in. Feels like texting a creative assistant.

```text
┌─────────────────────────────────┐
│  VanillaSky                     │
│                                 │
│  🤖 Hey! What kind of video     │
│     are you making?             │
│                                 │
│  [Launch] [Explainer] [Promo]   │
│  [Social] [Portfolio] [Event]   │
│                                 │
│  (user taps "Launch")           │
│                                 │
│  👤 Launch video                │
│                                 │
│  🤖 Great! Got any content I    │
│     can work with?              │
│                                 │
│  [Scrape a page] [Upload files] │
│  [I'll describe it]             │
│                                 │
│  ┌─────────────────────────┐    │
│  │ Type a message...   [→] │    │
│  └─────────────────────────┘    │
└─────────────────────────────────┘
```

- Chat bubble UI with alternating bot/user messages
- Bot avatar + typing indicator ("..." dots) before each new message
- Option chips rendered inline as clickable pills
- When a sub-input is needed (URL, file upload, prompt textarea), it appears as a special input card within the chat
- Brand kit step: bot asks "Want to add your brand colors?" with Yes/Skip chips
- Final step: bot says "Creating your video..." with animated progress in a chat bubble
- Warm, conversational copy ("Hey!", "Great choice!", "Almost there!")

## Version B: Recommended (Single-Card Stepper)

A compact, centered card that morphs through each step. Progress dots at the top, smooth content transitions. The most balanced UX -- focused, clear, no page scrolling. This is the version we think works best.

```text
┌─────────────────────────────────┐
│         ● ○ ○ ○                 │
│                                 │
│  What kind of video are         │
│  you creating?                  │
│                                 │
│  ┌────────┐ ┌────────┐          │
│  │🚀Launch│ │📺Explain│          │
│  └────────┘ └────────┘          │
│  ┌────────┐ ┌────────┐          │
│  │📣Promo │ │🎬Social │          │
│  └────────┘ └────────┘          │
│  ┌────────┐ ┌────────┐          │
│  │💼Portfl│ │📅Event  │          │
│  └────────┘ └────────┘          │
│                                 │
│              [Continue →]       │
└─────────────────────────────────┘
```

- Single glassmorphic card, fixed max-w-2xl, centered on page
- Step indicator: 4 dots at top (filled = current/done, outline = upcoming)
- AnimatePresence slide transitions between steps (left-to-right forward, right-to-left back)
- Step 1: 6-card grid for video type selection (icon + label, highlight on select)
- Step 2: 3 source option cards, selecting one expands an inline input (URL field, file dropzone, or textarea)
- Step 3: Brand kit toggle -- "Skip" or "Configure" with inline color pickers + logo upload
- Step 4: Generation loading with rotating status messages, navigates to `/editor`
- Back/Continue buttons at bottom, Continue disabled until selection made
- Clean, professional copy

## Version C: Typeform Style (Full-Screen Steps)

Each question takes the full viewport. Large typography, minimal chrome, keyboard-friendly. One question at a time with a progress bar at the top. Arrow keys or Enter to advance.

```text
┌─────────────────────────────────┐
│ ████░░░░░░░░░░░░░░  Step 1 of 4│
│                                 │
│                                 │
│                                 │
│  What type of video do          │
│  you want to create?            │
│                                 │
│  A  🚀 Product Launch           │
│  B  📺 Explainer                │
│  C  📣 Promotion                │
│  D  🎬 Social Media             │
│  E  💼 Portfolio Reel            │
│  F  📅 Event Promo              │
│                                 │
│                                 │
│  press A-F or click             │
│                    [OK ✓]       │
│                                 │
└─────────────────────────────────┘
```

- Full viewport height per question, vertically centered content
- Top progress bar (thin gradient line showing % completion)
- Large heading text (text-3xl/4xl), generous whitespace
- Options rendered as a vertical list with keyboard shortcut letters (A, B, C...)
- Keyboard navigation: press letter to select, Enter/arrow-down to advance
- Smooth scroll-snap or AnimatePresence fade between questions
- Sub-inputs (URL, upload, prompt) render as full-width centered fields below the question
- Brand kit: full-screen with large color swatches and drag-and-drop logo area
- Generation: full-screen cinematic loading with large progress bar and rotating messages
- Minimal, editorial tone ("Let's start.", "What should we work with?", "One more thing.")

---

## Technical Details

### New file: `src/components/create/CreationWizard.tsx`
- Single component with `variant` state (`'A' | 'B' | 'C'`)
- Shared state: `step` (1-4), `videoType`, `contentSource` (url/upload/prompt), `contentData`, `brandKit`
- Each variant is a sub-component (WizardA, WizardB, WizardC) receiving shared state + setters
- Mock generation on step 4: 3s timeout with rotating status messages, then `navigate('/editor')`
- Floating version switcher (A/B/C pills) in top-right corner, same pattern as Editor page

### Variant A (Chatbot)
- `messages` array state, each message has `role` ('bot' | 'user'), `content`, optional `options` array
- Bot messages appear with a 500ms typing delay (animated dots then reveal)
- User selections push a user message + trigger next bot message
- Scrolls to bottom on new message via `scrollIntoView`

### Variant B (Stepper)
- 4-step state machine, AnimatePresence with direction-aware slide
- Step validation: Next disabled until required field filled
- Progress dots component at top

### Variant C (Typeform)
- Full-height sections with `min-h-screen` per step
- `useEffect` keyboard listener for letter shortcuts (A-F) and Enter
- Top progress bar width = `(step / totalSteps) * 100%`
- Scroll-snap or animated transition between steps

### File: `src/pages/Landing.tsx`
- Replace `<PromptCard glowOnHover />` (line 355) with `<CreationWizard />`
- Import CreationWizard
- Keep all other landing page sections below unchanged

### Estimated scope
- ~450 lines for CreationWizard.tsx (3 variants + shared logic)
- ~5 lines changed in Landing.tsx

