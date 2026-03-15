import { Scene, GRADIENT_STYLES } from '@/types/scene';
import { Plus, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface SceneStripProps {
  scenes: Scene[];
  activeIndex: number;
  onSelect: (index: number) => void;
  onAdd: () => void;
  onDelete: (index: number) => void;
}

export default function SceneStrip({ scenes, activeIndex, onSelect, onAdd, onDelete }: SceneStripProps) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-scene-strip overflow-x-auto scrollbar-none flex-shrink-0">
      {scenes.map((scene, i) => {
        const gradientStyle = GRADIENT_STYLES.find(g => g.id === scene.gradient.style) || GRADIENT_STYLES[0];
        return (
          <motion.button
            key={scene.id}
            layout
            onClick={() => onSelect(i)}
            className={`relative flex-shrink-0 w-12 h-[68px] rounded-lg overflow-hidden border-2 transition-colors ${
              i === activeIndex ? 'border-primary' : 'border-transparent hover:border-muted-foreground/30'
            }`}
          >
            {scene.assetType === 'media' && scene.backgroundUrl ? (
              <img src={scene.backgroundUrl} alt="" className="w-full h-full object-cover" />
            ) : scene.assetType === 'counter' ? (
              <div className="w-full h-full flex items-center justify-center" style={{ background: gradientStyle.preview }}>
                <span className="text-xs font-bold text-primary">{scene.counter.number}</span>
              </div>
            ) : (
              <div className="w-full h-full" style={{ background: gradientStyle.preview }}>
                {scene.text && (
                  <div className="absolute inset-0 flex items-center justify-center px-1">
                    <span className="text-[6px] text-foreground/80 text-center leading-tight line-clamp-3">{scene.text}</span>
                  </div>
                )}
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-background/60 text-[7px] text-center text-muted-foreground py-0.5">
              #{i + 1}
            </div>
            {scenes.length > 1 && i === activeIndex && (
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(i); }}
                className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-destructive rounded-full flex items-center justify-center"
              >
                <X className="w-2.5 h-2.5 text-destructive-foreground" />
              </button>
            )}
          </motion.button>
        );
      })}
      {scenes.length < 10 && (
        <button
          onClick={onAdd}
          className="flex-shrink-0 w-12 h-[68px] rounded-lg border-2 border-dashed border-muted-foreground/30 flex items-center justify-center hover:border-primary/50 transition-colors"
        >
          <Plus className="w-4 h-4 text-muted-foreground" />
        </button>
      )}
    </div>
  );
}
