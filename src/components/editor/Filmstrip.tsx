import { useRef, useMemo } from 'react';
import { Scene, GRADIENT_STYLES, TEMPLATE_OPTIONS } from '@/types/scene';
import { Plus, ChevronLeft, ChevronRight, X } from 'lucide-react';
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

  // Compute cumulative start times for time markers
  const sceneStarts = useMemo(() => {
    const starts: number[] = [];
    let t = 0;
    for (const s of scenes) {
      starts.push(t);
      t += s.endTime - s.startTime;
    }
    return starts;
  }, [scenes]);

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

  return (
    <div className="shrink-0">
      {/* Time markers */}
      <div className="relative h-4 mb-0.5">
        <div className="absolute inset-0 overflow-x-auto scrollbar-none flex items-end px-[50%]">
          <div className="flex items-end gap-1" style={{ minWidth: `${totalDuration * SCALE + 48}px` }}>
            {scenes.map((scene, idx) => {
              const dur = scene.endTime - scene.startTime;
              const w = Math.max(dur * SCALE, 48);
              return (
                <div key={`marker-${idx}`} className="shrink-0 relative" style={{ width: `${w}px` }}>
                  <span className="absolute left-1 bottom-0 text-[9px] text-muted-foreground/50 tabular-nums">
                    {Math.round(sceneStarts[idx])}s
                  </span>
                </div>
              );
            })}
            {/* Final time marker */}
            <div className="shrink-0 w-12 relative">
              <span className="absolute left-0 bottom-0 text-[9px] text-muted-foreground/50 tabular-nums">
                {Math.round(totalDuration)}s
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Active scene indicator dot */}
      <div className="relative h-2.5 mb-0.5">
        <div className="absolute inset-0 overflow-x-auto scrollbar-none flex items-center px-[50%]">
          <div className="flex items-center gap-1">
            {scenes.map((scene, idx) => {
              const dur = scene.endTime - scene.startTime;
              const w = Math.max(dur * SCALE, 48);
              const isActive = idx === activeIndex;
              return (
                <div key={`dot-${idx}`} className="shrink-0 flex justify-center" style={{ width: `${w}px` }}>
                  {isActive && <div className="w-2 h-2 rounded-full bg-primary" />}
                </div>
              );
            })}
            <div className="shrink-0 w-12" />
          </div>
        </div>
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
              const templateLabel = TEMPLATE_OPTIONS.find(t => t.value === scene.template)?.label || 'Scene';

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
                  <div className="absolute inset-0 flex flex-col items-center justify-center z-10 gap-0.5">
                    <span className="text-[8px] font-semibold text-foreground/70 tracking-wide">{templateLabel}</span>
                    {scene.text && (
                      <span className="text-[9px] font-semibold text-foreground px-1.5 truncate max-w-full drop-shadow-md">
                        {scene.text.slice(0, 20)}
                      </span>
                    )}
                  </div>
                  <div className="absolute bottom-1 right-1 px-1 py-0.5 rounded bg-background/60 backdrop-blur-sm">
                    <span className="text-[8px] font-semibold text-foreground tabular-nums">{dur.toFixed(1)}s</span>
                  </div>
                  {/* Scene number badge - green */}
                  <div className="absolute top-1 left-1 w-4 h-4 rounded bg-emerald-500/80 flex items-center justify-center">
                    <span className="text-[8px] font-bold text-foreground">{idx + 1}</span>
                  </div>
                  {/* Active scene nav arrows & close */}
                  {isActive && (
                    <>
                      {idx > 0 && (
                        <div className="absolute left-0.5 top-1/2 -translate-y-1/2 z-20"
                          onClick={e => { e.stopPropagation(); onSetActiveIndex(idx - 1); onEditScene(idx - 1); }}>
                          <div className="w-5 h-5 rounded-full bg-primary/80 flex items-center justify-center">
                            <ChevronLeft className="w-3 h-3 text-primary-foreground" />
                          </div>
                        </div>
                      )}
                      {idx < scenes.length - 1 && (
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 z-20"
                          onClick={e => { e.stopPropagation(); onSetActiveIndex(idx + 1); onEditScene(idx + 1); }}>
                          <div className="w-5 h-5 rounded-full bg-primary/80 flex items-center justify-center">
                            <ChevronRight className="w-3 h-3 text-primary-foreground" />
                          </div>
                        </div>
                      )}
                      <div className="absolute top-1 right-1 z-20"
                        onClick={e => { e.stopPropagation(); }}>
                        <div className="w-4 h-4 rounded-full bg-destructive/80 flex items-center justify-center">
                          <X className="w-2.5 h-2.5 text-destructive-foreground" />
                        </div>
                      </div>
                    </>
                  )}
                </button>
              );
            })}
            <button
              onClick={() => { onAddScene(); toast({ title: 'Scene added' }); }}
              className="h-[72px] w-12 rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-1 shrink-0 hover:border-primary/50 hover:bg-primary/5 transition-all"
            >
              <Plus className="w-4 h-4 text-muted-foreground" />
              <span className="text-[8px] text-muted-foreground font-medium">Add</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
