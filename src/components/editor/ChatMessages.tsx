import { Sparkles, Check } from 'lucide-react';

interface ChatMessagesProps {
  sceneCount: number;
}

const ACTIONS = [
  { name: 'addScene', detail: 'added scene 3 (sceneIndex=2, ctaProof) — total 3 scenes' },
  { name: 'swapTrack', detail: 'music: (none) → Launch Sequence' },
  { name: 'setSceneVariable', detail: 'scene 1 transition: (unset) → "flash"' },
  { name: 'setSceneVariable', detail: 'scene 2 transition: (unset) → "cut"' },
  { name: 'setSceneVariable', detail: 'scene 3 transition: (unset) → "dip-to-black"' },
];

export default function ChatMessages({ sceneCount }: ChatMessagesProps) {
  return (
    <div className="space-y-4 px-4 py-4">
      {/* User prompt bubble */}
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl rounded-tr-md bg-primary/15 border border-primary/20 px-3.5 py-2.5">
          <p className="text-sm text-foreground">Make me a launch video for VanillaSky — 3 scenes, punchy.</p>
        </div>
      </div>

      {/* AI bubble — intro */}
      <div className="flex gap-2.5">
        <div className="w-7 h-7 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
        </div>
        <div className="flex-1 space-y-2">
          <p className="text-xs font-semibold text-muted-foreground">VanillaSky</p>
          <p className="text-sm text-foreground/90 leading-relaxed">
            On it. Drafting a kinetic 3-scene arc with a staccato hook and a proof closer.
          </p>
        </div>
      </div>

      {/* Action log */}
      <div className="space-y-1.5">
        {ACTIONS.map((a, i) => (
          <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/30 border border-border/30 font-mono text-[11px]">
            <Check className="w-3 h-3 text-emerald-400 shrink-0" />
            <span className="font-semibold text-foreground">{a.name}</span>
            <span className="text-muted-foreground truncate">{a.detail}</span>
          </div>
        ))}
      </div>

      {/* AI bubble — recap */}
      <div className="flex gap-2.5">
        <div className="w-7 h-7 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
        </div>
        <div className="flex-1 space-y-2 text-sm text-foreground/90 leading-relaxed">
          <p>
            Here's the full arc: kinetic staccato hook → problem/solution contrast body → proof closer on
            "6–10 sec videos, shipped instantly."
          </p>
          <p className="font-semibold">Three ways to push it further:</p>
          <ol className="list-decimal pl-5 space-y-1.5 text-foreground/80">
            <li><span className="font-semibold text-foreground">Got a launch stat?</span> Tell me a user count or G2 rating and I'll lead with it.</li>
            <li><span className="font-semibold text-foreground">Drop a screenshot.</span> A product shot will outperform the text contrast.</li>
            <li><span className="font-semibold text-foreground">Want it edgier?</span> Say "go all black" and I'll flip the palette.</li>
          </ol>
          <p className="text-xs text-muted-foreground pt-1">Working on {sceneCount} scene{sceneCount !== 1 ? 's' : ''}.</p>
        </div>
      </div>
    </div>
  );
}
