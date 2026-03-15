import { useState, useCallback, useRef } from 'react';
import { useSceneStore } from '@/hooks/useSceneStore';
import ScenePreview from '@/components/ScenePreview';
import EditorPanel from '@/components/EditorPanel';
import SearchDialog from '@/components/SearchDialog';
import { Progress } from '@/components/ui/progress';
import { Download, Sparkles, ChevronLeft, ChevronRight, Plus, Trash2 } from 'lucide-react';
import PromptInput from '@/components/PromptInput';
import { toast } from '@/hooks/use-toast';

/**
 * V3 — Swipeable Carousel Navigation
 * Full-width scene cards you swipe/arrow through, with dot indicators.
 * Tap a scene to edit inline below the carousel.
 */
const V3 = () => {
  const {
    scenes, activeIndex, activeScene, totalDuration,
    setActiveIndex, addScene, deleteScene, updateScene,
    brandKit, setBrandKit, endScreen, setEndScreen,
  } = useSceneStore();

  const [exporting, setExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const touchStartX = useRef(0);
  const touchDeltaX = useRef(0);

  const handleExport = () => {
    setExporting(true);
    setExportProgress(0);
    const interval = setInterval(() => {
      setExportProgress(prev => {
        if (prev >= 100) { clearInterval(interval); setExporting(false); toast({ title: '✅ Video ready!' }); return 0; }
        return prev + 4;
      });
    }, 80);
  };

  const handleGenerate = (prompt: string) => {
    toast({ title: '🎬 Generating…', description: `"${prompt}"` });
    setShowPrompt(false);
  };

  const goPrev = () => setActiveIndex(Math.max(0, activeIndex - 1));
  const goNext = () => setActiveIndex(Math.min(scenes.length - 1, activeIndex + 1));

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  };
  const handleTouchEnd = () => {
    if (touchDeltaX.current > 50) goPrev();
    else if (touchDeltaX.current < -50) goNext();
  };

  const handleOpenSearch = useCallback(() => setSearchOpen(true), []);
  const handleSearchSelect = (url: string) => {
    updateScene(activeIndex, { backgroundUrl: url, assetType: 'media' });
  };

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {exporting && (
        <div className="absolute top-0 left-0 right-0 z-50">
          <Progress value={exportProgress} className="h-1 rounded-none bg-secondary [&>div]:bg-primary" />
        </div>
      )}

      {/* Header */}
      <header className="flex items-center justify-between px-4 h-11 border-b border-border flex-shrink-0">
        <h1 className="text-sm font-bold tracking-tight text-primary">Sequence · V3</h1>
        <div className="flex items-center gap-1.5">
          <button onClick={() => setShowPrompt(!showPrompt)} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium bg-accent/15 text-accent hover:bg-accent/25 transition-colors">
            <Sparkles className="w-3 h-3" /> AI
          </button>
          <button onClick={handleExport} disabled={exporting} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-[11px] font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50">
            <Download className="w-3 h-3" /> Export
          </button>
        </div>
      </header>

      {showPrompt && (
        <div className="px-3 py-2.5 border-b border-border flex-shrink-0 bg-card">
          <PromptInput onGenerate={handleGenerate} />
        </div>
      )}

      {/* Carousel area */}
      <div
        className="flex-shrink-0 relative"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Scene preview */}
        <ScenePreview scene={activeScene} totalDuration={totalDuration} />

        {/* Left/Right arrows */}
        {activeIndex > 0 && (
          <button
            onClick={goPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/60 backdrop-blur-sm flex items-center justify-center hover:bg-background/80 transition-colors z-20"
          >
            <ChevronLeft className="w-4 h-4 text-foreground" />
          </button>
        )}
        {activeIndex < scenes.length - 1 && (
          <button
            onClick={goNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/60 backdrop-blur-sm flex items-center justify-center hover:bg-background/80 transition-colors z-20"
          >
            <ChevronRight className="w-4 h-4 text-foreground" />
          </button>
        )}
      </div>

      {/* Dot indicators + actions */}
      <div className="flex items-center justify-center gap-3 py-2 border-b border-border flex-shrink-0 bg-card">
        <button
          onClick={() => { if (scenes.length > 1) deleteScene(activeIndex); }}
          disabled={scenes.length <= 1}
          className="p-1.5 rounded-md hover:bg-destructive/15 text-muted-foreground hover:text-destructive transition-colors disabled:opacity-30"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>

        <div className="flex items-center gap-1.5">
          {scenes.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`rounded-full transition-all ${
                i === activeIndex
                  ? 'w-6 h-2 bg-primary'
                  : 'w-2 h-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
              }`}
            />
          ))}
        </div>

        <button
          onClick={addScene}
          disabled={scenes.length >= 10}
          className="p-1.5 rounded-md hover:bg-primary/15 text-muted-foreground hover:text-primary transition-colors disabled:opacity-30"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Editor — scrollable */}
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-none">
        <EditorPanel
          scene={activeScene}
          sceneIndex={activeIndex}
          onUpdate={(updates) => updateScene(activeIndex, updates)}
          onOpenSearch={handleOpenSearch}
          brandKit={brandKit}
          onBrandKitUpdate={(updates) => setBrandKit(prev => ({ ...prev, ...updates }))}
          endScreen={endScreen}
          onEndScreenUpdate={(updates) => setEndScreen(prev => ({ ...prev, ...updates }))}
        />
      </div>

      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} onSelect={handleSearchSelect} />
    </div>
  );
};

export default V3;
