import { Scene } from '@/types/scene';
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
    <div className="flex items-center gap-2 px-3 py-2 bg-scene-strip overflow-x-auto scrollbar-none">
      {scenes.map((scene, i) => (
        <motion.button
          key={scene.id}
          layout
          onClick={() => onSelect(i)}
          className={`relative flex-shrink-0 w-14 h-10 rounded-md overflow-hidden border-2 transition-colors ${
            i === activeIndex ? 'border-primary' : 'border-transparent hover:border-muted-foreground/30'
          }`}
        >
          {scene.backgroundUrl ? (
            <img src={scene.backgroundUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-secondary flex items-center justify-center">
              <span className="text-[10px] text-muted-foreground">{i + 1}</span>
            </div>
          )}
          {scenes.length > 1 && i === activeIndex && (
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(i); }}
              className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-destructive rounded-full flex items-center justify-center"
            >
              <X className="w-2.5 h-2.5 text-destructive-foreground" />
            </button>
          )}
        </motion.button>
      ))}
      {scenes.length < 10 && (
        <button
          onClick={onAdd}
          className="flex-shrink-0 w-14 h-10 rounded-md border-2 border-dashed border-muted-foreground/30 flex items-center justify-center hover:border-primary/50 transition-colors"
        >
          <Plus className="w-4 h-4 text-muted-foreground" />
        </button>
      )}
    </div>
  );
}
