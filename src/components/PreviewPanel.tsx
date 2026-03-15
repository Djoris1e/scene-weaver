import { useState, useEffect, useCallback } from 'react';
import { Scene, TEXT_COLOR_PAIRINGS, FONT_OPTIONS, GRADIENT_STYLES } from '@/types/scene';
import { Play, Pause, RotateCcw, Download, Share2, Pencil } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';

interface PreviewPanelProps {
  scenes: Scene[];
  activeIndex: number;
  totalDuration: number;
  onSelectScene: (index: number) => void;
}

export default function PreviewPanel({ scenes, activeIndex, totalDuration, onSelectScene }: PreviewPanelProps) {
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [exported, setExported] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const activeScene = scenes[activeIndex] || scenes[0];

  // Playback
  useEffect(() => {
    if (!playing) return;
    const interval = setInterval(() => {
      setCurrentTime(prev => {
        const next = prev + 0.1;
        if (next >= totalDuration) {
          setPlaying(false);
          return 0;
        }
        // Find which scene we're in
        let cumulative = 0;
        for (let i = 0; i < scenes.length; i++) {
          cumulative += scenes[i].endTime - scenes[i].startTime;
          if (next < cumulative) {
            if (i !== activeIndex) onSelectScene(i);
            break;
          }
        }
        return next;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [playing, totalDuration, scenes, activeIndex, onSelectScene]);

  const handleReset = useCallback(() => {
    setPlaying(false);
    setCurrentTime(0);
    onSelectScene(0);
  }, [onSelectScene]);

  const handleExport = () => {
    setExporting(true);
    setExportProgress(0);
    const interval = setInterval(() => {
      setExportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setExporting(false);
          setExported(true);
          toast({ title: '✅ Video ready!', description: 'Your video has been exported successfully.' });
          return 100;
        }
        return prev + 4;
      });
    }, 80);
  };

  const color = TEXT_COLOR_PAIRINGS.find(c => c.id === activeScene.textColorId) || TEXT_COLOR_PAIRINGS[0];
  const fontOpt = FONT_OPTIONS.find(f => f.id === activeScene.fontId) || FONT_OPTIONS[0];
  const gradientStyle = GRADIENT_STYLES.find(g => g.id === activeScene.gradient.style) || GRADIENT_STYLES[0];

  const positionClass = {
    top: 'items-start pt-8',
    center: 'items-center',
    bottom: 'items-end pb-8',
  }[activeScene.textPosition];

  const renderBackground = () => {
    if (activeScene.assetType === 'media' && activeScene.backgroundUrl) {
      return <img src={activeScene.backgroundUrl} alt="" className="absolute inset-0 w-full h-full object-cover rounded-2xl" />;
    }
    if (activeScene.assetType === 'counter') {
      return (
        <div className="absolute inset-0 rounded-2xl flex items-center justify-center" style={{ background: gradientStyle.preview }}>
          <div className="text-center">
            <span className="text-5xl font-bold text-primary">{activeScene.counter.number}</span>
            {activeScene.counter.unit && <span className="text-2xl text-primary ml-1">{activeScene.counter.unit}</span>}
            {activeScene.counter.label && <p className="text-sm text-foreground/70 mt-1">{activeScene.counter.label}</p>}
          </div>
        </div>
      );
    }
    return <div className="absolute inset-0 rounded-2xl" style={{ background: gradientStyle.preview }} />;
  };

  const progress = totalDuration > 0 ? (currentTime / totalDuration) * 100 : 0;

  return (
    <div className="flex flex-col items-center gap-4 h-full justify-center">
      {/* Preview canvas */}
      <div className="relative w-full max-w-[280px]" style={{ aspectRatio: '9/16' }}>
        {renderBackground()}

        {/* Text overlay */}
        {activeScene.text && activeScene.assetType !== 'counter' && (
          <div className={`absolute inset-0 flex flex-col ${positionClass} justify-center px-5 z-10`}>
            <p
              className="text-lg leading-snug text-center max-w-full break-words font-semibold"
              style={{ color: color.text, textShadow: color.shadow, fontFamily: fontOpt.family }}
            >
              {activeScene.text}
            </p>
          </div>
        )}

        {/* Vignette */}
        <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{ boxShadow: 'inset 0 0 60px rgba(0,0,0,0.3)' }} />
      </div>

      {/* Playback controls */}
      <div className="w-full max-w-[320px] space-y-2">
        <div className="flex items-center gap-3">
          <button onClick={() => setPlaying(!playing)} className="w-9 h-9 rounded-full bg-card border border-border flex items-center justify-center hover:bg-muted transition-colors">
            {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </button>
          <button onClick={handleReset} className="w-9 h-9 rounded-full bg-card border border-border flex items-center justify-center hover:bg-muted transition-colors">
            <RotateCcw className="w-4 h-4" />
          </button>
          <div className="flex-1" />
          <span className="text-xs text-muted-foreground tabular-nums">
            {currentTime.toFixed(1)}s / {totalDuration.toFixed(1)}s
          </span>
        </div>
        <Progress value={progress} className="h-1.5 bg-secondary [&>div]:bg-primary rounded-full" />
      </div>

      {/* Export */}
      {exporting ? (
        <div className="w-full max-w-[320px]">
          <Progress value={exportProgress} className="h-2 bg-secondary [&>div]:bg-primary rounded-full" />
          <p className="text-xs text-muted-foreground text-center mt-1">Exporting...</p>
        </div>
      ) : exported ? (
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors">
            <Download className="w-4 h-4" />
            Download
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-card border border-border text-sm font-medium hover:bg-muted transition-colors">
            <Share2 className="w-4 h-4" />
            Share
          </button>
          <button
            onClick={() => setExported(false)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-card border border-border text-sm font-medium hover:bg-muted transition-colors"
          >
            <Pencil className="w-4 h-4" />
            Edit
          </button>
        </div>
      ) : (
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-colors w-full max-w-[320px] justify-center"
        >
          <Download className="w-4 h-4" />
          Export MP4
        </button>
      )}
    </div>
  );
}
