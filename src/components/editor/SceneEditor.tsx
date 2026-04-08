import { useState } from 'react';
import { Scene, TEXT_COLOR_PAIRINGS, FONT_OPTIONS, GRADIENT_STYLES, TEMPLATE_OPTIONS, TemplateType } from '@/types/scene';
import { BrandKit } from '@/hooks/useSceneStore';
import {
  Globe, Upload, Trash2, X, ChevronDown,
  Type, Paintbrush, Zap, Music, Diamond,
  Play, Volume2, VolumeX,
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import IconTabBar from '@/components/editor/IconTabBar';

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

type EditorTab = 'content' | 'style' | 'motion' | 'audio' | 'brand';

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">{children}</span>;
}

function FieldInput({ value, onChange, placeholder, type = 'text', ...rest }: {
  value: string | number; onChange: (v: string) => void; placeholder?: string; type?: string;
  [key: string]: any;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-secondary/60 border border-border/50 rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-colors"
      {...rest}
    />
  );
}

function FieldTextarea({ value, onChange, placeholder, maxLength, rows = 3 }: {
  value: string; onChange: (v: string) => void; placeholder?: string; maxLength?: number; rows?: number;
}) {
  return (
    <div className="space-y-1">
      <textarea
        value={value}
        onChange={e => onChange(maxLength ? e.target.value.slice(0, maxLength) : e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        rows={rows}
        className="w-full bg-secondary/60 border border-border/50 rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary/30 resize-none transition-colors"
      />
      {maxLength && (
        <span className="text-[10px] text-muted-foreground/50 tabular-nums float-right">{value.length}/{maxLength}</span>
      )}
    </div>
  );
}

function SelectField({ label, value, options, onChange }: {
  label: string;
  value: string;
  options: { value: string; label: string; description?: string }[];
  onChange: (v: string) => void;
}) {
  const selected = options.find(o => o.value === value);
  return (
    <div className="space-y-1.5">
      <FieldLabel>{label}</FieldLabel>
      <div className="relative">
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full appearance-none bg-secondary/60 border border-border/50 rounded-xl px-4 pt-2.5 pb-2 text-sm font-medium text-foreground cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary/30 transition-colors"
        >
          {options.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        {selected?.description && (
          <p className="text-[10px] text-muted-foreground/60 mt-1 px-1">{selected.description}</p>
        )}
      </div>
    </div>
  );
}

// ─── Mock audio tracks ───
const AUDIO_TRACKS = [
  { id: 'upbeat-1', name: 'Sunrise Energy', vibe: 'upbeat', duration: '2:34' },
  { id: 'chill-1', name: 'Ambient Drift', vibe: 'chill', duration: '3:12' },
  { id: 'cinematic-1', name: 'Epic Rise', vibe: 'cinematic', duration: '2:48' },
  { id: 'lofi-1', name: 'Lo-Fi Breeze', vibe: 'lo-fi', duration: '3:01' },
  { id: 'corporate-1', name: 'Clean Motion', vibe: 'corporate', duration: '2:22' },
];

// ─── Tab Content Components ───

function ContentTab({ scene, onUpdate, handleTemplateChange }: {
  scene: Scene; onUpdate: (u: Partial<Scene>) => void; handleTemplateChange: (t: string) => void;
}) {
  return (
    <div className="space-y-4 animate-in fade-in-0 duration-200">
      {/* Template picker — horizontal thumbnails */}
      <div className="space-y-1.5">
        <FieldLabel>Template</FieldLabel>
        <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
          {TEMPLATE_OPTIONS.map(t => (
            <button
              key={t.value}
              onClick={() => handleTemplateChange(t.value)}
              className={`shrink-0 flex flex-col items-center gap-1.5 p-2 rounded-xl border transition-all min-w-[72px]
                ${scene.template === t.value
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border/50 bg-secondary/40 text-muted-foreground hover:text-foreground hover:border-muted-foreground/30'
                }`}
            >
              <div className="w-10 h-14 rounded-lg bg-secondary/80 flex items-center justify-center text-[10px] font-bold">
                {t.label.charAt(0)}
              </div>
              <span className="text-[10px] font-medium leading-tight text-center">{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Template-specific fields */}
      {(scene.template === 'gradient-text' || scene.template === 'fullscreen') && (
        <div className="space-y-1.5">
          <FieldLabel>Text</FieldLabel>
          <FieldTextarea
            value={scene.text}
            onChange={v => onUpdate({ text: v })}
            placeholder="Your story begins."
            maxLength={120}
            rows={2}
          />
        </div>
      )}

      {scene.template === 'social-proof' && (
        <>
          <div className="space-y-1.5">
            <FieldLabel>Quote</FieldLabel>
            <FieldTextarea
              value={scene.socialProof.quote}
              onChange={v => onUpdate({ socialProof: { ...scene.socialProof, quote: v } })}
              placeholder="This changed how we create content."
              rows={3}
            />
          </div>
          <div className="space-y-1.5">
            <FieldLabel>Author name</FieldLabel>
            <FieldInput value={scene.socialProof.authorName}
              onChange={v => onUpdate({ socialProof: { ...scene.socialProof, authorName: v } })}
              placeholder="Sarah Chen" />
          </div>
          <div className="space-y-1.5">
            <FieldLabel>Author role</FieldLabel>
            <FieldInput value={scene.socialProof.authorRole}
              onChange={v => onUpdate({ socialProof: { ...scene.socialProof, authorRole: v } })}
              placeholder="Marketing Lead, TechCo" />
          </div>
          <div className="space-y-1.5">
            <FieldLabel>Star rating (1-5)</FieldLabel>
            <FieldInput type="number" value={scene.socialProof.starRating}
              onChange={v => onUpdate({ socialProof: { ...scene.socialProof, starRating: Math.min(5, Math.max(1, Number(v) || 1)) } })} />
          </div>
        </>
      )}

      {scene.template === 'counter' && (
        <>
          <div className="space-y-1.5">
            <FieldLabel>Number</FieldLabel>
            <FieldInput type="number" value={scene.counter.number}
              onChange={v => onUpdate({ counter: { ...scene.counter, number: Number(v) } })} />
          </div>
          <div className="space-y-1.5">
            <FieldLabel>Label</FieldLabel>
            <FieldInput value={scene.counter.label}
              onChange={v => onUpdate({ counter: { ...scene.counter, label: v } })}
              placeholder="Active users" />
          </div>
          <div className="space-y-1.5">
            <FieldLabel>Unit</FieldLabel>
            <FieldInput value={scene.counter.unit}
              onChange={v => onUpdate({ counter: { ...scene.counter, unit: v } })}
              placeholder="%, s, k, days" />
          </div>
        </>
      )}

      {scene.template === 'product-launch' && (
        <>
          <div className="space-y-1.5">
            <FieldLabel>Headline</FieldLabel>
            <FieldInput value={scene.productLaunch.headline}
              onChange={v => onUpdate({ productLaunch: { ...scene.productLaunch, headline: v } })}
              placeholder="Introducing the future" />
          </div>
          <div className="space-y-1.5">
            <FieldLabel>Subheadline</FieldLabel>
            <FieldInput value={scene.productLaunch.subheadline}
              onChange={v => onUpdate({ productLaunch: { ...scene.productLaunch, subheadline: v } })}
              placeholder="Everything you need, nothing you don't" />
          </div>
          <div className="space-y-1.5">
            <FieldLabel>CTA text</FieldLabel>
            <FieldInput value={scene.productLaunch.ctaText}
              onChange={v => onUpdate({ productLaunch: { ...scene.productLaunch, ctaText: v } })}
              placeholder="Get started →" />
          </div>
        </>
      )}

      {scene.template === 'end-screen' && (
        <div className="flex items-center gap-2 px-3 py-3 rounded-xl bg-accent/10 border border-accent/20">
          <Diamond className="w-3.5 h-3.5 text-accent shrink-0" />
          <span className="text-[11px] text-accent font-medium">End screen uses your Brand logo & slogan. Edit in the Brand tab.</span>
        </div>
      )}
    </div>
  );
}

function StyleTab({ scene, onUpdate }: { scene: Scene; onUpdate: (u: Partial<Scene>) => void }) {
  return (
    <div className="space-y-4 animate-in fade-in-0 duration-200">
      <div className="space-y-1.5">
        <FieldLabel>Font</FieldLabel>
        <div className="flex gap-2">
          {FONT_OPTIONS.map(f => (
            <button key={f.id} onClick={() => onUpdate({ fontId: f.id })}
              className={`flex-1 py-2 rounded-xl text-xs font-medium border transition-all
                ${scene.fontId === f.id
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border/50 bg-secondary/40 text-muted-foreground hover:text-foreground hover:border-muted-foreground/30'
                }`}
              style={{ fontFamily: f.family }}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        <FieldLabel>Text color</FieldLabel>
        <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
          {TEXT_COLOR_PAIRINGS.map(c => (
            <button key={c.id} onClick={() => onUpdate({ textColorId: c.id })} className="flex flex-col items-center gap-1 shrink-0">
              <div className={`w-7 h-7 rounded-full border-2 transition-all
                ${scene.textColorId === c.id ? 'border-primary scale-110' : 'border-border/40 hover:border-muted-foreground/50'}`}
                style={{ backgroundColor: c.text, boxShadow: scene.textColorId === c.id ? c.shadow : undefined }} />
              <span className="text-[9px] text-muted-foreground">{c.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        <FieldLabel>Text position</FieldLabel>
        <div className="flex gap-2">
          {(['top', 'center', 'bottom'] as const).map(pos => (
            <button key={pos} onClick={() => onUpdate({ textPosition: pos })}
              className={`flex-1 py-2 rounded-xl text-xs font-medium border capitalize transition-all
                ${scene.textPosition === pos
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border/50 bg-secondary/40 text-muted-foreground hover:text-foreground hover:border-muted-foreground/30'
                }`}>
              {pos}
            </button>
          ))}
        </div>
      </div>

      {(scene.template === 'gradient-text' || scene.template === 'social-proof' || scene.template === 'product-launch' || scene.template === 'end-screen') && (
        <div className="space-y-1.5">
          <FieldLabel>Gradient style</FieldLabel>
          <div className="grid grid-cols-4 gap-2">
            {GRADIENT_STYLES.slice(0, 8).map(g => (
              <button key={g.id} onClick={() => onUpdate({ gradient: { ...scene.gradient, style: g.id } })}
                className={`aspect-square rounded-xl border-2 transition-all overflow-hidden
                  ${scene.gradient.style === g.id ? 'border-primary scale-105' : 'border-border/30 hover:border-muted-foreground/40'}`}>
                <div className="w-full h-full" style={{ background: g.preview }} />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MotionTab({ scene, onUpdate }: { scene: Scene; onUpdate: (u: Partial<Scene>) => void }) {
  return (
    <div className="space-y-4 animate-in fade-in-0 duration-200">
      <SelectField label="Transition" value={scene.transition}
        options={[
          { value: 'default', label: 'Cut', description: 'Standard cut between scenes' },
          { value: 'crossfade', label: 'Crossfade', description: 'Smooth blend between scenes' },
          { value: 'zoom-in', label: 'Zoom In', description: 'Camera zooms into next scene' },
          { value: 'flash', label: 'Flash', description: 'Bright flash transition' },
          { value: 'slide', label: 'Slide', description: 'Slides to next scene' },
        ]}
        onChange={v => onUpdate({ transition: v as any })} />

      <SelectField label="Text effect" value={scene.textEffect}
        options={[
          { value: 'default', label: 'None' },
          { value: 'fade-in', label: 'Fade In', description: 'Text fades in smoothly' },
          { value: 'typewriter', label: 'Typewriter', description: 'Character-by-character reveal' },
          { value: 'scale-up', label: 'Scale Up', description: 'Text scales up from small' },
        ]}
        onChange={v => onUpdate({ textEffect: v as any })} />

      <SelectField label="Animation" value={scene.animation}
        options={[
          { value: 'none', label: 'None' },
          { value: 'ken-burns', label: 'Ken Burns', description: 'Slow pan and zoom' },
          { value: 'drift', label: 'Drift', description: 'Gentle floating movement' },
          { value: 'pulse', label: 'Pulse', description: 'Subtle pulsing effect' },
        ]}
        onChange={v => onUpdate({ animation: v as any })} />
    </div>
  );
}

function AudioTab() {
  const [selectedTrack, setSelectedTrack] = useState('upbeat-1');
  const [muted, setMuted] = useState(false);

  return (
    <div className="space-y-4 animate-in fade-in-0 duration-200">
      {/* Current track */}
      <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/60 border border-border/30">
        <button className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 hover:bg-primary/30 transition-colors">
          <Play className="w-3.5 h-3.5 ml-0.5" />
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-foreground truncate">
            {AUDIO_TRACKS.find(t => t.id === selectedTrack)?.name}
          </p>
          <p className="text-[10px] text-muted-foreground">
            {AUDIO_TRACKS.find(t => t.id === selectedTrack)?.vibe} · {AUDIO_TRACKS.find(t => t.id === selectedTrack)?.duration}
          </p>
        </div>
        <button onClick={() => setMuted(!muted)}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
          {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Track list */}
      <div className="space-y-1.5">
        <FieldLabel>Change track</FieldLabel>
        <div className="space-y-1">
          {AUDIO_TRACKS.map(track => (
            <button key={track.id} onClick={() => setSelectedTrack(track.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all
                ${selectedTrack === track.id
                  ? 'bg-primary/10 border border-primary/30'
                  : 'bg-secondary/30 border border-transparent hover:bg-secondary/60'
                }`}>
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-medium truncate ${selectedTrack === track.id ? 'text-primary' : 'text-foreground'}`}>
                  {track.name}
                </p>
                <p className="text-[10px] text-muted-foreground">{track.duration}</p>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium
                ${selectedTrack === track.id ? 'bg-primary/20 text-primary' : 'bg-secondary text-muted-foreground'}`}>
                {track.vibe}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function BrandTab({ brandKit, setBrandKit, endScreen, setEndScreen }: {
  brandKit: BrandKit; setBrandKit: (v: BrandKit) => void;
  endScreen: { enabled: boolean; duration: number }; setEndScreen: (v: { enabled: boolean; duration: number }) => void;
}) {
  return (
    <div className="space-y-4 animate-in fade-in-0 duration-200">
      <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-accent/8 border border-accent/15">
        <Globe className="w-3.5 h-3.5 text-accent shrink-0" />
        <span className="text-[11px] text-accent font-medium">Applies to all scenes</span>
      </div>

      <div className="flex gap-4">
        <div className="space-y-1.5">
          <FieldLabel>Background</FieldLabel>
          <input type="color" value={brandKit.bgColor}
            onChange={e => setBrandKit({ ...brandKit, bgColor: e.target.value })}
            className="w-10 h-10 rounded-xl border-2 border-border/40 cursor-pointer bg-transparent p-0.5" />
        </div>
        <div className="space-y-1.5">
          <FieldLabel>Accent</FieldLabel>
          <input type="color" value={brandKit.accentColor}
            onChange={e => setBrandKit({ ...brandKit, accentColor: e.target.value })}
            className="w-10 h-10 rounded-xl border-2 border-border/40 cursor-pointer bg-transparent p-0.5" />
        </div>
      </div>

      <div className="space-y-1.5">
        <FieldLabel>Logo</FieldLabel>
        {brandKit.logoUrl ? (
          <div className="flex items-center gap-3 bg-secondary/40 rounded-xl px-3 py-2">
            <img src={brandKit.logoUrl} alt="Logo" className="h-8 object-contain" />
            <div className="flex-1" />
            <button onClick={() => setBrandKit({ ...brandKit, logoUrl: null })}
              className="w-6 h-6 rounded-lg flex items-center justify-center hover:bg-muted transition-colors">
              <X className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          </div>
        ) : (
          <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-secondary/60 border border-border/50 text-xs text-muted-foreground cursor-pointer hover:bg-secondary hover:text-foreground transition-all">
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
        <FieldLabel>Slogan</FieldLabel>
        <FieldInput value={brandKit.slogan}
          onChange={v => setBrandKit({ ...brandKit, slogan: v })}
          placeholder="e.g. Your tagline or website" />
      </div>

      <div className="border-t border-border/20 pt-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-foreground font-medium">End screen</p>
            <p className="text-[10px] text-muted-foreground">Show logo & slogan at the end</p>
          </div>
          <Switch checked={endScreen.enabled} onCheckedChange={val => setEndScreen({ ...endScreen, enabled: val })} />
        </div>
        {endScreen.enabled && (
          <div className="flex items-center gap-2">
            <FieldLabel>Duration</FieldLabel>
            <select value={endScreen.duration}
              onChange={e => setEndScreen({ ...endScreen, duration: Number(e.target.value) })}
              className="bg-secondary/60 border border-border/50 rounded-lg px-2 py-1 text-xs text-foreground cursor-pointer">
              <option value={2}>2s</option>
              <option value={3}>3s</option>
              <option value={5}>5s</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Component ───

const EDITOR_TABS = [
  { id: 'content', label: 'Content', icon: <Type className="w-4 h-4" /> },
  { id: 'style', label: 'Style', icon: <Paintbrush className="w-4 h-4" /> },
  { id: 'motion', label: 'Motion', icon: <Zap className="w-4 h-4" /> },
  { id: 'audio', label: 'Audio', icon: <Music className="w-4 h-4" /> },
  { id: 'brand', label: 'Brand', icon: <Diamond className="w-4 h-4" /> },
];

export default function SceneEditor({
  scene, index, onUpdate, onDelete, onClose, totalScenes,
  brandKit, setBrandKit, endScreen, setEndScreen,
}: SceneEditorProps) {
  const [tab, setTab] = useState<EditorTab>('content');

  const handleTemplateChange = (t: string) => {
    const template = t as TemplateType;
    let assetType = scene.assetType;
    if (template === 'counter') assetType = 'counter';
    else if (template === 'fullscreen') assetType = 'media';
    else if (template === 'gradient-text' || template === 'social-proof' || template === 'product-launch' || template === 'end-screen') assetType = 'gradient';
    onUpdate({ template, assetType });
  };

  return (
    <div className="bg-card/80 backdrop-blur-sm rounded-2xl border border-border/30 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/20">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-foreground">Scene {index + 1}/{totalScenes}</span>
          <span className="text-[10px] text-muted-foreground/60">·</span>
          <span className="text-[10px] text-muted-foreground tabular-nums">{scene.startTime.toFixed(1)}s – {scene.endTime.toFixed(1)}s</span>
        </div>
        <div className="flex items-center gap-1.5">
          {totalScenes > 1 && (
            <button onClick={onDelete}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 5-tab icon bar */}
      <IconTabBar tabs={EDITOR_TABS} active={tab} onChange={id => setTab(id as EditorTab)} />

      {/* Tab content */}
      <div className="px-4 py-4">
        {tab === 'content' && <ContentTab scene={scene} onUpdate={onUpdate} handleTemplateChange={handleTemplateChange} />}
        {tab === 'style' && <StyleTab scene={scene} onUpdate={onUpdate} />}
        {tab === 'motion' && <MotionTab scene={scene} onUpdate={onUpdate} />}
        {tab === 'audio' && <AudioTab />}
        {tab === 'brand' && <BrandTab brandKit={brandKit} setBrandKit={setBrandKit} endScreen={endScreen} setEndScreen={setEndScreen} />}
      </div>
    </div>
  );
}
