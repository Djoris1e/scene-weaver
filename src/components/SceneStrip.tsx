import { Scene, GRADIENT_STYLES } from '@/types/scene';
import { Plus, X } from 'lucide-react';

interface SceneStripProps {
  scenes: Scene[];
  activeIndex: number;
  onSelect: (index: number) => void;
  onAdd: () => void;
  onDelete: (index: number) => void;
}

export default function SceneStrip({ scenes, activeIndex, onSelect, onAdd, onDelete }: SceneStripProps) {
  return (
    <div className="flex-shrink-0 border-y border-border bg-scene-strip">
      <div className="flex items-center gap-1 px-3 py-1.5">
        <span className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground mr-1.5 flex-shrink-0">
          {scenes.length}
        </span>
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none flex-1">
          {scenes.map((scene, i) => {
            const grad = GRADIENT_STYLES.find(g => g.id === scene.gradient.style) || GRADIENT_STYLES[0];
            const isActive = i === activeIndex;
            return (
              <button
                key={scene.id}
                onClick={() => onSelect(i)}
                className={`relative flex-shrink-0 w-10 h-14 rounded-lg overflow-hidden transition-all ${
                  isActive
                    ? 'ring-2 ring-primary ring-offset-1 ring-offset-background scale-105'
                    : 'opacity-60 hover:opacity-90'
                }`}
              >
                {scene.assetType === 'media' && scene.backgroundUrl ? (
                  <img src={scene.backgroundUrl} alt="" className="w-full h-full object-cover" />
                ) : scene.assetType === 'counter' ? (
                  <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-primary" style={{ background: grad.preview }}>
                    {scene.counter.number}
                  </div>
                ) : (
                  <div className="w-full h-full" style={{ background: grad.preview }} />
                )}
                <span className="absolute bottom-0 inset-x-0 text-[7px] text-center bg-background/70 text-muted-foreground py-px">
                  {i + 1}
                </span>
                {scenes.length > 1 && isActive && (
                  <button
                    onClick={(e) => { e.stopPropagation(); onDelete(i); }}
                    className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-destructive rounded-full flex items-center justify-center"
                  >
                    <X className="w-2 h-2 text-destructive-foreground" />
                  </button>
                )}
              </button>
            );
          })}
          {scenes.length < 10 && (
            <button
              onClick={onAdd}
              className="flex-shrink-0 w-10 h-14 rounded-lg border border-dashed border-muted-foreground/25 flex items-center justify-center hover:border-primary/40 transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
