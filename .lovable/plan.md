

# Sequence — Scene-Based Video Creator

A mobile-first video creation app where users build videos scene by scene in a vertical stack interface.

## Core Interface

### Layout (Mobile-First)
- **Dark "Darkroom" theme** with deep charcoal backgrounds and high-contrast white text
- **Stage area** (top 60%): Shows active scene preview at 9:16 aspect ratio with text overlay
- **Scene Strip** (h-16): Horizontal scrollable row of scene thumbnails with active state indicator
- **Console drawer** (bottom 35%): Tabbed panel with [Text], [Media], [Motion] tabs

### Empty State
- Large centered `+` button with ghosted 3-scene preview to onboard users

## Features

### Scene Management
- Add new scenes (up to ~10)
- Delete scenes
- Reorder via drag-and-drop in the Scene Strip
- Tap scene thumbnail to switch active scene

### Text Tab (Console)
- Text input area for scene copy (2-3 sentences max)
- Text position selector: Top / Center / Bottom (no free-form dragging)
- 8 curated color pairings for text (no color picker)
- Font selection: 3-4 preset fonts

### Media Tab (Console)
- **Unsplash search**: Search and select free stock images as scene backgrounds
- **Upload**: Upload your own images from device
- Thumbnail grid showing search results / uploaded media
- Selected media fills the scene preview

### Motion Tab (Console)
- **Transitions** between scenes: Fade, Slide, Zoom, Cut (4 basic options)
- **Text effects**: Fade In, Typewriter, Scale Up (3 options)
- Visual preview chips showing effect names, tap to select

### Scene Preview
- Shows selected background image/media at 9:16 ratio
- Text overlay rendered in chosen position, font, and color
- Live updates as user types

### Export (Mock)
- "Export" button with primary blue styling
- Simulated processing state with thin progress bar at top
- Success toast with mock "video ready" message

## Technical Approach
- All state managed in React (no persistence)
- Unsplash API via their free public access (client-side, no API key needed for demo usage)
- Framer Motion for drag-to-reorder and scene transitions
- Fully responsive but optimized for mobile viewport

