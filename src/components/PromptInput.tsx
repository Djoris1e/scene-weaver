import { useState } from 'react';
import { Send, Loader2, Check } from 'lucide-react';

interface PromptInputProps {
  onGenerate: (prompt: string) => void;
}

export default function PromptInput({ onGenerate }: PromptInputProps) {
  const [prompt, setPrompt] = useState('');
  const [state, setState] = useState<'idle' | 'loading' | 'done'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || state === 'loading') return;
    setState('loading');
    setTimeout(() => {
      onGenerate(prompt);
      setState('done');
      setTimeout(() => setState('idle'), 2000);
    }, 2000);
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="What's your video about? e.g. gaming headset launch, fitness app promo..."
        className="w-full bg-card border border-border rounded-xl px-4 py-3.5 pr-12 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
      />
      <button
        type="submit"
        disabled={state === 'loading' || !prompt.trim()}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center hover:bg-primary/30 transition-colors disabled:opacity-40"
      >
        {state === 'loading' ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : state === 'done' ? (
          <Check className="w-4 h-4" />
        ) : (
          <Send className="w-4 h-4" />
        )}
      </button>
    </form>
  );
}
