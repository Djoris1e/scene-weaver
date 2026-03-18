import { Play, Pause } from 'lucide-react';

interface PlaybackControlsProps {
  currentTime: number;
  totalDuration: number;
  playing: boolean;
  onSetCurrentTime: (t: number) => void;
  onSetPlaying: (p: boolean) => void;
}

export default function PlaybackControls({
  currentTime, totalDuration, playing, onSetCurrentTime, onSetPlaying,
}: PlaybackControlsProps) {
  const formatTime = (t: number) => `${Math.floor(t / 60)}:${Math.floor(t % 60).toString().padStart(2, '0')}`;

  return (
    <div className="flex items-center justify-center gap-4 py-2">
      <span className="text-[11px] text-muted-foreground tabular-nums w-8 text-right">
        {formatTime(currentTime)}
      </span>
      <button
        onClick={() => { if (currentTime >= totalDuration) onSetCurrentTime(0); onSetPlaying(!playing); }}
        className="w-10 h-10 rounded-full bg-primary flex items-center justify-center hover:bg-primary/90 active:scale-95 transition-all shadow-lg shadow-primary/30"
      >
        {playing
          ? <Pause className="w-4 h-4 text-primary-foreground" />
          : <Play className="w-4 h-4 text-primary-foreground ml-0.5" />
        }
      </button>
      <span className="text-[11px] text-muted-foreground tabular-nums w-8">
        {formatTime(totalDuration)}
      </span>
    </div>
  );
}
