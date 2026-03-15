import { Scene, GRADIENT_STYLES } from '@/types/scene';
import { Play, Pause, RotateCcw, Download } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface MobileBottomBarProps {
  scene: Scene;
  playing: boolean;
  currentTime: number;
  totalDuration: number;
  onPlayPause: () => void;
  onReset: () => void;
  onExport: () => void;
  onOpenPreview: () => void;
  exporting: boolean;
  exportProgress: number;
}

export default function MobileBottomBar({
  scene, playing, currentTime, totalDuration,
  onPlayPause, onReset, onExport, onOpenPreview,
  exporting, exportProgress
}: MobileBottomBarProps) {
  const gradientStyle = GRADIENT_STYLES.find(g => g.id === scene.gradient.style) || GRADIENT_STYLES[0];
  const progress = totalDuration > 0 ? (currentTime / totalDuration) * 100 : 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-3 py-2.5 flex items-center gap-2 z-40 lg:hidden">
      {/* Thumbnail */}
      <button onClick={onOpenPreview} className="w-10 h-14 rounded-lg overflow-hidden flex-shrink-0 border border-border">
        {scene.backgroundUrl ? (
          <img src={scene.backgroundUrl} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full" style={{ background: gradientStyle.preview }} />
        )}
      </button>

      {/* Controls */}
      <button onClick={onPlayPause} className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
        {playing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
      </button>
      <button onClick={onReset} className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
        <RotateCcw className="w-3.5 h-3.5" />
      </button>

      {/* Progress */}
      <div className="flex-1 min-w-0 space-y-0.5">
        <Progress value={exporting ? exportProgress : progress} className="h-1 bg-secondary [&>div]:bg-primary rounded-full" />
        <span className="text-[10px] text-muted-foreground tabular-nums">
          {currentTime.toFixed(1)}s / {totalDuration.toFixed(1)}s
        </span>
      </div>

      {/* Export */}
      <button
        onClick={onExport}
        disabled={exporting}
        className="flex items-center gap-1 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold flex-shrink-0 disabled:opacity-50"
      >
        <Download className="w-3.5 h-3.5" />
        Export
      </button>
    </div>
  );
}
