import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSceneStore } from '@/hooks/useSceneStore';
import { TEXT_COLOR_PAIRINGS, FONT_OPTIONS, GRADIENT_STYLES, Scene } from '@/types/scene';
import {
  Play, Pause, Plus, Undo2, Redo2, Film, Share2, Maximize2,
  Trash2, Clock, ChevronDown, ChevronUp, Image
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function V6() {
  const navigate = useNavigate();
  const {
    scenes, activeIndex, activeScene, totalDuration,
    setActiveIndex, addScene, deleteScene, updateScene,
  } = useSceneStore();

  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [expandedScene, setExpandedScene] = useState<number | null>(null);
  const [scrubbing, setScrubbing] = useState(false);
  const scrubRef = useRef<HTMLDivElement>(null);

  const getSceneAtTime = useCallback((time: number) => {
    let cumulative = 0;
    for (let i = 0; i < scenes.length; i++) {
      cumulative += scenes[i].endTime - scenes[i].startTime;
      if (time < cumulative) return i;
    }
    return scenes.length - 1;
  }, [scenes]);

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

  const handleScrub = useCallback((clientX: number) => {
    if (!scrubRef.current) return;
    const rect = scrubRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const time = +(ratio * totalDuration).toFixed(1);
    setCurrentTime(time);
    setActiveIndex(getSceneAtTime(time));
  }, [totalDuration, getSceneAtTime, setActiveIndex]);

  const formatTime = (t: number) => `${Math.floor(t / 60)}:${Math.floor(t % 60).toString().padStart(2, '0')}`;

  const color = TEXT_COLOR_PAIRINGS.find(c => c.id === activeScene.textColorId) || TEXT_COLOR_PAIRINGS[0];
  const fontOpt = FONT_OPTIONS.find(f => f.id === activeScene.fontId) || FONT_OPTIONS[0];
  const gradientStyle = GRADIENT_STYLES.find(g => g.id === activeScene.gradient.style) || GRADIENT_STYLES[0];

  const positionClass = {
    top: 'items-start pt-10',
    center: 'items-center',
    bottom: 'items-end pb-10',
  }[activeScene.textPosition];

  const renderPreviewBg = () => {
    if (activeScene.assetType === 'media' && activeScene.backgroundUrl)
      return <img src={activeScene.backgroundUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />;
    if (activeScene.assetType === 'counter')
      return (
        <div className="absolute inset-0 flex items-center justify-center" style={{ background: gradientStyle.preview }}>
          <span className="text-6xl font-bold text-primary">{activeScene.counter.number}</span>
          {activeScene.counter.unit && <span className="text-3xl ml-2 text-primary">{activeScene.counter.unit}</span>}
        </div>
      );
    return <div className="absolute inset-0" style={{ background: gradientStyle.preview }} />;
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 shrink-0">
        <button onClick={() => navigate('/')} className="text-sm font-medium text-primary">Done</button>
        <div className="flex items-center gap-4">
          <Undo2 className="w-5 h-5 text-foreground/40" />
          <Redo2 className="w-5 h-5 text-foreground/40" />
        </div>
        <div className="flex items-center gap-3">
          <Film className="w-5 h-5 text-foreground/60" />
          <Share2 className="w-5 h-5 text-foreground/60" />
        </div>
      </div>

      {/* Preview */}
      <div className="flex-1 min-h-0 relative bg-stage">
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div className="relative w-full h-full max-w-[340px] rounded-lg overflow-hidden" style={{ aspectRatio: '9/16', maxHeight: '100%' }}>
            {renderPreviewBg()}
            {activeScene.text && activeScene.assetType !== 'counter' && (
              <div className={`absolute inset-0 flex flex-col ${positionClass} justify-center px-6 z-10`}>
                <p className="text-xl leading-snug text-center max-w-full break-words font-semibold"
                  style={{ color: color.text, textShadow: color.shadow, fontFamily: fontOpt.family }}>
                  {activeScene.text}
                </p>
              </div>
            )}
            <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: 'inset 0 0 60px rgba(0,0,0,0.25)' }} />
          </div>
        </div>
      </div>

      {/* Scrubber */}
      <div className="shrink-0 px-4 pt-2 pb-1">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-xs text-muted-foreground tabular-nums w-8">{formatTime(currentTime)}</span>
          <div ref={scrubRef} className="flex-1 h-6 flex items-center cursor-pointer"
            onMouseDown={e => { setScrubbing(true); handleScrub(e.clientX); }}
            onMouseMove={e => scrubbing && handleScrub(e.clientX)}
            onMouseUp={() => setScrubbing(false)}
            onMouseLeave={() => setScrubbing(false)}
            onTouchStart={e => { setScrubbing(true); handleScrub(e.touches[0].clientX); }}
            onTouchMove={e => scrubbing && handleScrub(e.touches[0].clientX)}
            onTouchEnd={() => setScrubbing(false)}>
            <div className="relative w-full h-1 bg-secondary rounded-full">
              <div className="absolute h-full bg-foreground/50 rounded-full" style={{ width: `${totalDuration > 0 ? (currentTime / totalDuration) * 100 : 0}%` }} />
              <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-foreground shadow-md"
                style={{ left: `calc(${totalDuration > 0 ? (currentTime / totalDuration) * 100 : 0}% - 6px)` }} />
            </div>
          </div>
          <span className="text-xs text-muted-foreground tabular-nums w-8 text-right">{formatTime(totalDuration)}</span>
        </div>
        <div className="flex items-center justify-between">
          <button onClick={() => setPlaying(!playing)} className="w-10 h-10 flex items-center justify-center text-foreground">
            {playing ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
          </button>
          <Maximize2 className="w-5 h-5 text-foreground/50" />
        </div>
      </div>

      {/* Scene list with inline editable text */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 pb-2 scrollbar-none">
        <div className="flex flex-col gap-2">
          {scenes.map((scene, idx) => {
            const gStyle = GRADIENT_STYLES.find(g => g.id === scene.gradient.style) || GRADIENT_STYLES[0];
            const isActive = idx === activeIndex;
            const isExpanded = expandedScene === idx;
            const dur = +(scene.endTime - scene.startTime).toFixed(1);

            return (
              <div
                key={scene.id}
                className={`rounded-xl transition-all ${isActive ? 'bg-card ring-1 ring-primary/40' : 'bg-card/60'}`}
              >
                {/* Main row */}
                <div
                  className="flex items-center gap-3 p-2 cursor-pointer"
                  onClick={() => setActiveIndex(idx)}
                >
                  {/* Thumbnail */}
                  <div className="w-20 h-14 rounded-lg overflow-hidden shrink-0 relative">
                    {scene.assetType === 'media' && scene.backgroundUrl ? (
                      <img src={scene.backgroundUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full" style={{ background: gStyle.preview }} />
                    )}
                  </div>

                  {/* Editable text */}
                  <div className="flex-1 min-w-0">
                    <input
                      type="text"
                      value={scene.text}
                      onChange={e => updateScene(idx, { text: e.target.value })}
                      onClick={e => e.stopPropagation()}
                      placeholder="Add text..."
                      className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none border-b border-transparent focus:border-primary/30 pb-0.5 transition-colors"
                    />
                    <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span className="text-[11px]">{dur}s</span>
                      <span className="text-[11px] capitalize">· {scene.assetType}</span>
                    </div>
                  </div>

                  {/* Expand toggle */}
                  <button
                    onClick={e => { e.stopPropagation(); setExpandedScene(isExpanded ? null : idx); }}
                    className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-secondary transition-colors shrink-0"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                  </button>
                </div>

                {/* Expanded settings */}
                {isExpanded && (
                  <div className="px-3 pb-3 space-y-3 border-t border-border/50 pt-3 mt-1">
                    {/* Text position */}
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-muted-foreground uppercase w-16 shrink-0">Position</span>
                      <div className="flex gap-1">
                        {(['top', 'center', 'bottom'] as const).map(pos => (
                          <button key={pos} onClick={() => updateScene(idx, { textPosition: pos })}
                            className={`px-2.5 py-1 rounded-md text-[11px] font-medium capitalize transition-colors
                              ${scene.textPosition === pos ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                            {pos}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Text color */}
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-muted-foreground uppercase w-16 shrink-0">Color</span>
                      <div className="flex gap-1.5 flex-wrap">
                        {TEXT_COLOR_PAIRINGS.map(c => (
                          <button key={c.id} onClick={() => updateScene(idx, { textColorId: c.id })}
                            className={`w-6 h-6 rounded-full border-2 transition-all ${scene.textColorId === c.id ? 'border-primary scale-110' : 'border-transparent'}`}
                            style={{ background: c.text }} title={c.label} />
                        ))}
                      </div>
                    </div>

                    {/* Font */}
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-muted-foreground uppercase w-16 shrink-0">Font</span>
                      <div className="flex gap-1 flex-wrap">
                        {FONT_OPTIONS.map(f => (
                          <button key={f.id} onClick={() => updateScene(idx, { fontId: f.id })}
                            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors
                              ${scene.fontId === f.id ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}
                            style={{ fontFamily: f.family }}>
                            {f.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Asset type */}
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-muted-foreground uppercase w-16 shrink-0">Asset</span>
                      <div className="flex gap-1">
                        {(['media', 'gradient', 'counter'] as const).map(t => (
                          <button key={t} onClick={() => updateScene(idx, { assetType: t })}
                            className={`px-2.5 py-1 rounded-md text-[11px] font-medium capitalize transition-colors
                              ${scene.assetType === t ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Gradient picker */}
                    {scene.assetType === 'gradient' && (
                      <div className="grid grid-cols-6 gap-1.5 ml-[72px]">
                        {GRADIENT_STYLES.map(g => (
                          <button key={g.id} onClick={() => updateScene(idx, { gradient: { ...scene.gradient, style: g.id } })}
                            className={`w-9 h-9 rounded-lg border-2 transition-all ${scene.gradient.style === g.id ? 'border-primary' : 'border-transparent'}`}
                            style={{ background: g.preview }} title={g.label} />
                        ))}
                      </div>
                    )}

                    {/* Transition */}
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-muted-foreground uppercase w-16 shrink-0">Trans.</span>
                      <div className="flex gap-1 flex-wrap">
                        {(['crossfade', 'zoom-in', 'flash', 'slide'] as const).map(tr => (
                          <button key={tr} onClick={() => updateScene(idx, { transition: tr })}
                            className={`px-2 py-1 rounded-md text-[11px] font-medium capitalize transition-colors
                              ${scene.transition === tr ? 'bg-accent text-accent-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                            {tr.replace('-', ' ')}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Duration */}
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-muted-foreground uppercase w-16 shrink-0">{dur}s</span>
                      <input type="range" min={0.5} max={10} step={0.1} value={dur}
                        onChange={e => updateScene(idx, { endTime: scene.startTime + parseFloat(e.target.value) })}
                        className="flex-1 accent-primary h-1" />
                    </div>

                    {/* Delete */}
                    <div className="flex justify-end">
                      <button onClick={() => { deleteScene(idx); setExpandedScene(null); }}
                        disabled={scenes.length <= 1}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium text-destructive bg-secondary hover:bg-destructive/10 disabled:opacity-40 transition-colors">
                        <Trash2 className="w-3 h-3" /> Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="shrink-0 flex items-center justify-between px-4 py-3 border-t border-border">
        <button onClick={() => { addScene(); toast({ title: 'Scene added' }); }}
          className="flex items-center gap-1.5 text-sm font-medium text-foreground">
          <Plus className="w-4 h-4" /> Add
        </button>
        <span className="text-xs text-muted-foreground">{scenes.length} scene{scenes.length !== 1 ? 's' : ''}</span>
      </div>
    </div>
  );
}
