

# Remove "Footage to video" + Clarify multi-input across all variants

## Changes

### 1. Remove "Footage to video" from CONTENT_SOURCES
Delete the `footage` entry from the `CONTENT_SOURCES` array (line 40) and remove the `footage` handler in `ContentSourceInput` (lines 353-371). The media bucket panel already covers uploading video/images as background media.

### 2. Make it clear users can combine multiple inputs
Currently the content source chips behave as toggles (selecting one deselects the previous). The UX should communicate that these are additive — you can enter a URL AND describe it AND upload media.

Changes across all four variants:
- **Prompt textarea**: Change placeholder from "Add any extra instructions…" to something like `"Describe your video, paste a URL, or do both…"` — wording that signals combining inputs is expected.
- **Content source chips**: Keep them as quick-start shortcuts but add a small helper line below the chips: `"Pick one or combine — add a URL, description, and media all at once"`.
- **URL input**: When a content source like "Blog to video" is selected and a URL is entered, keep the prompt textarea visible and prominent so users naturally add extra instructions alongside the URL.
- In **Option B** (shortcut cards), update the divider text from "or describe anything" to "and/or describe it" to signal combination rather than alternatives.
- In **Option C** (smart field), update placeholder to reinforce multi-input: `"Paste a URL, describe your video, or both…"`.
- In **Option D** (accordion), ensure the prompt section header says something like `"Describe & add sources"` rather than implying a single input.

### Technical scope
All changes are in `src/pages/Create.tsx` — removing ~20 lines (footage source + handler), updating ~10 placeholder/label strings across the four variants.

