import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSceneStore } from '@/hooks/useSceneStore';
import { TEXT_COLOR_PAIRINGS, FONT_OPTIONS, GRADIENT_STYLES, Scene } from '@/types/scene';
import {
  ArrowLeft, Play, Pause, Plus, CheckSquare, MoreHorizontal,
  Image, Clock, ChevronRight, Undo2, Redo2, Film, Share2, Maximize2,
  Trash2, Copy, Type, Palette, Zap
} from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { toast } from '@/hooks/use-toast';

export default function V5() {
  const navigate = useNavigate();
  const {
    scenes, activeIndex, activeScene, totalDuration,
    setActiveIndex, addScene, deleteScene, updateScene,
    brandKit, endScreen,
  } = useSceneStore();

  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [selectMode, setSelectMode] = useState(false);
  const [selectedScenes, setSelectedScenes] = useState<Set<number>>(new Set());
  const [editingScene, setEditingScene] = useState<number | null>(null);
  const [scrubbing, setScrubbing] = useState(false);
  const scrubRef = useRef<HTMLDivElement>(null);

  // Find which scene is playing at current time
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
        if (next >= totalDuration) {
          setPlaying(false);
          return 0;
        }
        const sceneIdx = getSceneAtTime(next);
        if (sceneIdx !== activeIndex) setActiveIndex(sceneIdx);
        return next;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [playing, totalDuration, getSceneAtTime, activeIndex, setActiveIndex]);

  // Scrubber
  const handleScrub = useCallback((clientX: number) => {
    if (!scrubRef.current) return;
    const rect = scrubRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const time = +(ratio * totalDuration).toFixed(1);
    setCurrentTime(time);
    setActiveIndex(getSceneAtTime(time));
  }, [totalDuration, getSceneAtTime, setActiveIndex]);

  const formatTime = (t: number) => {
    const mins = Math.floor(t / 60);
    const secs = Math.floor(t % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const color = TEXT_COLOR_PAIRINGS.find(c => c.id === activeScene.textColorId) || TEXT_COLOR_PAIRINGS[0];
  const fontOpt = FONT_OPTIONS.find(f => f.id === activeScene.fontId) || FONT_OPTIONS[0];
  const gradientStyle = GRADIENT_STYLES.find(g => g.id === activeScene.gradient.style) || GRADIENT_STYLES[0];

  const getSceneDuration = (s: Scene) => +(s.endTime - s.startTime).toFixed(1);

  const toggleSelect = (idx: number) => {
    setSelectedScenes(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const deleteSelected = () => {
    const sorted = Array.from(selectedScenes).sort((a, b) => b - a);
    sorted.forEach(i => deleteScene(i));
    setSelectedScenes(new Set());
    setSelectMode(false);
    toast({ title: `Deleted ${sorted.length} scene(s)` });
  };

  const duplicateScene = (idx: number) => {
    addScene();
    const source = scenes[idx];
    updateScene(scenes.length, { ...source, id: crypto.randomUUID() });
    toast({ title: 'Scene duplicated' });
  };

  // Preview background
  const renderPreviewBg = () => {
    if (activeScene.assetType === 'media' && activeScene.backgroundUrl) {
      return <img src={activeScene.backgroundUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />;
    }
    if (activeScene.assetType === 'counter') {
      return (
        <div className="absolute inset-0 flex items-center justify-center" style={{ background: gradientStyle.preview }}>
          <div className="text-center">
            <span className="text-6xl font-bold" style={{ color: 'hsl(var(--primary))' }}>{activeScene.counter.number}</span>
            {activeScene.counter.unit && <span className="text-3xl ml-2" style={{ color: 'hsl(var(--primary))' }}>{activeScene.counter.unit}</span>}
            {activeScene.counter.label && <p className="text-base mt-2 text-foreground/70">{activeScene.counter.label}</p>}
          </div>
        </div>
      );
    }
    return <div className="absolute inset-0" style={{ background: gradientStyle.preview }} />;
  };

  const positionClass = {
    top: 'items-start pt-10',
    center: 'items-center',
    bottom: 'items-end pb-10',
  }[activeScene.textPosition];

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 shrink-0">
        <button onClick={() => navigate('/')} className="text-sm font-medium text-primary">
          Done
        </button>
        <div className="flex items-center gap-4">
          <button className="text-foreground/40 hover:text-foreground/70 transition-colors">
            <Undo2 className="w-5 h-5" />
          </button>
          <button className="text-foreground/40 hover:text-foreground/70 transition-colors">
            <Redo2 className="w-5 h-5" />
          </button>
        </div>
        <div className="flex items-center gap-3">
          <button className="text-foreground/60 hover:text-foreground transition-colors">
            <Film className="w-5 h-5" />
          </button>
          <button className="text-foreground/60 hover:text-foreground transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Preview — takes up flexible space */}
      <div className="flex-1 min-h-0 relative bg-stage">
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div className="relative rounded-lg overflow-hidden" style={{ aspectRatio: '9/16', height: '100%', maxHeight: '100%', width: 'auto' }}>
            {renderPreviewBg()}

            {/* Text overlay */}
            {activeScene.text && activeScene.assetType !== 'counter' && (
              <div className={`absolute inset-0 flex flex-col ${positionClass} justify-center px-6 z-10`}>
                <p
                  className="text-xl leading-snug text-center max-w-full break-words font-semibold"
                  style={{ color: color.text, textShadow: color.shadow, fontFamily: fontOpt.family }}
                >
                  {activeScene.text}
                </p>
              </div>
            )}

            {/* Vignette */}
            <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: 'inset 0 0 60px rgba(0,0,0,0.25)' }} />
          </div>
        </div>
      </div>

      {/* Scrubber + Playback */}
      <div className="shrink-0 px-4 pt-2 pb-1 bg-background">
        {/* Time labels + scrubber */}
        <div className="flex items-center gap-3 mb-2">
          <span className="text-xs text-muted-foreground tabular-nums w-8">{formatTime(currentTime)}</span>
          <div
            ref={scrubRef}
            className="flex-1 h-6 flex items-center cursor-pointer group"
            onMouseDown={(e) => { setScrubbing(true); handleScrub(e.clientX); }}
            onMouseMove={(e) => scrubbing && handleScrub(e.clientX)}
            onMouseUp={() => setScrubbing(false)}
            onMouseLeave={() => setScrubbing(false)}
            onTouchStart={(e) => { setScrubbing(true); handleScrub(e.touches[0].clientX); }}
            onTouchMove={(e) => scrubbing && handleScrub(e.touches[0].clientX)}
            onTouchEnd={() => setScrubbing(false)}
          >
            <div className="relative w-full h-1 bg-secondary rounded-full">
              <div
                className="absolute h-full bg-foreground/50 rounded-full transition-[width] duration-75"
                style={{ width: `${totalDuration > 0 ? (currentTime / totalDuration) * 100 : 0}%` }}
              />
              {/* Scrub handle */}
              <div
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-foreground shadow-md transition-[left] duration-75"
                style={{ left: `calc(${totalDuration > 0 ? (currentTime / totalDuration) * 100 : 0}% - 6px)` }}
              />
            </div>
          </div>
          <span className="text-xs text-muted-foreground tabular-nums w-8 text-right">{formatTime(totalDuration)}</span>
        </div>

        {/* Play + fullscreen */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setPlaying(!playing)}
            className="w-10 h-10 flex items-center justify-center text-foreground hover:text-primary transition-colors"
          >
            {playing ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
          </button>
          <button className="w-10 h-10 flex items-center justify-center text-foreground/50 hover:text-foreground transition-colors">
            <Maximize2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Project title */}
      <div className="px-4 py-2 shrink-0">
        <h2 className="text-lg font-bold text-foreground">My Video Project</h2>
      </div>

      {/* Scene list */}
      <div className="shrink-0 max-h-[30vh] overflow-y-auto px-4 pb-2 scrollbar-none">
        <div className="flex flex-col gap-2">
          {scenes.map((scene, idx) => {
            const gradStyle = GRADIENT_STYLES.find(g => g.id === scene.gradient.style) || GRADIENT_STYLES[0];
            const isActive = idx === activeIndex && !selectMode;
            const isSelected = selectedScenes.has(idx);

            return (
              <button
                key={scene.id}
                onClick={() => {
                  if (selectMode) {
                    toggleSelect(idx);
                  } else {
                    setActiveIndex(idx);
                    setEditingScene(idx);
                  }
                }}
                className={`flex items-center gap-3 p-2 rounded-xl transition-all text-left
                  ${isActive ? 'bg-card ring-1 ring-primary/40' : 'bg-card/60 hover:bg-card'}
                  ${isSelected ? 'ring-2 ring-primary' : ''}
                `}
              >
                {/* Thumbnail */}
                <div className="w-24 h-16 rounded-lg overflow-hidden shrink-0 relative">
                  {scene.assetType === 'media' && scene.backgroundUrl ? (
                    <img src={scene.backgroundUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full" style={{ background: gradStyle.preview }} />
                  )}
                  {scene.text && scene.assetType !== 'counter' && (
                    <div className="absolute inset-0 flex items-center justify-center px-1">
                      <p className="text-[7px] text-center text-white font-medium leading-tight line-clamp-2 drop-shadow-md">
                        {scene.text}
                      </p>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 text-muted-foreground mb-0.5">
                    <Image className="w-3.5 h-3.5" />
                    <span className="text-xs capitalize">{scene.assetType}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock className="w-3.5 h-3.5" />
                    <span className="text-xs">{getSceneDuration(scene).toFixed(1)}s</span>
                  </div>
                  {scene.text && (
                    <p className="text-xs text-foreground/60 mt-1 truncate">{scene.text}</p>
                  )}
                </div>

                {/* Chevron */}
                {!selectMode && (
                  <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="shrink-0 flex items-center justify-between px-4 py-3 border-t border-border bg-background">
        {selectMode ? (
          <>
            <button
              onClick={deleteSelected}
              disabled={selectedScenes.size === 0}
              className="flex items-center gap-1.5 text-sm font-medium text-destructive disabled:opacity-40"
            >
              <Trash2 className="w-4 h-4" />
              Delete ({selectedScenes.size})
            </button>
            <button
              onClick={() => { setSelectMode(false); setSelectedScenes(new Set()); }}
              className="text-sm font-medium text-primary"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => { addScene(); toast({ title: 'Scene added' }); }}
              className="flex items-center gap-1.5 text-sm font-medium text-foreground"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
            <button
              onClick={() => setSelectMode(true)}
              className="text-sm font-medium text-foreground"
            >
              Select
            </button>
          </>
        )}
      </div>

      {/* Scene edit sheet */}
      <Sheet open={editingScene !== null} onOpenChange={(open) => !open && setEditingScene(null)}>
        <SheetContent side="bottom" className="bg-card border-border rounded-t-2xl max-h-[70vh] overflow-y-auto">
          {editingScene !== null && scenes[editingScene] && (() => {
            const s = scenes[editingScene];
            const gStyle = GRADIENT_STYLES.find(g => g.id === s.gradient.style) || GRADIENT_STYLES[0];
            return (
              <>
                <SheetHeader>
                  <SheetTitle className="text-foreground text-base">Scene {editingScene + 1}</SheetTitle>
                </SheetHeader>

                <div className="space-y-5 mt-4 pb-4">
                  {/* Quick actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => { duplicateScene(editingScene); setEditingScene(null); }}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-secondary text-xs font-medium text-secondary-foreground"
                    >
                      <Copy className="w-3.5 h-3.5" /> Duplicate
                    </button>
                    <button
                      onClick={() => { deleteScene(editingScene); setEditingScene(null); }}
                      disabled={scenes.length <= 1}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-secondary text-xs font-medium text-destructive disabled:opacity-40"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>

                  {/* Text */}
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                      <Type className="w-3.5 h-3.5" /> Copy
                    </label>
                    <textarea
                      value={s.text}
                      onChange={e => updateScene(editingScene, { text: e.target.value })}
                      placeholder="Scene text..."
                      rows={2}
                      className="w-full rounded-lg bg-secondary border-none text-sm text-foreground p-3 resize-none focus:outline-none focus:ring-1 focus:ring-primary/40 placeholder:text-muted-foreground"
                    />
                    {/* Text position */}
                    <div className="flex gap-1.5 mt-2">
                      {(['top', 'center', 'bottom'] as const).map(pos => (
                        <button
                          key={pos}
                          onClick={() => updateScene(editingScene, { textPosition: pos })}
                          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors capitalize
                            ${s.textPosition === pos ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}
                          `}
                        >
                          {pos}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Text color */}
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                      <Palette className="w-3.5 h-3.5" /> Text Color
                    </label>
                    <div className="flex gap-2 flex-wrap">
                      {TEXT_COLOR_PAIRINGS.map(c => (
                        <button
                          key={c.id}
                          onClick={() => updateScene(editingScene, { textColorId: c.id })}
                          className={`w-8 h-8 rounded-full border-2 transition-all ${s.textColorId === c.id ? 'border-primary scale-110' : 'border-transparent'}`}
                          style={{ background: c.text }}
                          title={c.label}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Font */}
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Font</label>
                    <div className="flex gap-1.5 flex-wrap">
                      {FONT_OPTIONS.map(f => (
                        <button
                          key={f.id}
                          onClick={() => updateScene(editingScene, { fontId: f.id })}
                          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors
                            ${s.fontId === f.id ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}
                          `}
                          style={{ fontFamily: f.family }}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Asset type */}
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                      <Image className="w-3.5 h-3.5" /> Background
                    </label>
                    <div className="flex gap-1.5">
                      {(['media', 'gradient', 'counter'] as const).map(t => (
                        <button
                          key={t}
                          onClick={() => updateScene(editingScene, { assetType: t })}
                          className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-colors
                            ${s.assetType === t ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}
                          `}
                        >
                          {t}
                        </button>
                      ))}
                    </div>

                    {/* Gradient picker */}
                    {s.assetType === 'gradient' && (
                      <div className="grid grid-cols-6 gap-2 mt-3">
                        {GRADIENT_STYLES.map(g => (
                          <button
                            key={g.id}
                            onClick={() => updateScene(editingScene, { gradient: { ...s.gradient, style: g.id } })}
                            className={`w-10 h-10 rounded-lg border-2 transition-all ${s.gradient.style === g.id ? 'border-primary scale-105' : 'border-transparent'}`}
                            style={{ background: g.preview }}
                            title={g.label}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Motion */}
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                      <Zap className="w-3.5 h-3.5" /> Effects
                    </label>
                    <div className="space-y-2">
                      <div>
                        <span className="text-[10px] text-muted-foreground uppercase">Transition</span>
                        <div className="flex gap-1.5 mt-1">
                          {(['crossfade', 'zoom-in', 'flash', 'slide'] as const).map(tr => (
                            <button
                              key={tr}
                              onClick={() => updateScene(editingScene, { transition: tr })}
                              className={`px-2.5 py-1 rounded-md text-[11px] font-medium capitalize transition-colors
                                ${s.transition === tr ? 'bg-accent text-accent-foreground' : 'bg-secondary text-secondary-foreground'}
                              `}
                            >
                              {tr.replace('-', ' ')}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="text-[10px] text-muted-foreground uppercase">Text Effect</span>
                        <div className="flex gap-1.5 mt-1">
                          {(['fade-in', 'typewriter', 'scale-up'] as const).map(te => (
                            <button
                              key={te}
                              onClick={() => updateScene(editingScene, { textEffect: te })}
                              className={`px-2.5 py-1 rounded-md text-[11px] font-medium capitalize transition-colors
                                ${s.textEffect === te ? 'bg-accent text-accent-foreground' : 'bg-secondary text-secondary-foreground'}
                              `}
                            >
                              {te.replace('-', ' ')}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="text-[10px] text-muted-foreground uppercase">Animation</span>
                        <div className="flex gap-1.5 mt-1">
                          {(['ken-burns', 'drift', 'pulse'] as const).map(an => (
                            <button
                              key={an}
                              onClick={() => updateScene(editingScene, { animation: an })}
                              className={`px-2.5 py-1 rounded-md text-[11px] font-medium capitalize transition-colors
                                ${s.animation === an ? 'bg-accent text-accent-foreground' : 'bg-secondary text-secondary-foreground'}
                              `}
                            >
                              {an.replace('-', ' ')}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Duration */}
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                      Duration ({getSceneDuration(s).toFixed(1)}s)
                    </label>
                    <input
                      type="range"
                      min={0.5}
                      max={10}
                      step={0.1}
                      value={s.endTime - s.startTime}
                      onChange={e => updateScene(editingScene, { endTime: s.startTime + parseFloat(e.target.value) })}
                      className="w-full accent-primary"
                    />
                  </div>
                </div>
              </>
            );
          })()}
        </SheetContent>
      </Sheet>
    </div>
  );
}
