import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSceneStore } from '@/hooks/useSceneStore';
import { TEXT_COLOR_PAIRINGS, FONT_OPTIONS, GRADIENT_STYLES, Scene } from '@/types/scene';
import {
  Play, Pause, Plus, Undo2, Redo2, Share2, Trash2, X,
  AlignVerticalJustifyStart, AlignVerticalJustifyCenter, AlignVerticalJustifyEnd,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const SCALE = 80; // px per second

/* ─── Bottom Sheet Editor ─────────────────────────────────────── */

function SceneEditor({
  scene, index, onUpdate, onDelete, onClose, totalScenes,
}: {
  scene: Scene; index: number;
  onUpdate: (u: Partial<Scene>) => void;
  onDelete: () => void; onClose: () => void; totalScenes: number;
}) {
  const dur = +(scene.endTime - scene.startTime).toFixed(1);

  return (
    <div className="bg-card border-t border-border rounded-t-2xl shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center justify-between px-4 pt-3 pb-2">
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Scene {index + 1}</span>
        <button onClick={onClose} className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center hover:bg-muted transition-colors">
          <X className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
      </div>
      <div className="px-4 pb-4 space-y-3 max-h-[45vh] overflow-y-auto scrollbar-none">
        {/* Text */}
        <input
          type="text" value={scene.text} onChange={e => onUpdate({ text: e.target.value })}
          placeholder="Scene text..." className="w-full bg-secondary rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary/30"
        />

        {/* Position */}
        <Row label="Position">
          <div className="flex gap-1">
            {([
              { val: 'top' as const, icon: <AlignVerticalJustifyStart className="w-3.5 h-3.5" /> },
              { val: 'center' as const, icon: <AlignVerticalJustifyCenter className="w-3.5 h-3.5" /> },
              { val: 'bottom' as const, icon: <AlignVerticalJustifyEnd className="w-3.5 h-3.5" /> },
            ]).map(p => (
              <button key={p.val} onClick={() => onUpdate({ textPosition: p.val })}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all
                  ${scene.textPosition === p.val ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-muted'}`}>
                {p.icon}
              </button>
            ))}
          </div>
        </Row>

        {/* Color */}
        <Row label="Color">
          <div className="flex gap-1.5 flex-wrap">
            {TEXT_COLOR_PAIRINGS.map(c => (
              <button key={c.id} onClick={() => onUpdate({ textColorId: c.id })}
                className={`w-7 h-7 rounded-full shadow-sm transition-all
                  ${scene.textColorId === c.id ? 'ring-2 ring-primary ring-offset-2 ring-offset-card scale-110' : 'hover:scale-105'}`}
                style={{ background: c.text }} title={c.label} />
            ))}
          </div>
        </Row>

        {/* Font */}
        <Row label="Font">
          <div className="flex gap-1 flex-wrap">
            {FONT_OPTIONS.map(f => (
              <button key={f.id} onClick={() => onUpdate({ fontId: f.id })}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all
                  ${scene.fontId === f.id ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-muted'}`}
                style={{ fontFamily: f.family }}>
                {f.label}
              </button>
            ))}
          </div>
        </Row>

        {/* Background */}
        <Row label="Background">
          <div className="flex gap-1">
            {(['media', 'gradient', 'counter'] as const).map(t => (
              <button key={t} onClick={() => onUpdate({ assetType: t })}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-medium capitalize transition-all
                  ${scene.assetType === t ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-muted'}`}>
                {t}
              </button>
            ))}
          </div>
        </Row>

        {/* Gradient picker */}
        {scene.assetType === 'gradient' && (
          <div className="grid grid-cols-6 gap-1.5 pl-16">
            {GRADIENT_STYLES.map(g => (
              <button key={g.id} onClick={() => onUpdate({ gradient: { ...scene.gradient, style: g.id } })}
                className={`aspect-square rounded-lg border-2 transition-all
                  ${scene.gradient.style === g.id ? 'border-primary scale-105' : 'border-transparent hover:border-border'}`}
                style={{ background: g.preview }} title={g.label} />
            ))}
          </div>
        )}

        {/* Transition */}
        <Row label="Transition">
          <div className="flex gap-1 flex-wrap">
            {(['default', 'crossfade', 'zoom-in', 'flash', 'slide'] as const).map(tr => (
              <button key={tr} onClick={() => onUpdate({ transition: tr })}
                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium capitalize transition-all
                  ${scene.transition === tr ? 'bg-accent text-accent-foreground' : 'bg-secondary text-secondary-foreground hover:bg-muted'}`}>
                {tr === 'default' ? 'None' : tr.replace('-', ' ')}
              </button>
            ))}
          </div>
        </Row>

        {/* Duration */}
        <Row label={`${dur}s`}>
          <input type="range" min={0.5} max={10} step={0.1} value={dur}
            onChange={e => onUpdate({ endTime: scene.startTime + parseFloat(e.target.value) })}
            className="flex-1 accent-primary h-1.5 cursor-pointer" />
        </Row>

        {/* Delete */}
        {totalScenes > 1 && (
          <div className="flex justify-end pt-1">
            <button onClick={onDelete}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium text-destructive/70 hover:text-destructive bg-destructive/5 hover:bg-destructive/10 transition-all">
              <Trash2 className="w-3 h-3" /> Remove
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] text-muted-foreground/70 uppercase tracking-wider font-semibold w-16 shrink-0 text-right">{label}</span>
      {children}
    </div>
  );
}

/* ─── Main ────────────────────────────────────────────────────── */

export default function V8() {
  const navigate = useNavigate();
  const {
    scenes, activeIndex, activeScene, totalDuration,
    setActiveIndex, addScene, deleteScene, updateScene,
  } = useSceneStore();

  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [editingScene, setEditingScene] = useState<number | null>(null);
  const filmstripRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const dragStartX = useRef(0);
  const scrollStart = useRef(0);

  const getSceneAtTime = useCallback((time: number) => {
    let cumulative = 0;
    for (let i = 0; i < scenes.length; i++) {
      cumulative += scenes[i].endTime - scenes[i].startTime;
      if (time < cumulative) return i;
    }
    return scenes.length - 1;
  }, [scenes]);

  // Playback
  useEffect(() => {
    if (!playing) return;
    const interval = setInterval(() => {
      setCurrentTime(prev => {
        const next = +(prev + 0.1).toFixed(1);
        if (next >= totalDuration) { setPlaying(false); return 0; }
        const idx = getSceneAtTime(next);
        if (idx !== activeIndex) setActiveIndex(idx);
        return next;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [playing, totalDuration, getSceneAtTime, activeIndex, setActiveIndex]);

  // Keep filmstrip scroll synced with playhead during playback
  useEffect(() => {
    if (!filmstripRef.current || !playing) return;
    const totalWidth = totalDuration * SCALE;
    const containerW = filmstripRef.current.clientWidth;
    const playheadPos = (currentTime / totalDuration) * totalWidth;
    filmstripRef.current.scrollLeft = playheadPos - containerW / 2;
  }, [currentTime, playing, totalDuration]);

  // Drag-to-scrub
  const handleDragStart = (clientX: number) => {
    dragging.current = true;
    dragStartX.current = clientX;
    scrollStart.current = filmstripRef.current?.scrollLeft ?? 0;
  };
  const handleDragMove = (clientX: number) => {
    if (!dragging.current || !filmstripRef.current) return;
    const dx = dragStartX.current - clientX;
    filmstripRef.current.scrollLeft = scrollStart.current + dx;
    // Update time based on scroll position + center
    const containerW = filmstripRef.current.clientWidth;
    const centerScroll = filmstripRef.current.scrollLeft + containerW / 2;
    const totalWidth = totalDuration * SCALE;
    const ratio = Math.max(0, Math.min(1, centerScroll / totalWidth));
    const time = +(ratio * totalDuration).toFixed(1);
    setCurrentTime(time);
    setActiveIndex(getSceneAtTime(time));
  };
  const handleDragEnd = () => { dragging.current = false; };

  const handleSegmentTap = (index: number) => {
    if (!dragging.current) {
      setActiveIndex(index);
      setEditingScene(index);
      // jump time to scene start
      let t = 0;
      for (let i = 0; i < index; i++) t += scenes[i].endTime - scenes[i].startTime;
      setCurrentTime(t);
    }
  };

  const color = TEXT_COLOR_PAIRINGS.find(c => c.id === activeScene.textColorId) || TEXT_COLOR_PAIRINGS[0];
  const fontOpt = FONT_OPTIONS.find(f => f.id === activeScene.fontId) || FONT_OPTIONS[0];
  const gradientStyle = GRADIENT_STYLES.find(g => g.id === activeScene.gradient.style) || GRADIENT_STYLES[0];
  const positionClass = { top: 'items-start pt-8', center: 'items-center', bottom: 'items-end pb-8' }[activeScene.textPosition];
  const formatTime = (t: number) => `${Math.floor(t / 60)}:${Math.floor(t % 60).toString().padStart(2, '0')}`;

  const renderPreviewBg = () => {
    if (activeScene.assetType === 'media' && activeScene.backgroundUrl)
      return <img src={activeScene.backgroundUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />;
    if (activeScene.assetType === 'counter')
      return (
        <div className="absolute inset-0 flex items-center justify-center" style={{ background: gradientStyle.preview }}>
          <div className="text-center">
            <span className="text-5xl font-bold text-primary">{activeScene.counter.number}</span>
            {activeScene.counter.unit && <span className="text-2xl ml-1.5 text-primary">{activeScene.counter.unit}</span>}
            {activeScene.counter.label && <p className="text-sm mt-1.5 text-foreground/60">{activeScene.counter.label}</p>}
          </div>
        </div>
      );
    return <div className="absolute inset-0" style={{ background: gradientStyle.preview }} />;
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* ─── Header ─── */}
      <div className="flex items-center justify-between px-4 h-12 shrink-0">
        <button onClick={() => navigate('/')} className="text-sm font-semibold text-primary">Done</button>
        <div className="flex items-center gap-1">
          <button className="w-9 h-9 flex items-center justify-center rounded-xl text-foreground/30"><Undo2 className="w-[18px] h-[18px]" /></button>
          <button className="w-9 h-9 flex items-center justify-center rounded-xl text-foreground/30"><Redo2 className="w-[18px] h-[18px]" /></button>
        </div>
        <button className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-sm">
          <Share2 className="w-3.5 h-3.5" /> Export
        </button>
      </div>

      {/* ─── 9:16 Preview ─── */}
      <div className="flex-1 min-h-0 relative" style={{ background: 'hsl(var(--stage))' }}>
        <div className="absolute inset-0 flex items-center justify-center px-6 py-3">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl" style={{ aspectRatio: '9/16', height: '100%', width: 'auto' }}>
            {renderPreviewBg()}
            {activeScene.text && activeScene.assetType !== 'counter' && (
              <div className={`absolute inset-0 flex flex-col ${positionClass} justify-center px-5 z-10`}>
                <p className="text-lg leading-snug text-center max-w-full break-words font-semibold"
                  style={{ color: color.text, textShadow: color.shadow, fontFamily: fontOpt.family }}>
                  {activeScene.text}
                </p>
              </div>
            )}
            <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{ boxShadow: 'inset 0 0 50px rgba(0,0,0,0.2)' }} />
            <div className="absolute top-3 left-3 px-2 py-1 rounded-lg bg-background/50 backdrop-blur-md z-20">
              <span className="text-[10px] font-bold text-foreground">{activeIndex + 1} / {scenes.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Playback Controls ─── */}
      <div className="shrink-0 flex items-center justify-center gap-4 py-2">
        <span className="text-[11px] text-muted-foreground tabular-nums w-8">{formatTime(currentTime)}</span>
        <button
          onClick={() => { if (currentTime >= totalDuration) setCurrentTime(0); setPlaying(!playing); }}
          className="w-11 h-11 rounded-2xl bg-card border border-border flex items-center justify-center hover:bg-muted active:scale-95 transition-all shadow-sm"
        >
          {playing ? <Pause className="w-5 h-5 text-foreground" /> : <Play className="w-5 h-5 text-foreground ml-0.5" />}
        </button>
        <span className="text-[11px] text-muted-foreground tabular-nums w-8 text-right">{formatTime(totalDuration)}</span>
      </div>

      {/* ─── Horizontal Filmstrip ─── */}
      <div className="shrink-0 relative h-20 bg-card border-t border-border">
        {/* Playhead — fixed center line */}
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-px w-0.5 bg-primary z-20 pointer-events-none">
          <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-primary shadow-md shadow-primary/40" />
        </div>

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
          <div className="flex items-center gap-1 h-14">
            {scenes.map((scene, idx) => {
              const dur = scene.endTime - scene.startTime;
              const w = Math.max(dur * SCALE, 40);
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
                  {/* Background */}
                  {scene.assetType === 'media' && scene.backgroundUrl ? (
                    <img src={scene.backgroundUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0" style={{ background: gStyle.preview }} />
                  )}
                  {/* Overlay info */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                    {scene.text && (
                      <span className="text-[9px] font-medium text-foreground/90 px-1 truncate max-w-full"
                        style={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
                        {scene.text.slice(0, 20)}
                      </span>
                    )}
                  </div>
                  {/* Duration badge */}
                  <div className="absolute bottom-1 right-1 px-1 py-0.5 rounded bg-background/60 backdrop-blur-sm">
                    <span className="text-[8px] font-semibold text-foreground tabular-nums">{dur.toFixed(1)}s</span>
                  </div>
                  {/* Scene number */}
                  <div className="absolute top-1 left-1 w-4 h-4 rounded bg-background/50 flex items-center justify-center">
                    <span className="text-[8px] font-bold text-foreground">{idx + 1}</span>
                  </div>
                </button>
              );
            })}
            {/* Add scene at end */}
            <button
              onClick={() => { addScene(); toast({ title: 'Scene added' }); }}
              className="h-14 w-12 rounded-xl border-2 border-dashed border-border flex items-center justify-center shrink-0 hover:border-primary/50 hover:bg-primary/5 transition-all"
            >
              <Plus className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>

      {/* ─── Bottom Sheet Editor ─── */}
      {editingScene !== null && scenes[editingScene] && (
        <SceneEditor
          scene={scenes[editingScene]}
          index={editingScene}
          onUpdate={u => updateScene(editingScene, u)}
          onDelete={() => { deleteScene(editingScene); setEditingScene(null); }}
          onClose={() => setEditingScene(null)}
          totalScenes={scenes.length}
        />
      )}

      {/* ─── Bottom info bar (when no editor) ─── */}
      {editingScene === null && (
        <div className="shrink-0 flex items-center justify-between px-4 py-3 border-t border-border/50">
          <span className="text-[11px] text-muted-foreground">{scenes.length} scene{scenes.length !== 1 ? 's' : ''} · {totalDuration.toFixed(1)}s</span>
          <span className="text-[10px] text-muted-foreground/50">Tap a clip to edit</span>
        </div>
      )}
    </div>
  );
}
