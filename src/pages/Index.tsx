import { useState, useCallback } from 'react';
import { useSceneStore } from '@/hooks/useSceneStore';
import PromptInput from '@/components/PromptInput';
import SceneCard from '@/components/SceneCard';
import BrandKitSection from '@/components/BrandKit';
import EndScreenSettings from '@/components/EndScreenSettings';
import PreviewPanel from '@/components/PreviewPanel';
import SearchDialog from '@/components/SearchDialog';
import MobileBottomBar from '@/components/MobileBottomBar';
import { Plus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { FONT_OPTIONS } from '@/types/scene';

const Index = () => {
  const {
    scenes, activeIndex, activeScene, totalDuration,
    setActiveIndex, addScene, deleteScene, updateScene,
    brandKit, setBrandKit, endScreen, setEndScreen,
  } = useSceneStore();

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchSceneIndex, setSearchSceneIndex] = useState(0);
  const [mobilePreviewOpen, setMobilePreviewOpen] = useState(false);

  // Mobile playback state
  const [mobilePlaying, setMobilePlaying] = useState(false);
  const [mobileTime, setMobileTime] = useState(0);
  const [exporting, setExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const handleGenerate = (prompt: string) => {
    toast({ title: '🎬 Scenes generated!', description: `Created scenes based on: "${prompt}"` });
  };

  const handleOpenSearch = useCallback((index: number) => {
    setSearchSceneIndex(index);
    setSearchOpen(true);
  }, []);

  const handleSearchSelect = (url: string) => {
    updateScene(searchSceneIndex, { backgroundUrl: url, assetType: 'media' });
  };

  const handleExport = () => {
    setExporting(true);
    setExportProgress(0);
    const interval = setInterval(() => {
      setExportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setExporting(false);
          toast({ title: '✅ Video ready!', description: 'Your video has been exported successfully.' });
          return 0;
        }
        return prev + 4;
      });
    }, 80);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/90 backdrop-blur-md border-b border-border px-4 py-3 flex items-center justify-center">
        <h1 className="text-sm font-bold tracking-tight text-accent">VanillaStudio</h1>
      </header>

      <div className="flex flex-col lg:flex-row">
        {/* Sidebar / Main content */}
        <div className="flex-1 lg:max-w-2xl lg:border-r lg:border-border px-4 py-6 space-y-6 pb-24 lg:pb-6 lg:max-h-[calc(100vh-52px)] lg:overflow-y-auto">
          {/* Title */}
          <div>
            <h2 className="text-xl font-bold text-foreground">Make this video yours</h2>
            <p className="text-xs text-muted-foreground mt-1">Describe what your video is about and we'll compose the scenes. Edit each scene to match your brand.</p>
          </div>

          {/* Prompt */}
          <PromptInput onGenerate={handleGenerate} />

          {/* Font picker */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground shrink-0">Font</span>
            <select
              className="flex-1 bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground"
              onChange={(e) => {
                // Apply to all scenes
                scenes.forEach((_, i) => updateScene(i, { fontId: e.target.value }));
              }}
              defaultValue="sans"
            >
              {FONT_OPTIONS.map(f => (
                <option key={f.id} value={f.id} style={{ fontFamily: f.family }}>{f.label}</option>
              ))}
            </select>
          </div>

          {/* Scene list */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
              Scenes ({scenes.length})
            </h3>
            <div className="space-y-3">
              {scenes.map((scene, i) => (
                <SceneCard
                  key={scene.id}
                  scene={scene}
                  index={i}
                  onUpdate={(updates) => updateScene(i, updates)}
                  onDelete={() => deleteScene(i)}
                  onOpenSearch={() => handleOpenSearch(i)}
                  canDelete={scenes.length > 1}
                />
              ))}
            </div>

            {scenes.length < 10 && (
              <button
                onClick={addScene}
                className="w-full mt-3 py-3 rounded-xl border-2 border-dashed border-border text-sm text-muted-foreground flex items-center justify-center gap-2 hover:border-primary/50 hover:text-foreground transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add scene
              </button>
            )}
          </div>

          {/* Brand Kit */}
          <BrandKitSection
            brandKit={brandKit}
            onUpdate={(updates) => setBrandKit(prev => ({ ...prev, ...updates }))}
          />

          {/* End Screen */}
          <EndScreenSettings
            enabled={endScreen.enabled}
            duration={endScreen.duration}
            onUpdate={(updates) => setEndScreen(prev => ({ ...prev, ...updates }))}
          />
        </div>

        {/* Preview Panel - Desktop */}
        <div className="hidden lg:flex lg:flex-1 lg:sticky lg:top-[52px] lg:h-[calc(100vh-52px)] p-8">
          <PreviewPanel
            scenes={scenes}
            activeIndex={activeIndex}
            totalDuration={totalDuration}
            onSelectScene={setActiveIndex}
          />
        </div>
      </div>

      {/* Mobile bottom bar */}
      <MobileBottomBar
        scene={activeScene}
        playing={mobilePlaying}
        currentTime={mobileTime}
        totalDuration={totalDuration}
        onPlayPause={() => setMobilePlaying(!mobilePlaying)}
        onReset={() => { setMobilePlaying(false); setMobileTime(0); }}
        onExport={handleExport}
        onOpenPreview={() => setMobilePreviewOpen(true)}
        exporting={exporting}
        exportProgress={exportProgress}
      />

      {/* Mobile fullscreen preview modal */}
      {mobilePreviewOpen && (
        <div className="fixed inset-0 z-50 bg-background flex flex-col lg:hidden">
          <header className="flex items-center justify-between px-4 py-3 border-b border-border">
            <h2 className="text-sm font-bold">Preview</h2>
            <button onClick={() => setMobilePreviewOpen(false)} className="text-sm text-primary font-medium">Done</button>
          </header>
          <div className="flex-1 p-4">
            <PreviewPanel
              scenes={scenes}
              activeIndex={activeIndex}
              totalDuration={totalDuration}
              onSelectScene={setActiveIndex}
            />
          </div>
        </div>
      )}

      {/* Search dialog */}
      <SearchDialog
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelect={handleSearchSelect}
      />
    </div>
  );
};

export default Index;
