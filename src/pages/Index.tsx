import { useNavigate } from 'react-router-dom';
import { Layout, Layers, GalleryHorizontalEnd, List, Smartphone, TextCursorInput, Star, Film, Maximize, Grid2X2, SlidersHorizontal, Sparkles } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  const versions = [
    {
      id: 'v1',
      title: 'V1 — Tabbed Drawer',
      description: 'Bottom tab bar with separate Text, Media, Motion, Style, and Settings panels.',
      icon: <Layout className="w-5 h-5" />,
    },
    {
      id: 'v2',
      title: 'V2 — Single Scroll',
      description: 'Unified scrollable editor with collapsible sections and floating playback controls.',
      icon: <Layers className="w-5 h-5" />,
    },
    {
      id: 'v3',
      title: 'V3 — Swipeable Carousel',
      description: 'Swipe left/right through scenes with dot indicators and arrow navigation.',
      icon: <GalleryHorizontalEnd className="w-5 h-5" />,
    },
    {
      id: 'v4',
      title: 'V4 — Vertical Timeline',
      description: 'All scenes in a scrollable timeline. Tap any scene to expand its inline editor.',
      icon: <List className="w-5 h-5" />,
    },
    {
      id: 'v5',
      title: 'V5 — iOS Clip List',
      description: 'Full-screen preview with scrubber, scrollable clip list, and bottom-sheet scene editor.',
      icon: <Smartphone className="w-5 h-5" />,
    },
    {
      id: 'v6',
      title: 'V6 — Inline Edit Cards',
      description: 'Like V5 but with text directly editable in each card. Expand for more settings.',
      icon: <TextCursorInput className="w-5 h-5" />,
    },
    {
      id: 'v7',
      title: 'V7 — Polished Final',
      description: 'Best of V5+V6: inline editing, select mode, segmented scrubber, and refined design.',
      icon: <Star className="w-5 h-5" />,
    },
    {
      id: 'v8',
      title: 'V8 — Filmstrip Timeline',
      description: 'CapCut-style horizontal filmstrip where scene width = duration. Drag to scrub, tap to edit.',
      icon: <Film className="w-5 h-5" />,
    },
    {
      id: 'v9',
      title: 'V9 — Full-Screen Swipe',
      description: 'TikTok-style full-screen preview. Swipe between scenes, overlay tool trays.',
      icon: <Maximize className="w-5 h-5" />,
    },
    {
      id: 'v10',
      title: 'V10 — Storyboard Grid',
      description: 'Canva-style 2-column grid of scene thumbnails. Tap to edit in a half-sheet.',
      icon: <Grid2X2 className="w-5 h-5" />,
    },
    {
      id: 'v11',
      title: 'V11 — Carousel Editor',
      description: 'Mojo-style carousel + always-visible segmented editor panel below.',
      icon: <SlidersHorizontal className="w-5 h-5" />,
    },
  ];

  return (
    <div className="flex flex-col items-center min-h-screen bg-background px-6 py-8 gap-6">
      <div className="text-center">
        <h1 className="text-xl font-bold text-foreground tracking-tight">Sequence</h1>
        <p className="text-sm text-muted-foreground mt-1">Choose a version to explore</p>
      </div>

      <div className="flex flex-col gap-3 w-full max-w-sm">
        {versions.map(v => (
          <button
            key={v.id}
            onClick={() => navigate(`/${v.id}`)}
            className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card hover:bg-muted transition-colors text-left"
          >
            <div className="mt-0.5 text-primary">{v.icon}</div>
            <div>
              <h2 className="text-sm font-semibold text-foreground">{v.title}</h2>
              <p className="text-xs text-muted-foreground mt-0.5">{v.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Index;
