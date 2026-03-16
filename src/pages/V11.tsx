import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSceneStore } from '@/hooks/useSceneStore';
import { TEXT_COLOR_PAIRINGS, FONT_OPTIONS, GRADIENT_STYLES, Scene } from '@/types/scene';
import {
  Plus, Share2, Trash2,
  AlignVerticalJustifyStart, AlignVerticalJustifyCenter, AlignVerticalJustifyEnd,
  Type, Palette, Zap,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

type TabId = 'text' | 'style' | 'motion';

export default function V11() {
  const navigate = useNavigate();
  const {
    scenes, activeIndex, activeScene, totalDuration,
    setActiveIndex, addScene, deleteScene, updateScene,
  } = useSceneStore();

  const [activeTab, setActiveTab] = useState<TabId>('text');
  const carouselRef = useRef<HTMLDivElement>(null);

  const color = TEXT_COLOR_PAIRINGS.find(c => c.id === activeScene.textColorId) || TEXT_COLOR_PAIRINGS[0];
  const fontOpt = FONT_OPTIONS.find(f => f.id === activeScene.fontId) || FONT_OPTIONS[0];
  const gradientStyle = GRADIENT_STYLES.find(g => g.id === activeScene.gradient.style) || GRADIENT_STYLES[0];
  const positionClass = { top: 'items-start pt-8', center: 'items-center', bottom: 'items-end pb-8' }[activeScene.textPosition];
  const dur = +(activeScene.endTime - activeScene.startTime).toFixed(1);
  const update = (u: Partial<Scene>) => updateScene(activeIndex, u);

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

  const renderTab = () => {
    if (activeTab === 'text') {
      return (
        <div className="space-y-3">
          <input type="text" value={activeScene.text} onChange={e => update({ text: e.target.value })}
            placeholder="Enter scene text..." className="w-full bg-secondary rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary/30" />
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-muted-foreground/70 uppercase tracking-wider font-semibold w-14 shrink-0 text-right">Position</span>
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
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-muted-foreground/70 uppercase tracking-wider font-semibold w-14 shrink-0 text-right">Font</span>
            <div className="flex gap-1 flex-wrap">
              {FONT_OPTIONS.map(f => (
                <button key={f.id} onClick={() => update({ fontId: f.id })}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all
                    ${activeScene.fontId === f.id ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}
                  style={{ fontFamily: f.family }}>{f.label}</button>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === 'style') {
      return (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-muted-foreground/70 uppercase tracking-wider font-semibold w-14 shrink-0 text-right">Color</span>
            <div className="flex gap-1.5 flex-wrap">
              {TEXT_COLOR_PAIRINGS.map(c => (
                <button key={c.id} onClick={() => update({ textColorId: c.id })}
                  className={`w-7 h-7 rounded-full shadow-sm transition-all
                    ${activeScene.textColorId === c.id ? 'ring-2 ring-primary ring-offset-2 ring-offset-card scale-110' : ''}`}
                  style={{ background: c.text }} />
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-muted-foreground/70 uppercase tracking-wider font-semibold w-14 shrink-0 text-right">BG</span>
            <div className="flex gap-1">
              {(['media', 'gradient', 'counter'] as const).map(t => (
                <button key={t} onClick={() => update({ assetType: t })}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-medium capitalize transition-all
                    ${activeScene.assetType === t ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>{t}</button>
              ))}
            </div>
          </div>
          {activeScene.assetType === 'gradient' && (
            <div className="grid grid-cols-6 gap-1.5 pl-16">
              {GRADIENT_STYLES.map(g => (
                <button key={g.id} onClick={() => update({ gradient: { ...activeScene.gradient, style: g.id } })}
                  className={`aspect-square rounded-lg border-2 transition-all
                    ${activeScene.gradient.style === g.id ? 'border-primary scale-105' : 'border-transparent hover:border-border'}`}
                  style={{ background: g.preview }} />
              ))}
            </div>
          )}
        </div>
      );
    }

    // motion tab
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground/70 uppercase tracking-wider font-semibold w-14 shrink-0 text-right">Trans.</span>
          <div className="flex gap-1 flex-wrap">
            {(['default', 'crossfade', 'zoom-in', 'flash', 'slide'] as const).map(tr => (
              <button key={tr} onClick={() => update({ transition: tr })}
                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium capitalize transition-all
                  ${activeScene.transition === tr ? 'bg-accent text-accent-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                {tr === 'default' ? 'None' : tr.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground/70 uppercase tracking-wider font-semibold w-14 shrink-0 text-right">Text FX</span>
          <div className="flex gap-1 flex-wrap">
            {(['default', 'fade-in', 'typewriter', 'scale-up'] as const).map(te => (
              <button key={te} onClick={() => update({ textEffect: te })}
                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium capitalize transition-all
                  ${activeScene.textEffect === te ? 'bg-accent text-accent-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                {te === 'default' ? 'None' : te.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground/70 uppercase tracking-wider font-semibold w-14 shrink-0 text-right">{dur}s</span>
          <input type="range" min={0.5} max={10} step={0.1} value={dur}
            onChange={e => update({ endTime: activeScene.startTime + parseFloat(e.target.value) })}
            className="flex-1 accent-primary h-1.5 cursor-pointer" />
        </div>
        {scenes.length > 1 && (
          <div className="flex justify-end">
            <button onClick={() => deleteScene(activeIndex)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium text-destructive/70 hover:text-destructive bg-destructive/5 hover:bg-destructive/10 transition-all">
              <Trash2 className="w-3 h-3" /> Remove
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* ─── Header ─── */}
      <div className="flex items-center justify-between px-4 h-11 shrink-0">
        <button onClick={() => navigate('/')} className="text-sm font-semibold text-primary">Done</button>
        <span className="text-[11px] text-muted-foreground tabular-nums">{scenes.length} scenes · {totalDuration.toFixed(1)}s</span>
        <button className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-sm">
          <Share2 className="w-3.5 h-3.5" /> Export
        </button>
      </div>

      {/* ─── Large Preview ─── */}
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
          </div>
        </div>
      </div>

      {/* ─── Carousel ─── */}
      <div className="shrink-0 py-2 border-t border-border/50">
        <div ref={carouselRef} className="flex items-center gap-2 px-4 overflow-x-auto scrollbar-none">
          {scenes.map((scene, idx) => {
            const gStyle = GRADIENT_STYLES.find(g => g.id === scene.gradient.style) || GRADIENT_STYLES[0];
            const isActive = idx === activeIndex;
            return (
              <button
                key={scene.id}
                onClick={() => setActiveIndex(idx)}
                className={`shrink-0 rounded-xl overflow-hidden transition-all relative
                  ${isActive ? 'w-14 h-[100px] ring-2 ring-primary shadow-lg shadow-primary/20' : 'w-11 h-[78px] ring-1 ring-border opacity-60 hover:opacity-90'}`}
              >
                {scene.assetType === 'media' && scene.backgroundUrl ? (
                  <img src={scene.backgroundUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full" style={{ background: gStyle.preview }} />
                )}
                <div className="absolute bottom-0.5 inset-x-0 flex justify-center">
                  <span className="text-[7px] font-bold text-foreground px-1 rounded bg-background/50 backdrop-blur-sm">{idx + 1}</span>
                </div>
              </button>
            );
          })}
          <button
            onClick={() => { addScene(); toast({ title: 'Scene added' }); }}
            className="shrink-0 w-11 h-[78px] rounded-xl border-2 border-dashed border-border flex items-center justify-center hover:border-primary/50 transition-colors"
          >
            <Plus className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* ─── Segmented Tabs + Editor ─── */}
      <div className="shrink-0 bg-card border-t border-border">
        {/* Tab bar */}
        <div className="flex mx-4 mt-2 p-0.5 bg-secondary rounded-xl">
          {([
            { id: 'text' as TabId, label: 'Text', icon: <Type className="w-3.5 h-3.5" /> },
            { id: 'style' as TabId, label: 'Style', icon: <Palette className="w-3.5 h-3.5" /> },
            { id: 'motion' as TabId, label: 'Motion', icon: <Zap className="w-3.5 h-3.5" /> },
          ]).map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-[10px] text-xs font-semibold transition-all
                ${activeTab === tab.id ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground/70'}`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="px-4 py-3 min-h-[120px] max-h-[30vh] overflow-y-auto scrollbar-none">
          {renderTab()}
        </div>
      </div>
    </div>
  );
}
