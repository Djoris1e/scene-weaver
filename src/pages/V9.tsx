import { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSceneStore } from '@/hooks/useSceneStore';
import { TEXT_COLOR_PAIRINGS, FONT_OPTIONS, GRADIENT_STYLES, Scene } from '@/types/scene';
import {
  Type, Palette, Zap, Clock, Sparkles, X, ChevronLeft, ChevronRight, Plus,
  AlignVerticalJustifyStart, AlignVerticalJustifyCenter, AlignVerticalJustifyEnd,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

type ToolId = 'text' | 'style' | 'transition' | 'duration' | 'effects';

const TOOLS: { id: ToolId; label: string; icon: React.ReactNode }[] = [
  { id: 'text', label: 'Text', icon: <Type className="w-5 h-5" /> },
  { id: 'style', label: 'Style', icon: <Palette className="w-5 h-5" /> },
  { id: 'transition', label: 'Transition', icon: <Zap className="w-5 h-5" /> },
  { id: 'duration', label: 'Duration', icon: <Clock className="w-5 h-5" /> },
  { id: 'effects', label: 'Effects', icon: <Sparkles className="w-5 h-5" /> },
];

export default function V9() {
  const navigate = useNavigate();
  const {
    scenes, activeIndex, activeScene, totalDuration,
    setActiveIndex, addScene, deleteScene, updateScene,
  } = useSceneStore();

  const [showToolbar, setShowToolbar] = useState(true);
  const [activeTool, setActiveTool] = useState<ToolId | null>(null);
  const touchStartX = useRef(0);
  const touchDelta = useRef(0);

  const color = TEXT_COLOR_PAIRINGS.find(c => c.id === activeScene.textColorId) || TEXT_COLOR_PAIRINGS[0];
  const fontOpt = FONT_OPTIONS.find(f => f.id === activeScene.fontId) || FONT_OPTIONS[0];
  const gradientStyle = GRADIENT_STYLES.find(g => g.id === activeScene.gradient.style) || GRADIENT_STYLES[0];
  const positionClass = { top: 'items-start pt-16', center: 'items-center', bottom: 'items-end pb-24' }[activeScene.textPosition];
  const dur = +(activeScene.endTime - activeScene.startTime).toFixed(1);

  const goNext = () => setActiveIndex(Math.min(activeIndex + 1, scenes.length - 1));
  const goPrev = () => setActiveIndex(Math.max(activeIndex - 1, 0));

  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; touchDelta.current = 0; };
  const handleTouchMove = (e: React.TouchEvent) => { touchDelta.current = e.touches[0].clientX - touchStartX.current; };
  const handleTouchEnd = () => {
    if (Math.abs(touchDelta.current) > 60) {
      touchDelta.current < 0 ? goNext() : goPrev();
    }
    touchDelta.current = 0;
  };

  const handleTap = () => {
    if (activeTool) { setActiveTool(null); return; }
    setShowToolbar(prev => !prev);
  };

  const renderPreviewBg = () => {
    if (activeScene.assetType === 'media' && activeScene.backgroundUrl)
      return <img src={activeScene.backgroundUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />;
    if (activeScene.assetType === 'counter')
      return (
        <div className="absolute inset-0 flex items-center justify-center" style={{ background: gradientStyle.preview }}>
          <div className="text-center">
            <span className="text-6xl font-bold text-primary">{activeScene.counter.number}</span>
            {activeScene.counter.unit && <span className="text-3xl ml-2 text-primary">{activeScene.counter.unit}</span>}
            {activeScene.counter.label && <p className="text-base mt-2 text-foreground/60">{activeScene.counter.label}</p>}
          </div>
        </div>
      );
    return <div className="absolute inset-0" style={{ background: gradientStyle.preview }} />;
  };

  const renderTray = () => {
    if (!activeTool) return null;
    const update = (u: Partial<Scene>) => updateScene(activeIndex, u);

    return (
      <div className="absolute bottom-[88px] left-0 right-0 z-30 bg-background/95 backdrop-blur-xl border-t border-border rounded-t-2xl animate-in slide-in-from-bottom-2 duration-200">
        <div className="px-4 py-3 max-h-[140px] overflow-y-auto scrollbar-none">
          {activeTool === 'text' && (
            <div className="space-y-3">
              <input type="text" value={activeScene.text} onChange={e => update({ text: e.target.value })}
                placeholder="Enter text..." className="w-full bg-secondary rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary/30" />
              <div className="flex gap-1">
                {([
                  { val: 'top' as const, icon: <AlignVerticalJustifyStart className="w-3.5 h-3.5" /> },
                  { val: 'center' as const, icon: <AlignVerticalJustifyCenter className="w-3.5 h-3.5" /> },
                  { val: 'bottom' as const, icon: <AlignVerticalJustifyEnd className="w-3.5 h-3.5" /> },
                ]).map(p => (
                  <button key={p.val} onClick={() => update({ textPosition: p.val })}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all
                      ${activeScene.textPosition === p.val ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                    {p.icon}
                  </button>
                ))}
              </div>
            </div>
          )}
          {activeTool === 'style' && (
            <div className="space-y-3">
              <div className="flex gap-1.5 flex-wrap">
                {TEXT_COLOR_PAIRINGS.map(c => (
                  <button key={c.id} onClick={() => update({ textColorId: c.id })}
                    className={`w-8 h-8 rounded-full shadow-sm transition-all
                      ${activeScene.textColorId === c.id ? 'ring-2 ring-primary ring-offset-2 ring-offset-background scale-110' : ''}`}
                    style={{ background: c.text }} />
                ))}
              </div>
              <div className="flex gap-1 flex-wrap">
                {FONT_OPTIONS.map(f => (
                  <button key={f.id} onClick={() => update({ fontId: f.id })}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all
                      ${activeScene.fontId === f.id ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}
                    style={{ fontFamily: f.family }}>
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          )}
          {activeTool === 'transition' && (
            <div className="flex gap-1.5 flex-wrap">
              {(['default', 'crossfade', 'zoom-in', 'flash', 'slide'] as const).map(tr => (
                <button key={tr} onClick={() => update({ transition: tr })}
                  className={`px-3 py-2 rounded-xl text-xs font-medium capitalize transition-all
                    ${activeScene.transition === tr ? 'bg-accent text-accent-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                  {tr === 'default' ? 'None' : tr.replace('-', ' ')}
                </button>
              ))}
            </div>
          )}
          {activeTool === 'duration' && (
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-foreground tabular-nums w-10">{dur}s</span>
              <input type="range" min={0.5} max={10} step={0.1} value={dur}
                onChange={e => update({ endTime: activeScene.startTime + parseFloat(e.target.value) })}
                className="flex-1 accent-primary h-2 cursor-pointer" />
            </div>
          )}
          {activeTool === 'effects' && (
            <div className="space-y-3">
              <div className="flex gap-1.5 flex-wrap">
                {(['default', 'fade-in', 'typewriter', 'scale-up'] as const).map(te => (
                  <button key={te} onClick={() => update({ textEffect: te })}
                    className={`px-3 py-2 rounded-xl text-xs font-medium capitalize transition-all
                      ${activeScene.textEffect === te ? 'bg-accent text-accent-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                    {te === 'default' ? 'None' : te.replace('-', ' ')}
                  </button>
                ))}
              </div>
              <div className="flex gap-1">
                {(['media', 'gradient', 'counter'] as const).map(t => (
                  <button key={t} onClick={() => update({ assetType: t })}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-medium capitalize transition-all
                      ${activeScene.assetType === t ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                    {t}
                  </button>
                ))}
              </div>
              {activeScene.assetType === 'gradient' && (
                <div className="grid grid-cols-6 gap-1.5">
                  {GRADIENT_STYLES.map(g => (
                    <button key={g.id} onClick={() => update({ gradient: { ...activeScene.gradient, style: g.id } })}
                      className={`aspect-square rounded-lg border-2 transition-all
                        ${activeScene.gradient.style === g.id ? 'border-primary scale-105' : 'border-transparent'}`}
                      style={{ background: g.preview }} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-background">
      {/* Full-screen preview */}
      <div
        className="absolute inset-0"
        onClick={handleTap}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {renderPreviewBg()}
        {activeScene.text && activeScene.assetType !== 'counter' && (
          <div className={`absolute inset-0 flex flex-col ${positionClass} justify-center px-8 z-10`}>
            <p className="text-2xl leading-snug text-center max-w-full break-words font-semibold"
              style={{ color: color.text, textShadow: color.shadow, fontFamily: fontOpt.family }}>
              {activeScene.text}
            </p>
          </div>
        )}
        <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: 'inset 0 0 80px rgba(0,0,0,0.3)' }} />
      </div>

      {/* Scene counter */}
      <div className="absolute top-4 right-4 z-30 px-2.5 py-1 rounded-lg bg-background/40 backdrop-blur-md">
        <span className="text-xs font-bold text-foreground">{activeIndex + 1} / {scenes.length}</span>
      </div>

      {/* Back button */}
      <button onClick={() => navigate('/')} className="absolute top-4 left-4 z-30 px-3 py-1.5 rounded-lg bg-background/40 backdrop-blur-md text-xs font-semibold text-foreground">
        ← Back
      </button>

      {/* Arrow navigation (desktop) */}
      {activeIndex > 0 && (
        <button onClick={goPrev} className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-background/30 backdrop-blur-sm flex items-center justify-center hover:bg-background/50 transition-colors">
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </button>
      )}
      {activeIndex < scenes.length - 1 && (
        <button onClick={goNext} className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-background/30 backdrop-blur-sm flex items-center justify-center hover:bg-background/50 transition-colors">
          <ChevronRight className="w-5 h-5 text-foreground" />
        </button>
      )}

      {/* Dot indicators */}
      <div className="absolute bottom-[100px] left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
        {scenes.map((_, i) => (
          <button key={i} onClick={() => setActiveIndex(i)}
            className={`rounded-full transition-all ${i === activeIndex ? 'w-6 h-2 bg-primary' : 'w-2 h-2 bg-foreground/30'}`} />
        ))}
        <button onClick={() => { addScene(); toast({ title: 'Scene added' }); }}
          className="w-5 h-5 rounded-full border border-dashed border-foreground/30 flex items-center justify-center ml-1 hover:border-primary/50 transition-colors">
          <Plus className="w-3 h-3 text-foreground/40" />
        </button>
      </div>

      {/* Tool tray */}
      {renderTray()}

      {/* Bottom toolbar */}
      {showToolbar && (
        <div className="absolute bottom-0 left-0 right-0 z-20 bg-background/80 backdrop-blur-xl border-t border-border/30 animate-in fade-in duration-200">
          <div className="flex items-center justify-around py-3 px-2">
            {TOOLS.map(tool => (
              <button key={tool.id} onClick={(e) => { e.stopPropagation(); setActiveTool(activeTool === tool.id ? null : tool.id); }}
                className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all
                  ${activeTool === tool.id ? 'text-primary' : 'text-foreground/50 hover:text-foreground/80'}`}>
                {tool.icon}
                <span className="text-[10px] font-medium">{tool.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
