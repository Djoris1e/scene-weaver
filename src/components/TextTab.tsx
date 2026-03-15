import { Scene, TextPosition, TEXT_COLOR_PAIRINGS, FONT_OPTIONS } from '@/types/scene';
import { Textarea } from '@/components/ui/textarea';

interface TextTabProps {
  scene: Scene;
  onUpdate: (updates: Partial<Scene>) => void;
}

export default function TextTab({ scene, onUpdate }: TextTabProps) {
  const positions: { value: TextPosition; label: string }[] = [
    { value: 'top', label: 'Top' },
    { value: 'center', label: 'Center' },
    { value: 'bottom', label: 'Bottom' },
  ];

  return (
    <div className="space-y-4 p-4">
      <Textarea
        value={scene.text}
        onChange={(e) => onUpdate({ text: e.target.value.slice(0, 150) })}
        placeholder="Write your scene copy..."
        className="bg-secondary border-border text-foreground resize-none h-20 text-sm"
        maxLength={150}
      />
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Position</span>
        <span>{scene.text.length}/150</span>
      </div>

      {/* Position */}
      <div className="flex gap-2">
        {positions.map(p => (
          <button
            key={p.value}
            onClick={() => onUpdate({ textPosition: p.value })}
            className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-colors ${
              scene.textPosition === p.value
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-muted'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Colors */}
      <div>
        <span className="text-xs text-muted-foreground mb-2 block">Color</span>
        <div className="flex gap-2 flex-wrap">
          {TEXT_COLOR_PAIRINGS.map(c => (
            <button
              key={c.id}
              onClick={() => onUpdate({ textColorId: c.id })}
              className={`w-7 h-7 rounded-full border-2 transition-all ${
                scene.textColorId === c.id ? 'border-primary scale-110' : 'border-transparent'
              }`}
              style={{ backgroundColor: c.text }}
              title={c.label}
            />
          ))}
        </div>
      </div>

      {/* Fonts */}
      <div>
        <span className="text-xs text-muted-foreground mb-2 block">Font</span>
        <div className="flex gap-2">
          {FONT_OPTIONS.map(f => (
            <button
              key={f.id}
              onClick={() => onUpdate({ fontId: f.id })}
              className={`flex-1 py-2 rounded-md text-xs transition-colors ${
                scene.fontId === f.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-muted'
              }`}
              style={{ fontFamily: f.family }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
