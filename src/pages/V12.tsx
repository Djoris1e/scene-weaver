import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSceneStore } from '@/hooks/useSceneStore';
import logo from '@/assets/logo.svg';
import { TEXT_COLOR_PAIRINGS, FONT_OPTIONS, GRADIENT_STYLES, Scene } from '@/types/scene';
import {
  Play, Pause, Plus, Share2, X, Settings,
  Type, Image, Sparkles as MotionIcon,
  Search, Upload, Palette, Code,
  Sparkles, Send, Loader2, Check, Trash2, ChevronDown,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';

const SCALE = 80;

/* ─── Icon Tab Bar ────────────────────────────────────────────── */

function IconTabBar({ tabs, active, onChange }: { tabs: { id: string; label: string; icon: React.ReactNode }[]; active: string; onChange: (id: string) => void }) {
  return (
    <div className="flex items-end justify-center gap-6 pt-2 pb-1 border-b border-border/50">
      {tabs.map(t => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className={`flex flex-col items-center gap-1 pb-2 px-2 relative transition-colors
            ${active === t.id ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
        >
          {t.icon}
          <span className="text-[11px] font-medium">{t.label}</span>
          {active === t.id && (
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
          )}
        </button>
      ))}
    </div>
  );
}

/* ─── Dropdown Select ─────────────────────────────────────────── */

function DropdownSelect<T extends string>({ label, value, options, onChange }: {
  label: string; value: T; options: { value: T; label: string }[]; onChange: (v: T) => void;
}) {
  return (
    <div className="space-y-1.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="relative">
        <select
          value={value}
          onChange={e => onChange(e.target.value as T)}
          className="w-full appearance-none bg-secondary border border-border rounded-xl px-4 py-3 text-sm font-medium text-foreground cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary/30"
        >
          {options.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
      </div>
    </div>
  );
}

/* ─── Scene Editor (3 icon tabs matching reference) ───────────── */

const EDITOR_TABS = [
  { id: 'text', label: 'Text', icon: <Type className="w-5 h-5" /> },
  { id: 'media', label: 'Media', icon: <Image className="w-5 h-5" /> },
  { id: 'motion', label: 'Motion', icon: <MotionIcon className="w-5 h-5" /> },
];

function SceneEditor({
  scene, index, onUpdate, onDelete, onClose, totalScenes,
}: {
  scene: Scene; index: number;
  onUpdate: (u: Partial<Scene>) => void;
  onDelete: () => void; onClose: () => void; totalScenes: number;
}) {
  const [tab, setTab] = useState('text');

  return (
    <div className="bg-card border-t border-border">
      <div className="flex items-center justify-between px-4 pt-3 pb-0">
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Scene {index + 1}</span>
        <div className="flex items-center gap-2">
          {/* Duration control */}
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-muted-foreground">Duration</span>
            <select
              value={(scene.endTime - scene.startTime).toFixed(1)}
              onChange={e => {
                const dur = Number(e.target.value);
                onUpdate({ endTime: scene.startTime + dur });
              }}
              className="bg-secondary border border-border rounded-lg px-2 py-1 text-[11px] font-medium text-foreground"
            >
              {[1, 1.5, 2, 2.5, 3, 4, 5].map(d => (
                <option key={d} value={d.toFixed(1)}>{d}s</option>
              ))}
            </select>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center hover:bg-muted transition-colors">
            <X className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        </div>
      </div>

      <IconTabBar tabs={EDITOR_TABS} active={tab} onChange={setTab} />

      <div className="px-4 py-4 space-y-4">
        {/* ── Text tab ── */}
        {tab === 'text' && (
          <div className="space-y-4 animate-in fade-in-0 duration-200">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Scene copy</span>
                <span className="text-[11px] text-muted-foreground tabular-nums">{scene.text.length}/120</span>
              </div>
              <textarea
                value={scene.text}
                onChange={e => onUpdate({ text: e.target.value.slice(0, 120) })}
                placeholder="Your story begins."
                maxLength={120}
                rows={2}
                className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary/30 resize-none"
              />
            </div>

            {/* Font selector */}
            <DropdownSelect
              label="Font"
              value={scene.fontId}
              options={FONT_OPTIONS.map(f => ({ value: f.id, label: f.label }))}
              onChange={v => onUpdate({ fontId: v })}
            />

            {/* Text color swatches */}
            <div className="space-y-1.5">
              <span className="text-xs text-muted-foreground">Text color</span>
              <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
                {TEXT_COLOR_PAIRINGS.map(c => (
                  <button
                    key={c.id}
                    onClick={() => onUpdate({ textColorId: c.id })}
                    className={`flex flex-col items-center gap-1 shrink-0`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        scene.textColorId === c.id ? 'border-primary scale-110' : 'border-border hover:border-muted-foreground/50'
                      }`}
                      style={{ backgroundColor: c.text, boxShadow: scene.textColorId === c.id ? c.shadow : undefined }}
                    />
                    <span className="text-[9px] text-muted-foreground">{c.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <DropdownSelect
              label="Text effect"
              value={scene.textEffect}
              options={[
                { value: 'default', label: 'Default' },
                { value: 'fade-in', label: 'Fade In' },
                { value: 'typewriter', label: 'Typewriter' },
                { value: 'scale-up', label: 'Scale Up' },
              ]}
              onChange={v => onUpdate({ textEffect: v })}
            />
            <DropdownSelect
              label="Text position"
              value={scene.textPosition}
              options={[
                { value: 'top', label: 'Top' },
                { value: 'center', label: 'Center' },
                { value: 'bottom', label: 'Bottom' },
              ]}
              onChange={v => onUpdate({ textPosition: v })}
            />
          </div>
        )}

        {/* ── Media tab ── */}
        {tab === 'media' && (
          <div className="space-y-4 animate-in fade-in-0 duration-200">
            <div className="grid grid-cols-4 gap-2">
              {([
                { type: 'search' as const, icon: <Search className="w-5 h-5" />, label: 'Search' },
                { type: 'upload' as const, icon: <Upload className="w-5 h-5" />, label: 'Upload' },
                { type: 'gradient' as const, icon: <Palette className="w-5 h-5" />, label: 'Gradient' },
                { type: 'counter' as const, icon: <Code className="w-5 h-5" />, label: 'Counter' },
              ] as const).map(item => {
                const isActive = (item.type === 'gradient' && scene.assetType === 'gradient') ||
                                 (item.type === 'counter' && scene.assetType === 'counter');
                return (
                  <button
                    key={item.type}
                    onClick={() => {
                      if (item.type === 'gradient') onUpdate({ assetType: 'gradient', backgroundUrl: null });
                      else if (item.type === 'counter') onUpdate({ assetType: 'counter' });
                    }}
                    className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border-2 transition-all
                      ${isActive ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-secondary text-muted-foreground hover:text-foreground hover:border-muted-foreground/30'}`}
                  >
                    {item.icon}
                    <span className="text-[11px] font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Gradient swatches */}
            {scene.assetType === 'gradient' && (
              <div className="flex gap-2 overflow-x-auto scrollbar-none -mx-1 px-1 pb-1">
                {GRADIENT_STYLES.map(g => (
                  <div key={g.id} className="flex flex-col items-center gap-1 shrink-0">
                    <button
                      onClick={() => onUpdate({ gradient: { ...scene.gradient, style: g.id } })}
                      className={`w-16 h-24 rounded-xl border-2 transition-all
                        ${scene.gradient.style === g.id ? 'border-primary scale-105' : 'border-transparent hover:border-border'}`}
                      style={{ background: g.preview }}
                    />
                    <span className="text-[9px] text-muted-foreground font-medium">{g.label}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Counter editing */}
            {scene.assetType === 'counter' && (
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <span className="text-xs text-muted-foreground">Number</span>
                  <input
                    type="number"
                    value={scene.counter.number}
                    onChange={e => onUpdate({ counter: { ...scene.counter, number: Number(e.target.value) } })}
                    className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/30"
                  />
                </div>
                <div className="space-y-1.5">
                  <span className="text-xs text-muted-foreground">Label</span>
                  <input
                    type="text"
                    value={scene.counter.label}
                    onChange={e => onUpdate({ counter: { ...scene.counter, label: e.target.value } })}
                    className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/30"
                  />
                </div>
                <div className="space-y-1.5">
                  <span className="text-xs text-muted-foreground">Unit (%, s, k, days)</span>
                  <input
                    type="text"
                    value={scene.counter.unit}
                    onChange={e => onUpdate({ counter: { ...scene.counter, unit: e.target.value } })}
                    className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/30"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Motion tab ── */}
        {tab === 'motion' && (
          <div className="space-y-4 animate-in fade-in-0 duration-200">
            <DropdownSelect
              label="Transition"
              value={scene.transition}
              options={[
                { value: 'default', label: 'Default' },
                { value: 'crossfade', label: 'Crossfade' },
                { value: 'zoom-in', label: 'Zoom In' },
                { value: 'flash', label: 'Flash' },
                { value: 'slide', label: 'Slide' },
              ]}
              onChange={v => onUpdate({ transition: v })}
            />
            <DropdownSelect
              label="Animation"
              value={scene.animation}
              options={[
                { value: 'none', label: 'None' },
                { value: 'ken-burns', label: 'Ken Burns' },
                { value: 'drift', label: 'Drift' },
                { value: 'pulse', label: 'Pulse' },
              ]}
              onChange={v => onUpdate({ animation: v })}
            />
            <DropdownSelect
              label="Overlays"
              value={scene.overlays.length > 0 ? scene.overlays[0] : 'none'}
              options={[
                { value: 'none', label: 'None' },
                { value: 'vignette', label: 'Vignette' },
                { value: 'film-grain', label: 'Film Grain' },
                { value: 'rgb-split', label: 'RGB Split' },
              ]}
              onChange={v => onUpdate({ overlays: v === 'none' ? [] : [v] })}
            />
          </div>
        )}

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

/* ─── Settings Panel (tabbed, inline) ─────────────────────────── */

const SETTINGS_TABS = [
  { id: 'brand', label: 'Brand Kit', icon: <Palette className="w-5 h-5" /> },
  { id: 'endscreen', label: 'End Screen', icon: <Settings className="w-5 h-5" /> },
];

function SettingsPanel({ onClose, brandKit, setBrandKit, endScreen, setEndScreen }: {
  onClose: () => void;
  brandKit: { bgColor: string; accentColor: string; logoUrl: string | null; slogan: string };
  setBrandKit: (v: typeof brandKit) => void;
  endScreen: { enabled: boolean; duration: number };
  setEndScreen: (v: typeof endScreen) => void;
}) {
  const [tab, setTab] = useState('brand');

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBrandKit({ ...brandKit, logoUrl: URL.createObjectURL(file) });
  };

  return (
    <div className="bg-card border-t border-border">
      <div className="flex items-center justify-between px-4 pt-3 pb-0">
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Settings</span>
        <button onClick={onClose} className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center hover:bg-muted transition-colors">
          <X className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
      </div>
      <IconTabBar tabs={SETTINGS_TABS} active={tab} onChange={setTab} />
      <div className="px-4 py-4 space-y-4">

        {/* Brand Kit */}
        {tab === 'brand' && (
          <div className="space-y-3 animate-in fade-in-0 duration-200">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Background</span>
                <input type="color" value={brandKit.bgColor}
                  onChange={e => setBrandKit({ ...brandKit, bgColor: e.target.value })}
                  className="w-7 h-7 rounded border-0 cursor-pointer bg-transparent" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Accent</span>
                <input type="color" value={brandKit.accentColor}
                  onChange={e => setBrandKit({ ...brandKit, accentColor: e.target.value })}
                  className="w-7 h-7 rounded border-0 cursor-pointer bg-transparent" />
              </div>
            </div>

            <div>
              <span className="text-xs text-muted-foreground block mb-2">Logo</span>
              {brandKit.logoUrl ? (
                <div className="flex items-center gap-2">
                  <img src={brandKit.logoUrl} alt="Logo" className="h-8 object-contain" />
                  <button onClick={() => setBrandKit({ ...brandKit, logoUrl: null })} className="p-1 rounded hover:bg-muted">
                    <X className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                </div>
              ) : (
                <label className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-secondary text-xs text-secondary-foreground cursor-pointer hover:bg-muted transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  Upload logo
                  <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                </label>
              )}
            </div>

            <div>
              <span className="text-xs text-muted-foreground block mb-1.5">Slogan</span>
              <input type="text" value={brandKit.slogan}
                onChange={e => setBrandKit({ ...brandKit, slogan: e.target.value })}
                placeholder="e.g. Your tagline or website"
                className="w-full bg-secondary border border-border rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground" />
            </div>
          </div>
        )}

        {/* End Screen */}
        {tab === 'endscreen' && (
          <div className="space-y-3 animate-in fade-in-0 duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-foreground font-medium">Closing card</p>
                <p className="text-[10px] text-muted-foreground">Show logo & slogan at the end</p>
              </div>
              <Switch checked={endScreen.enabled} onCheckedChange={val => setEndScreen({ ...endScreen, enabled: val })} />
            </div>
            {endScreen.enabled && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Duration</span>
                <select value={endScreen.duration}
                  onChange={e => setEndScreen({ ...endScreen, duration: Number(e.target.value) })}
                  className="bg-secondary border border-border rounded-md px-2 py-1 text-xs text-foreground">
                  <option value={2}>2s</option>
                  <option value={3}>3s</option>
                  <option value={5}>5s</option>
                </select>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Export Button ────────────────────────────────────────────── */

function ExportButton() {
  const [state, setState] = useState<'idle' | 'exporting' | 'done'>('idle');
  const [progress, setProgress] = useState(0);

  const handleExport = () => {
    if (state !== 'idle') return;
    setState('exporting');
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        const next = prev + Math.random() * 8 + 2;
        if (next >= 100) {
          clearInterval(interval);
          setState('done');
          toast({ title: 'Export complete', description: 'Your video is ready to download.' });
          setTimeout(() => { setState('idle'); setProgress(0); }, 2500);
          return 100;
        }
        return next;
      });
    }, 100);
  };

  if (state === 'exporting') {
    return (
      <button disabled className="relative flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-primary/20 text-primary text-xs font-bold overflow-hidden min-w-[100px]">
        <div className="absolute inset-0 bg-primary/30 transition-all duration-150" style={{ width: `${progress}%` }} />
        <span className="relative z-10 tabular-nums">{Math.round(progress)}%</span>
      </button>
    );
  }

  if (state === 'done') {
    return (
      <button disabled className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-primary/20 text-primary text-xs font-bold min-w-[100px] justify-center">
        <Check className="w-3.5 h-3.5" /> Done
      </button>
    );
  }

  return (
    <button onClick={handleExport}
      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-sm hover:bg-primary/90 active:scale-95 transition-all">
      <Share2 className="w-3.5 h-3.5" /> Export
    </button>
  );
}

/* ─── AI Prompt Bar ───────────────────────────────────────────── */

function AIPromptBar() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setPrompt('');
      toast({ title: 'AI applied changes', description: 'Your video has been updated.' });
    }, 2000);
  };

  return (
    <form onSubmit={handleSubmit} className="px-3 py-2 border-t border-border/50">
      <div className="flex items-center gap-2 bg-secondary rounded-xl px-3 py-2">
        <Sparkles className="w-4 h-4 text-accent shrink-0" />
        <input
          value={prompt} onChange={e => setPrompt(e.target.value)}
          placeholder="Describe changes… e.g. make it more energetic"
          className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
          disabled={loading}
        />
        <button type="submit" disabled={loading || !prompt.trim()}
          className="w-7 h-7 rounded-lg bg-primary/20 text-primary flex items-center justify-center hover:bg-primary/30 transition-colors disabled:opacity-40 shrink-0">
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
        </button>
      </div>
    </form>
  );
}

/* ─── Main ────────────────────────────────────────────────────── */

export default function V12() {
  const navigate = useNavigate();
  const {
    scenes, activeIndex, activeScene, totalDuration,
    setActiveIndex, addScene, deleteScene, updateScene,
    brandKit, setBrandKit, endScreen, setEndScreen,
  } = useSceneStore();

  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [editingScene, setEditingScene] = useState<number | null>(null);
  const [showSettings, setShowSettings] = useState(false);
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

  // Keep filmstrip scroll synced
  useEffect(() => {
    if (!filmstripRef.current || !playing) return;
    const totalWidth = totalDuration * SCALE;
    const containerW = filmstripRef.current.clientWidth;
    const playheadPos = (currentTime / totalDuration) * totalWidth;
    filmstripRef.current.scrollLeft = playheadPos - containerW / 2;
  }, [currentTime, playing, totalDuration]);

  // Drag-to-scrub with distance threshold
  const didDrag = useRef(false);
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
      setCurrentTime(time);
      setActiveIndex(getSceneAtTime(time));
    }
  };
  const handleDragEnd = () => { dragging.current = false; };

  const handleSegmentTap = (index: number) => {
    if (!didDrag.current) {
      setActiveIndex(index);
      setEditingScene(index);
      setShowSettings(false);
      let t = 0;
      for (let i = 0; i < index; i++) t += scenes[i].endTime - scenes[i].startTime;
      setCurrentTime(t);
    }
  };

  const color = TEXT_COLOR_PAIRINGS.find(c => c.id === activeScene.textColorId) || TEXT_COLOR_PAIRINGS[0];
  const fontOpt = FONT_OPTIONS.find(f => f.id === activeScene.fontId) || FONT_OPTIONS[0];
  const gradientStyle = GRADIENT_STYLES.find(g => g.id === activeScene.gradient.style) || GRADIENT_STYLES[0];
  const positionClass = { top: 'justify-start pt-8', center: 'justify-center', bottom: 'justify-end pb-8' }[activeScene.textPosition];
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
    <div className="min-h-screen bg-background flex flex-col">
      {/* ─── Header (sticky) ─── */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm flex items-center justify-between px-4 h-12 shrink-0 border-b border-border/30">
        <img src={logo} alt="Logo" className="h-5" />
        <div className="flex items-center gap-2">
          <button onClick={() => { setShowSettings(!showSettings); setEditingScene(null); }}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] font-medium transition-colors ${showSettings ? 'bg-primary/20 text-primary' : 'bg-secondary text-muted-foreground hover:text-foreground'}`}>
            <Settings className="w-3.5 h-3.5" />
            <span className="hidden min-[380px]:inline">Brand</span>
          </button>
          <ExportButton />
        </div>
      </div>

      {/* ─── 9:16 Preview (fixed height) ─── */}
      <div className="h-[55vh] shrink-0 relative" style={{ background: 'hsl(var(--stage))' }}>
        <div className="absolute inset-0 flex items-center justify-center px-6 py-3">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl" style={{ aspectRatio: '9/16', height: '100%', width: 'auto' }}>
            {renderPreviewBg()}
            {activeScene.text && activeScene.assetType !== 'counter' && (
              <div className={`absolute inset-0 flex flex-col ${positionClass} px-5 z-10`}>
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

      {/* ─── Filmstrip with integrated playback ─── */}
      <div className="shrink-0 bg-card border-t border-border">
        {/* Compact playback row */}
        <div className="flex items-center gap-2 px-3 py-1.5">
          <button
            onClick={() => { if (currentTime >= totalDuration) setCurrentTime(0); setPlaying(!playing); }}
            className="w-8 h-8 rounded-xl bg-secondary flex items-center justify-center hover:bg-muted active:scale-95 transition-all shrink-0"
          >
            {playing ? <Pause className="w-3.5 h-3.5 text-foreground" /> : <Play className="w-3.5 h-3.5 text-foreground ml-0.5" />}
          </button>
          {/* Scrub bar */}
          <div className="flex-1 relative h-1.5 bg-secondary rounded-full cursor-pointer"
            onClick={e => {
              const rect = e.currentTarget.getBoundingClientRect();
              const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
              const time = +(ratio * totalDuration).toFixed(1);
              setCurrentTime(time);
              setActiveIndex(getSceneAtTime(time));
            }}>
            <div className="absolute inset-y-0 left-0 bg-primary rounded-full transition-all duration-100" style={{ width: `${totalDuration > 0 ? (currentTime / totalDuration) * 100 : 0}%` }} />
          </div>
          <span className="text-[10px] text-muted-foreground tabular-nums shrink-0">{formatTime(currentTime)} / {formatTime(totalDuration)}</span>
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
                onClick={() => { addScene(); toast({ title: 'Scene added' }); }}
                className="h-[72px] w-12 rounded-xl border-2 border-dashed border-border flex items-center justify-center shrink-0 hover:border-primary/50 hover:bg-primary/5 transition-all"
              >
                <Plus className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── AI Prompt Bar (sticky) ─── */}
      <div className="sticky bottom-0 z-20 bg-card">
        <AIPromptBar />
      </div>

      {/* ─── Settings Panel (inline) ─── */}
      {showSettings && <SettingsPanel onClose={() => setShowSettings(false)} brandKit={brandKit} setBrandKit={setBrandKit} endScreen={endScreen} setEndScreen={setEndScreen} />}

      {/* ─── Scene Editor (inline, scrollable) ─── */}
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

      {/* ─── Bottom info bar ─── */}
      {editingScene === null && !showSettings && (
        <div className="shrink-0 flex items-center justify-between px-4 py-2.5 border-t border-border/50">
          <span className="text-[11px] text-muted-foreground">{scenes.length} scene{scenes.length !== 1 ? 's' : ''} · {totalDuration.toFixed(1)}s</span>
          <span className="text-[10px] text-muted-foreground/50">Tap a clip to edit</span>
        </div>
      )}
    </div>
  );
}
