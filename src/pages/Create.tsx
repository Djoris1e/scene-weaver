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
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setLogoPreview(URL.createObjectURL(file));
  };

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
      <div className="w-full max-w-2xl space-y-10">
        {/* Hero */}
        <div className="text-center space-y-3">
          <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight leading-tight">
            Turn any moment into a
            <br />
            <span className="gradient-vs-text">cinematic video</span>
          </h1>
          <p className="text-muted-foreground text-base max-w-md mx-auto leading-relaxed">
            Describe what you want, add optional context, and let AI craft your video.
          </p>
        </div>

        {/* Unified Card */}
        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl overflow-hidden">
          {/* Main prompt area */}
          <div className="p-5 pb-4">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-primary mt-0.5 shrink-0" />
              <textarea
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                placeholder="Describe your video…"
                rows={3}
                className="flex-1 bg-transparent text-foreground text-base placeholder:text-muted-foreground/40 focus:outline-none font-sans resize-none leading-relaxed"
                disabled={loading}
              />
            </div>
          </div>

          {/* URL attachment (inline) */}
          {showUrl && (
            <div className="px-5 pb-3 animate-in fade-in slide-in-from-top-1 duration-200">
              <div className="flex items-center gap-2 bg-secondary/60 rounded-xl px-3 py-2">
                <Link className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                <input
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  placeholder="Paste a URL for context…"
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
                  className="w-5 h-5 rounded flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors shrink-0"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}

          {/* Brand kit (inline) */}
          {showBrand && (
            <div className="px-5 pb-3 animate-in fade-in slide-in-from-top-1 duration-200">
              <div className="bg-secondary/60 rounded-xl px-4 py-3 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">Brand kit</span>
                  <button
                    type="button"
                    onClick={() => setShowBrand(false)}
                    className="w-5 h-5 rounded flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={brandColors.primary}
                      onChange={e => setBrandColors(c => ({ ...c, primary: e.target.value }))}
                      className="w-7 h-7 rounded-lg border border-border cursor-pointer bg-transparent"
                    />
                    <span className="text-xs text-muted-foreground">Primary</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={brandColors.secondary}
                      onChange={e => setBrandColors(c => ({ ...c, secondary: e.target.value }))}
                      className="w-7 h-7 rounded-lg border border-border cursor-pointer bg-transparent"
                    />
                    <span className="text-xs text-muted-foreground">Accent</span>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    {logoPreview ? (
                      <div className="relative">
                        <img src={logoPreview} alt="Logo" className="w-7 h-7 rounded-lg object-contain bg-background/40 border border-border" />
                        <button type="button" onClick={(e) => { e.preventDefault(); setLogoPreview(null); }} className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center">
                          <X className="w-2 h-2" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="w-7 h-7 rounded-lg border border-dashed border-border flex items-center justify-center bg-background/40 group-hover:border-muted-foreground transition-colors">
                          <span className="text-muted-foreground text-xs">+</span>
                        </div>
                        <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">Logo</span>
                      </>
                    )}
                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Bottom toolbar */}
          <div className="flex items-center justify-between px-5 py-3 border-t border-border/60">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setShowUrl(!showUrl)}
                className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg transition-colors ${
                  showUrl ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
              >
                <Link className="w-3.5 h-3.5" />
                URL
              </button>
              <button
                type="button"
                onClick={() => setShowBrand(!showBrand)}
                className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg transition-colors ${
                  showBrand ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
              >
                <Palette className="w-3.5 h-3.5" />
                Brand
              </button>
              <span className="text-xs text-muted-foreground/50 ml-2">5 prompts left</span>
            </div>
            <button
              type="submit"
              disabled={!prompt.trim() || loading}
              className="flex items-center gap-2 bg-primary text-primary-foreground text-sm font-medium px-4 py-2 rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-30"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Generate
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
