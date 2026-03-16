import { useState } from 'react';
import { Scene, TEXT_COLOR_PAIRINGS, FONT_OPTIONS, GRADIENT_STYLES } from '@/types/scene';
import { BrandKit } from '@/hooks/useSceneStore';
import {
  Type, Image, Globe,
  Sparkles as MotionIcon,
  Search, Upload, Palette, Code,
  Trash2, X,
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import IconTabBar from './IconTabBar';
import DropdownSelect from './DropdownSelect';

const EDITOR_TABS = [
  { id: 'text', label: 'Text', icon: <Type className="w-5 h-5" /> },
  { id: 'media', label: 'Media', icon: <Image className="w-5 h-5" /> },
  { id: 'motion', label: 'Motion', icon: <MotionIcon className="w-5 h-5" /> },
  { id: 'brand', label: 'Brand', icon: <Globe className="w-5 h-5" /> },
];

interface SceneEditorProps {
  scene: Scene;
  index: number;
  onUpdate: (u: Partial<Scene>) => void;
  onDelete: () => void;
  onClose: () => void;
  totalScenes: number;
  brandKit: BrandKit;
  setBrandKit: (v: BrandKit) => void;
  endScreen: { enabled: boolean; duration: number };
  setEndScreen: (v: { enabled: boolean; duration: number }) => void;
}

export default function SceneEditor({
  scene, index, onUpdate, onDelete, onClose, totalScenes,
  brandKit, setBrandKit, endScreen, setEndScreen,
}: SceneEditorProps) {
  const [tab, setTab] = useState('text');

  return (
    <div className="bg-card rounded-xl border border-border/40">
      <div className="flex items-center justify-between px-4 pt-3 pb-0">
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Scene {index + 1}</span>
        <div className="flex items-center gap-2">
          {totalScenes > 1 && (
            <button onClick={onDelete}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary text-muted-foreground text-[11px] font-medium hover:text-destructive hover:bg-destructive/10 transition-all">
              <Trash2 className="w-3 h-3" /> Delete
            </button>
          )}
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center hover:bg-muted transition-colors">
            <X className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        </div>
      </div>

      <IconTabBar tabs={EDITOR_TABS} active={tab} onChange={setTab} />

      <div className="px-4 py-4 space-y-4">
        {/* Text tab */}
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
            <DropdownSelect
              label="Font"
              value={scene.fontId}
              options={FONT_OPTIONS.map(f => ({ value: f.id, label: f.label }))}
              onChange={v => onUpdate({ fontId: v })}
            />
            <div className="space-y-1.5">
              <span className="text-xs text-muted-foreground">Text color</span>
              <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
                {TEXT_COLOR_PAIRINGS.map(c => (
                  <button key={c.id} onClick={() => onUpdate({ textColorId: c.id })} className="flex flex-col items-center gap-1 shrink-0">
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
            <DropdownSelect label="Text effect" value={scene.textEffect}
              options={[
                { value: 'default', label: 'Default' }, { value: 'fade-in', label: 'Fade In' },
                { value: 'typewriter', label: 'Typewriter' }, { value: 'scale-up', label: 'Scale Up' },
              ]}
              onChange={v => onUpdate({ textEffect: v })}
            />
            <DropdownSelect label="Text position" value={scene.textPosition}
              options={[
                { value: 'top', label: 'Top' }, { value: 'center', label: 'Center' }, { value: 'bottom', label: 'Bottom' },
              ]}
              onChange={v => onUpdate({ textPosition: v })}
            />
          </div>
        )}

        {/* Media tab */}
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
                  <button key={item.type}
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
            {scene.assetType === 'counter' && (
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <span className="text-xs text-muted-foreground">Number</span>
                  <input type="number" value={scene.counter.number}
                    onChange={e => onUpdate({ counter: { ...scene.counter, number: Number(e.target.value) } })}
                    className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/30" />
                </div>
                <div className="space-y-1.5">
                  <span className="text-xs text-muted-foreground">Label</span>
                  <input type="text" value={scene.counter.label}
                    onChange={e => onUpdate({ counter: { ...scene.counter, label: e.target.value } })}
                    className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/30" />
                </div>
                <div className="space-y-1.5">
                  <span className="text-xs text-muted-foreground">Unit (%, s, k, days)</span>
                  <input type="text" value={scene.counter.unit}
                    onChange={e => onUpdate({ counter: { ...scene.counter, unit: e.target.value } })}
                    className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/30" />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Motion tab */}
        {tab === 'motion' && (
          <div className="space-y-4 animate-in fade-in-0 duration-200">
            <DropdownSelect label="Transition" value={scene.transition}
              options={[
                { value: 'default', label: 'Default' }, { value: 'crossfade', label: 'Crossfade' },
                { value: 'zoom-in', label: 'Zoom In' }, { value: 'flash', label: 'Flash' }, { value: 'slide', label: 'Slide' },
              ]}
              onChange={v => onUpdate({ transition: v })}
            />
            <DropdownSelect label="Animation" value={scene.animation}
              options={[
                { value: 'none', label: 'None' }, { value: 'ken-burns', label: 'Ken Burns' },
                { value: 'drift', label: 'Drift' }, { value: 'pulse', label: 'Pulse' },
              ]}
              onChange={v => onUpdate({ animation: v })}
            />
            <DropdownSelect label="Overlays" value={scene.overlays.length > 0 ? scene.overlays[0] : 'none'}
              options={[
                { value: 'none', label: 'None' }, { value: 'vignette', label: 'Vignette' },
                { value: 'film-grain', label: 'Film Grain' }, { value: 'rgb-split', label: 'RGB Split' },
              ]}
              onChange={v => onUpdate({ overlays: v === 'none' ? [] : [v] })}
            />
          </div>
        )}

        {/* Brand tab (global) */}
        {tab === 'brand' && (
          <div className="space-y-4 animate-in fade-in-0 duration-200">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-accent/10 border border-accent/20">
              <Globe className="w-3.5 h-3.5 text-accent shrink-0" />
              <span className="text-[11px] text-accent font-medium">These settings apply to all scenes in this video</span>
            </div>
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
                <label className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-secondary text-xs text-secondary-foreground cursor-pointer hover:bg-muted transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  Upload logo
                  <input type="file" accept="image/*" className="hidden" onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) setBrandKit({ ...brandKit, logoUrl: URL.createObjectURL(file) });
                  }} />
                </label>
              )}
            </div>
            <div className="space-y-1.5">
              <span className="text-xs text-muted-foreground">Slogan</span>
              <input type="text" value={brandKit.slogan}
                onChange={e => setBrandKit({ ...brandKit, slogan: e.target.value })}
                placeholder="e.g. Your tagline or website"
                className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary/30" />
            </div>
            <div className="pt-2 border-t border-border/50 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-foreground font-medium">End screen</p>
                  <p className="text-[10px] text-muted-foreground">Show logo & slogan at the end</p>
                </div>
                <Switch checked={endScreen.enabled} onCheckedChange={val => setEndScreen({ ...endScreen, enabled: val })} />
              </div>
              {endScreen.enabled && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Duration</span>
                  <select value={endScreen.duration}
                    onChange={e => setEndScreen({ ...endScreen, duration: Number(e.target.value) })}
                    className="bg-secondary border border-border rounded-lg px-2 py-1 text-xs text-foreground">
                    <option value={2}>2s</option>
                    <option value={3}>3s</option>
                    <option value={5}>5s</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
