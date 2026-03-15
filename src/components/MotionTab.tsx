import { Scene, TransitionType, TextEffect } from '@/types/scene';

interface MotionTabProps {
  scene: Scene;
  onUpdate: (updates: Partial<Scene>) => void;
}

const transitions: { value: TransitionType; label: string; icon: string }[] = [
  { value: 'cut', label: 'Cut', icon: '⚡' },
  { value: 'fade', label: 'Fade', icon: '🌫' },
  { value: 'slide', label: 'Slide', icon: '➡' },
  { value: 'zoom', label: 'Zoom', icon: '🔍' },
];

const textEffects: { value: TextEffect; label: string; icon: string }[] = [
  { value: 'fade-in', label: 'Fade In', icon: '✨' },
  { value: 'typewriter', label: 'Typewriter', icon: '⌨' },
  { value: 'scale-up', label: 'Scale Up', icon: '📐' },
];

export default function MotionTab({ scene, onUpdate }: MotionTabProps) {
  return (
    <div className="space-y-5 p-4">
      {/* Transitions */}
      <div>
        <span className="text-xs text-muted-foreground mb-2 block font-medium uppercase tracking-wider">
          Scene Transition
        </span>
        <div className="grid grid-cols-4 gap-2">
          {transitions.map(t => (
            <button
              key={t.value}
              onClick={() => onUpdate({ transition: t.value })}
              className={`flex flex-col items-center gap-1 py-2.5 rounded-lg text-xs transition-all ${
                scene.transition === t.value
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                  : 'bg-secondary text-secondary-foreground hover:bg-muted'
              }`}
            >
              <span className="text-base">{t.icon}</span>
              <span className="font-medium">{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Text Effects */}
      <div>
        <span className="text-xs text-muted-foreground mb-2 block font-medium uppercase tracking-wider">
          Text Effect
        </span>
        <div className="grid grid-cols-3 gap-2">
          {textEffects.map(e => (
            <button
              key={e.value}
              onClick={() => onUpdate({ textEffect: e.value })}
              className={`flex flex-col items-center gap-1 py-2.5 rounded-lg text-xs transition-all ${
                scene.textEffect === e.value
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                  : 'bg-secondary text-secondary-foreground hover:bg-muted'
              }`}
            >
              <span className="text-base">{e.icon}</span>
              <span className="font-medium">{e.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
