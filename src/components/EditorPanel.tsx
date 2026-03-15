import { useState } from 'react';
import { Scene, TextEffect, TransitionType, AnimationType, OverlayType, TextPosition, GRADIENT_STYLES } from '@/types/scene';
import { BrandKit } from '@/hooks/useSceneStore';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Search, Upload, Palette, Code, ChevronDown, X } from 'lucide-react';

interface EditorPanelProps {
  scene: Scene;
  sceneIndex: number;
  onUpdate: (updates: Partial<Scene>) => void;
  onOpenSearch: () => void;
  brandKit: BrandKit;
  onBrandKitUpdate: (updates: Partial<BrandKit>) => void;
  endScreen: { enabled: boolean; duration: number };
  onEndScreenUpdate: (updates: { enabled?: boolean; duration?: number }) => void;
}

function Section({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
      >
        {title}
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="px-4 pb-4 space-y-3">{children}</div>}
    </div>
  );
}

function PillSelect<T extends string>({ value, options, onChange }: { value: T; options: { value: T; label: string }[]; onChange: (v: T) => void }) {
  return (
    <div className="flex gap-1 flex-wrap">
      {options.map(o => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
            value === o.value
              ? 'bg-primary/15 text-primary'
              : 'bg-secondary text-muted-foreground hover:text-foreground'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export default function EditorPanel({ scene, sceneIndex, onUpdate, onOpenSearch, brandKit, onBrandKitUpdate, endScreen, onEndScreenUpdate }: EditorPanelProps) {
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onUpdate({ backgroundUrl: URL.createObjectURL(file), assetType: 'media' });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onBrandKitUpdate({ logoUrl: URL.createObjectURL(file) });
  };

  return (
    <div className="bg-console">
      {/* Scene header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border">
        <span className="text-[11px] font-semibold text-foreground">Scene #{sceneIndex + 1}</span>
        <span className="text-[9px] tabular-nums text-muted-foreground">
          {scene.startTime.toFixed(1)}s – {scene.endTime.toFixed(1)}s
        </span>
      </div>

      {/* COPY — always visible */}
      <Section title="Copy" defaultOpen={true}>
        {scene.assetType === 'counter' ? (
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-[10px] text-muted-foreground block mb-1">Number</label>
              <Input
                type="number"
                value={scene.counter.number}
                onChange={(e) => onUpdate({ counter: { ...scene.counter, number: Number(e.target.value) } })}
                className="bg-secondary border-border h-8 text-xs"
              />
            </div>
            <div>
              <label className="text-[10px] text-muted-foreground block mb-1">Label</label>
              <Input
                value={scene.counter.label}
                onChange={(e) => onUpdate({ counter: { ...scene.counter, label: e.target.value } })}
                className="bg-secondary border-border h-8 text-xs"
              />
            </div>
            <div>
              <label className="text-[10px] text-muted-foreground block mb-1">Unit</label>
              <Input
                value={scene.counter.unit}
                onChange={(e) => onUpdate({ counter: { ...scene.counter, unit: e.target.value } })}
                className="bg-secondary border-border h-8 text-xs"
                placeholder="%"
              />
            </div>
          </div>
        ) : (
          <>
            <Textarea
              value={scene.text}
              onChange={(e) => onUpdate({ text: e.target.value.slice(0, 150) })}
              placeholder="Scene text…"
              className="bg-secondary border-border text-foreground resize-none h-16 text-xs"
              maxLength={150}
            />
            <div className="flex items-center justify-between">
              <PillSelect
                value={scene.textEffect}
                options={[
                  { value: 'default' as TextEffect, label: 'None' },
                  { value: 'fade-in' as TextEffect, label: 'Fade' },
                  { value: 'typewriter' as TextEffect, label: 'Type' },
                  { value: 'scale-up' as TextEffect, label: 'Scale' },
                ]}
                onChange={(v) => onUpdate({ textEffect: v })}
              />
              <span className="text-[9px] text-muted-foreground tabular-nums">{scene.text.length}/150</span>
            </div>
          </>
        )}
      </Section>

      {/* ASSET */}
      <Section title="Asset" defaultOpen={true}>
        {/* Type switcher */}
        <div className="grid grid-cols-4 gap-1.5">
          <button onClick={onOpenSearch} className="flex flex-col items-center gap-1 py-2 rounded-lg bg-secondary hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
            <Search className="w-3.5 h-3.5" />
            <span className="text-[9px]">Search</span>
          </button>
          <label className="flex flex-col items-center gap-1 py-2 rounded-lg bg-secondary hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
            <Upload className="w-3.5 h-3.5" />
            <span className="text-[9px]">Upload</span>
            <input type="file" accept="image/*,video/*" className="hidden" onChange={handleUpload} />
          </label>
          <button
            onClick={() => onUpdate({ assetType: 'gradient', backgroundUrl: null })}
            className={`flex flex-col items-center gap-1 py-2 rounded-lg transition-colors ${
              scene.assetType === 'gradient' ? 'bg-primary/15 text-primary' : 'bg-secondary text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span className="text-[9px]">Gradient</span>
          </button>
          <button
            onClick={() => onUpdate({ assetType: 'counter' })}
            className={`flex flex-col items-center gap-1 py-2 rounded-lg transition-colors ${
              scene.assetType === 'counter' ? 'bg-primary/15 text-primary' : 'bg-secondary text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span className="text-[9px]">Counter</span>
          </button>
        </div>

        {/* Gradient strip */}
        {scene.assetType === 'gradient' && (
          <div className="flex gap-1.5 overflow-x-auto scrollbar-none -mx-1 px-1">
            {GRADIENT_STYLES.map(g => (
              <button
                key={g.id}
                onClick={() => onUpdate({ gradient: { ...scene.gradient, style: g.id } })}
                className={`flex-shrink-0 w-12 h-12 rounded-lg border-2 transition-all ${
                  scene.gradient.style === g.id ? 'border-primary scale-110' : 'border-transparent'
                }`}
                style={{ background: g.preview }}
              />
            ))}
          </div>
        )}

        {/* Current media thumbnail */}
        {scene.assetType === 'media' && scene.backgroundUrl && (
          <div className="flex items-center gap-2">
            <div className="w-10 h-14 rounded-md overflow-hidden border border-border flex-shrink-0">
              <img src={scene.backgroundUrl} alt="" className="w-full h-full object-cover" />
            </div>
            <button
              onClick={() => onUpdate({ backgroundUrl: null, assetType: 'gradient' })}
              className="text-[10px] text-destructive hover:underline"
            >
              Remove
            </button>
          </div>
        )}
      </Section>

      {/* MOTION & EFFECTS — collapsed by default */}
      <Section title="Motion & Effects" defaultOpen={false}>
        <div className="space-y-3">
          <div>
            <label className="text-[10px] text-muted-foreground block mb-1.5">Transition</label>
            <PillSelect
              value={scene.transition}
              options={[
                { value: 'default' as TransitionType, label: 'Default' },
                { value: 'crossfade' as TransitionType, label: 'Crossfade' },
                { value: 'zoom-in' as TransitionType, label: 'Zoom In' },
                { value: 'flash' as TransitionType, label: 'Flash' },
                { value: 'slide' as TransitionType, label: 'Slide' },
              ]}
              onChange={(v) => onUpdate({ transition: v })}
            />
          </div>
          <div>
            <label className="text-[10px] text-muted-foreground block mb-1.5">Animation</label>
            <PillSelect
              value={scene.animation}
              options={[
                { value: 'none' as AnimationType, label: 'None' },
                { value: 'ken-burns' as AnimationType, label: 'Ken Burns' },
                { value: 'drift' as AnimationType, label: 'Drift' },
                { value: 'pulse' as AnimationType, label: 'Pulse' },
              ]}
              onChange={(v) => onUpdate({ animation: v })}
            />
          </div>
          <div>
            <label className="text-[10px] text-muted-foreground block mb-1.5">Overlays</label>
            <div className="flex gap-1.5 flex-wrap">
              {(['vignette', 'film-grain', 'rgb-split'] as OverlayType[]).map(o => {
                const active = scene.overlays.includes(o);
                return (
                  <button
                    key={o}
                    onClick={() => onUpdate({ overlays: active ? scene.overlays.filter(x => x !== o) : [...scene.overlays, o] })}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                      active ? 'bg-accent/15 text-accent' : 'bg-secondary text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {o === 'film-grain' ? 'Film Grain' : o === 'rgb-split' ? 'RGB Split' : 'Vignette'}
                  </button>
                );
              })}
            </div>
          </div>
          {scene.assetType !== 'counter' && (
            <div>
              <label className="text-[10px] text-muted-foreground block mb-1.5">Text Position</label>
              <PillSelect
                value={scene.textPosition}
                options={[
                  { value: 'top' as TextPosition, label: 'Top' },
                  { value: 'center' as TextPosition, label: 'Center' },
                  { value: 'bottom' as TextPosition, label: 'Bottom' },
                ]}
                onChange={(v) => onUpdate({ textPosition: v })}
              />
            </div>
          )}
        </div>
      </Section>

      {/* BRAND KIT — collapsed by default */}
      <Section title="Brand Kit" defaultOpen={false}>
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-muted-foreground">BG</span>
              <input
                type="color"
                value={brandKit.bgColor}
                onChange={(e) => onBrandKitUpdate({ bgColor: e.target.value })}
                className="w-6 h-6 rounded border-0 cursor-pointer bg-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-muted-foreground">Accent</span>
              <input
                type="color"
                value={brandKit.accentColor}
                onChange={(e) => onBrandKitUpdate({ accentColor: e.target.value })}
                className="w-6 h-6 rounded border-0 cursor-pointer bg-transparent"
              />
            </div>
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground block mb-1.5">Logo</span>
            {brandKit.logoUrl ? (
              <div className="flex items-center gap-2">
                <img src={brandKit.logoUrl} alt="Logo" className="h-7 object-contain" />
                <button onClick={() => onBrandKitUpdate({ logoUrl: null })} className="p-0.5 rounded hover:bg-muted">
                  <X className="w-3 h-3 text-muted-foreground" />
                </button>
              </div>
            ) : (
              <label className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-secondary text-[10px] text-secondary-foreground cursor-pointer hover:bg-muted transition-colors">
                <Upload className="w-3 h-3" />
                Upload logo
                <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
              </label>
            )}
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground block mb-1">Slogan / CTA</span>
            <Input
              value={brandKit.slogan}
              onChange={(e) => onBrandKitUpdate({ slogan: e.target.value })}
              placeholder="Your tagline…"
              className="bg-secondary border-border h-8 text-xs"
            />
          </div>
        </div>
      </Section>

      {/* END SCREEN — collapsed by default */}
      <Section title="Closing Card" defaultOpen={false}>
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-foreground">Show closing card</span>
            <Switch checked={endScreen.enabled} onCheckedChange={(val) => onEndScreenUpdate({ enabled: val })} />
          </div>
          {endScreen.enabled && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-muted-foreground">Duration</span>
              <PillSelect
                value={String(endScreen.duration)}
                options={[
                  { value: '2', label: '2s' },
                  { value: '3', label: '3s' },
                  { value: '5', label: '5s' },
                ]}
                onChange={(v) => onEndScreenUpdate({ duration: Number(v) })}
              />
            </div>
          )}
        </div>
      </Section>
    </div>
  );
}
