import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import botAvatarImg from '@/assets/bot-avatar.png';
import {
  Rocket,
  Monitor,
  CalendarDays,
  Video,
  Megaphone,
  Briefcase,
  Link,
  Upload,
  Sparkles,
  Loader2,
  ArrowRight,
  Check,
  X,
  Image,
  Bot,
} from 'lucide-react';

/* ───────── Data ───────── */
const videoTypes = [
  { id: 'launch', icon: Rocket, label: 'Product Launch' },
  { id: 'explainer', icon: Monitor, label: 'Explainer' },
  { id: 'promo', icon: Megaphone, label: 'Promotion' },
  { id: 'social', icon: Video, label: 'Social Media' },
  { id: 'portfolio', icon: Briefcase, label: 'Portfolio Reel' },
  { id: 'event', icon: CalendarDays, label: 'Event Promo' },
];

const contentSources = [
  { id: 'url', icon: Link, label: 'Scrape a page', desc: "Paste a URL and we'll extract content" },
  { id: 'upload', icon: Upload, label: 'Upload files', desc: 'Images or videos to include' },
  { id: 'prompt', icon: Sparkles, label: 'Describe it', desc: 'Write what you want in the video' },
] as const;

const generatingMessages = [
  'Analyzing your content...',
  'Picking the perfect soundtrack...',
  'Finding stock footage...',
  'Composing scenes...',
  'Syncing to the beat...',
  'Adding finishing touches...',
];

/* ───────── Types ───────── */
interface ChatMessage {
  role: 'bot' | 'user';
  content: string;
  options?: { id: string; label: string; icon?: React.ElementType }[];
  inputType?: 'url' | 'upload' | 'prompt' | 'brand-ask' | 'logo-upload' | 'generating' | 'accumulator';
  sources?: string[];
}

type SourceFlowVariant = 'A' | 'B' | 'C';

type Phase = 'type' | 'source' | 'source-input' | 'brand' | 'brand-config' | 'logo' | 'generating';

const styles = {
  bubble: 'rounded-tl-md bg-muted text-foreground shadow-lg shadow-black/30',
  button: 'bg-card/80 shadow-[inset_0_0_0_1px_hsla(338,72%,59%,0.2),inset_0_0_0_1px_hsla(34,83%,55%,0.15)] hover:shadow-[inset_0_0_0_1px_hsla(338,72%,59%,0.4),inset_0_0_0_1px_hsla(34,83%,55%,0.3)]',
};

interface CreationWizardProps {
  onInteraction?: () => void;
  openingMessage?: string;
  buttonStyle?: 'default' | 'descriptive' | 'minimal';
}

type BotStyle = 'sparkle' | 'orb' | 'monogram' | 'waveform' | 'play' | 'filmstrip' | 'boticon' | 'label' | 'agent';

/* ───────── Bot indicators ───────── */

/* Sparkle — gradient circle with sparkle icon (original) */
function BotSparkle() {
  return (
    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent shadow-md shadow-primary/20">
      <Sparkles className="h-3.5 w-3.5 text-primary-foreground" />
    </div>
  );
}

/* Orb — soft glowing gradient circle, no icon */
function BotOrb() {
  return (
    <div className="h-7 w-7 shrink-0 rounded-full bg-gradient-to-br from-primary to-primary/60 shadow-lg shadow-primary/30 animate-pulse" />
  );
}

/* Monogram — branded 'VS' letter in circle */
function BotMonogram() {
  return (
    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-card border border-primary/30 shadow-md shadow-primary/10">
      <span className="text-[10px] font-heading font-bold gradient-vs-text leading-none">VS</span>
    </div>
  );
}

