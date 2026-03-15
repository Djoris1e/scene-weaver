import { useState, useCallback } from 'react';
import { useSceneStore } from '@/hooks/useSceneStore';
import ScenePreview from '@/components/ScenePreview';
import SceneStrip from '@/components/SceneStrip';
import EditorPanel from '@/components/EditorPanel';
import PromptInput from '@/components/PromptInput';
import SearchDialog from '@/components/SearchDialog';
import { Progress } from '@/components/ui/progress';
import { Download, Sparkles } from 'lucide-react';
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
  const [showPrompt, setShowPrompt] = useState(false);

  const handleExport = () => {
    setExporting(true);
    setExportProgress(0);
    const interval = setInterval(() => {
      setExportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setExporting(false);
          toast({ title: '✅ Video ready!', description: 'Your video has been exported.' });
          return 0;
        }
        return prev + 4;
      });
    }, 80);
  };

  const handleGenerate = (prompt: string) => {
    toast({ title: '🎬 Generating…', description: `Creating scenes for: "${prompt}"` });
    setShowPrompt(false);
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
        <h1 className="text-sm font-bold tracking-tight text-primary">Sequence</h1>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowPrompt(!showPrompt)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium bg-accent/15 text-accent hover:bg-accent/25 transition-colors"
          >
            <Sparkles className="w-3 h-3" />
            AI
          </button>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-[11px] font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            <Download className="w-3 h-3" />
            Export
          </button>
        </div>
      </header>

      {/* AI Prompt (collapsible) */}
      {showPrompt && (
        <div className="px-3 py-2.5 border-b border-border flex-shrink-0 bg-card">
          <PromptInput onGenerate={handleGenerate} />
        </div>
      )}

      {/* Preview */}
      <div className="flex-1 min-h-0 flex">
        <ScenePreview scene={activeScene} totalDuration={totalDuration} />
      </div>

      {/* Scene strip */}
      <SceneStrip
        scenes={scenes}
        activeIndex={activeIndex}
        onSelect={setActiveIndex}
        onAdd={addScene}
        onDelete={deleteScene}
      />

      {/* Editor panel — single scrollable view */}
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
