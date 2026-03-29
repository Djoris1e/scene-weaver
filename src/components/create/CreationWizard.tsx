import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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

/* ───────── Bot indicator ───────── */
function BotDot() {
  return <div className="w-2 h-2 rounded-full bg-primary animate-pulse shrink-0 mt-2.5" />;
}

/* ───────── Component ───────── */
interface CreationWizardProps {
  onInteraction?: () => void;
}

export default function CreationWizard({ onInteraction }: CreationWizardProps) {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typing, setTyping] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [genMsg, setGenMsg] = useState(0);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const phase = useRef<Phase>('type');

  const [brandColors, setBrandColors] = useState({ primary: '#E04F8A', secondary: '#EC9A2C' });
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
    addBotMessage({
      role: 'bot',
      content: "Let's make something amazing — what kind of video are we creating?",
      options: videoTypes.map(v => ({ id: v.id, label: v.label, icon: v.icon })),
    }, 600);
  }, [addBotMessage]);

  // Auto-scroll to the latest rendered content
  useEffect(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
      });
    });
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

  const startGenerating = () => {
    phase.current = 'generating';
    addBotMessage({ role: 'bot', content: '✨ Creating your video...', inputType: 'generating' });
  };

  const handleOptionSelect = (optionId: string, label: string) => {
    onInteraction?.();
    setMessages(prev => [...prev, { role: 'user', content: label }]);

    if (phase.current === 'type') {
      phase.current = 'source';
      addBotMessage({
        role: 'bot',
        content: 'Great choice! Got any content I can work with?',
        options: contentSources.map(s => ({ id: s.id, label: s.label, icon: s.icon })),
      });
    } else if (phase.current === 'source') {
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
    } else if (phase.current === 'brand') {
      if (optionId === 'yes') {
        phase.current = 'brand-config';
        addBotMessage({ role: 'bot', content: 'Set your brand colors below', inputType: 'brand-ask' });
      } else {
        phase.current = 'logo';
        addBotMessage({
          role: 'bot',
          content: 'Got a logo you\'d like to include?',
          options: [
            { id: 'upload-logo', label: 'Yes, upload logo', icon: Image },
            { id: 'skip-logo', label: 'Skip' },
          ],
        });
      }
    } else if (phase.current === 'logo') {
      if (optionId === 'upload-logo') {
        addBotMessage({ role: 'bot', content: 'Drop your logo below — PNG or SVG works best!', inputType: 'logo-upload' });
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
      content: 'Almost there! Want to add your brand colors?',
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
      content: 'Almost there! Want to add your brand colors?',
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
      content: 'Got a logo you\'d like to include?',
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
    <div className="w-full max-w-2xl mx-auto flex flex-col" style={{ height: 'calc(100vh - 120px)' }}>
      {/* Messages */}
      <div ref={scrollRef} className="space-y-5 flex-1 overflow-y-auto scrollbar-none pb-10">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            {msg.role === 'bot' && i === activeBotMessageIndex && <BotDot />}

            <div className={`flex-1 space-y-3 ${msg.role === 'user' ? 'flex flex-col items-end' : ''}`}>
              {/* Bubble */}
              <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-primary text-primary-foreground rounded-tr-md'
                  : 'bg-secondary/80 text-foreground rounded-tl-md'
              }`}>
                {msg.content}
              </div>
...
        {typing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2.5">
            <BotDot />
            <div className="bg-secondary/80 rounded-2xl rounded-tl-md px-4 py-3 flex gap-1.5">
              {[0, 1, 2].map(i => (
                <div key={i} className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-pulse" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </motion.div>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
