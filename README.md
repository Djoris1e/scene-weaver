# Sequence — Video Scene Editor

A mobile-first video scene editor built with React, TypeScript, and Tailwind CSS. Create short-form video sequences with text overlays, gradient backgrounds, counters, and brand customization.

## Architecture

```
src/
├── components/
│   ├── editor/           # Core editor components
│   │   ├── AIPromptBar   # AI prompt input bar
│   │   ├── DropdownSelect# Reusable styled select
│   │   ├── ExportButton  # Export with progress animation
│   │   ├── Filmstrip     # Horizontal timeline with drag-to-scrub
│   │   ├── IconTabBar    # Tab navigation with icons
│   │   ├── Preview       # 9:16 scene preview canvas
│   │   ├── SceneEditor   # Tabbed scene editing panel (Text/Media/Motion/Brand)
│   │   └── SearchDialog  # Media search modal
│   └── ui/               # shadcn/ui primitives
├── hooks/
│   └── useSceneStore     # Scene state management (scenes, brand kit, end screen)
├── types/
│   └── scene             # Scene model, constants (colors, fonts, gradients)
├── pages/
│   └── Editor            # Main page — composes all editor components
└── assets/
    └── logo.svg
```

## Key Concepts

- **Scene**: A clip with text, background (gradient/media/counter), timing, transitions, and effects
- **Brand Kit**: Global settings (colors, logo, slogan) applied across all scenes
- **Filmstrip**: Width-proportional timeline segments; drag to scrub, tap to edit
- **State**: `useSceneStore` hook manages all editor state via React `useState`

## Integration Guide

To integrate into another codebase:

1. Copy `src/components/editor/`, `src/hooks/useSceneStore.ts`, and `src/types/scene.ts`
2. The editor requires these dependencies: `lucide-react`, `tailwindcss`, `class-variance-authority`
3. It uses shadcn/ui's `Switch` component — copy `src/components/ui/switch.tsx` or replace with your own toggle
4. CSS variables are defined in `src/index.css` — merge the `:root` tokens into your theme
5. Mount the `<Editor />` page component or compose individual pieces as needed

## Tech Stack

- **React 18** + TypeScript
- **Vite** for dev/build
- **Tailwind CSS** with HSL design tokens
- **shadcn/ui** for primitives
- **lucide-react** for icons

## Development

```sh
npm install
npm run dev     # http://localhost:8080
npm run build   # Production build
npm run test    # Run tests
```
