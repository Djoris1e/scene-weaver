import { Music, Play } from 'lucide-react';

const TRACKS = [
  { id: 'launch', name: 'Launch Sequence', mood: 'confident · happy', dur: '0:27', active: true },
  { id: 'funky', name: 'Funky Groove', mood: 'playful · happy', dur: '0:38' },
  { id: 'motivation', name: 'Motivation Drive', mood: 'inspiring', dur: '0:31' },
  { id: 'eternity', name: 'Eternity', mood: 'warm · relaxed', dur: '0:30' },
];

export default function AudioPanel() {
  return (
    <div className="px-4 py-3 space-y-3">
      <div className="rounded-xl border border-border/40 bg-secondary/20 p-3">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-2">Now playing</p>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg gradient-vs flex items-center justify-center shrink-0">
            <Music className="w-4 h-4 text-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">Launch Sequence</p>
            <p className="text-[11px] text-muted-foreground">confident · happy · 0:27</p>
          </div>
          <button className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <Play className="w-3.5 h-3.5 text-primary-foreground ml-0.5" />
          </button>
        </div>
        {/* Faux waveform */}
        <div className="flex items-end gap-0.5 h-8 mt-3">
          {Array.from({ length: 48 }).map((_, i) => {
            const h = 20 + Math.abs(Math.sin(i * 0.7)) * 80;
            const isPlayed = i < 18;
            return (
              <div key={i} className={`flex-1 rounded-sm ${isPlayed ? 'bg-primary' : 'bg-muted'}`} style={{ height: `${h}%` }} />
            );
          })}
        </div>
      </div>

      <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold px-1">Suggested tracks</p>
      {TRACKS.filter(t => !t.active).map(t => (
        <button key={t.id} className="w-full flex items-center gap-3 p-2 rounded-xl border border-border/40 hover:border-border bg-secondary/20 text-left transition-all">
          <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center shrink-0">
            <Music className="w-3.5 h-3.5 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{t.name}</p>
            <p className="text-[11px] text-muted-foreground">{t.mood} · {t.dur}</p>
          </div>
        </button>
      ))}
    </div>
  );
}