/* Waveform — animated bars that feel alive */
function BotWaveform() {
  return (
    <div className="flex h-7 w-7 shrink-0 items-center justify-center gap-[2px] rounded-full bg-card border border-primary/20 shadow-md shadow-primary/10">
      {[0, 1, 2].map(i => (
        <div
          key={i}
          className="w-[3px] rounded-full bg-primary"
          style={{
            height: '10px',
            animation: 'waveform 0.8s ease-in-out infinite',
            animationDelay: `${i * 0.15}s`,
          }}
        />
      ))}
    </div>
  );
}

/* Play — pulsing play triangle, feels like a video is about to start */
function BotPlay() {
  return (
    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/15 border border-primary/30 shadow-md shadow-primary/10 animate-pulse">
      <div className="ml-[2px] h-0 w-0 border-l-[7px] border-y-[5px] border-l-primary border-y-transparent" />
    </div>
  );
}

/* Filmstrip — two tiny animated frames like a rolling reel */
function BotFilmstrip() {
  return (
    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-card border border-primary/20 shadow-md shadow-primary/10 overflow-hidden">
      <div className="flex gap-[2px]" style={{ animation: 'fade-in 1.5s ease-in-out infinite alternate' }}>
        <div className="h-3.5 w-[5px] rounded-[1px] bg-primary/70 border border-primary/40" />
        <div className="h-3.5 w-[5px] rounded-[1px] bg-primary/40 border border-primary/25" />
        <div className="h-3.5 w-[5px] rounded-[1px] bg-primary/70 border border-primary/40" />
      </div>
    </div>
  );
}

