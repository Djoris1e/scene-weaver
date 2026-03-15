import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSceneStore } from '@/hooks/useSceneStore';
import { TEXT_COLOR_PAIRINGS, FONT_OPTIONS, GRADIENT_STYLES, Scene } from '@/types/scene';
import {
  Play, Pause, Plus, Undo2, Redo2, Share2,
  Trash2, Clock, ChevronDown, ChevronUp,
  Download, Check, Sparkles, GripVertical,
  AlignVerticalJustifyStart, AlignVerticalJustifyCenter, AlignVerticalJustifyEnd,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

/* ─── Scene Card ──────────────────────────────────────────────── */

function SceneCard({
  scene, index, isActive, isExpanded, isSelectMode, isSelected, totalScenes,
  onSelect, onToggleExpand, onToggleSelect, onUpdate, onDelete,
}: {
  scene: Scene; index: number; isActive: boolean; isExpanded: boolean;
  isSelectMode: boolean; isSelected: boolean; totalScenes: number;
  onSelect: () => void; onToggleExpand: () => void; onToggleSelect: () => void;
  onUpdate: (u: Partial<Scene>) => void; onDelete: () => void;
}) {
  const gStyle = GRADIENT_STYLES.find(g => g.id === scene.gradient.style) || GRADIENT_STYLES[0];
  const dur = +(scene.endTime - scene.startTime).toFixed(1);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isActive && cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [isActive]);

  return (
    <div
      ref={cardRef}
      className={`rounded-2xl transition-all duration-200 overflow-hidden
        ${isActive ? 'bg-card ring-1 ring-primary/30 shadow-lg shadow-primary/5' : 'bg-card/50 hover:bg-card/80'}
        ${isSelected ? 'ring-2 ring-primary' : ''}
      `}
    >
      {/* Main row */}
      <div
        className="flex items-center gap-3 p-2.5 cursor-pointer"
        onClick={() => isSelectMode ? onToggleSelect() : onSelect()}
      >
        {/* Select checkbox or scene number */}
        {isSelectMode ? (
          <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all
            ${isSelected ? 'bg-primary border-primary' : 'border-muted-foreground/30'}`}>
            {isSelected && <Check className="w-3.5 h-3.5 text-primary-foreground" />}
          </div>
        ) : (
          <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 text-[11px] font-bold
            ${isActive ? 'bg-primary/15 text-primary' : 'bg-secondary text-muted-foreground'}`}>
            {index + 1}
          </div>
        )}

        {/* Thumbnail — 9:16 ratio */}
        <div className="w-12 h-[5.3rem] rounded-xl overflow-hidden shrink-0 relative shadow-sm">
          {scene.assetType === 'media' && scene.backgroundUrl ? (
            <img src={scene.backgroundUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full" style={{ background: gStyle.preview }} />
          )}
          {/* Duration badge */}
          <div className="absolute bottom-0.5 right-0.5 px-1 py-0.5 rounded bg-background/70 backdrop-blur-sm">
            <span className="text-[8px] font-semibold text-foreground tabular-nums">{dur}s</span>
          </div>
        </div>

        {/* Editable text + meta */}
        <div className="flex-1 min-w-0 py-0.5">
          <input
            type="text"
            value={scene.text}
            onChange={e => onUpdate({ text: e.target.value })}
            onClick={e => { e.stopPropagation(); if (!isActive) onSelect(); }}
            placeholder="Tap to add text..."
            className="w-full bg-transparent text-[13px] text-foreground placeholder:text-muted-foreground/40 
              focus:outline-none pb-1 transition-colors leading-snug"
          />
          <div className="flex items-center gap-1.5 text-muted-foreground/60">
            <span className="text-[10px] capitalize px-1.5 py-0.5 rounded-md bg-secondary/60">{scene.assetType}</span>
            {scene.transition !== 'default' && (
              <span className="text-[10px] capitalize px-1.5 py-0.5 rounded-md bg-accent/10 text-accent">
                {scene.transition.replace('-', ' ')}
              </span>
            )}
          </div>
        </div>

        {/* Expand toggle */}
        {!isSelectMode && (
          <button
            onClick={e => { e.stopPropagation(); onToggleExpand(); }}
            className={`w-8 h-8 flex items-center justify-center rounded-xl shrink-0 transition-all
              ${isExpanded ? 'bg-primary/10 text-primary' : 'hover:bg-secondary text-muted-foreground/50'}`}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Expanded editor */}
      {isExpanded && !isSelectMode && (
        <div className="px-3 pb-3 space-y-4 border-t border-border/30 pt-3 animate-in slide-in-from-top-1 duration-200">
          {/* Text position */}
          <SettingRow label="Position">
            <div className="flex gap-1">
              {([
                { val: 'top' as const, icon: <AlignVerticalJustifyStart className="w-3.5 h-3.5" /> },
                { val: 'center' as const, icon: <AlignVerticalJustifyCenter className="w-3.5 h-3.5" /> },
                { val: 'bottom' as const, icon: <AlignVerticalJustifyEnd className="w-3.5 h-3.5" /> },
              ]).map(p => (
                <button key={p.val} onClick={() => onUpdate({ textPosition: p.val })}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all
                    ${scene.textPosition === p.val ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-secondary text-secondary-foreground hover:bg-muted'}`}>
                  {p.icon}
                </button>
              ))}
            </div>
          </SettingRow>

          {/* Text color */}
          <SettingRow label="Color">
            <div className="flex gap-1.5">
              {TEXT_COLOR_PAIRINGS.map(c => (
                <button key={c.id} onClick={() => onUpdate({ textColorId: c.id })}
                  className={`w-7 h-7 rounded-full transition-all shadow-sm
                    ${scene.textColorId === c.id ? 'ring-2 ring-primary ring-offset-2 ring-offset-card scale-110' : 'hover:scale-105'}`}
                  style={{ background: c.text }} title={c.label} />
              ))}
            </div>
          </SettingRow>

          {/* Font */}
          <SettingRow label="Font">
            <div className="flex gap-1">
              {FONT_OPTIONS.map(f => (
                <button key={f.id} onClick={() => onUpdate({ fontId: f.id })}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all
                    ${scene.fontId === f.id ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-secondary text-secondary-foreground hover:bg-muted'}`}
                  style={{ fontFamily: f.family }}>
                  {f.label}
                </button>
              ))}
            </div>
          </SettingRow>

          {/* Background type */}
          <SettingRow label="Background">
            <div className="flex gap-1">
              {(['media', 'gradient', 'counter'] as const).map(t => (
                <button key={t} onClick={() => onUpdate({ assetType: t })}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-medium capitalize transition-all
                    ${scene.assetType === t ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-secondary text-secondary-foreground hover:bg-muted'}`}>
                  {t}
                </button>
              ))}
            </div>
          </SettingRow>

          {/* Gradient picker */}
          {scene.assetType === 'gradient' && (
            <div className="grid grid-cols-6 gap-1.5 pl-[76px]">
              {GRADIENT_STYLES.map(g => (
                <button key={g.id} onClick={() => onUpdate({ gradient: { ...scene.gradient, style: g.id } })}
                  className={`aspect-square rounded-lg border-2 transition-all
                    ${scene.gradient.style === g.id ? 'border-primary shadow-sm scale-105' : 'border-transparent hover:border-border'}`}
                  style={{ background: g.preview }} title={g.label} />
              ))}
            </div>
          )}

          {/* Transition */}
          <SettingRow label="Transition">
            <div className="flex gap-1 flex-wrap">
              {(['crossfade', 'zoom-in', 'flash', 'slide'] as const).map(tr => (
                <button key={tr} onClick={() => onUpdate({ transition: tr })}
                  className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium capitalize transition-all
                    ${scene.transition === tr ? 'bg-accent text-accent-foreground shadow-sm' : 'bg-secondary text-secondary-foreground hover:bg-muted'}`}>
                  {tr.replace('-', ' ')}
                </button>
              ))}
            </div>
          </SettingRow>

          {/* Text effect */}
          <SettingRow label="Text FX">
            <div className="flex gap-1 flex-wrap">
              {(['fade-in', 'typewriter', 'scale-up'] as const).map(te => (
                <button key={te} onClick={() => onUpdate({ textEffect: te })}
                  className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium capitalize transition-all
                    ${scene.textEffect === te ? 'bg-accent text-accent-foreground shadow-sm' : 'bg-secondary text-secondary-foreground hover:bg-muted'}`}>
                  {te.replace('-', ' ')}
                </button>
              ))}
            </div>
          </SettingRow>

          {/* Duration slider */}
          <SettingRow label={`${dur}s`}>
            <input type="range" min={0.5} max={10} step={0.1} value={dur}
              onChange={e => onUpdate({ endTime: scene.startTime + parseFloat(e.target.value) })}
              className="flex-1 accent-primary h-1.5 cursor-pointer" />
          </SettingRow>

          {/* Delete */}
          {totalScenes > 1 && (
            <div className="flex justify-end pt-1">
              <button onClick={onDelete}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium 
                  text-destructive/70 hover:text-destructive bg-destructive/5 hover:bg-destructive/10 transition-all">
                <Trash2 className="w-3 h-3" /> Remove scene
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Setting Row ─────────────────────────────────────────────── */

function SettingRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] text-muted-foreground/70 uppercase tracking-wider font-semibold w-[68px] shrink-0 text-right">
        {label}
      </span>
      {children}
    </div>
  );
}

/* ─── Main Page ───────────────────────────────────────────────── */

export default function V7() {
  const navigate = useNavigate();
  const {
    scenes, activeIndex, activeScene, totalDuration,
    setActiveIndex, addScene, deleteScene, updateScene,
  } = useSceneStore();

  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [expandedScene, setExpandedScene] = useState<number | null>(null);
  const [selectMode, setSelectMode] = useState(false);
  const [selectedScenes, setSelectedScenes] = useState<Set<number>>(new Set());
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
  const progress = totalDuration > 0 ? (currentTime / totalDuration) * 100 : 0;

  const color = TEXT_COLOR_PAIRINGS.find(c => c.id === activeScene.textColorId) || TEXT_COLOR_PAIRINGS[0];
  const fontOpt = FONT_OPTIONS.find(f => f.id === activeScene.fontId) || FONT_OPTIONS[0];
  const gradientStyle = GRADIENT_STYLES.find(g => g.id === activeScene.gradient.style) || GRADIENT_STYLES[0];

  const positionClass = {
    top: 'items-start pt-8',
    center: 'items-center',
    bottom: 'items-end pb-8',
  }[activeScene.textPosition];

  const toggleSelect = (idx: number) => {
    setSelectedScenes(prev => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      return next;
    });
  };

  const deleteSelected = () => {
    const sorted = Array.from(selectedScenes).sort((a, b) => b - a);
    sorted.forEach(i => deleteScene(i));
    setSelectedScenes(new Set());
    setSelectMode(false);
    toast({ title: `${sorted.length} scene${sorted.length > 1 ? 's' : ''} removed` });
  };

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

  // Build scene segment markers for the scrubber
  const sceneSegments = scenes.map((s, i) => {
    const dur = s.endTime - s.startTime;
    const widthPercent = totalDuration > 0 ? (dur / totalDuration) * 100 : 0;
    return { index: i, widthPercent };
  });

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* ─── Header ─── */}
      <div className="flex items-center justify-between px-4 h-12 shrink-0">
        <button onClick={() => navigate('/')} className="text-sm font-semibold text-primary">
          Done
        </button>
        <div className="flex items-center gap-1">
          <button className="w-9 h-9 flex items-center justify-center rounded-xl text-foreground/30 hover:text-foreground/60 transition-colors">
            <Undo2 className="w-[18px] h-[18px]" />
          </button>
          <button className="w-9 h-9 flex items-center justify-center rounded-xl text-foreground/30 hover:text-foreground/60 transition-colors">
            <Redo2 className="w-[18px] h-[18px]" />
          </button>
        </div>
        <button className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-colors shadow-sm">
          <Share2 className="w-3.5 h-3.5" />
          Export
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

            {/* Vignette */}
            <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{ boxShadow: 'inset 0 0 50px rgba(0,0,0,0.2)' }} />

            {/* Scene indicator */}
            <div className="absolute top-3 left-3 px-2 py-1 rounded-lg bg-background/50 backdrop-blur-md z-20">
              <span className="text-[10px] font-bold text-foreground">{activeIndex + 1} / {scenes.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Segmented Scrubber + Playback ─── */}
      <div className="shrink-0 px-4 pt-3 pb-1.5" style={{ background: 'hsl(var(--background))' }}>
        {/* Segmented progress bar */}
        <div className="flex items-center gap-3 mb-1.5">
          <span className="text-[11px] text-muted-foreground tabular-nums w-7">{formatTime(currentTime)}</span>
          <div
            ref={scrubRef}
            className="flex-1 h-7 flex items-center cursor-pointer"
            onMouseDown={e => { setScrubbing(true); handleScrub(e.clientX); }}
            onMouseMove={e => scrubbing && handleScrub(e.clientX)}
            onMouseUp={() => setScrubbing(false)}
            onMouseLeave={() => setScrubbing(false)}
            onTouchStart={e => { setScrubbing(true); handleScrub(e.touches[0].clientX); }}
            onTouchMove={e => scrubbing && handleScrub(e.touches[0].clientX)}
            onTouchEnd={() => setScrubbing(false)}
          >
            <div className="relative w-full h-1.5 flex rounded-full overflow-hidden">
              {/* Scene segments */}
              {sceneSegments.map((seg, i) => (
                <div
                  key={i}
                  className={`h-full transition-colors ${i === activeIndex ? 'bg-primary/30' : 'bg-secondary'}`}
                  style={{
                    width: `${seg.widthPercent}%`,
                    marginRight: i < sceneSegments.length - 1 ? '2px' : '0',
                  }}
                />
              ))}
              {/* Filled progress overlay */}
              <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
                <div className="h-full bg-primary/80 rounded-full transition-[width] duration-75"
                  style={{ width: `${progress}%` }} />
              </div>
            </div>
            {/* Handle */}
            <div className="absolute" style={{ left: `calc(${progress}% + 28px - 5px)`, top: '50%', transform: 'translateY(-50%)' }}>
              <div className={`w-2.5 h-2.5 rounded-full bg-primary shadow-md shadow-primary/30 transition-transform
                ${scrubbing ? 'scale-150' : 'scale-100'}`} />
            </div>
          </div>
          <span className="text-[11px] text-muted-foreground tabular-nums w-7 text-right">{formatTime(totalDuration)}</span>
        </div>

        {/* Play button */}
        <div className="flex items-center justify-center">
          <button
            onClick={() => { if (currentTime >= totalDuration) setCurrentTime(0); setPlaying(!playing); }}
            className="w-11 h-11 rounded-2xl bg-card border border-border flex items-center justify-center 
              hover:bg-muted active:scale-95 transition-all shadow-sm"
          >
            {playing ? <Pause className="w-5 h-5 text-foreground" /> : <Play className="w-5 h-5 text-foreground ml-0.5" />}
          </button>
        </div>
      </div>

      {/* ─── Scene List ─── */}
      <div className="shrink-0 max-h-[32vh] overflow-y-auto px-3 pt-1 pb-1 scrollbar-none">
        <div className="flex flex-col gap-1.5">
          {scenes.map((scene, idx) => (
            <SceneCard
              key={scene.id}
              scene={scene}
              index={idx}
              isActive={idx === activeIndex}
              isExpanded={expandedScene === idx}
              isSelectMode={selectMode}
              isSelected={selectedScenes.has(idx)}
              totalScenes={scenes.length}
              onSelect={() => setActiveIndex(idx)}
              onToggleExpand={() => setExpandedScene(expandedScene === idx ? null : idx)}
              onToggleSelect={() => toggleSelect(idx)}
              onUpdate={u => updateScene(idx, u)}
              onDelete={() => { deleteScene(idx); setExpandedScene(null); }}
            />
          ))}
        </div>
      </div>

      {/* ─── Bottom Bar ─── */}
      <div className="shrink-0 flex items-center justify-between px-4 py-3 border-t border-border/50">
        {selectMode ? (
          <>
            <button onClick={deleteSelected} disabled={selectedScenes.size === 0}
              className="flex items-center gap-1.5 text-sm font-semibold text-destructive disabled:opacity-30 transition-opacity">
              <Trash2 className="w-4 h-4" />
              Delete{selectedScenes.size > 0 ? ` (${selectedScenes.size})` : ''}
            </button>
            <button onClick={() => { setSelectMode(false); setSelectedScenes(new Set()); }}
              className="text-sm font-semibold text-primary">
              Cancel
            </button>
          </>
        ) : (
          <>
            <button onClick={() => { addScene(); toast({ title: 'Scene added' }); }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-card border border-border text-sm font-medium text-foreground 
                hover:bg-muted active:scale-95 transition-all">
              <Plus className="w-4 h-4" /> Add Scene
            </button>
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-muted-foreground">{scenes.length} scene{scenes.length !== 1 ? 's' : ''} · {totalDuration.toFixed(1)}s</span>
              {scenes.length > 1 && (
                <button onClick={() => setSelectMode(true)}
                  className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors">
                  Select
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
