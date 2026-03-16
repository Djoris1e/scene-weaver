

## Move AI Prompt Bar into the Header

Merge the AI prompt input into the sticky top navigation bar, between the logo and the export button. This saves vertical space, keeps AI always accessible, and creates a cleaner layout.

### Layout change

Current header: `[Logo] .............. [Export]`
New header: `[Logo] [====AI prompt input====] [Export]`

### Changes

**`src/pages/Editor.tsx`**
- Remove the standalone `<AIPromptBar />` section (lines 73-76)
- Move the AI prompt bar into the header row between logo and export button
- Adjust header height slightly (`h-14`) to accommodate the input comfortably

**`src/components/editor/AIPromptBar.tsx`**
- Remove the outer `<form>` wrapper's padding, background, and border (it no longer needs its own card container)
- Keep just the inner input row (`bg-secondary rounded-xl`) so it sits inline in the header
- Make it `flex-1` so it fills the space between logo and export button

The result is a single compact header bar: logo on the left, AI input stretching in the middle, export button on the right.

