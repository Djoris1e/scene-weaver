import { Scene, GRADIENT_STYLES, TEMPLATE_OPTIONS } from '@/types/scene';
import { Plus, GripVertical } from 'lucide-react';

interface ScenesListProps {
  scenes: Scene[];
  activeIndex: number;
  onSelect: (i: number) => void;
  onAdd: () => void;
}

export default function ScenesList({ scenes, activeIndex, onSelect, onAdd }: ScenesListProps) {
  return (
    <div className="px-4 py-3 space-y-2">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70 px-1">
        {scenes.length} scene{scenes.length !== 1 ? 's' : ''}
      </p>
      {scenes.map((s, idx) => {
        const g = GRADIENT_STYLES.find(x => x.id === s.gradient.style) || GRADIENT_STYLES[0];
        const tpl = TEMPLATE_OPTIONS.find(t => t.value === s.template)?.label || 'Scene';
        const isActive = idx === activeIndex;
        const dur = s.endTime - s.startTime;
        return (
          <button
            key={s.id}
            onClick={() => onSelect(idx)}
            className={`w-full flex items-center gap-3 p-2 rounded-xl border transition-all text-left ${
              isActive
                ? 'border-primary bg-primary/5 shadow-sm shadow-primary/10'
                : 'border-border/40 hover:border-border bg-secondary/20'
            }`}
          >
            <GripVertical className="w-3.5 h-3.5 text-muted-foreground/40 shrink-0" />
            <div className="w-12 h-16 rounded-lg overflow-hidden shrink-0 relative" style={{ background: g.preview }}>
              {s.assetType === 'media' && s.backgroundUrl && (
                <img src={s.backgroundUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
              )}
              <div className="absolute top-1 left-1 w-4 h-4 rounded bg-background/70 flex items-center justify-center text-[9px] font-bold">
                {idx + 1}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">{tpl}</p>
              <p className="text-sm text-foreground truncate">{s.text || 'Untitled scene'}</p>
              <p className="text-[10px] text-muted-foreground tabular-nums mt-0.5">{dur.toFixed(1)}s</p>
            </div>
          </button>
        );
      })}
      <button
        onClick={onAdd}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-border hover:border-primary/50 hover:bg-primary/5 text-xs font-medium text-muted-foreground hover:text-primary transition-all"
      >
        <Plus className="w-3.5 h-3.5" /> Add scene
      </button>
    </div>
  );
}
