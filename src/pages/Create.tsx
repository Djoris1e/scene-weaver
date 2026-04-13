import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, Link as LinkIcon, Upload, Image, Monitor, Smartphone,
  Palette, Globe, X, Sparkles, Loader2, ArrowRight, ArrowLeft,
  Check, Type, FileImage, Megaphone, GraduationCap, Star,
  FileText, MessageSquare, GitCommit, File, Plus,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

/* ───────── Types ───────── */
type Step = 'prompt' | 'media' | 'brand';

interface MediaFile {
  id: string;
  file: File;
  preview: string;
  label: string;
}

interface BrandConfig {
  gradient: string;
  customPrimary: string;
  customSecondary: string;
  useCustom: boolean;
  logo: File | null;
  logoPreview: string | null;
  logoDetected: string | null;
  font: string;
  scrapeUrl: string;
}

/* ───────── Constants ───────── */
const STEPS: { id: Step; label: string; number: number }[] = [
  { id: 'prompt', label: 'Describe', number: 1 },
  { id: 'media', label: 'Media', number: 2 },
  { id: 'brand', label: 'Brand', number: 3 },
];

const VIBES = [
  { id: 'promote', icon: Megaphone, label: 'Promote' },
  { id: 'explain', icon: GraduationCap, label: 'Explain' },
  { id: 'showcase', icon: Sparkles, label: 'Showcase' },
];

const CONTENT_TYPES = [
  { id: 'page', icon: LinkIcon, label: 'Page' },
  { id: 'blog', icon: FileText, label: 'Blog Post' },
  { id: 'social', icon: MessageSquare, label: 'Social Post' },
  { id: 'review', icon: Star, label: 'Review' },
  { id: 'changelog', icon: GitCommit, label: 'Changelog' },
  { id: 'document', icon: File, label: 'Document' },
  { id: 'describe', icon: Sparkles, label: 'Just describe it' },
];

const MEDIA_SLOTS = [
  { type: 'mobile', icon: Smartphone, label: 'Mobile Screenshots', desc: 'App or mobile web screenshots' },
  { type: 'desktop', icon: Monitor, label: 'Desktop Screenshots', desc: 'Desktop or dashboard screenshots' },
  { type: 'background', icon: Image, label: 'Background Media', desc: 'Video or images for scene backgrounds' },
];

const GRADIENTS: { id: string; label: string; from: string; to: string }[] = [
  { id: 'brand', label: 'Brand', from: '#E04F8A', to: '#3B82F6' },
  { id: 'aurora', label: 'Aurora', from: '#5EEAD4', to: '#3B82F6' },
  { id: 'berry', label: 'Berry', from: '#A855F7', to: '#EC4899' },
  { id: 'forest', label: 'Forest', from: '#22C55E', to: '#16A34A' },
  { id: 'sunset', label: 'Sunset', from: '#F97316', to: '#EF4444' },
];

const FONTS = ['System Default', 'Inter', 'Raleway', 'Manrope', 'Space Grotesk', 'DM Sans'];

/* ───────── Step Indicator ───────── */
function StepIndicator({ current, onNavigate }: { current: Step; onNavigate: (s: Step) => void }) {
  const currentIdx = STEPS.findIndex(s => s.id === current);
  return (
    <div className="flex items-center gap-2">
      {STEPS.map((step, i) => {
        const done = i < currentIdx;
        const active = step.id === current;
        return (
          <button
            key={step.id}
            onClick={() => (done || active) && onNavigate(step.id)}
            className="flex items-center gap-2 group"
            disabled={i > currentIdx}
          >
            <div className={`w-7 h-7 rounded-full text-xs font-semibold flex items-center justify-center transition-all duration-300 ${
              done ? 'bg-primary text-primary-foreground'
                : active ? 'bg-primary/20 text-primary border border-primary/40'
                : 'bg-secondary text-muted-foreground'
            }`}>
              {done ? <Check className="w-3.5 h-3.5" /> : step.number}
            </div>
            <span className={`text-xs font-medium transition-colors hidden sm:inline ${
              active ? 'text-foreground' : done ? 'text-muted-foreground' : 'text-muted-foreground/50'
            }`}>
              {step.label}
            </span>
            {i < STEPS.length - 1 && (
              <div className={`w-8 h-px mx-1 transition-colors ${done ? 'bg-primary/60' : 'bg-border'}`} />
            )}
          </button>
        );
      })}
    </div>
  );
}

