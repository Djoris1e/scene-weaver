import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Rocket, Monitor, CalendarDays, Video, Megaphone, Briefcase,
  Link, Upload, Sparkles, Loader2, ArrowRight, ArrowLeft,
  Check, Palette, X,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

/* ───────── Shared Types & Data ───────── */
const videoTypes = [
  { id: 'launch', icon: Rocket, label: 'Product Launch' },
  { id: 'explainer', icon: Monitor, label: 'Explainer' },
  { id: 'promo', icon: Megaphone, label: 'Promotion' },
  { id: 'social', icon: Video, label: 'Social Media' },
  { id: 'portfolio', icon: Briefcase, label: 'Portfolio Reel' },
  { id: 'event', icon: CalendarDays, label: 'Event Promo' },
];

const contentSources = [
  { id: 'url', icon: Link, label: 'Scrape a page', desc: 'Paste a URL and we\'ll extract content' },
  { id: 'upload', icon: Upload, label: 'Upload files', desc: 'Images or videos to include' },
  { id: 'prompt', icon: Sparkles, label: 'Describe it', desc: 'Write what you want in the video' },
] as const;

type ContentSourceId = typeof contentSources[number]['id'];

const generatingMessages = [
  'Analyzing your content...',
  'Picking the perfect soundtrack...',
  'Finding stock footage...',
  'Composing scenes...',
  'Syncing to the beat...',
  'Adding finishing touches...',
];

interface WizardState {
  videoType: string | null;
  contentSource: ContentSourceId | null;
  contentData: string;
  brandEnabled: boolean;
  brandColors: { primary: string; secondary: string };
}

const defaultState: WizardState = {
  videoType: null,
  contentSource: null,
  contentData: '',
  brandEnabled: false,
  brandColors: { primary: '#E04F8A', secondary: '#EC9A2C' },
};

/* ───────── Version A: Chatbot (Landbot-style) ───────── */
interface ChatMessage {
  role: 'bot' | 'user';
  content: string;
  options?: { id: string; label: string; icon?: React.ElementType }[];
  inputType?: 'url' | 'upload' | 'prompt' | 'brand-ask' | 'generating';
}

