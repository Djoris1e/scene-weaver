import { useState } from 'react';
import {
  Send, Link, X, Palette, Sparkles, Loader2,
  Rocket, Monitor, CalendarDays, Video, Megaphone, Briefcase,
  Bot, Film, SlidersHorizontal, Eye, Terminal, ArrowRight,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

/* ───────── Hero Prompt Card (from Create page) ───────── */
function PromptCard() {
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
    <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl overflow-hidden w-full max-w-2xl mx-auto">
      <div className="p-5 pb-4">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-primary mt-0.5 shrink-0" />
          <textarea
            value={prompt}
            onChange={e => {
              setPrompt(e.target.value);
              e.target.style.height = 'auto';
              e.target.style.height = e.target.scrollHeight + 'px';
            }}
            placeholder="What's your video about? e.g. gaming headset launch, fitness app promo…"
            rows={2}
            className="flex-1 bg-transparent text-foreground text-base placeholder:text-muted-foreground/40 focus:outline-none font-sans resize-none leading-relaxed min-h-[3.25rem] max-h-48 overflow-y-auto"
            disabled={loading}
          />
        </div>
      </div>

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
            <button type="button" onClick={() => { setShowUrl(false); setUrl(''); }} className="w-5 h-5 rounded flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors shrink-0">
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {showBrand && (
        <div className="px-5 pb-3 animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="bg-secondary/60 rounded-xl px-4 py-3 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Brand kit</span>
              <button type="button" onClick={() => setShowBrand(false)} className="w-5 h-5 rounded flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-3 h-3" />
              </button>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <input type="color" value={brandColors.primary} onChange={e => setBrandColors(c => ({ ...c, primary: e.target.value }))} className="w-7 h-7 rounded-lg border border-border cursor-pointer bg-transparent" />
                <span className="text-xs text-muted-foreground">Primary</span>
              </div>
              <div className="flex items-center gap-2">
                <input type="color" value={brandColors.secondary} onChange={e => setBrandColors(c => ({ ...c, secondary: e.target.value }))} className="w-7 h-7 rounded-lg border border-border cursor-pointer bg-transparent" />
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

      <div className="flex items-center justify-between px-5 py-3 border-t border-border/60">
        <div className="flex items-center gap-1">
          <button type="button" onClick={() => setShowUrl(!showUrl)} className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg transition-colors ${showUrl ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'}`}>
            <Link className="w-3.5 h-3.5" /> URL
          </button>
          <button type="button" onClick={() => setShowBrand(!showBrand)} className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg transition-colors ${showBrand ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'}`}>
            <Palette className="w-3.5 h-3.5" /> Brand
          </button>
          <span className="text-xs text-muted-foreground/50 ml-2">5 left</span>
        </div>
        <button type="submit" disabled={!prompt.trim() || loading} className="flex items-center gap-2 bg-primary text-primary-foreground text-sm font-medium px-4 py-2 rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-30">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          Generate
        </button>
      </div>
    </form>
  );
}

/* ───────── Section Components ───────── */

const steps = [
  { icon: Sparkles, title: 'Brief the agent', desc: 'Describe what you need. Paste a URL, set your brand colors. The agent takes it from here.', num: 1 },
  { icon: Film, title: 'It builds your video', desc: 'Selects a soundtrack, searches stock libraries, writes scene copy, creates animations, and syncs every cut to the beat.', num: 2 },
  { icon: SlidersHorizontal, title: 'You review & refine', desc: 'Get a complete video draft in your timeline. Swap any scene, change any word, adjust timing. Ship when ready.', num: 3 },
];

const features = [
  { icon: Bot, title: 'An agent, not a template', desc: "It doesn't fill in a template. It makes creative decisions — which music fits, what footage works, how to pace the story." },
  { icon: Film, title: 'Real assets, real quality', desc: 'Stock footage, curated music, professional animations. No AI-generated pixels, no uncanny valley.' },
  { icon: SlidersHorizontal, title: 'You stay in control', desc: 'Full timeline editor. Every scene, every effect, every word is yours to change. The agent proposes, you decide.' },
  { icon: Eye, title: 'Gets smarter with context', desc: 'Paste a URL and it reads your content. Set brand colors and it matches every scene. More context = better video.' },
];

const comparisons = [
  ['AI video generators make pixels.', 'VanillaSky composes real assets.'],
  ['Template tools need you to do the work.', 'VanillaSky delivers a complete draft.'],
  ['Stock libraries give you ingredients.', 'VanillaSky gives you the dish.'],
];

const useCases = [
  { icon: Rocket, title: 'Product Launches', desc: 'Build hype for your next release with a professional video.' },
  { icon: Monitor, title: 'App & SaaS Demos', desc: 'Show off features with beat-synced cuts and bold text.' },
  { icon: CalendarDays, title: 'Event Promos', desc: 'Conferences, webinars, concerts — make them unmissable.' },
  { icon: Video, title: 'Social Media Teasers', desc: 'Vertical, punchy clips ready for TikTok, Reels, and Shorts.' },
  { icon: Megaphone, title: 'Brand Announcements', desc: 'Funding rounds, partnerships, milestones — make them epic.' },
  { icon: Briefcase, title: 'Portfolio Reels', desc: 'Showcase your work with a polished, professional edit.' },
];

const terminalLines = [
  { prefix: '$', text: 'create a launch video for my fitness app', bold: true },
  { prefix: '✓', text: 'Picked track: "Momentum Theme" (energetic, bold)' },
  { prefix: '✓', text: 'Composed 8 scenes with beat-synced transitions' },
  { prefix: '✓', text: 'Found 12 stock clips from Pexels' },
  { prefix: '✓', text: 'Generated counter animation for "10K+ users"' },
];

/* ───────── Landing Page ───────── */
export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-5 max-w-6xl mx-auto">
        <span className="font-heading text-xl font-bold gradient-vs-text">VanillaSky</span>
        <a href="#hero" className="text-sm border border-border rounded-lg px-4 py-2 text-foreground hover:bg-secondary transition-colors">
          Get Started
        </a>
      </nav>

      {/* Hero */}
      <section id="hero" className="pt-16 pb-24 md:pt-24 md:pb-32 px-6 text-center max-w-4xl mx-auto space-y-8">
        <h1 className="font-heading text-5xl md:text-7xl font-bold tracking-tight leading-[1.1]">
          Your AI&#8209;powered{' '}
          <span className="gradient-vs-text">video team.</span>
        </h1>
        <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
          An AI agent that picks the music, finds the footage, writes the copy, creates animations, and syncs it all to the beat. You review and direct — like having a production team on demand.
        </p>
        <PromptCard />
      </section>

      <Divider />

      {/* How it works */}
      <section className="py-24 md:py-32 px-6 max-w-5xl mx-auto text-center space-y-16">
        <div className="space-y-4">
          <h2 className="font-heading text-3xl md:text-4xl font-bold">Delegate, don't operate</h2>
          <p className="text-muted-foreground text-base max-w-lg mx-auto">You give the brief. The agent does the production work. You approve the result.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-10 md:gap-8 text-center">
          {steps.map(s => (
            <div key={s.num} className="space-y-4 group">
              <div className="relative mx-auto w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center group-hover:shadow-[0_0_24px_hsl(338_72%_59%/0.2)] transition-shadow duration-300">
                <s.icon className="w-6 h-6 text-primary" />
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full gradient-vs text-xs font-bold flex items-center justify-center text-primary-foreground">{s.num}</span>
              </div>
              <h3 className="font-heading text-lg font-semibold">{s.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <Divider />

      {/* Value props */}
      <section className="py-24 md:py-32 px-6 max-w-5xl mx-auto text-center space-y-16">
        <div className="space-y-4">
          <h2 className="font-heading text-3xl md:text-4xl font-bold">An agent, not a generator</h2>
          <p className="text-muted-foreground text-base max-w-lg mx-auto">This isn't a filter or a template. It's an autonomous system that makes creative decisions and delivers a complete draft.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          {features.map(f => (
            <div key={f.title} className="bg-card border border-border rounded-2xl p-6 text-left space-y-3 hover:border-primary/30 hover:shadow-[0_0_30px_hsl(338_72%_59%/0.08)] transition-all duration-300">
              <div className="w-11 h-11 rounded-xl bg-secondary flex items-center justify-center">
                <f.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-heading text-base font-semibold">{f.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <Divider />

      {/* What this isn't */}
      <section className="py-24 md:py-32 px-6 max-w-3xl mx-auto text-center space-y-12">
        <h2 className="font-heading text-3xl md:text-4xl font-bold">What this isn't</h2>
        <div className="space-y-4">
          {comparisons.map(([left, right], i) => (
            <div key={i} className="grid grid-cols-2 gap-4">
              <div className="bg-card border border-border rounded-xl px-5 py-4 text-sm text-muted-foreground text-left">{left}</div>
              <div className="bg-card border border-primary/20 rounded-xl px-5 py-4 text-sm text-foreground text-left">{right}</div>
            </div>
          ))}
        </div>
      </section>

      <Divider />

      {/* Developer / Terminal */}
      <section className="py-24 md:py-32 px-6 max-w-4xl mx-auto text-center space-y-12">
        <div className="space-y-2">
          <p className="text-xs font-medium tracking-widest uppercase text-primary flex items-center justify-center gap-2"><Terminal className="w-4 h-4" /> For Developers</p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold">Built for the agentic era</h2>
          <p className="text-muted-foreground text-base max-w-lg mx-auto">VanillaSky runs as a skill inside Claude Code — the first video tool built for AI agents. Your coding agent creates the video, you edit it in the browser.</p>
        </div>
        <div className="bg-card border border-border rounded-2xl overflow-hidden text-left max-w-2xl mx-auto">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border/60">
            <span className="w-3 h-3 rounded-full bg-destructive/60" />
            <span className="w-3 h-3 rounded-full bg-accent/60" />
            <span className="w-3 h-3 rounded-full bg-green-500/60" />
            <span className="text-xs text-muted-foreground ml-2 font-mono">terminal</span>
          </div>
          <div className="p-5 space-y-2 font-mono text-sm">
            {terminalLines.map((l, i) => (
              <p key={i} className={l.bold ? 'text-foreground' : 'text-muted-foreground'}>
                <span className={l.prefix === '✓' ? 'text-primary mr-2' : 'text-muted-foreground mr-2'}>{l.prefix}</span>
                {l.bold ? <strong>{l.text}</strong> : l.text}
              </p>
            ))}
            <p className="pt-2">
              <span className="text-primary font-semibold">Ready</span>
              <span className="text-foreground font-semibold ml-2">Open in editor:</span>
              <span className="text-primary ml-2 underline underline-offset-2">vanillasky.ai/create?config=a1b2c3</span>
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <span className="text-xs text-muted-foreground">Coming soon:</span>
          {['API access', 'Template marketplace', 'Custom animation SDK'].map(t => (
            <span key={t} className="text-xs border border-border rounded-full px-3 py-1 text-muted-foreground">{t}</span>
          ))}
        </div>
      </section>

      <Divider />

      {/* Use cases */}
      <section className="py-24 md:py-32 px-6 max-w-5xl mx-auto text-center space-y-16">
        <div className="space-y-4">
          <h2 className="font-heading text-3xl md:text-4xl font-bold">Made for every big moment</h2>
          <p className="text-muted-foreground text-base max-w-lg mx-auto">Whether you're launching, announcing, or promoting — make it unforgettable.</p>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
          {useCases.map(u => (
            <div key={u.title} className="bg-card border border-border rounded-2xl p-6 text-left space-y-3 hover:border-primary/30 hover:shadow-[0_0_30px_hsl(338_72%_59%/0.08)] transition-all duration-300">
              <div className="w-11 h-11 rounded-xl bg-secondary flex items-center justify-center">
                <u.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-heading text-base font-semibold">{u.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{u.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <Divider />

      {/* Final CTA */}
      <section className="py-24 md:py-32 px-6 text-center space-y-6 max-w-3xl mx-auto">
        <h2 className="font-heading text-3xl md:text-4xl font-bold italic">Put your video team to work</h2>
        <p className="text-muted-foreground text-base">Describe what you need. The agent delivers a draft. No signup required.</p>
        <a href="#hero" className="inline-flex items-center gap-2 gradient-vs text-primary-foreground font-medium px-6 py-3 rounded-xl hover:opacity-90 transition-opacity">
          Brief the agent <ArrowRight className="w-4 h-4" />
        </a>
      </section>

      <div className="h-12" />
    </div>
  );
}

function Divider() {
  return <div className="max-w-5xl mx-auto border-t border-border/40" />;
}
