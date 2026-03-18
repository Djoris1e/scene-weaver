import { useRef, useCallback } from 'react';
import { Scene, GRADIENT_STYLES, TEMPLATE_OPTIONS } from '@/types/scene';
import { Plus, Play, Pause, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const SCALE = 80;

interface FilmstripProps {
  scenes: Scene[];
  activeIndex: number;
  currentTime: number;
  totalDuration: number;
  playing: boolean;
  onSetActiveIndex: (i: number) => void;
  onSetCurrentTime: (t: number) => void;
  onSetPlaying: (p: boolean) => void;
  onAddScene: () => void;
  onEditScene: (i: number) => void;
  getSceneAtTime: (t: number) => number;
}

export default function Filmstrip({
  scenes, activeIndex, currentTime, totalDuration, playing,
  onSetActiveIndex, onSetCurrentTime, onSetPlaying, onAddScene, onEditScene, getSceneAtTime,
}: FilmstripProps) {
  const filmstripRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const didDrag = useRef(false);
  const dragStartX = useRef(0);
  const scrollStart = useRef(0);

  const handleDragStart = (clientX: number) => {
    dragging.current = true;
    didDrag.current = false;
    dragStartX.current = clientX;
    scrollStart.current = filmstripRef.current?.scrollLeft ?? 0;
  };

  const handleDragMove = (clientX: number) => {
    if (!dragging.current || !filmstripRef.current) return;
    const dx = dragStartX.current - clientX;
    if (Math.abs(dx) > 5) didDrag.current = true;
    filmstripRef.current.scrollLeft = scrollStart.current + dx;
    if (didDrag.current) {
      const containerW = filmstripRef.current.clientWidth;
      const centerScroll = filmstripRef.current.scrollLeft + containerW / 2;
      const totalWidth = totalDuration * SCALE;
      const ratio = Math.max(0, Math.min(1, centerScroll / totalWidth));
      const time = +(ratio * totalDuration).toFixed(1);
      onSetCurrentTime(time);
      onSetActiveIndex(getSceneAtTime(time));
    }
  };

  const handleDragEnd = () => { dragging.current = false; };

  const handleSegmentTap = (index: number) => {
    if (!didDrag.current) {
      onSetActiveIndex(index);
      onEditScene(index);
      let t = 0;
      for (let i = 0; i < index; i++) t += scenes[i].endTime - scenes[i].startTime;
      onSetCurrentTime(t);
    }
  };

  const formatTime = (t: number) => `${Math.floor(t / 60)}:${Math.floor(t % 60).toString().padStart(2, '0')}`;

  return (
    <div className="shrink-0 bg-card rounded-xl border border-border/40">
      {/* Playback row */}
      <div className="flex items-center gap-2 px-3 py-1.5">
        <button
          onClick={() => { if (currentTime >= totalDuration) onSetCurrentTime(0); onSetPlaying(!playing); }}
          className="w-8 h-8 rounded-xl bg-secondary flex items-center justify-center hover:bg-muted active:scale-95 transition-all shrink-0"
        >
          {playing ? <Pause className="w-3.5 h-3.5 text-foreground" /> : <Play className="w-3.5 h-3.5 text-foreground ml-0.5" />}
        </button>
        <div className="flex-1 relative h-1.5 bg-secondary rounded-full cursor-pointer"
          onClick={e => {
            const rect = e.currentTarget.getBoundingClientRect();
            const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
            const time = +(ratio * totalDuration).toFixed(1);
            onSetCurrentTime(time);
            onSetActiveIndex(getSceneAtTime(time));
          }}>
          <div className="absolute inset-y-0 left-0 bg-primary rounded-full transition-all duration-100"
            style={{ width: `${totalDuration > 0 ? (currentTime / totalDuration) * 100 : 0}%` }} />
        </div>
        <span className="text-[10px] text-muted-foreground tabular-nums shrink-0">
          {formatTime(currentTime)} / {formatTime(totalDuration)}
        </span>
      </div>

      {/* Filmstrip segments */}
      <div className="relative h-[72px]">
        <div
          ref={filmstripRef}
          className="h-full overflow-x-auto scrollbar-none flex items-center px-[50%]"
          onMouseDown={e => handleDragStart(e.clientX)}
          onMouseMove={e => handleDragMove(e.clientX)}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          onTouchStart={e => handleDragStart(e.touches[0].clientX)}
          onTouchMove={e => handleDragMove(e.touches[0].clientX)}
          onTouchEnd={handleDragEnd}
        >
          <div className="flex items-center gap-1 h-[72px]">
            {scenes.map((scene, idx) => {
              const dur = scene.endTime - scene.startTime;
              const w = Math.max(dur * SCALE, 48);
              const gStyle = GRADIENT_STYLES.find(g => g.id === scene.gradient.style) || GRADIENT_STYLES[0];
              const isActive = idx === activeIndex;

              return (
                <button
                  key={scene.id}
                  onClick={() => handleSegmentTap(idx)}
                  className={`h-full rounded-xl overflow-hidden shrink-0 relative transition-all border-2
                    ${isActive ? 'border-primary shadow-lg shadow-primary/20' : 'border-transparent hover:border-border'}`}
                  style={{ width: `${w}px` }}
                >
                  {scene.assetType === 'media' && scene.backgroundUrl ? (
                    <img src={scene.backgroundUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0" style={{ background: gStyle.preview }} />
                  )}
                  <div className="absolute inset-0 bg-background/30" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                    {scene.text && (
                      <span className="text-[9px] font-semibold text-foreground px-1.5 truncate max-w-full drop-shadow-md">
                        {scene.text.slice(0, 20)}
                      </span>
                    )}
                  </div>
                  <div className="absolute bottom-1 right-1 px-1 py-0.5 rounded bg-background/60 backdrop-blur-sm">
                    <span className="text-[8px] font-semibold text-foreground tabular-nums">{dur.toFixed(1)}s</span>
                  </div>
                  <div className="absolute top-1 left-1 w-4 h-4 rounded bg-background/50 flex items-center justify-center">
                    <span className="text-[8px] font-bold text-foreground">{idx + 1}</span>
                  </div>
                </button>
              );
            })}
            <button
              onClick={() => { onAddScene(); toast({ title: 'Scene added' }); }}
              className="h-[72px] w-12 rounded-xl border-2 border-dashed border-border flex items-center justify-center shrink-0 hover:border-primary/50 hover:bg-primary/5 transition-all"
            >
              <Plus className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