function WizardA() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typing, setTyping] = useState(false);
  const [state, setState] = useState<WizardState>({ ...defaultState });
  const [inputVal, setInputVal] = useState('');
  const [genMsg, setGenMsg] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const phase = useRef<'type' | 'source' | 'source-input' | 'brand' | 'brand-config' | 'generating'>('type');

  const addBotMessage = useCallback((msg: ChatMessage, delay = 600) => {
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(prev => [...prev, msg]);
    }, delay);
  }, []);

  // Initial message
  useEffect(() => {
    addBotMessage({
      role: 'bot',
      content: 'Hey! 👋 What kind of video are you making?',
      options: videoTypes.map(v => ({ id: v.id, label: v.label, icon: v.icon })),
    }, 400);
  }, [addBotMessage]);

  // Scroll to bottom
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, typing]);

  // Generation timer
  useEffect(() => {
    if (phase.current !== 'generating') return;
    const interval = setInterval(() => {
      setGenMsg(prev => {
        if (prev >= generatingMessages.length - 1) {
          clearInterval(interval);
          setTimeout(() => navigate('/editor'), 800);
          return prev;
        }
        return prev + 1;
      });
    }, 700);
    return () => clearInterval(interval);
  }, [messages, navigate]);

  const handleOptionSelect = (optionId: string, label: string) => {
    setMessages(prev => [...prev, { role: 'user', content: label }]);

    if (phase.current === 'type') {
      setState(s => ({ ...s, videoType: optionId }));
      phase.current = 'source';
      addBotMessage({
        role: 'bot',
        content: 'Great choice! 🎯 Got any content I can work with?',
        options: contentSources.map(s => ({ id: s.id, label: s.label, icon: s.icon })),
      });
    } else if (phase.current === 'source') {
      setState(s => ({ ...s, contentSource: optionId as ContentSourceId }));
      phase.current = 'source-input';
      const prompts: Record<string, string> = {
        url: 'Drop the URL and I\'ll extract everything I need 🔗',
        upload: 'Upload your images or videos below 📁',
        prompt: 'Tell me what the video should be about ✍️',
      };
      addBotMessage({
        role: 'bot',
        content: prompts[optionId] || 'Tell me more!',
        inputType: optionId as 'url' | 'upload' | 'prompt',
      });
    } else if (phase.current === 'brand') {
      if (optionId === 'yes') {
        phase.current = 'brand-config';
        addBotMessage({
          role: 'bot',
          content: 'Set your brand colors below 🎨',
          inputType: 'brand-ask',
        });
      } else {
        phase.current = 'generating';
        addBotMessage({
          role: 'bot',
          content: '✨ Creating your video...',
          inputType: 'generating',
        });
      }
    }
  };

  const handleContentSubmit = () => {
    if (!inputVal.trim() && state.contentSource !== 'upload') return;
    setState(s => ({ ...s, contentData: inputVal }));
    setMessages(prev => [...prev, { role: 'user', content: inputVal || 'Files uploaded' }]);
    setInputVal('');
    phase.current = 'brand';
    addBotMessage({
      role: 'bot',
      content: 'Almost there! Want to add your brand colors? 🎨',
      options: [
        { id: 'yes', label: 'Yes, configure' },
        { id: 'skip', label: 'Skip' },
      ],
    });
  };

  const handleBrandDone = () => {
    setState(s => ({ ...s, brandEnabled: true }));
    setMessages(prev => [...prev, { role: 'user', content: 'Brand kit configured' }]);
    phase.current = 'generating';
    addBotMessage({
      role: 'bot',
      content: '✨ Creating your video...',
      inputType: 'generating',
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-card border border-border rounded-2xl overflow-hidden flex flex-col" style={{ height: '480px' }}>
      {/* Header */}
      <div className="px-5 py-3 border-b border-border/60 flex items-center gap-2">
        <div className="w-8 h-8 rounded-full gradient-vs flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-primary-foreground" />
        </div>
        <span className="text-sm font-semibold">VanillaSky Assistant</span>
        <span className="ml-auto text-[10px] text-muted-foreground/60 bg-secondary px-2 py-0.5 rounded-full">AI</span>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-4 scrollbar-none">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] space-y-2 ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
              <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-primary text-primary-foreground rounded-br-md'
                  : 'bg-secondary text-foreground rounded-bl-md'
              }`}>
                {msg.content}
              </div>

              {/* Option chips */}
              {msg.options && (
                <div className="flex flex-wrap gap-1.5">
                  {msg.options.map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => handleOptionSelect(opt.id, opt.label)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-card text-xs font-medium hover:border-primary hover:bg-primary/10 transition-colors"
                    >
                      {opt.icon && <opt.icon className="w-3.5 h-3.5" />}
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Inline inputs */}
              {msg.inputType === 'url' && (
                <div className="flex gap-2 w-full">
                  <input value={inputVal} onChange={e => setInputVal(e.target.value)} placeholder="https://..."
                    className="flex-1 bg-secondary border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary"
                    onKeyDown={e => e.key === 'Enter' && handleContentSubmit()} />
                  <button onClick={handleContentSubmit} className="px-3 py-2 rounded-xl bg-primary text-primary-foreground text-sm"><ArrowRight className="w-4 h-4" /></button>
                </div>
              )}
              {msg.inputType === 'prompt' && (
                <div className="w-full space-y-2">
                  <textarea value={inputVal} onChange={e => setInputVal(e.target.value)} placeholder="Describe your video..."
                    rows={3} className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary resize-none" />
                  <button onClick={handleContentSubmit} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium"><ArrowRight className="w-4 h-4" /> Submit</button>
                </div>
              )}
              {msg.inputType === 'upload' && (
                <div className="w-full space-y-2">
                  <label className="flex flex-col items-center gap-2 p-6 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary/40 transition-colors">
                    <Upload className="w-6 h-6 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Click to upload images or videos</span>
                    <input type="file" multiple accept="image/*,video/*" className="hidden" onChange={() => { setInputVal('files'); handleContentSubmit(); }} />
                  </label>
                </div>
              )}
              {msg.inputType === 'brand-ask' && (
                <div className="w-full space-y-3">
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                      <input type="color" value={state.brandColors.primary} onChange={e => setState(s => ({ ...s, brandColors: { ...s.brandColors, primary: e.target.value } }))} className="w-8 h-8 rounded-lg border border-border cursor-pointer bg-transparent" />
                      <span className="text-xs text-muted-foreground">Primary</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="color" value={state.brandColors.secondary} onChange={e => setState(s => ({ ...s, brandColors: { ...s.brandColors, secondary: e.target.value } }))} className="w-8 h-8 rounded-lg border border-border cursor-pointer bg-transparent" />
                      <span className="text-xs text-muted-foreground">Accent</span>
                    </div>
                  </div>
                  <button onClick={handleBrandDone} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium"><Check className="w-4 h-4" /> Done</button>
                </div>
              )}
              {msg.inputType === 'generating' && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  <span>{generatingMessages[genMsg]}</span>
                </div>
              )}
            </div>
          </motion.div>
        ))}

        {/* Typing indicator */}
        {typing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="bg-secondary rounded-2xl rounded-bl-md px-4 py-3 flex gap-1">
              {[0, 1, 2].map(i => (
                <div key={i} className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

/* ───────── Version B: Stepper (Recommended) ───────── */
function WizardB() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [state, setState] = useState<WizardState>({ ...defaultState });
  const [inputVal, setInputVal] = useState('');
  const [genMsg, setGenMsg] = useState(0);

  const goNext = () => { setDirection(1); setStep(s => s + 1); };
  const goBack = () => { setDirection(-1); setStep(s => s - 1); };

  const canContinue = () => {
    if (step === 1) return !!state.videoType;
    if (step === 2) return !!state.contentSource && (state.contentData.length > 0 || state.contentSource === 'upload');
    return true;
  };

  // Generation animation
  useEffect(() => {
    if (step !== 4) return;
    const interval = setInterval(() => {
      setGenMsg(prev => {
        if (prev >= generatingMessages.length - 1) {
          clearInterval(interval);
          setTimeout(() => navigate('/editor'), 800);
          return prev;
        }
        return prev + 1;
      });
    }, 700);
    return () => clearInterval(interval);
  }, [step, navigate]);

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -60 : 60, opacity: 0 }),
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-card border border-border rounded-2xl overflow-hidden">
      {/* Progress dots */}
      <div className="flex items-center justify-center gap-2 pt-5 pb-2">
        {[1, 2, 3, 4].map(s => (
          <div key={s} className={`w-2 h-2 rounded-full transition-colors ${s <= step ? 'bg-primary' : 'bg-muted'}`} />
        ))}
      </div>

      {/* Content */}
      <div className="px-6 pb-6 min-h-[360px] flex flex-col">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="flex-1 flex flex-col"
          >
            {step === 1 && (
              <div className="space-y-5 pt-2">
                <div className="space-y-1">
                  <h2 className="font-heading text-xl font-bold">What kind of video are you creating?</h2>
                  <p className="text-sm text-muted-foreground">Pick one to get started</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {videoTypes.map(v => (
                    <button
                      key={v.id}
                      onClick={() => setState(s => ({ ...s, videoType: v.id }))}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                        state.videoType === v.id
                          ? 'border-primary bg-primary/10 shadow-[0_0_20px_hsla(338,72%,59%,0.15)]'
                          : 'border-border hover:border-muted-foreground/30 bg-secondary/40'
                      }`}
                    >
                      <v.icon className={`w-5 h-5 ${state.videoType === v.id ? 'text-primary' : 'text-muted-foreground'}`} />
                      <span className="text-xs font-medium">{v.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4 pt-2">
                <div className="space-y-1">
                  <h2 className="font-heading text-xl font-bold">What should we work with?</h2>
                  <p className="text-sm text-muted-foreground">Choose how to provide content</p>
                </div>
                <div className="space-y-2">
                  {contentSources.map(src => (
                    <button
                      key={src.id}
                      onClick={() => { setState(s => ({ ...s, contentSource: src.id })); setInputVal(''); }}
                      className={`w-full flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all ${
                        state.contentSource === src.id
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-muted-foreground/30 bg-secondary/40'
                      }`}
                    >
                      <src.icon className={`w-5 h-5 shrink-0 ${state.contentSource === src.id ? 'text-primary' : 'text-muted-foreground'}`} />
                      <div>
                        <span className="text-sm font-medium block">{src.label}</span>
                        <span className="text-xs text-muted-foreground">{src.desc}</span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Expanded input */}
                <AnimatePresence>
                  {state.contentSource && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      {state.contentSource === 'url' && (
                        <input value={inputVal} onChange={e => { setInputVal(e.target.value); setState(s => ({ ...s, contentData: e.target.value })); }}
                          placeholder="https://your-page.com" className="w-full bg-secondary border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary" />
                      )}
                      {state.contentSource === 'prompt' && (
                        <textarea value={inputVal} onChange={e => { setInputVal(e.target.value); setState(s => ({ ...s, contentData: e.target.value })); }}
                          placeholder="Describe what the video should be about..." rows={3}
                          className="w-full bg-secondary border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary resize-none" />
                      )}
                      {state.contentSource === 'upload' && (
                        <label className="flex flex-col items-center gap-2 p-8 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary/40 transition-colors">
                          <Upload className="w-6 h-6 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">Click to upload images or videos</span>
                          <input type="file" multiple accept="image/*,video/*" className="hidden" onChange={() => setState(s => ({ ...s, contentData: 'uploaded' }))} />
                        </label>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-5 pt-2">
                <div className="space-y-1">
                  <h2 className="font-heading text-xl font-bold">Got a brand kit?</h2>
                  <p className="text-sm text-muted-foreground">Optional — we'll match your brand across every scene</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setState(s => ({ ...s, brandEnabled: false }))}
                    className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-all ${
                      !state.brandEnabled ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-secondary/40 text-muted-foreground hover:border-muted-foreground/30'
                    }`}
                  >Skip</button>
                  <button
                    onClick={() => setState(s => ({ ...s, brandEnabled: true }))}
                    className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-all ${
                      state.brandEnabled ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-secondary/40 text-muted-foreground hover:border-muted-foreground/30'
                    }`}
                  >Yes, configure</button>
                </div>

                <AnimatePresence>
                  {state.brandEnabled && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="bg-secondary/60 rounded-xl p-4 space-y-3">
                        <div className="flex gap-4">
                          <div className="flex items-center gap-2">
                            <input type="color" value={state.brandColors.primary} onChange={e => setState(s => ({ ...s, brandColors: { ...s.brandColors, primary: e.target.value } }))} className="w-8 h-8 rounded-lg border border-border cursor-pointer bg-transparent" />
                            <span className="text-xs text-muted-foreground">Primary</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <input type="color" value={state.brandColors.secondary} onChange={e => setState(s => ({ ...s, brandColors: { ...s.brandColors, secondary: e.target.value } }))} className="w-8 h-8 rounded-lg border border-border cursor-pointer bg-transparent" />
                            <span className="text-xs text-muted-foreground">Accent</span>
                          </div>
                          <label className="flex items-center gap-2 cursor-pointer group">
                            <div className="w-8 h-8 rounded-lg border border-dashed border-border flex items-center justify-center bg-card group-hover:border-muted-foreground transition-colors"><span className="text-muted-foreground text-xs">+</span></div>
                            <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">Logo</span>
                            <input type="file" accept="image/*" className="hidden" />
                          </label>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {step === 4 && (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 py-12">
                <div className="w-14 h-14 rounded-2xl gradient-vs flex items-center justify-center">
                  <Sparkles className="w-7 h-7 text-primary-foreground animate-pulse" />
                </div>
                <h2 className="font-heading text-xl font-bold">Creating your video...</h2>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  <span>{generatingMessages[genMsg]}</span>
                </div>
                <div className="w-48 h-1.5 bg-secondary rounded-full overflow-hidden mt-2">
                  <motion.div className="h-full gradient-vs rounded-full" initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: 4.5, ease: 'easeInOut' }} />
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Footer */}
        {step < 4 && (
          <div className="flex items-center justify-between pt-4 border-t border-border/60 mt-auto">
            <button onClick={goBack} disabled={step === 1}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-0">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button onClick={step === 3 ? () => goNext() : goNext} disabled={!canContinue()}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-30">
              {step === 3 ? 'Create' : 'Continue'} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ───────── Version C: Typeform (Full-screen steps) ───────── */
function WizardC() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [state, setState] = useState<WizardState>({ ...defaultState });
  const [inputVal, setInputVal] = useState('');
  const [genMsg, setGenMsg] = useState(0);
  const totalSteps = 4;

  const canContinue = () => {
    if (step === 1) return !!state.videoType;
    if (step === 2) return !!state.contentSource && (state.contentData.length > 0 || state.contentSource === 'upload');
    return true;
  };

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (step === 4) return;
      if (e.key === 'Enter' && canContinue()) {
        setStep(s => s + 1);
        return;
      }
      if (step === 1) {
        const idx = 'abcdef'.indexOf(e.key.toLowerCase());
        if (idx >= 0 && idx < videoTypes.length) {
          setState(s => ({ ...s, videoType: videoTypes[idx].id }));
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  });

  // Generation
  useEffect(() => {
    if (step !== 4) return;
    const interval = setInterval(() => {
      setGenMsg(prev => {
        if (prev >= generatingMessages.length - 1) {
          clearInterval(interval);
          setTimeout(() => navigate('/editor'), 800);
          return prev;
        }
        return prev + 1;
      });
    }, 700);
    return () => clearInterval(interval);
  }, [step, navigate]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress bar */}
      <div className="relative h-1 bg-muted rounded-full mb-8 overflow-hidden">
        <motion.div className="absolute inset-y-0 left-0 gradient-vs rounded-full" animate={{ width: `${(step / totalSteps) * 100}%` }} transition={{ duration: 0.4 }} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.35 }}
        >
          {step === 1 && (
            <div className="space-y-8">
              <div className="space-y-2">
                <p className="text-xs font-medium tracking-widest uppercase text-primary">Step 1 of {totalSteps}</p>
                <h2 className="font-heading text-3xl md:text-4xl font-bold leading-tight">What type of video do<br />you want to create?</h2>
              </div>
              <div className="space-y-2.5">
                {videoTypes.map((v, i) => (
                  <button
                    key={v.id}
                    onClick={() => setState(s => ({ ...s, videoType: v.id }))}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all group ${
                      state.videoType === v.id
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-muted-foreground/30 bg-card'
                    }`}
                  >
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                      state.videoType === v.id ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'
                    }`}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    <v.icon className={`w-5 h-5 shrink-0 ${state.videoType === v.id ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span className="text-sm font-medium">{v.label}</span>
                    {state.videoType === v.id && <Check className="w-4 h-4 text-primary ml-auto" />}
                  </button>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground/50">press A-F or click</span>
                <button onClick={() => setStep(2)} disabled={!state.videoType}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-30">
                  OK <Check className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8">
              <div className="space-y-2">
                <p className="text-xs font-medium tracking-widest uppercase text-primary">Step 2 of {totalSteps}</p>
                <h2 className="font-heading text-3xl md:text-4xl font-bold leading-tight">What should we<br />work with?</h2>
              </div>
              <div className="space-y-2.5">
                {contentSources.map((src, i) => (
                  <button
                    key={src.id}
                    onClick={() => { setState(s => ({ ...s, contentSource: src.id })); setInputVal(''); }}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all ${
                      state.contentSource === src.id ? 'border-primary bg-primary/10' : 'border-border hover:border-muted-foreground/30 bg-card'
                    }`}
                  >
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                      state.contentSource === src.id ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'
                    }`}>{String.fromCharCode(65 + i)}</span>
                    <src.icon className={`w-5 h-5 shrink-0 ${state.contentSource === src.id ? 'text-primary' : 'text-muted-foreground'}`} />
                    <div>
                      <span className="text-sm font-medium block">{src.label}</span>
                      <span className="text-xs text-muted-foreground">{src.desc}</span>
                    </div>
                  </button>
                ))}
              </div>

              <AnimatePresence>
                {state.contentSource && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    {state.contentSource === 'url' && (
                      <input value={inputVal} onChange={e => { setInputVal(e.target.value); setState(s => ({ ...s, contentData: e.target.value })); }}
                        placeholder="https://your-page.com" className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary" />
                    )}
                    {state.contentSource === 'prompt' && (
                      <textarea value={inputVal} onChange={e => { setInputVal(e.target.value); setState(s => ({ ...s, contentData: e.target.value })); }}
                        placeholder="Describe what the video should be about..." rows={4}
                        className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary resize-none" />
                    )}
                    {state.contentSource === 'upload' && (
                      <label className="flex flex-col items-center gap-3 p-10 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary/40 transition-colors bg-card">
                        <Upload className="w-8 h-8 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Drop files here or click to upload</span>
                        <input type="file" multiple accept="image/*,video/*" className="hidden" onChange={() => setState(s => ({ ...s, contentData: 'uploaded' }))} />
                      </label>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex items-center justify-between">
                <button onClick={() => setStep(1)} className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"><ArrowLeft className="w-4 h-4" /> Back</button>
                <button onClick={() => setStep(3)} disabled={!canContinue()}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-30">
                  OK <Check className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8">
              <div className="space-y-2">
                <p className="text-xs font-medium tracking-widest uppercase text-primary">Step 3 of {totalSteps}</p>
                <h2 className="font-heading text-3xl md:text-4xl font-bold leading-tight">One more thing.</h2>
                <p className="text-muted-foreground text-lg">Want to add your brand colors?</p>
              </div>

              <div className="space-y-3">
                <button onClick={() => { setState(s => ({ ...s, brandEnabled: false })); setStep(4); }}
                  className="w-full flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:border-muted-foreground/30 text-left transition-all">
                  <span className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center text-xs font-bold text-muted-foreground">A</span>
                  <span className="text-sm font-medium">Skip — use defaults</span>
                </button>
                <button onClick={() => setState(s => ({ ...s, brandEnabled: true }))}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all ${
                    state.brandEnabled ? 'border-primary bg-primary/10' : 'border-border bg-card hover:border-muted-foreground/30'
                  }`}>
                  <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${state.brandEnabled ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>B</span>
                  <Palette className={`w-5 h-5 ${state.brandEnabled ? 'text-primary' : 'text-muted-foreground'}`} />
                  <span className="text-sm font-medium">Yes, configure brand kit</span>
                </button>
              </div>

              <AnimatePresence>
                {state.brandEnabled && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="bg-card border border-border rounded-xl p-5 space-y-4">
                      <div className="flex gap-6">
                        <div className="flex items-center gap-2">
                          <input type="color" value={state.brandColors.primary} onChange={e => setState(s => ({ ...s, brandColors: { ...s.brandColors, primary: e.target.value } }))} className="w-10 h-10 rounded-lg border border-border cursor-pointer bg-transparent" />
                          <span className="text-sm text-muted-foreground">Primary</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input type="color" value={state.brandColors.secondary} onChange={e => setState(s => ({ ...s, brandColors: { ...s.brandColors, secondary: e.target.value } }))} className="w-10 h-10 rounded-lg border border-border cursor-pointer bg-transparent" />
                          <span className="text-sm text-muted-foreground">Accent</span>
                        </div>
                        <label className="flex items-center gap-2 cursor-pointer group">
                          <div className="w-10 h-10 rounded-lg border border-dashed border-border flex items-center justify-center bg-secondary group-hover:border-muted-foreground transition-colors"><Upload className="w-4 h-4 text-muted-foreground" /></div>
                          <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">Logo</span>
                          <input type="file" accept="image/*" className="hidden" />
                        </label>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex items-center justify-between">
                <button onClick={() => setStep(2)} className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"><ArrowLeft className="w-4 h-4" /> Back</button>
                {state.brandEnabled && (
                  <button onClick={() => setStep(4)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                    Create <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="flex flex-col items-center justify-center gap-6 py-20 text-center">
              <div className="w-16 h-16 rounded-2xl gradient-vs flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-primary-foreground animate-pulse" />
              </div>
              <h2 className="font-heading text-3xl font-bold">Creating your video...</h2>
              <div className="flex items-center gap-2 text-base text-muted-foreground">
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
                <span>{generatingMessages[genMsg]}</span>
              </div>
              <div className="w-64 h-2 bg-muted rounded-full overflow-hidden">
                <motion.div className="h-full gradient-vs rounded-full" initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: 4.5, ease: 'easeInOut' }} />
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ───────── Main Wizard with Version Switcher ───────── */
export default function CreationWizard() {
  const [variant, setVariant] = useState<'A' | 'B' | 'C'>('B');

  return (
    <div className="relative">
      {/* Floating version switcher */}
      <div className="fixed top-5 right-5 z-50 flex items-center gap-1 bg-card/90 backdrop-blur border border-border rounded-full px-1 py-1 shadow-lg">
        {(['A', 'B', 'C'] as const).map(v => (
          <button
            key={v}
            onClick={() => setVariant(v)}
            className={`w-8 h-8 rounded-full text-xs font-bold transition-all ${
              variant === v ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
            }`}
          >{v}</button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={variant} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.25 }}>
          {variant === 'A' && <WizardA />}
          {variant === 'B' && <WizardB />}
          {variant === 'C' && <WizardC />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
