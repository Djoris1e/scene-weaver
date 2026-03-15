import { Switch } from '@/components/ui/switch';

interface EndScreenSettingsProps {
  enabled: boolean;
  duration: number;
  onUpdate: (updates: { enabled?: boolean; duration?: number }) => void;
}

export default function EndScreenSettings({ enabled, duration, onUpdate }: EndScreenSettingsProps) {
  return (
    <div className="bg-card rounded-xl border border-border p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Closing card</h3>
          <p className="text-[10px] text-muted-foreground">Show your logo and slogan at the end of the video</p>
        </div>
        <Switch checked={enabled} onCheckedChange={(val) => onUpdate({ enabled: val })} />
      </div>

      {enabled && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Duration</span>
          <select
            value={duration}
            onChange={(e) => onUpdate({ duration: Number(e.target.value) })}
            className="bg-secondary border border-border rounded-md px-2 py-1 text-xs text-foreground"
          >
            <option value={2}>2s</option>
            <option value={3}>3s</option>
            <option value={5}>5s</option>
          </select>
        </div>
      )}
    </div>
  );
}
