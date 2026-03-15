import { useState } from 'react';
import { useSceneStore } from '@/hooks/useSceneStore';
import ScenePreview from '@/components/ScenePreview';
import SceneStrip from '@/components/SceneStrip';
import ConsoleDrawer from '@/components/ConsoleDrawer';
import { Progress } from '@/components/ui/progress';
import { Download, Plus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const { scenes, activeIndex, activeScene, setActiveIndex, addScene, deleteScene, updateScene } = useSceneStore();
  const [exporting, setExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

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

  // Empty state
  if (scenes.length === 1 && !scenes[0].text && !scenes[0].backgroundUrl) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        {/* Header */}
        <header className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h1 className="text-sm font-bold tracking-tight text-foreground">Sequence</h1>
          <button
            onClick={handleExport}
            disabled
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary/30 text-primary-foreground/50 text-xs font-medium cursor-not-allowed"
          >
            <Download className="w-3.5 h-3.5" />
            Export
          </button>
        </header>

        <div className="flex-1 flex flex-col items-center justify-center gap-6 px-8">
          {/* Ghost scene previews */}
          <div className="flex gap-3 opacity-20">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-16 h-28 rounded-lg bg-secondary border border-border" />
            ))}
          </div>
          <button
            onClick={() => {
              // Just focus the console to start editing
              setActiveIndex(0);
              // Scroll down to console
              document.getElementById('console')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="w-16 h-16 rounded-2xl border-2 border-dashed border-muted-foreground/40 flex items-center justify-center hover:border-primary hover:bg-primary/5 transition-all"
          >
            <Plus className="w-7 h-7 text-muted-foreground" />
          </button>
          <div className="text-center">
            <p className="text-foreground font-semibold text-lg">Create your first scene</p>
            <p className="text-muted-foreground text-sm mt-1">Tap + to start building your video</p>
          </div>
        </div>

        {/* Console at bottom for first scene editing */}
        <div id="console">
          <SceneStrip
            scenes={scenes}
            activeIndex={activeIndex}
            onSelect={setActiveIndex}
            onAdd={addScene}
            onDelete={deleteScene}
          />
          <ConsoleDrawer
            scene={activeScene}
            onUpdate={(updates) => updateScene(activeIndex, updates)}
          />
        </div>
      </div>
    );
  }

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
        <h1 className="text-sm font-bold tracking-tight text-foreground">Sequence</h1>
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
          onUpdate={(updates) => updateScene(activeIndex, updates)}
        />
      </div>
    </div>
  );
};

export default Index;
