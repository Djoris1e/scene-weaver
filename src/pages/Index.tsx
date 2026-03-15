import { useState, useCallback } from 'react';
import { useSceneStore } from '@/hooks/useSceneStore';
import ScenePreview from '@/components/ScenePreview';
import SceneStrip from '@/components/SceneStrip';
import ConsoleDrawer from '@/components/ConsoleDrawer';
import PromptInput from '@/components/PromptInput';
import SearchDialog from '@/components/SearchDialog';
import { Progress } from '@/components/ui/progress';
import { Download } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const {
    scenes, activeIndex, activeScene, totalDuration,
    setActiveIndex, addScene, deleteScene, updateScene,
    brandKit, setBrandKit, endScreen, setEndScreen,
  } = useSceneStore();

  const [exporting, setExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);

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

  const handleGenerate = (prompt: string) => {
    toast({ title: '🎬 Scenes generated!', description: `Created scenes based on: "${prompt}"` });
  };

  const handleOpenSearch = useCallback(() => {
    setSearchOpen(true);
  }, []);

  const handleSearchSelect = (url: string) => {
    updateScene(activeIndex, { backgroundUrl: url, assetType: 'media' });
  };

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* Export progress */}
      {exporting && (
        <div className="absolute top-0 left-0 right-0 z-50">
          <Progress value={exportProgress} className="h-1 rounded-none bg-secondary [&>div]:bg-primary" />
        </div>
      )}

      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-border flex-shrink-0">
        <h1 className="text-sm font-bold tracking-tight text-accent">VanillaStudio</h1>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground">{scenes.length} scene{scenes.length !== 1 ? 's' : ''}</span>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            Export
          </button>
        </div>
      </header>

      {/* Prompt input */}
      <div className="px-4 py-3 border-b border-border flex-shrink-0">
        <PromptInput onGenerate={handleGenerate} />
      </div>

      {/* Stage - scene preview */}
      <div className="flex-1 min-h-0">
        <ScenePreview scene={activeScene} />
      </div>

      {/* Scene strip */}
      <SceneStrip
        scenes={scenes}
        activeIndex={activeIndex}
        onSelect={setActiveIndex}
        onAdd={addScene}
        onDelete={deleteScene}
      />

      {/* Console drawer */}
      <div className="flex-shrink-0 max-h-[40vh] overflow-hidden flex flex-col">
        <ConsoleDrawer
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
