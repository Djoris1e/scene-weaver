import { useState, useCallback } from 'react';
import { Scene, GRADIENT_STYLES } from '@/types/scene';
import { Input } from '@/components/ui/input';
import { Search, Upload, Loader2, Palette, Code } from 'lucide-react';

interface MediaTabProps {
  scene: Scene;
  onUpdate: (updates: Partial<Scene>) => void;
  onOpenSearch: () => void;
}

export default function MediaTab({ scene, onUpdate, onOpenSearch }: MediaTabProps) {
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    onUpdate({ backgroundUrl: url, assetType: 'media' });
  };

  return (
    <div className="space-y-4 p-4">
      {/* Asset type switcher */}
      <div className="flex gap-2">
        <button
          onClick={onOpenSearch}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium bg-secondary text-secondary-foreground hover:bg-muted transition-colors"
        >
          <Search className="w-3.5 h-3.5" />
          Search
        </button>
        <label className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium bg-secondary text-secondary-foreground hover:bg-muted transition-colors cursor-pointer">
          <Upload className="w-3.5 h-3.5" />
          Upload
          <input type="file" accept="image/*,video/*" className="hidden" onChange={handleUpload} />
        </label>
        <button
          onClick={() => onUpdate({ assetType: 'gradient', backgroundUrl: null })}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-colors ${
            scene.assetType === 'gradient' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-muted'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          Gradient
        </button>
        <button
          onClick={() => onUpdate({ assetType: 'counter' })}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-colors ${
            scene.assetType === 'counter' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-muted'
          }`}
        >
          <Code className="w-3.5 h-3.5" />
          Counter
        </button>
      </div>

      {/* Gradient picker */}
      {scene.assetType === 'gradient' && (
        <div>
          <span className="text-xs text-muted-foreground mb-2 block">Pattern</span>
          <div className="flex gap-1.5 overflow-x-auto scrollbar-none pb-1">
            {GRADIENT_STYLES.map(g => (
              <button
                key={g.id}
                onClick={() => onUpdate({ gradient: { ...scene.gradient, style: g.id } })}
                className={`flex-shrink-0 w-14 h-14 rounded-lg border-2 transition-all ${
                  scene.gradient.style === g.id ? 'border-primary scale-105' : 'border-transparent hover:border-muted-foreground/30'
                }`}
                style={{ background: g.preview }}
                title={g.label}
              />
            ))}
          </div>
        </div>
      )}

      {/* Counter inputs */}
      {scene.assetType === 'counter' && (
        <div className="space-y-2">
          <div>
            <label className="text-xs text-muted-foreground block mb-1">Number</label>
            <Input
              type="number"
              value={scene.counter.number}
              onChange={(e) => onUpdate({ counter: { ...scene.counter, number: Number(e.target.value) } })}
              className="bg-secondary border-border h-9"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground block mb-1">Label</label>
            <Input
              value={scene.counter.label}
              onChange={(e) => onUpdate({ counter: { ...scene.counter, label: e.target.value } })}
              className="bg-secondary border-border h-9"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground block mb-1">Unit (%, s, k, days)</label>
            <Input
              value={scene.counter.unit}
              onChange={(e) => onUpdate({ counter: { ...scene.counter, unit: e.target.value } })}
              className="bg-secondary border-border h-9"
            />
          </div>
        </div>
      )}

      {/* Current background */}
      {scene.assetType === 'media' && scene.backgroundUrl && (
        <div>
          <span className="text-xs text-muted-foreground mb-1 block">Current</span>
          <div className="w-16 h-24 rounded-lg overflow-hidden border border-border">
            <img src={scene.backgroundUrl} alt="" className="w-full h-full object-cover" />
          </div>
        </div>
      )}
    </div>
  );
}
