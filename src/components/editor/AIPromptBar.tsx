import { useState } from 'react';
import { Sparkles, Send, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function AIPromptBar() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setPrompt('');
      toast({ title: 'AI applied changes', description: 'Your video has been updated.' });
    }, 2000);
  };

  return (
    <form onSubmit={handleSubmit} className="px-3 py-2 bg-card rounded-xl border border-border/40">
      <div className="flex items-center gap-2 bg-secondary rounded-xl px-3 py-2">
        <Sparkles className="w-4 h-4 text-accent shrink-0" />
        <input
          value={prompt} onChange={e => setPrompt(e.target.value)}
          placeholder="Describe changes… e.g. make it more energetic"
          className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
          disabled={loading}
        />
        <button type="submit" disabled={loading || !prompt.trim()}
          className="w-7 h-7 rounded-lg bg-primary/20 text-primary flex items-center justify-center hover:bg-primary/30 transition-colors disabled:opacity-40 shrink-0">
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
        </button>
      </div>
    </form>
  );
}
