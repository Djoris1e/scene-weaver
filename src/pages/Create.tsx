import { useState } from 'react';
import { Send, Link, X, Palette, ChevronDown, Sparkles, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function Create() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [showUrl, setShowUrl] = useState(false);
  const [url, setUrl] = useState('');
  const [showBrand, setShowBrand] = useState(false);
  const [brandColors, setBrandColors] = useState({ primary: '#E04F8A', secondary: '#EC9A2C' });
  const [logoUrl, setLogoUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({ title: 'Video generation started', description: 'Your cinematic video is being created.' });
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-2xl space-y-8">
        {/* Hero */}
        <div className="text-center space-y-4">
          <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight leading-tight">
            Turn any moment into a
            <br />
            <span className="gradient-vs-text">cinematic video</span>
          </h1>
          <p className="text-muted-foreground text-base md:text-lg max-w-md mx-auto leading-relaxed">
            No footage needed — use built-in animated backgrounds or your own media. Pick a beat, add text, and export in minutes.
          </p>
        </div>

        {/* Prompt Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/40 to-accent/30 rounded-2xl blur-sm opacity-60 group-focus-within:opacity-100 transition-opacity" />
            <div className="relative flex items-center bg-card border border-primary/20 rounded-2xl px-5 py-4 gap-3 focus-within:border-primary/50 transition-colors">
              <Sparkles className="w-5 h-5 text-primary shrink-0" />
              <input
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                placeholder="Describe your video…"
                className="flex-1 bg-transparent text-foreground text-base placeholder:text-muted-foreground/40 focus:outline-none font-sans"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={!prompt.trim() || loading}
                className="w-10 h-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center hover:bg-primary/25 transition-colors disabled:opacity-30 shrink-0"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* URL Section */}
          {!showUrl ? (
            <button
              type="button"
              onClick={() => setShowUrl(true)}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors px-1"
            >
              <Link className="w-3.5 h-3.5" />
              <span>Add content from a URL</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 bg-card border border-border rounded-xl px-4 py-2.5 animate-in fade-in slide-in-from-top-1 duration-200">
              <Link className="w-4 h-4 text-muted-foreground shrink-0" />
              <input
                value={url}
                onChange={e => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none"
              />
              {url.trim() && (
                <button type="button" className="text-xs font-medium text-primary hover:text-primary/80 transition-colors shrink-0">
                  Extract
                </button>
              )}
              <button
                type="button"
                onClick={() => { setShowUrl(false); setUrl(''); }}
                className="w-6 h-6 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Prompt counter */}
          <p className="text-xs text-muted-foreground/60 px-1">5 of 5 prompts remaining today</p>
        </form>

        {/* Brand Kit */}
        <div className="border border-border rounded-xl overflow-hidden">
          <button
            type="button"
            onClick={() => setShowBrand(!showBrand)}
            className="w-full flex items-center justify-between px-5 py-3.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <span className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Personalize with your brand
            </span>
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showBrand ? 'rotate-180' : ''}`} />
          </button>

          <div
            className="grid transition-all duration-300 ease-out"
            style={{ gridTemplateRows: showBrand ? '1fr' : '0fr' }}
          >
            <div className="overflow-hidden">
              <div className="px-5 pb-5 pt-1 space-y-4 border-t border-border">
                <div className="flex gap-4">
                  <div className="space-y-1.5 flex-1">
                    <label className="text-xs text-muted-foreground">Primary color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={brandColors.primary}
                        onChange={e => setBrandColors(c => ({ ...c, primary: e.target.value }))}
                        className="w-8 h-8 rounded-lg border border-border cursor-pointer bg-transparent"
                      />
                      <span className="text-xs font-mono text-muted-foreground">{brandColors.primary}</span>
                    </div>
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <label className="text-xs text-muted-foreground">Accent color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={brandColors.secondary}
                        onChange={e => setBrandColors(c => ({ ...c, secondary: e.target.value }))}
                        className="w-8 h-8 rounded-lg border border-border cursor-pointer bg-transparent"
                      />
                      <span className="text-xs font-mono text-muted-foreground">{brandColors.secondary}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-muted-foreground">Logo URL (optional)</label>
                  <input
                    value={logoUrl}
                    onChange={e => setLogoUrl(e.target.value)}
                    placeholder="https://yoursite.com/logo.png"
                    className="w-full bg-secondary border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary/30"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}