/* Bot icon — lucide Bot icon as avatar with subtle blink */
function BotIcon() {
  return (
    <motion.div
      animate={{ opacity: [1, 0.6, 1] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-card border border-primary/20 shadow-md shadow-primary/10"
    >
      <Bot className="h-3.5 w-3.5 text-primary" />
    </motion.div>
  );
}

/* Label above bubble */
function BotLabel() {
  return (
    <div className="flex items-center gap-1.5 mb-1">
      <Sparkles className="h-3.5 w-3.5 text-primary" />
      <span className="text-xs font-semibold text-primary font-heading">AI Agent</span>
    </div>
  );
}

/* Agent bar — name + status dot */
function BotAgentBar() {
  return (
    <div className="flex items-center gap-2 mb-1.5">
      <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/15">
        <Bot className="h-3.5 w-3.5 text-primary" />
      </div>
      <span className="text-xs font-semibold text-foreground/80 font-heading">VanillaSky Agent</span>
      <div className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
    </div>
  );
}

/* Helper: renders the inline avatar for avatar-type styles */
function InlineAvatar({ style }: { style: BotStyle }) {
  switch (style) {
    case 'sparkle': return <BotSparkle />;
    case 'orb': return <BotOrb />;
    case 'monogram': return <BotMonogram />;
    case 'waveform': return <BotWaveform />;
    case 'play': return <BotPlay />;
    case 'filmstrip': return <BotFilmstrip />;
    case 'boticon': return <BotIcon />;
    default: return null;
  }
}

const isInlineStyle = (s: BotStyle) => ['sparkle', 'orb', 'monogram', 'waveform', 'play', 'filmstrip', 'boticon'].includes(s);
const inlineAvatarWidth = 'w-7';

/* ───────── Component ───────── */
export default function CreationWizard({ onInteraction }: CreationWizardProps) {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typing, setTyping] = useState(false);
  const [botStyle, setBotStyle] = useState<BotStyle>('sparkle');
  const [inputVal, setInputVal] = useState('');
  const [genMsg, setGenMsg] = useState(0);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [brandColors, setBrandColors] = useState({ primary: '#E04F8A', secondary: '#EC9A2C' });
  const [sourceFlowVariant, setSourceFlowVariant] = useState<SourceFlowVariant>('A');
  const [collectedSources, setCollectedSources] = useState<string[]>([]);
  const [sourceType, setSourceType] = useState<'url' | 'upload' | 'prompt'>('url');

  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const phase = useRef<Phase>('type');

  const lastMessage = messages[messages.length - 1];
  const activeBotMessageIndex = !typing && lastMessage?.role === 'bot' ? messages.length - 1 : -1;

  const addBotMessage = useCallback((msg: ChatMessage, delay = 600) => {
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(prev => [...prev, msg]);
    }, delay);
  }, []);

  useEffect(() => {
    addBotMessage(
      {
        role: 'bot',
        content: "Let's make something amazing — what kind of video are we creating?",
        options: videoTypes.map(v => ({ id: v.id, label: v.label, icon: v.icon })),
      },
      600,
    );
  }, [addBotMessage]);

  useEffect(() => {
    // Skip auto-scroll for the initial bot message (video type selection)
    // to avoid fighting with the hero collapse animation
    if (messages.length <= 1 && !typing) return;
    if (messages.length === 0) return;

    const timeout = setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, messages.length <= 2 ? 700 : 50);

    return () => clearTimeout(timeout);
  }, [messages, typing]);

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
    onInteraction?.();
    setMessages(prev => [...prev, { role: 'user', content: label }]);

    if (phase.current === 'type') {
      phase.current = 'source';
      addBotMessage({
        role: 'bot',
        content: 'Great choice! Got any content I can work with?',
        options: contentSources.map(source => ({ id: source.id, label: source.label, icon: source.icon })),
      });
      return;
    }

    if (phase.current === 'source') {
      sourceType === optionId as any || setSourceType(optionId as 'url' | 'upload' | 'prompt');
      setSourceType(optionId as 'url' | 'upload' | 'prompt');

      if (sourceFlowVariant === 'C' && optionId === 'url') {
        // Variant C: multi-input — show textarea for multiple URLs
        phase.current = 'source-input';
        addBotMessage({
          role: 'bot',
          content: 'Paste one or more URLs (one per line) and I\'ll extract content from all of them',
          inputType: 'prompt', // reuse textarea input type
        });
        return;
      }

      phase.current = 'source-input';
      const prompts: Record<string, string> = {
        url: "Drop the URL and I'll extract everything I need",
        upload: 'Upload your images or videos below',
        prompt: 'Tell me what the video should be about',
      };

      addBotMessage({
        role: 'bot',
        content: prompts[optionId] || 'Tell me more!',
        inputType: optionId as 'url' | 'upload' | 'prompt',
      });
      return;
    }

    // Handle "add-more" from Variant A
    if (optionId === 'add-more') {
      phase.current = 'source';
      addBotMessage({
        role: 'bot',
        content: 'What else have you got?',
        options: contentSources.map(source => ({ id: source.id, label: source.label, icon: source.icon })),
      });
      return;
    }

    // Handle "move-on" from Variant A
    if (optionId === 'move-on') {
      goToBrandPhase();
      return;
    }

    if (phase.current === 'brand') {
      if (optionId === 'yes') {
        phase.current = 'brand-config';
        addBotMessage({
          role: 'bot',
          content: 'Set your brand colors below',
          inputType: 'brand-ask',
        });
      } else {
        phase.current = 'logo';
        addBotMessage({
          role: 'bot',
          content: "Got a logo you'd like to include?",
          options: [
            { id: 'upload-logo', label: 'Yes, upload logo', icon: Image },
            { id: 'skip-logo', label: 'Skip' },
          ],
        });
      }
      return;
    }

    if (phase.current === 'logo') {
      if (optionId === 'upload-logo') {
        addBotMessage({
          role: 'bot',
          content: 'Drop your logo below — PNG or SVG works best!',
          inputType: 'logo-upload',
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

  const startGenerating = () => {
    phase.current = 'generating';
    addBotMessage({
      role: 'bot',
      content: '✨ Creating your video...',
      inputType: 'generating',
    });
  };

  const goToBrandPhase = () => {
    phase.current = 'brand';
    addBotMessage({
      role: 'bot',
      content: 'Almost there! Want to add your brand colors?',
      options: [
        { id: 'yes', label: 'Yes, configure' },
        { id: 'skip', label: 'Skip' },
      ],
    });
  };

  const handleContentSubmit = () => {
    if (!inputVal.trim()) return;

    onInteraction?.();
    const value = inputVal.trim();
    setMessages(prev => [...prev, { role: 'user', content: value }]);
    setInputVal('');

    // Variant C: parse multiple URLs
    if (sourceFlowVariant === 'C' && sourceType === 'url') {
      const urls = value.split('\n').map(u => u.trim()).filter(Boolean);
      setCollectedSources(prev => [...prev, ...urls]);
      goToBrandPhase();
      return;
    }

    // Variant A: "Anything else?" pattern
    if (sourceFlowVariant === 'A') {
      setCollectedSources(prev => [...prev, value]);
      phase.current = 'source-input'; // stay in source phase logically
      addBotMessage({
        role: 'bot',
        content: `Got it! ${collectedSources.length === 0 ? 'Want to add another source, or shall we move on?' : 'Anything else, or are we good?'}`,
        options: [
          { id: 'add-more', label: '+ Add another', icon: Link },
          { id: 'move-on', label: "Let's go →" },
        ],
      });
      return;
    }

    // Variant B: accumulator — add to sources and show accumulator UI
    if (sourceFlowVariant === 'B') {
      const newSources = [...collectedSources, value];
      setCollectedSources(newSources);
      phase.current = 'source-input';
      addBotMessage({
        role: 'bot',
        content: newSources.length === 1
          ? 'Added! Drop more URLs or files, or continue when ready.'
          : `${newSources.length} sources added. Keep going or continue.`,
        inputType: 'accumulator',
        sources: newSources,
      });
      return;
    }

    // Default fallback (shouldn't reach)
    goToBrandPhase();
  };

  const handleFileUpload = () => {
    onInteraction?.();
    setMessages(prev => [...prev, { role: 'user', content: 'Files uploaded' }]);
    setCollectedSources(prev => [...prev, 'uploaded files']);

    if (sourceFlowVariant === 'A') {
      addBotMessage({
        role: 'bot',
        content: 'Got it! Want to add another source, or shall we move on?',
        options: [
          { id: 'add-more', label: '+ Add another', icon: Link },
          { id: 'move-on', label: "Let's go →" },
        ],
      });
      return;
    }

    if (sourceFlowVariant === 'B') {
      const newSources = [...collectedSources, 'uploaded files'];
      phase.current = 'source-input';
      addBotMessage({
        role: 'bot',
        content: `${newSources.length} sources added. Keep going or continue.`,
        inputType: 'accumulator',
        sources: newSources,
      });
      return;
    }

    goToBrandPhase();
  };

  const handleAccumulatorSubmit = () => {
    if (inputVal.trim()) {
      const newSources = [...collectedSources, inputVal.trim()];
      setCollectedSources(newSources);
      setInputVal('');
      // Update the last message's sources
      setMessages(prev => {
        const updated = [...prev];
        const last = updated[updated.length - 1];
        if (last?.inputType === 'accumulator') {
          updated[updated.length - 1] = {
            ...last,
            content: `${newSources.length} sources added. Keep going or continue.`,
            sources: newSources,
          };
        }
        return updated;
      });
      return;
    }
    // No input — user pressed "That's everything"
    goToBrandPhase();
  };

  const handleBrandDone = () => {
    onInteraction?.();
    setMessages(prev => [...prev, { role: 'user', content: 'Brand colors set ✓' }]);
    phase.current = 'logo';

    addBotMessage({
      role: 'bot',
      content: "Got a logo you'd like to include?",
      options: [
        { id: 'upload-logo', label: 'Yes, upload logo', icon: Image },
        { id: 'skip-logo', label: 'Skip' },
      ],
    });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    onInteraction?.();
    const url = URL.createObjectURL(file);
    setLogoPreview(url);
    setMessages(prev => [...prev, { role: 'user', content: `Logo uploaded: ${file.name}` }]);
    startGenerating();
  };

  const handleLogoRemove = () => {
    if (logoPreview) URL.revokeObjectURL(logoPreview);
    setLogoPreview(null);
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-120px)] w-full max-w-2xl flex-col">
      <div ref={scrollRef} className="flex-1 space-y-5 overflow-y-auto scrollbar-none pb-12">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className={`flex items-start gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            {/* Inline avatar styles (sparkle, orb, monogram, waveform) */}
            {msg.role === 'bot' && isInlineStyle(botStyle) && i === activeBotMessageIndex && (
              <div className="flex h-[44px] items-center"><InlineAvatar style={botStyle} /></div>
            )}
            {msg.role === 'bot' && isInlineStyle(botStyle) && i !== activeBotMessageIndex && (
              <div className={`${inlineAvatarWidth} shrink-0`} />
            )}

            <div className={`max-w-[85%] space-y-3 ${msg.role === 'user' ? 'flex flex-col items-end' : ''}`}>
              {/* Style B: Label — text label above bubble */}
              {msg.role === 'bot' && botStyle === 'label' && i === activeBotMessageIndex && <BotLabel />}

              {/* Style C: Agent bar — name + status above bubble */}
              {msg.role === 'bot' && botStyle === 'agent' && i === activeBotMessageIndex && <BotAgentBar />}

              <div
                className={`inline-block rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'rounded-tr-md bg-primary text-primary-foreground'
                    : styles.bubble
                }`}
              >
                {msg.content}
              </div>

              {msg.options && (
                <div className="flex flex-wrap gap-2">
                  {msg.options.map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => handleOptionSelect(opt.id, opt.label)}
                      className={`group flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-foreground transition-all duration-200 ${styles.button}`}
                    >
                      {opt.icon ? <opt.icon className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" /> : null}
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}

              {msg.inputType === 'url' && (
                <div className="flex w-full gap-2">
                  <input
                    autoFocus
                    value={inputVal}
                    onChange={e => setInputVal(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleContentSubmit()}
                    placeholder="https://..."
                    className="flex-1 rounded-xl border border-border/80 bg-card/80 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                  <button
                    onClick={handleContentSubmit}
                    className="rounded-xl bg-primary px-3.5 py-2.5 text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              )}

              {msg.inputType === 'prompt' && (
                <div className="w-full space-y-2.5">
                  <textarea
                    autoFocus
                    value={inputVal}
                    onChange={e => setInputVal(e.target.value)}
                    placeholder="Describe your video..."
                    rows={3}
                    className="w-full resize-none rounded-xl border border-border/80 bg-card/80 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                  <button
                    onClick={handleContentSubmit}
                    className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    <ArrowRight className="h-4 w-4" /> Continue
                  </button>
                </div>
              )}

              {msg.inputType === 'upload' && (
                <div className="w-full">
                  <label className="flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed border-border/60 p-8 transition-all duration-200 hover:border-primary/40 hover:bg-primary/5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
                      <Upload className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <span className="text-xs text-muted-foreground">Click to upload images or videos</span>
                    <input type="file" multiple accept="image/*,video/*" className="hidden" onChange={handleFileUpload} />
                  </label>
                </div>
              )}

              {msg.inputType === 'accumulator' && (
                <div className="w-full space-y-3">
                  {/* Source chips */}
                  <div className="flex flex-wrap gap-2">
                    {(msg.sources || []).map((src, si) => (
                      <div
                        key={si}
                        className="flex items-center gap-1.5 rounded-lg bg-secondary/80 px-3 py-1.5 text-xs text-foreground border border-border/60"
                      >
                        <Link className="h-3 w-3 text-muted-foreground" />
                        <span className="max-w-[180px] truncate">{src}</span>
                      </div>
                    ))}
                  </div>
                  {/* Always-ready input */}
                  <div className="flex w-full gap-2">
                    <input
                      autoFocus
                      value={inputVal}
                      onChange={e => setInputVal(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && inputVal.trim()) handleAccumulatorSubmit();
                      }}
                      placeholder="Add another URL..."
                      className="flex-1 rounded-xl border border-border/80 bg-card/80 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                    {inputVal.trim() ? (
                      <button
                        onClick={handleAccumulatorSubmit}
                        className="rounded-xl bg-secondary px-3.5 py-2.5 text-foreground transition-colors hover:bg-secondary/80"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    ) : null}
                  </div>
                  <button
                    onClick={() => goToBrandPhase()}
                    className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    <ArrowRight className="h-4 w-4" /> That's everything
                  </button>
                </div>
              )}

              {msg.inputType === 'brand-ask' && (
                <div className="w-full space-y-3">
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={brandColors.primary}
                        onChange={e => setBrandColors(current => ({ ...current, primary: e.target.value }))}
                        className="h-9 w-9 cursor-pointer rounded-lg border border-border bg-transparent"
                      />
                      <span className="text-xs text-muted-foreground">Primary</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={brandColors.secondary}
                        onChange={e => setBrandColors(current => ({ ...current, secondary: e.target.value }))}
                        className="h-9 w-9 cursor-pointer rounded-lg border border-border bg-transparent"
                      />
                      <span className="text-xs text-muted-foreground">Accent</span>
                    </div>
                  </div>
                  <button
                    onClick={handleBrandDone}
                    className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    <Check className="h-4 w-4" /> Done
                  </button>
                </div>
              )}

              {msg.inputType === 'logo-upload' && (
                <div className="w-full space-y-2">
                  {logoPreview ? (
                    <div className="relative inline-block">
                      <img src={logoPreview} alt="Logo preview" className="h-16 rounded-lg border border-border bg-secondary/40 p-2 object-contain" />
                      <button
                        onClick={handleLogoRemove}
                        className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed border-border/60 p-8 transition-all duration-200 hover:border-primary/40 hover:bg-primary/5">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
                        <Image className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <span className="text-xs text-muted-foreground">Upload your logo (PNG, SVG)</span>
                      <input type="file" accept="image/*,.svg" className="hidden" onChange={handleLogoUpload} />
                    </label>
                  )}
                </div>
              )}

              {msg.inputType === 'generating' && (
                <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <span>{generatingMessages[genMsg]}</span>
                </div>
              )}
            </div>
          </motion.div>
        ))}

        {typing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start gap-2.5">
            {isInlineStyle(botStyle) && <div className="flex h-[44px] items-center"><InlineAvatar style={botStyle} /></div>}
            <div className="space-y-1">
              {botStyle === 'label' && <BotLabel />}
              {botStyle === 'agent' && <BotAgentBar />}
              <div className="flex gap-1.5 rounded-2xl rounded-tl-md bg-secondary/80 px-4 py-3">
                {[0, 1, 2].map(i => (
                  <div
                    key={i}
                    className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-pulse"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Floating source flow variant switcher */}
      <div className="fixed bottom-20 right-6 z-50 flex gap-1 rounded-xl border border-border bg-card/90 backdrop-blur-xl p-1 shadow-xl">
        <span className="px-2 py-1.5 text-[10px] text-muted-foreground font-medium">Source flow:</span>
        {(['A', 'B', 'C'] as const).map(v => (
          <button
            key={v}
            onClick={() => setSourceFlowVariant(v)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              sourceFlowVariant === v
                ? 'bg-accent text-accent-foreground shadow-md'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
            }`}
          >
            {v === 'A' ? 'A: Anything else?' : v === 'B' ? 'B: Accumulator' : 'C: Multi-input'}
          </button>
        ))}
      </div>

    </div>
  );
}
