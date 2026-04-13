import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, Link, Upload, Image, Monitor, Smartphone,
  Palette, Globe, X, Sparkles, Loader2, ArrowRight, ArrowLeft,
  Check, Type, FileImage,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

/* ───────── Types ───────── */
type Step = 'prompt' | 'media' | 'brand';

interface MediaSlot {
  label: string;
  icon: React.ElementType;
  description: string;
  file: File | null;
  preview: string | null;
}

interface BrandConfig {
  primary: string;
  secondary: string;
  logo: File | null;
  logoPreview: string | null;
  font: string;
  scrapeUrl: string;
}

const STEPS: { id: Step; label: string; number: number }[] = [
  { id: 'prompt', label: 'Describe', number: 1 },
  { id: 'media', label: 'Media', number: 2 },
  { id: 'brand', label: 'Brand', number: 3 },
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
            <div
              className={`w-7 h-7 rounded-full text-xs font-semibold flex items-center justify-center transition-all duration-300 ${
                done
                  ? 'bg-primary text-primary-foreground'
                  : active
                  ? 'bg-primary/20 text-primary border border-primary/40'
                  : 'bg-secondary text-muted-foreground'
              }`}
            >
              {done ? <Check className="w-3.5 h-3.5" /> : step.number}
            </div>
            <span
              className={`text-xs font-medium transition-colors hidden sm:inline ${
                active ? 'text-foreground' : done ? 'text-muted-foreground' : 'text-muted-foreground/50'
              }`}
            >
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

/* ───────── Step 1: Prompt ───────── */
function PromptStep({
  prompt,
  setPrompt,
  url,
  setUrl,
  showUrl,
  setShowUrl,
}: {
  prompt: string;
  setPrompt: (v: string) => void;
  url: string;
  setUrl: (v: string) => void;
  showUrl: boolean;
  setShowUrl: (v: boolean) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-heading text-lg font-semibold mb-1">What's your video about?</h2>
        <p className="text-muted-foreground text-sm">Be specific — mention your product, audience, and the vibe you want.</p>
      </div>

      <div className="relative">
        <textarea
          value={prompt}
          onChange={e => {
            setPrompt(e.target.value);
            e.target.style.height = 'auto';
            e.target.style.height = e.target.scrollHeight + 'px';
          }}
          placeholder="e.g. A 30-second launch video for our fitness app targeting young professionals. Energetic, modern, bold typography…"
          rows={3}
          className="w-full bg-secondary/40 border border-border rounded-xl px-4 py-3 text-foreground text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 resize-none leading-relaxed min-h-[5rem] max-h-48 overflow-y-auto transition-colors"
        />
      </div>

      {/* Inline attachments */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setShowUrl(!showUrl)}
          className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-colors ${
            showUrl ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
          }`}
        >
          <Link className="w-3.5 h-3.5" />
          Add URL
        </button>
      </div>

      {showUrl && (
        <div className="animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="flex items-center gap-2 bg-secondary/60 rounded-xl px-3 py-2">
            <Link className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            <input
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="Paste a URL for context (landing page, product page…)"
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none"
            />
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
    </div>
  );
}

/* ───────── Step 2: Media ───────── */
function MediaStep({
  mediaSlots,
  setMediaSlots,
}: {
  mediaSlots: MediaSlot[];
  setMediaSlots: React.Dispatch<React.SetStateAction<MediaSlot[]>>;
}) {
  const fileRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleFile = (index: number, file: File) => {
    const preview = URL.createObjectURL(file);
    setMediaSlots(prev =>
      prev.map((slot, i) => (i === index ? { ...slot, file, preview } : slot))
    );
  };

  const clearSlot = (index: number) => {
    setMediaSlots(prev =>
      prev.map((slot, i) => (i === index ? { ...slot, file: null, preview: null } : slot))
    );
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-heading text-lg font-semibold mb-1">Upload your media</h2>
        <p className="text-muted-foreground text-sm">
          Help us create the perfect video. Upload screenshots, photos, or background footage.
        </p>
      </div>

      <div className="grid gap-3">
        {mediaSlots.map((slot, i) => (
          <div
            key={slot.label}
            className="relative bg-secondary/40 border border-border rounded-xl p-4 hover:border-primary/30 transition-colors group"
          >
            {slot.preview ? (
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-background/40 border border-border shrink-0">
                  <img src={slot.preview} alt={slot.label} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{slot.file?.name}</p>
                  <p className="text-xs text-muted-foreground">{slot.label}</p>
                </div>
                <button
                  type="button"
                  onClick={() => clearSlot(i)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileRefs.current[i]?.click()}
                className="w-full flex items-center gap-4 text-left"
              >
                <div className="w-16 h-16 rounded-lg border-2 border-dashed border-border flex items-center justify-center bg-background/20 group-hover:border-primary/30 transition-colors shrink-0">
                  <slot.icon className="w-6 h-6 text-muted-foreground/60 group-hover:text-primary/60 transition-colors" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{slot.label}</p>
                  <p className="text-xs text-muted-foreground">{slot.description}</p>
                </div>
              </button>
            )}
            <input
              ref={el => { fileRefs.current[i] = el; }}
              type="file"
              accept="image/*,video/*"
              onChange={e => {
                const file = e.target.files?.[0];
                if (file) handleFile(i, file);
              }}
              className="hidden"
            />
          </div>
        ))}
      </div>

      <p className="text-xs text-muted-foreground/60 text-center">
        All uploads are optional — we'll use stock footage to fill any gaps.
      </p>
    </div>
  );
}

/* ───────── Step 3: Brand ───────── */
function BrandStep({
  brand,
  setBrand,
}: {
  brand: BrandConfig;
  setBrand: React.Dispatch<React.SetStateAction<BrandConfig>>;
}) {
  const logoRef = useRef<HTMLInputElement>(null);
  const [scraping, setScraping] = useState(false);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBrand(prev => ({ ...prev, logo: file, logoPreview: URL.createObjectURL(file) }));
    }
  };

  const handleScrape = () => {
    if (!brand.scrapeUrl.trim()) return;
    setScraping(true);
    setTimeout(() => {
      setScraping(false);
      setBrand(prev => ({ ...prev, primary: '#6366f1', secondary: '#ec4899' }));
      toast({ title: 'Brand extracted', description: 'Colors detected from your website.' });
    }, 2000);
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-heading text-lg font-semibold mb-1">Brand your video</h2>
        <p className="text-muted-foreground text-sm">
          Set your brand identity so every scene matches your look. Or scrape a page to auto-detect.
        </p>
      </div>

      {/* Auto-detect from URL */}
      <div className="bg-secondary/40 border border-border rounded-xl p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">Auto-detect from website</span>
        </div>
        <div className="flex gap-2">
          <input
            value={brand.scrapeUrl}
            onChange={e => setBrand(prev => ({ ...prev, scrapeUrl: e.target.value }))}
            placeholder="https://yoursite.com"
            className="flex-1 bg-background/40 border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/40 transition-colors"
          />
          <button
            type="button"
            onClick={handleScrape}
            disabled={!brand.scrapeUrl.trim() || scraping}
            className="flex items-center gap-1.5 bg-primary/15 text-primary text-xs font-medium px-3 py-2 rounded-lg hover:bg-primary/25 transition-colors disabled:opacity-40"
          >
            {scraping ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            Detect
          </button>
        </div>
      </div>

      {/* Manual controls */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Colors */}
        <div className="space-y-3">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Colors</span>
          <div className="flex gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="color"
                value={brand.primary}
                onChange={e => setBrand(prev => ({ ...prev, primary: e.target.value }))}
                className="w-9 h-9 rounded-lg border border-border cursor-pointer bg-transparent"
              />
              <span className="text-xs text-muted-foreground">Primary</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="color"
                value={brand.secondary}
                onChange={e => setBrand(prev => ({ ...prev, secondary: e.target.value }))}
                className="w-9 h-9 rounded-lg border border-border cursor-pointer bg-transparent"
              />
              <span className="text-xs text-muted-foreground">Accent</span>
            </label>
          </div>
        </div>

        {/* Logo */}
        <div className="space-y-3">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Logo</span>
          {brand.logoPreview ? (
            <div className="flex items-center gap-3">
              <img src={brand.logoPreview} alt="Logo" className="w-10 h-10 rounded-lg object-contain bg-background/40 border border-border" />
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
              className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground bg-secondary/60 hover:bg-secondary rounded-lg px-3 py-2 transition-colors"
            >
              <FileImage className="w-3.5 h-3.5" />
              Upload logo
            </button>
          )}
          <input ref={logoRef} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
        </div>
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
  );
}

/* ───────── Main Create Page ───────── */
export default function Create() {
  const [step, setStep] = useState<Step>('prompt');
  const [prompt, setPrompt] = useState('');
  const [url, setUrl] = useState('');
  const [showUrl, setShowUrl] = useState(false);
  const [loading, setLoading] = useState(false);

  const [mediaSlots, setMediaSlots] = useState<MediaSlot[]>([
    { label: 'Mobile Screenshot', icon: Smartphone, description: 'App or mobile web screenshot', file: null, preview: null },
    { label: 'Desktop Screenshot', icon: Monitor, description: 'Desktop or dashboard screenshot', file: null, preview: null },
    { label: 'Background Media', icon: Image, description: 'Video or image for scene backgrounds', file: null, preview: null },
    { label: 'Additional Asset', icon: Upload, description: 'Product photo, icon, or any extra visual', file: null, preview: null },
  ]);

  const [brand, setBrand] = useState<BrandConfig>({
    primary: '#E04F8A',
    secondary: '#EC9A2C',
    logo: null,
    logoPreview: null,
    font: 'System Default',
    scrapeUrl: '',
  });

  const currentIdx = STEPS.findIndex(s => s.id === step);
  const isFirst = currentIdx === 0;
  const isLast = currentIdx === STEPS.length - 1;

  const canProceed = step === 'prompt' ? prompt.trim().length > 0 : true;

  const handleNext = () => {
    if (isLast) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        toast({ title: 'Video generation started', description: 'Your cinematic video is being created.' });
      }, 2500);
      return;
    }
    setStep(STEPS[currentIdx + 1].id);
  };

  const handleBack = () => {
    if (!isFirst) setStep(STEPS[currentIdx - 1].id);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl space-y-8">
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

        {/* Step content card */}
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
                    prompt={prompt}
                    setPrompt={setPrompt}
                    url={url}
                    setUrl={setUrl}
                    showUrl={showUrl}
                    setShowUrl={setShowUrl}
                  />
                )}
                {step === 'media' && (
                  <MediaStep mediaSlots={mediaSlots} setMediaSlots={setMediaSlots} />
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
              onClick={handleBack}
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
