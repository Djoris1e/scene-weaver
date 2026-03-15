import { useState, useCallback, useRef, useEffect } from 'react';
import { useSceneStore } from '@/hooks/useSceneStore';
import { Scene, GRADIENT_STYLES, TextEffect, TransitionType, AnimationType, OverlayType, TEXT_COLOR_PAIRINGS, FONT_OPTIONS } from '@/types/scene';
import ScenePreview from '@/components/ScenePreview';
import SearchDialog from '@/components/SearchDialog';
import PromptInput from '@/components/PromptInput';
import BrandKitSection from '@/components/BrandKit';
import EndScreenSettings from '@/components/EndScreenSettings';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import {
  Download, Sparkles, Plus, Trash2, Play, Pause, RotateCcw,
  ChevronDown, Search, Upload, Palette, Code, GripVertical
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

/**
 * V4 — Vertical Timeline Navigation
 * All scenes visible in a vertical scrollable timeline.
 * Each scene is a row: mini preview + summary. Tap to expand inline editor.
 */

function TimelineScene({
  scene, index, isActive, isLast, total,
  onSelect, onUpdate, onDelete, onOpenSearch,
}: {
  scene: Scene; index: number; isActive: boolean; isLast: boolean; total: number;
  onSelect: () => void;
  onUpdate: (updates: Partial<Scene>) => void;
  onDelete: () => void;
  onOpenSearch: () => void;
}) {
  const grad = GRADIENT_STYLES.find(g => g.id === scene.gradient.style) || GRADIENT_STYLES[0];
  const activeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isActive && activeRef.current) {
      activeRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [isActive]);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onUpdate({ backgroundUrl: URL.createObjectURL(file), assetType: 'media' });
  };

  const renderMiniPreview = () => {
    const bg = scene.assetType === 'media' && scene.backgroundUrl
      ? undefined
      : grad.preview;

    return (
      <div
        className="w-11 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-border relative"
        style={{ background: bg }}
      >
        {scene.assetType === 'media' && scene.backgroundUrl && (
          <img src={scene.backgroundUrl} alt="" className="w-full h-full object-cover" />
        )}
        {scene.assetType === 'counter' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[10px] font-bold text-primary">{scene.counter.number}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div ref={activeRef} className="relative">
      {/* Timeline connector line */}
      {!isLast && (
        <div className="absolute left-[1.625rem] top-16 bottom-0 w-px bg-border z-0" />
      )}

      {/* Row */}
      <button
        onClick={onSelect}
        className={`relative z-10 w-full flex items-center gap-3 px-3 py-2 transition-colors text-left ${
          isActive ? 'bg-card' : 'hover:bg-card/50'
        }`}
      >
        {/* Timeline dot */}
        <div className="flex flex-col items-center flex-shrink-0 w-[13px]">
          <div className={`w-2.5 h-2.5 rounded-full border-2 transition-colors ${
            isActive ? 'border-primary bg-primary' : 'border-muted-foreground/40 bg-background'
          }`} />
        </div>

        {renderMiniPreview()}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-semibold text-foreground">Scene {index + 1}</span>
            <span className="text-[9px] text-muted-foreground tabular-nums">
              {(scene.endTime - scene.startTime).toFixed(1)}s
            </span>
          </div>
          <p className="text-[10px] text-muted-foreground truncate mt-0.5">
            {scene.assetType === 'counter'
              ? `${scene.counter.number}${scene.counter.unit} — ${scene.counter.label}`
              : scene.text || 'No text'}
          </p>
        </div>

        {total > 1 && (
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="p-1 rounded hover:bg-destructive/15 text-muted-foreground/50 hover:text-destructive transition-colors flex-shrink-0"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        )}
      </button>

      {/* Expanded inline editor */}
      {isActive && (
        <div className="relative z-10 bg-card border-y border-border px-4 py-3 ml-[2.35rem] mr-3 rounded-b-xl space-y-3">
          {/* Text / Counter */}
          {scene.assetType === 'counter' ? (
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[9px] text-muted-foreground block mb-0.5">Number</label>
                <Input type="number" value={scene.counter.number} onChange={(e) => onUpdate({ counter: { ...scene.counter, number: Number(e.target.value) } })} className="bg-secondary border-border h-7 text-[11px]" />
              </div>
              <div>
                <label className="text-[9px] text-muted-foreground block mb-0.5">Label</label>
                <Input value={scene.counter.label} onChange={(e) => onUpdate({ counter: { ...scene.counter, label: e.target.value } })} className="bg-secondary border-border h-7 text-[11px]" />
              </div>
              <div>
                <label className="text-[9px] text-muted-foreground block mb-0.5">Unit</label>
                <Input value={scene.counter.unit} onChange={(e) => onUpdate({ counter: { ...scene.counter, unit: e.target.value } })} className="bg-secondary border-border h-7 text-[11px]" placeholder="%" />
              </div>
            </div>
          ) : (
            <Textarea
              value={scene.text}
              onChange={(e) => onUpdate({ text: e.target.value.slice(0, 150) })}
              placeholder="Scene text…"
              className="bg-secondary border-border text-foreground resize-none h-14 text-[11px]"
              maxLength={150}
            />
          )}

          {/* Asset row */}
          <div className="flex gap-1.5">
            <button onClick={onOpenSearch} className="flex items-center gap-1 px-2 py-1.5 rounded-md bg-secondary text-[9px] text-muted-foreground hover:text-foreground transition-colors">
              <Search className="w-3 h-3" /> Search
            </button>
            <label className="flex items-center gap-1 px-2 py-1.5 rounded-md bg-secondary text-[9px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
              <Upload className="w-3 h-3" /> Upload
              <input type="file" accept="image/*,video/*" className="hidden" onChange={handleUpload} />
            </label>
            <button
              onClick={() => onUpdate({ assetType: 'gradient', backgroundUrl: null })}
              className={`flex items-center gap-1 px-2 py-1.5 rounded-md text-[9px] transition-colors ${scene.assetType === 'gradient' ? 'bg-primary/15 text-primary' : 'bg-secondary text-muted-foreground hover:text-foreground'}`}
            >
              <Palette className="w-3 h-3" /> Gradient
            </button>
            <button
              onClick={() => onUpdate({ assetType: 'counter' })}
              className={`flex items-center gap-1 px-2 py-1.5 rounded-md text-[9px] transition-colors ${scene.assetType === 'counter' ? 'bg-primary/15 text-primary' : 'bg-secondary text-muted-foreground hover:text-foreground'}`}
            >
              <Code className="w-3 h-3" /> Counter
            </button>
          </div>

          {/* Gradient strip */}
          {scene.assetType === 'gradient' && (
            <div className="flex gap-1 overflow-x-auto scrollbar-none -mx-1 px-1">
              {GRADIENT_STYLES.map(g => (
                <button
                  key={g.id}
                  onClick={() => onUpdate({ gradient: { ...scene.gradient, style: g.id } })}
                  className={`flex-shrink-0 w-10 h-10 rounded-md border-2 transition-all ${scene.gradient.style === g.id ? 'border-primary scale-110' : 'border-transparent'}`}
                  style={{ background: g.preview }}
                />
              ))}
            </div>
          )}

          {/* Quick motion pills */}
          <div className="flex flex-wrap gap-1">
            {(['default', 'crossfade', 'zoom-in', 'flash', 'slide'] as TransitionType[]).map(t => (
              <button
                key={t}
                onClick={() => onUpdate({ transition: t })}
                className={`px-2 py-0.5 rounded text-[9px] font-medium transition-colors ${scene.transition === t ? 'bg-primary/15 text-primary' : 'bg-secondary text-muted-foreground'}`}
              >
                {t === 'default' ? 'Cut' : t === 'zoom-in' ? 'Zoom' : t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const V4 = () => {
  const {
    scenes, activeIndex, activeScene, totalDuration,
    setActiveIndex, addScene, deleteScene, updateScene,
    brandKit, setBrandKit, endScreen, setEndScreen,
  } = useSceneStore();

  const [exporting, setExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const intervalRef = useRef<number | null>(null);

  // Playback
  useEffect(() => {
    if (playing) {
      intervalRef.current = window.setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= totalDuration) { setPlaying(false); return 0; }
          return +(prev + 0.1).toFixed(1);
        });
      }, 100);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [playing, totalDuration]);

  const progress = totalDuration > 0 ? (currentTime / totalDuration) * 100 : 0;

  const handleExport = () => {
    setExporting(true);
    setExportProgress(0);
    const interval = setInterval(() => {
      setExportProgress(prev => {
        if (prev >= 100) { clearInterval(interval); setExporting(false); toast({ title: '✅ Video ready!' }); return 0; }
        return prev + 4;
      });
    }, 80);
  };

  const handleGenerate = (prompt: string) => {
    toast({ title: '🎬 Generating…', description: `"${prompt}"` });
    setShowPrompt(false);
  };

  const handleOpenSearch = useCallback(() => setSearchOpen(true), []);
  const handleSearchSelect = (url: string) => {
    updateScene(activeIndex, { backgroundUrl: url, assetType: 'media' });
  };

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {exporting && (
        <div className="absolute top-0 left-0 right-0 z-50">
          <Progress value={exportProgress} className="h-1 rounded-none bg-secondary [&>div]:bg-primary" />
        </div>
      )}

      {/* Header */}
      <header className="flex items-center justify-between px-4 h-11 border-b border-border flex-shrink-0">
        <h1 className="text-sm font-bold tracking-tight text-primary">Sequence · V4</h1>
        <div className="flex items-center gap-1.5">
          <button onClick={() => setShowPrompt(!showPrompt)} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium bg-accent/15 text-accent hover:bg-accent/25 transition-colors">
            <Sparkles className="w-3 h-3" /> AI
          </button>
          <button onClick={handleExport} disabled={exporting} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-[11px] font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50">
            <Download className="w-3 h-3" /> Export
          </button>
        </div>
      </header>

      {showPrompt && (
        <div className="px-3 py-2.5 border-b border-border flex-shrink-0 bg-card">
          <PromptInput onGenerate={handleGenerate} />
        </div>
      )}

      {/* Preview */}
      <div className="flex-shrink-0 flex" style={{ height: '35vh' }}>
        <ScenePreview scene={activeScene} totalDuration={totalDuration} compact />
      </div>

      {/* Compact playback bar */}
      <div className="flex-shrink-0 border-b border-border bg-card">
        <div className="h-0.5 bg-secondary">
          <div className="h-full bg-primary transition-all duration-100" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex items-center gap-2 px-3 py-1">
          <button onClick={() => setPlaying(!playing)} className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center hover:bg-primary/25 transition-colors">
            {playing ? <Pause className="w-3 h-3 text-primary" /> : <Play className="w-3 h-3 text-primary ml-0.5" />}
          </button>
          <button onClick={() => { setCurrentTime(0); setPlaying(false); }} className="w-5 h-5 rounded-full flex items-center justify-center hover:bg-muted transition-colors">
            <RotateCcw className="w-2.5 h-2.5 text-muted-foreground" />
          </button>
          <span className="text-[10px] text-muted-foreground tabular-nums ml-auto">
            {currentTime.toFixed(1)}s / {totalDuration.toFixed(1)}s
          </span>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground">
            {scenes.length} scene{scenes.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Timeline — vertical scroll */}
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-none">
        <div className="py-2">
          {scenes.map((scene, i) => (
            <TimelineScene
              key={scene.id}
              scene={scene}
              index={i}
              isActive={i === activeIndex}
              isLast={i === scenes.length - 1}
              total={scenes.length}
              onSelect={() => setActiveIndex(i)}
              onUpdate={(updates) => updateScene(i, updates)}
              onDelete={() => deleteScene(i)}
              onOpenSearch={handleOpenSearch}
            />
          ))}

          {/* Add scene */}
          {scenes.length < 10 && (
            <div className="px-3 py-2 ml-[1.1rem]">
              <button
                onClick={addScene}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-dashed border-muted-foreground/25 text-[10px] text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors"
              >
                <Plus className="w-3 h-3" /> Add scene
              </button>
            </div>
          )}
        </div>

        {/* Brand Kit & End Screen at bottom */}
        <div className="border-t border-border px-3 py-3 space-y-3">
          <BrandKitSection brandKit={brandKit} onUpdate={(updates) => setBrandKit(prev => ({ ...prev, ...updates }))} />
          <EndScreenSettings enabled={endScreen.enabled} duration={endScreen.duration} onUpdate={(updates) => setEndScreen(prev => ({ ...prev, ...updates }))} />
        </div>
      </div>

      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} onSelect={handleSearchSelect} />
    </div>
  );
};

export default V4;
