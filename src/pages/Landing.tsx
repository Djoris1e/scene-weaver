import { useState, useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Send, Link, X, Palette, Sparkles, Loader2,
  Rocket, Monitor, CalendarDays, Video, Megaphone, Briefcase,
  Bot, Film, SlidersHorizontal, Eye, Terminal, ArrowRight,
  Check, Star, Music, Zap, Layers, Image,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

/* ───────── Animated Section Wrapper ───────── */
function AnimatedSection({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

/* ───────── Hero Prompt Card ───────── */
function PromptCard({ glowOnHover = false }: { glowOnHover?: boolean }) {
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
    <form
      onSubmit={handleSubmit}
      className={`bg-card border border-border rounded-2xl overflow-hidden w-full max-w-2xl mx-auto transition-shadow duration-500 ${glowOnHover ? 'hover:shadow-[0_0_60px_hsla(338,72%,59%,0.15)]' : ''}`}
    >
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
            <input value={url} onChange={e => setUrl(e.target.value)} placeholder="Paste a URL for context…" className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none" />
            <button type="button" onClick={() => { setShowUrl(false); setUrl(''); }} className="w-5 h-5 rounded flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors shrink-0"><X className="w-3 h-3" /></button>
          </div>
        </div>
      )}

      {showBrand && (
        <div className="px-5 pb-3 animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="bg-secondary/60 rounded-xl px-4 py-3 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Brand kit</span>
              <button type="button" onClick={() => setShowBrand(false)} className="w-5 h-5 rounded flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"><X className="w-3 h-3" /></button>
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
                    <button type="button" onClick={(e) => { e.preventDefault(); setLogoPreview(null); }} className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center"><X className="w-2 h-2" /></button>
                  </div>
                ) : (
                  <>
                    <div className="w-7 h-7 rounded-lg border border-dashed border-border flex items-center justify-center bg-background/40 group-hover:border-muted-foreground transition-colors"><span className="text-muted-foreground text-xs">+</span></div>
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


/* ───────── Video Showcase ───────── */
const showcaseVideos = [
  { label: 'Product Launch', src: 'https://videos.pexels.com/video-files/5532767/5532767-sd_506_960_25fps.mp4' },
  { label: 'App Demo', src: 'https://videos.pexels.com/video-files/6981411/6981411-sd_506_960_25fps.mp4' },
  { label: 'Event Promo', src: 'https://videos.pexels.com/video-files/4057402/4057402-sd_506_960_25fps.mp4' },
  { label: 'Brand Story', src: 'https://videos.pexels.com/video-files/5377700/5377700-sd_506_960_25fps.mp4' },
  { label: 'Social Teaser', src: 'https://videos.pexels.com/video-files/4488162/4488162-sd_506_960_25fps.mp4' },
];

function VideoShowcase() {
  return (
    <div className="relative max-w-5xl mx-auto">
      {/* Gradient fades */}
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

      <div className="flex gap-5 overflow-x-auto scrollbar-none px-8 py-4">
        {showcaseVideos.map((v, i) => (
          <motion.div
            key={v.label}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="relative shrink-0 w-[200px] group"
          >
            <div className="relative aspect-[9/16] rounded-3xl overflow-hidden border-2 border-border/60 bg-card shadow-[0_8px_40px_-12px_hsla(338,72%,59%,0.15)] group-hover:border-primary/40 group-hover:shadow-[0_12px_50px_-10px_hsla(338,72%,59%,0.25)] transition-all duration-500 group-hover:scale-[1.03]">
              {/* Phone notch */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-1.5 rounded-full bg-border/80 z-10" />

              <video
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              >
                <source src={v.src} type="video/mp4" />
              </video>

              {/* Label overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent p-4 pt-8">
                <span className="text-xs font-medium text-foreground">{v.label}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ───────── Asset Library ───────── */
const assetCategories = [
  {
    icon: Music,
    title: 'Curated Soundtracks',
    desc: 'Royalty-free tracks synced to your cuts',
    preview: 'waveform',
  },
  {
    icon: Zap,
    title: 'Ready-made Animations',
    desc: 'Counters, text effects, transitions',
    preview: 'pulse',
  },
  {
    icon: Layers,
    title: 'Gradient Backgrounds',
    desc: '12+ designer gradients, fully customizable',
    preview: 'gradients',
  },
  {
    icon: Image,
    title: 'Stock Footage',
    desc: 'Search millions of clips from Pexels',
    preview: 'grid',
  },
];

function AssetLibrary() {
  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
      {assetCategories.map((a, i) => (
        <motion.div
          key={a.title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1, duration: 0.5 }}
          className="glass-card rounded-2xl p-5 space-y-4 hover:border-primary/20 hover:shadow-[0_0_40px_hsla(338,72%,59%,0.1)] transition-all duration-500 group"
        >
          {/* Preview element */}
          <div className="h-12 flex items-end gap-1 overflow-hidden">
            {a.preview === 'waveform' && (
              <>
                {[40, 70, 30, 85, 50, 65, 35, 75, 45, 60, 80, 40].map((h, j) => (
                  <div
                    key={j}
                    className="flex-1 rounded-sm bg-primary/40 group-hover:bg-primary/70 transition-colors"
                    style={{
                      height: `${h}%`,
                      animation: `waveform 1.2s ease-in-out ${j * 0.1}s infinite alternate`,
                    }}
                  />
                ))}
              </>
            )}
            {a.preview === 'pulse' && (
              <div className="w-full h-full flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-accent/60 group-hover:text-accent animate-pulse" />
              </div>
            )}
            {a.preview === 'gradients' && (
              <div className="w-full h-full flex gap-1.5">
                {[
                  'from-primary/60 to-accent/60',
                  'from-accent/60 to-highlight/60',
                  'from-highlight/60 to-primary/60',
                  'from-primary/40 to-highlight/40',
                ].map((g, j) => (
                  <div key={j} className={`flex-1 rounded-lg bg-gradient-to-b ${g}`} />
                ))}
              </div>
            )}
            {a.preview === 'grid' && (
              <div className="w-full h-full grid grid-cols-3 grid-rows-2 gap-1">
                {['bg-primary/30', 'bg-accent/30', 'bg-highlight/30', 'bg-accent/20', 'bg-primary/20', 'bg-highlight/20'].map((bg, j) => (
                  <div key={j} className={`${bg} rounded-md`} />
                ))}
              </div>
            )}
          </div>

          <div className="w-10 h-10 rounded-xl bg-secondary/80 flex items-center justify-center group-hover:bg-primary/15 transition-colors duration-300">
            <a.icon className="w-5 h-5 text-primary" />
          </div>
          <h3 className="font-heading text-sm font-semibold">{a.title}</h3>
          <p className="text-muted-foreground text-xs leading-relaxed">{a.desc}</p>
        </motion.div>
      ))}
    </div>
  );
}
/* ───────── Data ───────── */
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
  { old: 'AI video generators make pixels', better: 'VanillaSky composes real assets' },
  { old: 'Template tools need you to do the work', better: 'VanillaSky delivers a complete draft' },
  { old: 'Stock libraries give you ingredients', better: 'VanillaSky gives you the dish' },
  { old: 'Generic outputs, no brand match', better: 'Brand-aware from the first frame' },
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
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden relative">

      {/* ── Nav ── */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-5 max-w-6xl mx-auto relative z-10">
        <span className="font-heading text-xl font-bold gradient-vs-text">VanillaSky</span>
        <a href="#hero" className="text-sm border border-border rounded-lg px-4 py-2 text-foreground hover:bg-secondary transition-colors">
          Get Started
        </a>
      </nav>

      {/* ── Hero ── */}
      <section id="hero" className="relative pt-12 pb-24 md:pt-20 md:pb-32 px-6 text-center max-w-4xl mx-auto">
        {/* Ambient orbs */}
        <div className="glow-orb w-[500px] h-[500px] bg-primary/15 -top-40 left-1/2 -translate-x-1/2" />
        <div className="glow-orb w-[300px] h-[300px] bg-accent/10 top-20 -right-20" />

        <div className="relative z-10 space-y-8">
          {/* Floating badges */}
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <span className="float-badge text-xs font-medium bg-primary/10 text-primary border border-primary/20 rounded-full px-3 py-1.5">
              No editing skills needed
            </span>
            <span className="float-badge-delayed text-xs font-medium bg-accent/10 text-accent border border-accent/20 rounded-full px-3 py-1.5">
              60s to first draft
            </span>
          </div>

          <h1 className="font-heading text-5xl md:text-7xl font-bold tracking-tight leading-[1.08]">
            Your AI&#8209;powered{' '}
            <span className="gradient-vs-text">video team.</span>
          </h1>

          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            An AI agent that picks the music, finds the footage, writes the copy, creates animations, and syncs it all to the beat. You review and direct — like having a production team on demand.
          </p>

          <PromptCard glowOnHover />

          <SocialProofBar />
        </div>
      </section>

      {/* ── How it works — Connected Timeline ── */}
      <AnimatedSection className="py-24 md:py-32 px-6 max-w-5xl mx-auto text-center space-y-16">
        <div className="space-y-4">
          <h2 className="font-heading text-3xl md:text-4xl font-bold">Delegate, don't operate</h2>
          <p className="text-muted-foreground text-base max-w-lg mx-auto">You give the brief. The agent does the production work. You approve the result.</p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-7 left-[16.6%] right-[16.6%] h-0.5 gradient-vs rounded-full" />

          <div className="grid md:grid-cols-3 gap-12 md:gap-8">
            {steps.map((s, i) => (
              <motion.div
                key={s.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="space-y-4 group relative"
              >
                <div className="relative mx-auto w-14 h-14 rounded-2xl bg-card border border-border flex items-center justify-center group-hover:shadow-[0_0_30px_hsla(338,72%,59%,0.2)] transition-shadow duration-500 z-10">
                  <s.icon className="w-6 h-6 text-primary" />
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full gradient-vs text-xs font-bold flex items-center justify-center text-primary-foreground">{s.num}</span>
                </div>
                <h3 className="font-heading text-lg font-semibold">{s.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* ── Video Showcase ── */}
      <AnimatedSection className="py-24 md:py-32 px-6 relative">
        <div className="glow-orb w-[600px] h-[400px] bg-primary/8 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        <div className="relative z-10 space-y-8 text-center">
          <div className="space-y-4">
            <h2 className="font-heading text-3xl md:text-4xl font-bold">See what the agent builds</h2>
            <p className="text-muted-foreground text-base max-w-lg mx-auto">Real output. Real assets. Every video generated from a single prompt.</p>
          </div>
          <VideoShowcase />
        </div>
      </AnimatedSection>

      {/* ── Asset Library ── */}
      <AnimatedSection className="py-24 md:py-32 px-6 max-w-5xl mx-auto text-center space-y-12">
        <div className="space-y-4">
          <h2 className="font-heading text-3xl md:text-4xl font-bold">Everything included. No extra cost.</h2>
          <p className="text-muted-foreground text-base max-w-lg mx-auto">Royalty-free audio, animations, backgrounds, and stock footage — all built in.</p>
        </div>
        <AssetLibrary />
      </AnimatedSection>

      {/* ── Features — Glassmorphic Grid ── */}
      <AnimatedSection className="py-24 md:py-32 px-6 max-w-5xl mx-auto text-center space-y-16 relative">
        <div className="glow-orb w-[400px] h-[400px] bg-primary/10 top-0 right-0" />

        <div className="space-y-4 relative z-10">
          <h2 className="font-heading text-3xl md:text-4xl font-bold">An agent, not a generator</h2>
          <p className="text-muted-foreground text-base max-w-lg mx-auto">This isn't a filter or a template. It's an autonomous system that makes creative decisions and delivers a complete draft.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 relative z-10">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="glass-card rounded-2xl p-6 text-left space-y-3 hover:border-primary/20 hover:shadow-[0_0_40px_hsla(338,72%,59%,0.1)] transition-all duration-500 group"
            >
              <div className="w-11 h-11 rounded-xl bg-secondary/80 flex items-center justify-center group-hover:bg-primary/15 transition-colors duration-300">
                <f.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-heading text-base font-semibold">{f.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </AnimatedSection>

      {/* ── Comparison — Strikethrough Table ── */}
      <AnimatedSection className="py-24 md:py-32 px-6 max-w-3xl mx-auto text-center space-y-12">
        <h2 className="font-heading text-3xl md:text-4xl font-bold">What this isn't</h2>
        <div className="space-y-3">
          {comparisons.map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="flex items-center gap-4 bg-card/50 rounded-xl px-5 py-4 border border-border/40"
            >
              <div className="flex-1 text-left">
                <span className="text-sm line-through-dim">{c.old}</span>
              </div>
              <ArrowRight className="w-4 h-4 text-primary shrink-0" />
              <div className="flex-1 text-left flex items-center gap-2">
                <Check className="w-4 h-4 text-primary shrink-0" />
                <span className="text-sm text-foreground font-medium">{c.better}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </AnimatedSection>

      {/* ── Terminal ── */}
      <AnimatedSection className="py-24 md:py-32 px-6 max-w-4xl mx-auto text-center space-y-12">
        <div className="space-y-2">
          <p className="text-xs font-medium tracking-widest uppercase text-primary flex items-center justify-center gap-2"><Terminal className="w-4 h-4" /> For Developers</p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold">Built for the agentic era</h2>
          <p className="text-muted-foreground text-base max-w-lg mx-auto">VanillaSky runs as a skill inside Claude Code — the first video tool built for AI agents.</p>
        </div>

        <TerminalBlock />

        <div className="flex items-center justify-center gap-3 flex-wrap">
          <span className="text-xs text-muted-foreground">Coming soon:</span>
          {['API access', 'Template marketplace', 'Custom animation SDK'].map(t => (
            <span key={t} className="text-xs border border-border rounded-full px-3 py-1 text-muted-foreground">{t}</span>
          ))}
        </div>
      </AnimatedSection>

      {/* ── Use Cases ── */}
      <AnimatedSection className="py-24 md:py-32 px-6 max-w-5xl mx-auto text-center space-y-16">
        <div className="space-y-4">
          <h2 className="font-heading text-3xl md:text-4xl font-bold">Made for every big moment</h2>
          <p className="text-muted-foreground text-base max-w-lg mx-auto">Whether you're launching, announcing, or promoting — make it unforgettable.</p>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {useCases.map((u, i) => (
            <motion.div
              key={u.title}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="glass-card rounded-2xl p-6 text-left space-y-3 hover:border-primary/20 transition-all duration-300 group"
            >
              <div className="w-11 h-11 rounded-xl bg-secondary/80 flex items-center justify-center group-hover:bg-primary/15 transition-colors duration-300">
                <u.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-heading text-base font-semibold">{u.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{u.desc}</p>
            </motion.div>
          ))}
        </div>
      </AnimatedSection>

      {/* ── Final CTA ── */}
      <section className="relative py-32 md:py-40 px-6 text-center">
        <div className="glow-orb w-[600px] h-[600px] bg-primary/12 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        <div className="glow-orb w-[300px] h-[300px] bg-accent/8 bottom-0 left-1/4" />

        <AnimatedSection className="relative z-10 space-y-8 max-w-3xl mx-auto">
          <h2 className="font-heading text-4xl md:text-5xl font-bold">
            Put your video team{' '}
            <span className="gradient-vs-text italic">to work</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-lg mx-auto">Describe what you need. The agent delivers a draft. No signup required.</p>
          <PromptCard glowOnHover />
        </AnimatedSection>
      </section>

      <div className="h-12" />
    </div>
  );
}

/* ───────── Terminal Block with typing animation ───────── */
function TerminalBlock() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <div ref={ref} className="bg-card border border-border rounded-2xl overflow-hidden text-left max-w-2xl mx-auto shadow-[0_10px_60px_-20px_hsla(338,72%,59%,0.1)]">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border/60">
        <span className="w-3 h-3 rounded-full bg-destructive/60" />
        <span className="w-3 h-3 rounded-full bg-accent/60" />
        <span className="w-3 h-3 rounded-full bg-accent/40" />
        <span className="text-xs text-muted-foreground ml-2 font-mono">terminal</span>
      </div>
      <div className="p-5 space-y-2 font-mono text-sm">
        {isInView && terminalLines.map((l, i) => (
          <p key={i} className={`terminal-line ${l.bold ? 'text-foreground' : 'text-muted-foreground'}`}>
            <span className={l.prefix === '✓' ? 'text-primary mr-2' : 'text-muted-foreground mr-2'}>{l.prefix}</span>
            {l.bold ? <strong>{l.text}</strong> : l.text}
          </p>
        ))}
        {isInView && (
          <p className="terminal-line" style={{ animationDelay: '2.2s' }}>
            <span className="text-primary font-semibold">Ready</span>
            <span className="text-foreground font-semibold ml-2">Open in editor:</span>
            <span className="text-primary ml-2 underline underline-offset-2">vanillasky.ai/editor</span>
            <span className="terminal-cursor" />
          </p>
        )}
      </div>
    </div>
  );
}
