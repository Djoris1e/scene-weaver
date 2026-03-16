

## AI Prompt Bar: Expand on Focus with Takeover Mode

On mobile (390px), the current inline AI input is too cramped. Instead of trying to fit everything in one row, we'll make the AI prompt a **CTA button** that, when tapped, takes over the entire nav bar.

### Behavior

**Default state (collapsed):**
```text
[🏠 Home] .................. [✨ AI] [Export]
```
- Logo replaced with a `Home` icon to save space
- AI shows as a small CTA button (sparkle icon + "AI" or just the sparkle)

**Expanded state (focused):**
```text
[====== AI prompt input ========] [✕]
```
- The entire nav bar becomes the input field
- Logo and Export button are hidden
- Cross (X) icon on the right to dismiss and return to default nav

### Changes

**`src/pages/Editor.tsx`**
- Replace `<img src={logo}>` with a `Home` icon from lucide-react
- Pass an `expanded` / `onExpand` / `onCollapse` state to `AIPromptBar`
- When AI bar is expanded, hide the Home icon and ExportButton; render only `<AIPromptBar />` filling the full header width

**`src/components/editor/AIPromptBar.tsx`**
- Accept props: `expanded`, `onExpand`, `onCollapse`
- **Collapsed mode**: Render a small button with `Sparkles` icon (acts as CTA to expand)
- **Expanded mode**: Render the full-width input with auto-focus, plus an `X` button on the right that calls `onCollapse`
- On submit or escape key, also collapse back

