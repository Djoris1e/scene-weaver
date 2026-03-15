import { useState } from 'react';
import { Scene, GRADIENT_STYLES, TEXT_COLOR_PAIRINGS, FONT_OPTIONS, TransitionType, TextEffect, AnimationType, OverlayType, TextPosition } from '@/types/scene';
import { Search, Upload, Palette, Code, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

interface SceneCardProps {
  scene: Scene;
  index: number;
  onUpdate: (updates: Partial<Scene>) => void;
  onDelete: () => void;
  onOpenSearch: () => void;
  canDelete: boolean;
}

export default function SceneCard({ scene, index, onUpdate, onDelete, onOpenSearch, canDelete }: SceneCardProps) {
  const [detailsOpen, setDetailsOpen] = useState(false);

  const gradientStyle = GRADIENT_STYLES.find(g => g.id === scene.gradient.style) || GRADIENT_STYLES[0];
  const color = TEXT_COLOR_PAIRINGS.find(c => c.id === scene.textColorId) || TEXT_COLOR_PAIRINGS[0];
  const font = FONT_OPTIONS.find(f => f.id === scene.fontId) || FONT_OPTIONS[0];

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    onUpdate({ backgroundUrl: url, assetType: 'media' });
  };

  const renderPreview = () => {
    const textOverlay = scene.text && (
      <div className={`absolute inset-0 flex items-${scene.textPosition === 'top' ? 'start pt-3' : scene.textPosition === 'bottom' ? 'end pb-3' : 'center'} justify-center px-3 z-10`}>
        <p
          className="text-[10px] leading-tight text-center break-words font-semibold"
          style={{ color: color.text, textShadow: color.shadow, fontFamily: font.family }}
        >
          {scene.text}
        </p>
      </div>
    );

    if (scene.assetType === 'media' && scene.backgroundUrl) {
      return (
        <div className="relative w-full h-full">
          <img src={scene.backgroundUrl} alt="" className="w-full h-full object-cover rounded-lg" />
          {textOverlay}
        </div>
      );
    }

    if (scene.assetType === 'counter') {
      return (
        <div className="relative w-full h-full rounded-lg flex items-center justify-center" style={{ background: gradientStyle.preview }}>
          <span className="text-2xl font-bold text-primary">{scene.counter.number}</span>
          {scene.text && (
            <p className="absolute bottom-2 left-0 right-0 text-center text-[8px] text-foreground/70">
              {scene.text}
            </p>
          )}
        </div>
      );
    }

    // gradient
    return (
      <div className="relative w-full h-full rounded-lg" style={{ background: gradientStyle.preview }}>
        {textOverlay}
      </div>
    );
  };

  const timeLabel = `${scene.startTime.toFixed(1)}s – ${scene.endTime.toFixed(1)}s`;

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5">
        <span className="text-xs font-semibold text-muted-foreground">#{index + 1}</span>
        <div className="flex items-center gap-1">
          <button onClick={onOpenSearch} className="p-1.5 rounded-md hover:bg-muted transition-colors" title="Search media">
            <Search className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
          <label className="p-1.5 rounded-md hover:bg-muted transition-colors cursor-pointer" title="Upload">
            <Upload className="w-3.5 h-3.5 text-muted-foreground" />
            <input type="file" accept="image/*,video/*" className="hidden" onChange={handleUpload} />
          </label>
          <button
            onClick={() => onUpdate({ assetType: 'gradient' })}
            className={`p-1.5 rounded-md transition-colors ${scene.assetType === 'gradient' ? 'bg-primary/20 text-primary' : 'hover:bg-muted text-muted-foreground'}`}
            title="Gradient"
          >
            <Palette className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onUpdate({ assetType: 'counter' })}
            className={`p-1.5 rounded-md transition-colors ${scene.assetType === 'counter' ? 'bg-primary/20 text-primary' : 'hover:bg-muted text-muted-foreground'}`}
            title="Counter"
          >
            <Code className="w-3.5 h-3.5" />
          </button>
          {canDelete && (
            <button onClick={onDelete} className="p-1.5 rounded-md hover:bg-destructive/20 transition-colors" title="Delete">
              <Trash2 className="w-3.5 h-3.5 text-muted-foreground hover:text-destructive" />
            </button>
          )}
        </div>
      </div>

      {/* Preview + inputs row */}
      <div className="px-4 pb-3 flex gap-3">
        {/* Thumbnail */}
        <div className="w-20 h-28 flex-shrink-0 rounded-lg overflow-hidden relative">
          {renderPreview()}
          <div className="absolute bottom-1 left-1 right-1 flex justify-between text-[7px] text-foreground/60 bg-background/60 rounded px-1 py-0.5">
            <span>{scene.assetType === 'gradient' ? 'Gradient' : scene.assetType === 'counter' ? 'Animation' : 'Media'}</span>
            <span>{timeLabel}</span>
          </div>
        </div>

        {/* Inputs */}
        <div className="flex-1 space-y-2 min-w-0">
          {scene.assetType === 'counter' ? (
            <>
              <select
                className="w-full bg-secondary border border-border rounded-md px-2.5 py-1.5 text-sm text-foreground"
                value="counter"
                disabled
              >
                <option value="counter">Counter</option>
              </select>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-muted-foreground block mb-0.5">Number</label>
                  <input
                    type="number"
                    value={scene.counter.number}
                    onChange={(e) => onUpdate({ counter: { ...scene.counter, number: Number(e.target.value) } })}
                    className="w-full bg-secondary border border-border rounded-md px-2 py-1 text-sm text-foreground"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-muted-foreground block mb-0.5">Label</label>
                  <input
                    type="text"
                    value={scene.counter.label}
                    onChange={(e) => onUpdate({ counter: { ...scene.counter, label: e.target.value } })}
                    className="w-full bg-secondary border border-border rounded-md px-2 py-1 text-sm text-foreground"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] text-muted-foreground block mb-0.5">Unit (%, s, k, days)</label>
                <input
                  type="text"
                  value={scene.counter.unit}
                  onChange={(e) => onUpdate({ counter: { ...scene.counter, unit: e.target.value } })}
                  className="w-full bg-secondary border border-border rounded-md px-2 py-1 text-sm text-foreground"
                />
              </div>
            </>
          ) : (
            <>
              <input
                type="text"
                value={scene.text}
                onChange={(e) => onUpdate({ text: e.target.value.slice(0, 150) })}
                placeholder="Scene copy..."
                className="w-full bg-secondary border border-border rounded-md px-2.5 py-1.5 text-sm text-foreground placeholder:text-muted-foreground"
              />
              <div className="flex gap-2">
                <span className="text-[10px] text-muted-foreground self-center shrink-0">Effect</span>
                <select
                  value={scene.textEffect}
                  onChange={(e) => onUpdate({ textEffect: e.target.value as TextEffect })}
                  className="flex-1 bg-secondary border border-border rounded-md px-2 py-1 text-xs text-foreground"
                >
                  <option value="default">Default</option>
                  <option value="fade-in">Fade In</option>
                  <option value="typewriter">Typewriter</option>
                  <option value="scale-up">Scale Up</option>
                </select>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Gradient picker inline (when gradient selected) */}
      {scene.assetType === 'gradient' && (
        <div className="px-4 pb-3">
          <div className="flex gap-1.5 overflow-x-auto scrollbar-none pb-2">
            {GRADIENT_STYLES.map(g => (
              <button
                key={g.id}
                onClick={() => onUpdate({ gradient: { ...scene.gradient, style: g.id } })}
                className={`flex-shrink-0 w-12 h-12 rounded-lg border-2 transition-all ${
                  scene.gradient.style === g.id ? 'border-primary scale-105' : 'border-transparent'
                }`}
                style={{ background: g.preview }}
                title={g.label}
              />
            ))}
          </div>
          <div className="flex gap-1.5 mt-1.5 overflow-x-auto scrollbar-none">
            {GRADIENT_STYLES.map(g => (
              <span key={g.id} className={`flex-shrink-0 w-12 text-center text-[8px] ${scene.gradient.style === g.id ? 'text-primary' : 'text-muted-foreground'}`}>
                {g.label}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Details toggle */}
      <button
        onClick={() => setDetailsOpen(!detailsOpen)}
        className="w-full flex items-center justify-center gap-1 py-2 text-xs text-muted-foreground hover:text-foreground border-t border-border transition-colors"
      >
        {detailsOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        Details
      </button>

      {/* Collapsible details */}
      {detailsOpen && (
        <div className="px-4 pb-4 space-y-3 border-t border-border pt-3">
          {/* Transition */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Transition</span>
            <select
              value={scene.transition}
              onChange={(e) => onUpdate({ transition: e.target.value as TransitionType })}
              className="bg-secondary border border-border rounded-md px-2 py-1 text-xs text-foreground"
            >
              <option value="default">Default</option>
              <option value="crossfade">Crossfade</option>
              <option value="zoom-in">Zoom In</option>
              <option value="flash">Flash</option>
              <option value="slide">Slide</option>
            </select>
          </div>

          {/* Animation */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Animation</span>
            <select
              value={scene.animation}
              onChange={(e) => onUpdate({ animation: e.target.value as AnimationType })}
              className="bg-secondary border border-border rounded-md px-2 py-1 text-xs text-foreground"
            >
              <option value="none">None</option>
              <option value="ken-burns">Ken Burns</option>
              <option value="drift">Drift</option>
              <option value="pulse">Pulse</option>
            </select>
          </div>

          {/* Overlays */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Overlays</span>
            <select
              value={scene.overlays.length > 0 ? scene.overlays[0] : 'none'}
              onChange={(e) => {
                const val = e.target.value as OverlayType;
                onUpdate({ overlays: val === ('none' as any) ? [] : [val] });
              }}
              className="bg-secondary border border-border rounded-md px-2 py-1 text-xs text-foreground"
            >
              <option value="none">None</option>
              <option value="vignette">Vignette</option>
              <option value="film-grain">Film Grain</option>
              <option value="rgb-split">RGB Split</option>
            </select>
          </div>

          {/* Text position */}
          {scene.assetType !== 'counter' && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Text position</span>
              <select
                value={scene.textPosition}
                onChange={(e) => onUpdate({ textPosition: e.target.value as TextPosition })}
                className="bg-secondary border border-border rounded-md px-2 py-1 text-xs text-foreground"
              >
                <option value="top">Top</option>
                <option value="center">Center</option>
                <option value="bottom">Bottom</option>
              </select>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