/* ───────── Bot Bubble ───────── */
function BotBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2.5 mb-4">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent shadow-md shadow-primary/20 mt-0.5">
        <Sparkles className="h-3.5 w-3.5 text-primary-foreground" />
      </div>
      <div className="rounded-2xl rounded-tl-md bg-muted text-foreground shadow-lg shadow-black/30 px-4 py-3 text-sm leading-relaxed">
        {children}
      </div>
    </div>
  );
}

/* ───────── Step 1: Prompt ───────── */
function PromptStep({
  vibe, setVibe,
  contentType, setContentType,
  prompt, setPrompt,
  url, setUrl,
}: {
  vibe: string; setVibe: (v: string) => void;
  contentType: string; setContentType: (v: string) => void;
  prompt: string; setPrompt: (v: string) => void;
  url: string; setUrl: (v: string) => void;
}) {
  const needsUrl = contentType && contentType !== 'describe';
  const needsPrompt = contentType === 'describe';

  return (
    <div className="space-y-6">
      {/* Vibe selection */}
      <div>
        <BotBubble>Let's make a video together. First, what's the vibe?</BotBubble>
        <div className="flex flex-wrap gap-2 ml-[38px]">
          {VIBES.map(v => (
            <button
              key={v.id}
              type="button"
              onClick={() => setVibe(v.id)}
              className={`group relative overflow-hidden flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                vibe === v.id
                  ? 'bg-primary/20 text-primary border border-primary/40 shadow-[0_0_20px_hsla(338,72%,59%,0.15)]'
                  : 'bg-card/80 text-foreground shadow-[inset_0_0_0_1px_hsla(338,72%,59%,0.2),inset_0_0_0_1px_hsla(34,83%,55%,0.15)] hover:shadow-[inset_0_0_0_1px_hsla(338,72%,59%,0.4),inset_0_0_0_1px_hsla(34,83%,55%,0.3)]'
              }`}
            >
              <v.icon className={`h-4 w-4 transition-colors ${vibe === v.id ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'}`} />
              {v.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content type selection */}
      {vibe && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
          <BotBubble>What content should I work with?</BotBubble>
          <div className="flex flex-wrap gap-2 ml-[38px]">
            {CONTENT_TYPES.map(ct => (
              <button
                key={ct.id}
                type="button"
                onClick={() => setContentType(ct.id)}
                className={`group relative overflow-hidden flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                  contentType === ct.id
                    ? 'bg-primary/20 text-primary border border-primary/40 shadow-[0_0_20px_hsla(338,72%,59%,0.15)]'
                    : 'bg-card/80 text-foreground shadow-[inset_0_0_0_1px_hsla(338,72%,59%,0.2),inset_0_0_0_1px_hsla(34,83%,55%,0.15)] hover:shadow-[inset_0_0_0_1px_hsla(338,72%,59%,0.4),inset_0_0_0_1px_hsla(34,83%,55%,0.3)]'
                }`}
              >
                <ct.icon className={`h-4 w-4 transition-colors ${contentType === ct.id ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'}`} />
                {ct.label}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* URL input for content types that need it */}
      {needsUrl && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="ml-[38px]">
          <div className="flex items-center gap-2 bg-secondary/60 rounded-xl px-3 py-2.5">
            <LinkIcon className="w-4 h-4 text-muted-foreground shrink-0" />
            <input
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="Paste the URL here…"
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none"
            />
          </div>
        </motion.div>
      )}

      {/* Prompt for "Just describe it" */}
      {needsPrompt && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="ml-[38px]">
          <textarea
            value={prompt}
            onChange={e => {
              setPrompt(e.target.value);
              e.target.style.height = 'auto';
              e.target.style.height = e.target.scrollHeight + 'px';
            }}
            placeholder="Describe what the video should be about…"
            rows={3}
            className="w-full bg-secondary/40 border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/40 resize-none leading-relaxed min-h-[5rem] max-h-48 overflow-y-auto transition-colors"
          />
        </motion.div>
      )}
    </div>
  );
}

/* ───────── Step 2: Media ───────── */
function MediaStep({
  mediaFiles, setMediaFiles,
}: {
  mediaFiles: Record<string, MediaFile[]>;
  setMediaFiles: React.Dispatch<React.SetStateAction<Record<string, MediaFile[]>>>;
}) {
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const handleFiles = (slotType: string, files: FileList) => {
    const newFiles: MediaFile[] = Array.from(files).map(f => ({
      id: crypto.randomUUID(),
      file: f,
      preview: URL.createObjectURL(f),
      label: f.name,
    }));
    setMediaFiles(prev => ({
      ...prev,
      [slotType]: [...(prev[slotType] || []), ...newFiles],
    }));
  };

  const removeFile = (slotType: string, fileId: string) => {
    setMediaFiles(prev => ({
      ...prev,
      [slotType]: (prev[slotType] || []).filter(f => f.id !== fileId),
    }));
  };

  return (
    <div className="space-y-5">
      <BotBubble>Now let's add your media. Upload screenshots and background footage — I'll use them to build your scenes.</BotBubble>

      <div className="space-y-4 ml-[38px]">
        {MEDIA_SLOTS.map(slot => {
          const files = mediaFiles[slot.type] || [];
          return (
            <div key={slot.type} className="space-y-2">
              <div className="flex items-center gap-2">
                <slot.icon className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">{slot.label}</span>
                <span className="text-xs text-muted-foreground">— {slot.desc}</span>
              </div>

              {/* Uploaded file thumbnails */}
              {files.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {files.map(f => (
                    <div key={f.id} className="relative group">
                      <div className="w-20 h-20 rounded-lg overflow-hidden border border-border bg-card">
                        <img src={f.preview} alt={f.label} className="w-full h-full object-cover" />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(slot.type, f.id)}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}

                  {/* Add more button */}
                  <button
                    type="button"
                    onClick={() => fileRefs.current[slot.type]?.click()}
                    className="w-20 h-20 rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center gap-1 hover:border-primary/40 hover:bg-primary/5 transition-colors"
                  >
                    <Upload className="w-4 h-4 text-muted-foreground" />
                    <span className="text-[10px] text-muted-foreground">Add more</span>
                  </button>
                </div>
              )}

              {/* Empty state — upload zone */}
              {files.length === 0 && (
                <button
                  type="button"
                  onClick={() => fileRefs.current[slot.type]?.click()}
                  className="w-full flex items-center gap-3 rounded-xl border-2 border-dashed border-border/60 p-4 hover:border-primary/40 hover:bg-primary/5 transition-all text-left"
                >
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-secondary shrink-0">
                    <Upload className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <span className="text-xs text-muted-foreground">Click to upload or drag files here</span>
                </button>
              )}

              <input
                ref={el => { fileRefs.current[slot.type] = el; }}
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={e => {
                  if (e.target.files?.length) handleFiles(slot.type, e.target.files);
                  e.target.value = '';
                }}
                className="hidden"
              />
            </div>
          );
        })}
      </div>

      <p className="text-xs text-muted-foreground/60 text-center">
        All uploads are optional — we'll use stock footage to fill any gaps.
      </p>
    </div>
  );
}

/* ───────── Step 3: Brand ───────── */
function BrandStep({
  brand, setBrand,
}: {
  brand: BrandConfig;
  setBrand: React.Dispatch<React.SetStateAction<BrandConfig>>;
}) {
  const logoRef = useRef<HTMLInputElement>(null);
  const [scraping, setScraping] = useState(false);

  const handleScrape = () => {
    if (!brand.scrapeUrl.trim()) return;
    setScraping(true);
    setTimeout(() => {
      setScraping(false);
      // Simulate finding a logo and brand colors
      setBrand(prev => ({
        ...prev,
        gradient: 'brand',
        logoDetected: 'https://placehold.co/120x40/E04F8A/FFF?text=Logo',
      }));
      toast({ title: 'Brand detected', description: 'We found your colors and logo from the website.' });
    }, 2000);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBrand(prev => ({ ...prev, logo: file, logoPreview: URL.createObjectURL(file), logoDetected: null }));
    }
  };

  return (
    <div className="space-y-5">
      {/* Auto-detect */}
      <BotBubble>Let's match your brand. Paste your website and I'll try to detect your colors and logo.</BotBubble>

      <div className="space-y-5 ml-[38px]">
        {/* Scrape URL */}
        <div className="flex gap-2">
          <div className="flex-1 flex items-center gap-2 bg-secondary/60 rounded-xl px-3 py-2.5">
            <Globe className="w-4 h-4 text-muted-foreground shrink-0" />
            <input
              value={brand.scrapeUrl}
              onChange={e => setBrand(prev => ({ ...prev, scrapeUrl: e.target.value }))}
              placeholder="https://yoursite.com"
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none"
            />
          </div>
          <button
            type="button"
            onClick={handleScrape}
            disabled={!brand.scrapeUrl.trim() || scraping}
            className="flex items-center gap-1.5 bg-primary/15 text-primary text-xs font-medium px-4 py-2.5 rounded-xl hover:bg-primary/25 transition-colors disabled:opacity-40"
          >
            {scraping ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            Detect
          </button>
        </div>

        {/* Detected logo */}
        {brand.logoDetected && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            <BotBubble>I found this logo on your site. Keep it, replace it, or remove it.</BotBubble>
            <div className="ml-[38px] flex items-center gap-3">
              <div className="relative">
                <div className="h-14 px-4 rounded-lg border border-border bg-secondary/40 flex items-center justify-center">
                  <img src={brand.logoDetected} alt="Detected logo" className="h-8 object-contain" />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <button
                  type="button"
                  onClick={() => logoRef.current?.click()}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <FileImage className="w-3.5 h-3.5" />
                  Replace
                </button>
                <button
                  type="button"
                  onClick={() => setBrand(prev => ({ ...prev, logoDetected: null }))}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                  Remove
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Manual logo upload if no detected logo */}
        {!brand.logoDetected && (
          <div className="space-y-2">
            {brand.logoPreview ? (
              <div className="flex items-center gap-3">
                <div className="h-14 px-4 rounded-lg border border-border bg-secondary/40 flex items-center justify-center">
                  <img src={brand.logoPreview} alt="Logo" className="h-8 object-contain" />
                </div>
                <button
                  type="button"
                  onClick={() => setBrand(prev => ({ ...prev, logo: null, logoPreview: null }))}
                  className="text-xs text-destructive hover:text-destructive/80 transition-colors"
                >
                  Remove
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => logoRef.current?.click()}
                className="flex items-center gap-3 rounded-xl border-2 border-dashed border-border/60 p-4 hover:border-primary/40 hover:bg-primary/5 transition-all w-full text-left"
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-secondary shrink-0 border border-dashed border-border">
                  <FileImage className="w-4 h-4 text-muted-foreground" />
                </div>
                <span className="text-xs text-muted-foreground">Upload logo</span>
              </button>
            )}
          </div>
        )}
        <input ref={logoRef} type="file" accept="image/*,.svg" onChange={handleLogoUpload} className="hidden" />

        {/* Gradient palette */}
        <div className="space-y-3">
          <BotBubble>Pick a color theme for your video.</BotBubble>
          <div className="ml-[38px] flex gap-3">
            {GRADIENTS.map(g => (
              <button
                key={g.id}
                type="button"
                onClick={() => setBrand(prev => ({ ...prev, gradient: g.id, useCustom: false }))}
                className="flex flex-col items-center gap-2 group"
              >
                <div
                  className={`w-[72px] h-[100px] rounded-xl transition-all duration-200 ${
                    brand.gradient === g.id && !brand.useCustom
                      ? 'ring-2 ring-primary ring-offset-2 ring-offset-background scale-105'
                      : 'hover:scale-105'
                  }`}
                  style={{ background: `linear-gradient(135deg, ${g.from}, ${g.to})` }}
                >
                  {brand.gradient === g.id && !brand.useCustom && (
                    <div className="w-full h-full flex items-center justify-center">
                      <Check className="w-5 h-5 text-white drop-shadow-md" />
                    </div>
                  )}
                </div>
                <span className={`text-xs transition-colors ${
                  brand.gradient === g.id && !brand.useCustom ? 'text-foreground font-medium' : 'text-muted-foreground'
                }`}>{g.label}</span>
              </button>
            ))}
          </div>

          {/* Custom colors toggle */}
          <button
            type="button"
            onClick={() => setBrand(prev => ({ ...prev, useCustom: !prev.useCustom }))}
            className="ml-[38px] flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <span>{brand.useCustom ? '▾' : '▸'}</span>
            Pick your own colors
          </button>

          {brand.useCustom && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="ml-[38px] flex gap-4 overflow-hidden">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="color"
                  value={brand.customPrimary}
                  onChange={e => setBrand(prev => ({ ...prev, customPrimary: e.target.value }))}
                  className="w-9 h-9 rounded-lg border border-border cursor-pointer bg-transparent"
                />
                <span className="text-xs text-muted-foreground">Primary</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="color"
                  value={brand.customSecondary}
                  onChange={e => setBrand(prev => ({ ...prev, customSecondary: e.target.value }))}
                  className="w-9 h-9 rounded-lg border border-border cursor-pointer bg-transparent"
                />
                <span className="text-xs text-muted-foreground">Accent</span>
              </label>
            </motion.div>
          )}
        </div>

        {/* Font */}
        <div className="space-y-3">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Font</span>
          <div className="flex flex-wrap gap-2">
            {FONTS.map(f => (
              <button
                key={f}
                type="button"
                onClick={() => setBrand(prev => ({ ...prev, font: f }))}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                  brand.font === f
                    ? 'border-primary/40 bg-primary/15 text-primary'
                    : 'border-border text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───────── Main Create Page ───────── */
export default function Create() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('prompt');
  const [loading, setLoading] = useState(false);

  // Step 1
  const [vibe, setVibe] = useState('');
  const [contentType, setContentType] = useState('');
  const [prompt, setPrompt] = useState('');
  const [url, setUrl] = useState('');

  // Step 2
  const [mediaFiles, setMediaFiles] = useState<Record<string, MediaFile[]>>({});

  // Step 3
  const [brand, setBrand] = useState<BrandConfig>({
    gradient: 'brand',
    customPrimary: '#E04F8A',
    customSecondary: '#EC9A2C',
    useCustom: false,
    logo: null,
    logoPreview: null,
    logoDetected: null,
    font: 'System Default',
    scrapeUrl: '',
  });

  const currentIdx = STEPS.findIndex(s => s.id === step);
  const isFirst = currentIdx === 0;
  const isLast = currentIdx === STEPS.length - 1;

  const canProceed = step === 'prompt'
    ? vibe && contentType && (contentType === 'describe' ? prompt.trim().length > 0 : true)
    : true;

  const handleNext = () => {
    if (isLast) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        toast({ title: 'Video generation started', description: 'Your cinematic video is being created.' });
        navigate('/editor');
      }, 2500);
      return;
    }
    setStep(STEPS[currentIdx + 1].id);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="font-heading text-2xl md:text-3xl font-bold tracking-tight">
            Create your <span className="gradient-vs-text">video</span>
          </h1>
        </div>

        {/* Step indicator */}
        <div className="flex justify-center">
          <StepIndicator current={step} onNavigate={setStep} />
        </div>

        {/* Step content */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
              >
                {step === 'prompt' && (
                  <PromptStep
                    vibe={vibe} setVibe={setVibe}
                    contentType={contentType} setContentType={setContentType}
                    prompt={prompt} setPrompt={setPrompt}
                    url={url} setUrl={setUrl}
                  />
                )}
                {step === 'media' && (
                  <MediaStep mediaFiles={mediaFiles} setMediaFiles={setMediaFiles} />
                )}
                {step === 'brand' && (
                  <BrandStep brand={brand} setBrand={setBrand} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-border/60">
            <button
              type="button"
              onClick={() => !isFirst && setStep(STEPS[currentIdx - 1].id)}
              disabled={isFirst}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-0 disabled:pointer-events-none"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            {!isLast && (
              <button
                type="button"
                onClick={() => setStep(STEPS[currentIdx + 1].id)}
                className="text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors"
              >
                Skip
              </button>
            )}

            <button
              type="button"
              onClick={handleNext}
              disabled={!canProceed || loading}
              className="flex items-center gap-2 bg-primary text-primary-foreground text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-30"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : isLast ? (
                <Sparkles className="w-4 h-4" />
              ) : (
                <ArrowRight className="w-4 h-4" />
              )}
              {isLast ? 'Generate' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
