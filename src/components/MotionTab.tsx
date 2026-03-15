import { Scene, TransitionType, AnimationType, OverlayType, TextPosition } from '@/types/scene';

interface MotionTabProps {
  scene: Scene;
  onUpdate: (updates: Partial<Scene>) => void;
}

const transitions: { value: TransitionType; label: string }[] = [
  { value: 'default', label: 'Default' },
  { value: 'crossfade', label: 'Crossfade' },
  { value: 'zoom-in', label: 'Zoom In' },
  { value: 'flash', label: 'Flash' },
  { value: 'slide', label: 'Slide' },
];

const animations: { value: AnimationType; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'ken-burns', label: 'Ken Burns' },
  { value: 'drift', label: 'Drift' },
  { value: 'pulse', label: 'Pulse' },
];

const overlays: { value: OverlayType; label: string }[] = [
  { value: 'vignette', label: 'Vignette' },
  { value: 'film-grain', label: 'Film Grain' },
  { value: 'rgb-split', label: 'RGB Split' },
];

export default function MotionTab({ scene, onUpdate }: MotionTabProps) {
  return (
    <div className="space-y-4 p-4">
      {/* Transition */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Transition</span>
        <select
          value={scene.transition}
          onChange={(e) => onUpdate({ transition: e.target.value as TransitionType })}
          className="bg-secondary border border-border rounded-md px-2.5 py-1.5 text-xs text-foreground"
        >
          {transitions.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
      </div>

      {/* Animation */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Animation</span>
        <select
          value={scene.animation}
          onChange={(e) => onUpdate({ animation: e.target.value as AnimationType })}
          className="bg-secondary border border-border rounded-md px-2.5 py-1.5 text-xs text-foreground"
        >
          {animations.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
        </select>
      </div>

      {/* Overlays */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Overlays</span>
        <select
          value={scene.overlays.length > 0 ? scene.overlays[0] : 'none'}
          onChange={(e) => {
            const val = e.target.value;
            onUpdate({ overlays: val === 'none' ? [] : [val as OverlayType] });
          }}
          className="bg-secondary border border-border rounded-md px-2.5 py-1.5 text-xs text-foreground"
        >
          <option value="none">None</option>
          {overlays.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      {/* Text position — only for text overlay scenes */}
      {scene.assetType !== 'counter' && (
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Text position</span>
          <select
            value={scene.textPosition}
            onChange={(e) => onUpdate({ textPosition: e.target.value as TextPosition })}
            className="bg-secondary border border-border rounded-md px-2.5 py-1.5 text-xs text-foreground"
          >
            <option value="top">Top</option>
            <option value="center">Center</option>
            <option value="bottom">Bottom</option>
          </select>
        </div>
      )}
    </div>
  );
}
