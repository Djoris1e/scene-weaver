import { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Loader2, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface AIPromptBarProps {
  expanded: boolean;
  onExpand: () => void;
  onCollapse: () => void;
}

export default function AIPromptBar({ expanded, onExpand, onCollapse }: AIPromptBarProps) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (expanded) inputRef.current?.focus();
  }, [expanded]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setPrompt('');
      toast({ title: 'AI applied changes', description: 'Your video has been updated.' });
      onCollapse();
    }, 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setPrompt('');
      onCollapse();
    }
  };

  if (!expanded) {
    return (
      <button
        onClick={onExpand}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-accent/20 text-accent text-xs font-bold hover:bg-accent/30 active:scale-95 transition-all shrink-0"
      >
        <Sparkles className="w-3.5 h-3.5" />
        <span>AI</span>
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex-1 min-w-0 flex items-center gap-2">
      <div className="flex-1 min-w-0 flex items-center gap-2 bg-secondary rounded-xl px-3 py-1.5">
        <Sparkles className="w-3.5 h-3.5 text-accent shrink-0" />
        <input
          ref={inputRef}
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe changes…"
          className="flex-1 min-w-0 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
          disabled={loading}
        />
        {prompt.trim() && (
          <button type="submit" disabled={loading}
            className="w-6 h-6 rounded-lg bg-primary/20 text-primary flex items-center justify-center hover:bg-primary/30 transition-colors disabled:opacity-40 shrink-0">
            {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
          </button>
        )}
      </div>
      <button type="button" onClick={() => { setPrompt(''); onCollapse(); }}
        className="w-8 h-8 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors shrink-0">
        <X className="w-4 h-4" />
      </button>
    </form>
  );
}
