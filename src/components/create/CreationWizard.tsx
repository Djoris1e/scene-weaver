import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Rocket, Monitor, CalendarDays, Video, Megaphone, Briefcase,
  Link, Upload, Sparkles, Loader2, ArrowRight, Check, X, Image,
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

type ContentSourceId = typeof contentSources[number]['id'];

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
  inputType?: 'url' | 'upload' | 'prompt' | 'brand-ask' | 'logo-upload' | 'generating';
}

type Phase = 'type' | 'source' | 'source-input' | 'brand' | 'brand-config' | 'logo' | 'generating';

/* ───────── Component ───────── */
export default function CreationWizard() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typing, setTyping] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [genMsg, setGenMsg] = useState(0);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const phase = useRef<Phase>('type');

  const [brandColors, setBrandColors] = useState({ primary: '#E04F8A', secondary: '#EC9A2C' });

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

  const startGenerating = () => {
    phase.current = 'generating';
    addBotMessage({
      role: 'bot',
      content: '✨ Creating your video...',
      inputType: 'generating',
    });
  };

  const handleOptionSelect = (optionId: string, label: string) => {
    setMessages(prev => [...prev, { role: 'user', content: label }]);

    if (phase.current === 'type') {
      phase.current = 'source';
      addBotMessage({
        role: 'bot',
        content: 'Great choice! 🎯 Got any content I can work with?',
        options: contentSources.map(s => ({ id: s.id, label: s.label, icon: s.icon })),
      });
    } else if (phase.current === 'source') {
      phase.current = 'source-input';
      const prompts: Record<string, string> = {
        url: "Drop the URL and I'll extract everything I need 🔗",
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
        // Ask about logo even if skipping brand colors
        phase.current = 'logo';
        addBotMessage({
          role: 'bot',
          content: 'Got a logo you\'d like to include? 🖼️',
          options: [
            { id: 'upload-logo', label: 'Yes, upload logo', icon: Image },
            { id: 'skip-logo', label: 'Skip' },
          ],
        });
      }
    } else if (phase.current === 'logo') {
      if (optionId === 'upload-logo') {
        addBotMessage({
          role: 'bot',
          content: 'Drop your logo below — PNG or SVG works best!',
          inputType: 'logo-upload',
        });
      } else {
        startGenerating();
      }
    }
  };

  const handleContentSubmit = () => {
    if (!inputVal.trim()) return;
    setMessages(prev => [...prev, { role: 'user', content: inputVal }]);
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

  const handleFileUpload = () => {
    setMessages(prev => [...prev, { role: 'user', content: 'Files uploaded' }]);
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
    setMessages(prev => [...prev, { role: 'user', content: 'Brand colors set ✓' }]);
    phase.current = 'logo';
    addBotMessage({
      role: 'bot',
      content: 'Got a logo you\'d like to include? 🖼️',
      options: [
        { id: 'upload-logo', label: 'Yes, upload logo', icon: Image },
        { id: 'skip-logo', label: 'Skip' },
      ],
    });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
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
    <div className="w-full max-w-2xl mx-auto">
      {/* Messages */}
      <div ref={scrollRef} className="space-y-4">
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

              {/* URL input */}
              {msg.inputType === 'url' && (
                <div className="flex gap-2 w-full">
                  <input value={inputVal} onChange={e => setInputVal(e.target.value)} placeholder="https://..."
                    className="flex-1 bg-secondary border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary"
                    onKeyDown={e => e.key === 'Enter' && handleContentSubmit()} />
                  <button onClick={handleContentSubmit} className="px-3 py-2 rounded-xl bg-primary text-primary-foreground text-sm">
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Prompt textarea */}
              {msg.inputType === 'prompt' && (
                <div className="w-full space-y-2">
                  <textarea value={inputVal} onChange={e => setInputVal(e.target.value)} placeholder="Describe your video..."
                    rows={3} className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary resize-none" />
                  <button onClick={handleContentSubmit} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium">
                    <ArrowRight className="w-4 h-4" /> Submit
                  </button>
                </div>
              )}

              {/* File upload */}
              {msg.inputType === 'upload' && (
                <div className="w-full">
                  <label className="flex flex-col items-center gap-2 p-6 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary/40 transition-colors">
                    <Upload className="w-6 h-6 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Click to upload images or videos</span>
                    <input type="file" multiple accept="image/*,video/*" className="hidden" onChange={handleFileUpload} />
                  </label>
                </div>
              )}

              {/* Brand colors */}
              {msg.inputType === 'brand-ask' && (
                <div className="w-full space-y-3">
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                      <input type="color" value={brandColors.primary} onChange={e => setBrandColors(c => ({ ...c, primary: e.target.value }))} className="w-8 h-8 rounded-lg border border-border cursor-pointer bg-transparent" />
                      <span className="text-xs text-muted-foreground">Primary</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="color" value={brandColors.secondary} onChange={e => setBrandColors(c => ({ ...c, secondary: e.target.value }))} className="w-8 h-8 rounded-lg border border-border cursor-pointer bg-transparent" />
                      <span className="text-xs text-muted-foreground">Accent</span>
                    </div>
                  </div>
                  <button onClick={handleBrandDone} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium">
                    <Check className="w-4 h-4" /> Done
                  </button>
                </div>
              )}

              {/* Logo upload */}
              {msg.inputType === 'logo-upload' && (
                <div className="w-full space-y-2">
                  {logoPreview ? (
                    <div className="relative inline-block">
                      <img src={logoPreview} alt="Logo preview" className="h-16 rounded-lg border border-border object-contain bg-secondary/40 p-2" />
                      <button onClick={handleLogoRemove} className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center gap-2 p-6 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary/40 transition-colors">
                      <Image className="w-6 h-6 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Upload your logo (PNG, SVG)</span>
                      <input type="file" accept="image/*,.svg" className="hidden" onChange={handleLogoUpload} />
                    </label>
                  )}
                </div>
              )}

              {/* Generating */}
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
