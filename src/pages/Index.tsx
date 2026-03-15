import { useNavigate } from 'react-router-dom';
import { Layout, Layers, GalleryHorizontalEnd, List, Smartphone } from 'lucide-react';

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
  ];

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background px-6 gap-6">
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
