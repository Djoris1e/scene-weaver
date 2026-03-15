import { Scene, TextEffect } from '@/types/scene';
import { Textarea } from '@/components/ui/textarea';

interface TextTabProps {
  scene: Scene;
  onUpdate: (updates: Partial<Scene>) => void;
}

export default function TextTab({ scene, onUpdate }: TextTabProps) {
  return (
    <div className="space-y-3 p-4">
      <Textarea
        value={scene.text}
        onChange={(e) => onUpdate({ text: e.target.value.slice(0, 150) })}
        placeholder="Write your scene copy..."
        className="bg-secondary border-border text-foreground resize-none h-20 text-sm"
        maxLength={150}
      />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Effect</span>
          <select
            value={scene.textEffect}
            onChange={(e) => onUpdate({ textEffect: e.target.value as TextEffect })}
            className="bg-secondary border border-border rounded-md px-2.5 py-1.5 text-xs text-foreground"
          >
            <option value="default">Default</option>
            <option value="fade-in">Fade In</option>
            <option value="typewriter">Typewriter</option>
            <option value="scale-up">Scale Up</option>
          </select>
        </div>
        <span className="text-[10px] text-muted-foreground">{scene.text.length}/150</span>
      </div>
    </div>
  );
}
