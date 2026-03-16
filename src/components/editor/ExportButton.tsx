import { useState } from 'react';
import { Share2, Check } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function ExportButton() {
  const [state, setState] = useState<'idle' | 'exporting' | 'done'>('idle');
  const [progress, setProgress] = useState(0);

  const handleExport = () => {
    if (state !== 'idle') return;
    setState('exporting');
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        const next = prev + Math.random() * 8 + 2;
        if (next >= 100) {
          clearInterval(interval);
          setState('done');
          toast({ title: 'Export complete', description: 'Your video is ready to download.' });
          setTimeout(() => { setState('idle'); setProgress(0); }, 2500);
          return 100;
        }
        return next;
      });
    }, 100);
  };

  if (state === 'exporting') {
    return (
      <button disabled className="relative flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-primary/20 text-primary text-xs font-bold overflow-hidden min-w-[100px]">
        <div className="absolute inset-0 bg-primary/30 transition-all duration-150" style={{ width: `${progress}%` }} />
        <span className="relative z-10 tabular-nums">{Math.round(progress)}%</span>
      </button>
    );
  }

  if (state === 'done') {
    return (
      <button disabled className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-primary/20 text-primary text-xs font-bold min-w-[100px] justify-center">
        <Check className="w-3.5 h-3.5" /> Done
      </button>
    );
  }

  return (
    <button onClick={handleExport}
      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-sm hover:bg-primary/90 active:scale-95 transition-all">
      <Share2 className="w-3.5 h-3.5" /> Export
    </button>
  );
}
