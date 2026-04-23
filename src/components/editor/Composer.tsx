import { useState } from 'react';
import { ImagePlus, Link2, FileText, Palette, ChevronDown, Send } from 'lucide-react';

interface ComposerProps {
  onSend?: (text: string, scope: string) => void;
  compact?: boolean; // tablet → icon-only chips
}

const SCOPES = ['Whole video', 'Active scene', 'Selected range'];

export default function Composer({ onSend, compact = false }: ComposerProps) {
  const [text, setText] = useState('');
  const [scope, setScope] = useState(SCOPES[0]);
  const [scopeOpen, setScopeOpen] = useState(false);

  const send = () => {
    if (!text.trim()) return;
    onSend?.(text.trim(), scope);
    setText('');
  };

  const chips = [
    { id: 'media', icon: ImagePlus, label: 'Media' },
    { id: 'url', icon: Link2, label: 'URL' },
    { id: 'docs', icon: FileText, label: 'Docs' },
    { id: 'brand', icon: Palette, label: 'Brand kit' },
  ];

  return (
    <div className="border-t border-border/40 bg-background/95 backdrop-blur-md p-3 space-y-2.5">
      {/* Scope dropdown */}
      <div className="relative inline-block">
        <button
          onClick={() => setScopeOpen(o => !o)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-secondary/60 hover:bg-secondary text-[11px] font-medium text-foreground transition-colors"
        >
          <span className="w-3.5 h-3.5 rounded-sm bg-primary/80" />
          {scope}
          <ChevronDown className={`w-3 h-3 transition-transform ${scopeOpen ? 'rotate-180' : ''}`} />
        </button>
        {scopeOpen && (
          <div className="absolute bottom-full mb-1 left-0 z-20 min-w-[160px] rounded-xl border border-border/40 bg-popover p-1 shadow-xl">
            {SCOPES.map(s => (
              <button
                key={s}
                onClick={() => { setScope(s); setScopeOpen(false); }}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-colors ${
                  s === scope ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Textarea */}
      <div className="relative rounded-2xl bg-secondary/40 border border-border/40 focus-within:border-primary/50 transition-colors">
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); send(); } }}
          rows={2}
          placeholder="Ask the chat to edit your video…"
          className="w-full bg-transparent resize-none px-3.5 py-2.5 pr-11 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
        />
        <button
          onClick={send}
          disabled={!text.trim()}
          className="absolute bottom-2 right-2 w-8 h-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-primary/90 active:scale-95 transition-all shadow-md shadow-primary/20"
          aria-label="Send"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Action chips */}
      <div className={`flex items-center gap-1.5 ${compact ? '' : 'flex-wrap'}`}>
        {chips.map(c => {
          const Icon = c.icon;
          return (
            <button
              key={c.id}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-secondary/40 hover:bg-secondary border border-border/30 hover:border-border text-[11px] font-medium text-muted-foreground hover:text-foreground transition-all"
              title={c.label}
            >
              <Icon className="w-3.5 h-3.5" />
              {!compact && <span>{c.label}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
