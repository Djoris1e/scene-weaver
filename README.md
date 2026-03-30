# VanillaSky — AI Video Creation Agent

An AI-powered video creation platform with a conversational wizard, timeline editor, and export flow. Built with React 18, TypeScript, Vite, Tailwind CSS, and Framer Motion.

**Live preview:** Dark-themed, mobile-first SPA with three routes and A/B/C variant testing across all pages.

---

## Quick Start

```sh
npm install
npm run dev     # http://localhost:8080
npm run build   # Production build
npm run test    # Vitest
```

## Routes

| Path | Page | Description |
|------|------|-------------|
| `/` | `Landing` | Marketing homepage with conversational creation wizard |
| `/editor` | `Editor` | Timeline-based video scene editor (3 layout variants) |
| `/export-done` | `ExportDone` | Post-export confirmation (3 variants) |

## Project Structure

```
src/
├── pages/
│   ├── Landing.tsx          # Homepage: hero, wizard, features, pricing, use cases
│   ├── Editor.tsx           # Scene editor with preview, filmstrip, AI prompt
│   └── ExportDone.tsx       # Export confirmation screen
├── components/
│   ├── create/
│   │   └── CreationWizard.tsx  # Chatbot-style multi-step video creation flow
│   ├── editor/
│   │   ├── Preview.tsx         # 9:16 scene preview canvas
│   │   ├── Filmstrip.tsx       # Horizontal timeline with drag-to-scrub
│   │   ├── SceneEditor.tsx     # Tabbed editing panel (Text/Media/Motion/Brand)
│   │   ├── PlaybackControls.tsx
│   │   ├── ExportButton.tsx    # Export with progress animation
│   │   ├── AIPromptBar.tsx     # AI prompt input
│   │   ├── DropdownSelect.tsx  # Styled select component
│   │   ├── IconTabBar.tsx      # Tab navigation with icons
│   │   └── SearchDialog.tsx    # Media search modal
│   └── ui/                     # shadcn/ui primitives (button, dialog, etc.)
├── hooks/
│   └── useSceneStore.ts     # All editor state: scenes, brand kit, end screen
├── types/
│   └── scene.ts             # Scene model, gradient configs, font/color constants
├── index.css                # Design tokens, fonts, utility classes, animations
├── App.tsx                  # Router setup with React Query + Toast providers
└── main.tsx                 # Entry point
```

## Tech Stack

- **React 18** + TypeScript (strict)
- **Vite 5** — dev server on port 8080
- **Tailwind CSS 3** with HSL design tokens
- **Framer Motion** — page transitions, scroll animations, layout animations
- **shadcn/ui** — headless primitives (Button, Dialog, Switch, Tabs, etc.)
- **lucide-react** — icons
- **React Router 6** — client-side routing
- **React Query** — data fetching (provider configured, not heavily used yet)

## Key Dependencies

```
react, react-dom, react-router-dom, framer-motion, 
lucide-react, class-variance-authority, tailwind-merge, clsx,
@radix-ui/* (via shadcn), @tanstack/react-query, sonner
```

See `package.json` for exact versions.

---

For architecture details, design system reference, and component API docs, see **[ARCHITECTURE.md](./ARCHITECTURE.md)**.
