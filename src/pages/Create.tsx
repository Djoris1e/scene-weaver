import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, Link as LinkIcon, Upload, Image, Palette, Settings,
  X, Sparkles, Loader2, ChevronDown, ChevronRight,
  Plus, Globe, FileImage, Type, Music, Video,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

/* ─── Shared types & state ─── */
type Variant = 'A' | 'B' | 'C' | 'D';

interface MediaFile {
  id: string;
  file: File;
  preview: string;
  name: string;
}

interface BrandConfig {
  primaryColor: string;
  accentColor: string;
  logo: File | null;
  logoPreview: string | null;
  font: string;
}

const FONTS = ['System Default', 'Inter', 'Raleway', 'Manrope', 'Space Grotesk'];

/* ─── Shared hooks ─── */
function useCreateState() {
  const [prompt, setPrompt] = useState('');
  const [url, setUrl] = useState('');
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [brand, setBrand] = useState<BrandConfig>({
    primaryColor: '#E04F8A',
    accentColor: '#3B82F6',
    logo: null,
    logoPreview: null,
    font: 'System Default',
  });
  const fileRef = useRef<HTMLInputElement>(null);
  const logoRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const addFiles = useCallback((fileList: FileList) => {
    const newFiles: MediaFile[] = Array.from(fileList).map(f => ({
      id: crypto.randomUUID(),
      file: f,
      preview: URL.createObjectURL(f),
      name: f.name,
    }));
    setFiles(prev => [...prev, ...newFiles]);
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  }, []);

  const handleGenerate = useCallback(() => {
    if (!prompt.trim() && !url.trim()) {
      toast({ title: 'Add a description or URL', description: 'We need something to work with.' });
      return;
    }
    toast({ title: 'Generating…', description: 'Your video is being created.' });
    setTimeout(() => navigate('/editor'), 1500);
  }, [prompt, url, navigate]);

  const handleLogoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBrand(prev => ({ ...prev, logo: file, logoPreview: URL.createObjectURL(file) }));
    }
  }, []);

  return {
    prompt, setPrompt, url, setUrl,
    files, addFiles, removeFile, fileRef,
    brand, setBrand, logoRef, handleLogoUpload,
    handleGenerate,
  };
}

/* ─── Shared sub-components ─── */

function FileThumbnails({ files, onRemove }: { files: MediaFile[]; onRemove: (id: string) => void }) {
  if (files.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {files.map(f => (
        <div key={f.id} className="relative group">
          <div className="w-16 h-16 rounded-lg overflow-hidden border border-border bg-card">
            <img src={f.preview} alt={f.name} className="w-full h-full object-cover" />
          </div>
          <button
            onClick={() => onRemove(f.id)}
            className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}
    </div>
  );
}

function BrandPanel({
  brand, setBrand, logoRef, onLogoUpload, compact = false,
}: {
  brand: BrandConfig;
  setBrand: React.Dispatch<React.SetStateAction<BrandConfig>>;
  logoRef: React.RefObject<HTMLInputElement | null>;
  onLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  compact?: boolean;
}) {
  return (
    <div className={`space-y-3 ${compact ? '' : 'p-4 rounded-xl bg-card/60 border border-border/40'}`}>
      <div className="flex items-center gap-4">
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Primary</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={brand.primaryColor}
              onChange={e => setBrand(prev => ({ ...prev, primaryColor: e.target.value }))}
              className="w-8 h-8 rounded-lg border border-border cursor-pointer bg-transparent"
            />
            <span className="text-xs text-muted-foreground font-mono">{brand.primaryColor}</span>
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Accent</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={brand.accentColor}
              onChange={e => setBrand(prev => ({ ...prev, accentColor: e.target.value }))}
              className="w-8 h-8 rounded-lg border border-border cursor-pointer bg-transparent"
            />
            <span className="text-xs text-muted-foreground font-mono">{brand.accentColor}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {brand.logoPreview ? (
          <div className="relative group">
            <div className="h-10 px-3 rounded-lg border border-border bg-secondary/40 flex items-center">
              <img src={brand.logoPreview} alt="Logo" className="h-6 object-contain" />
            </div>
            <button
              onClick={() => setBrand(prev => ({ ...prev, logo: null, logoPreview: null }))}
              className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-2.5 h-2.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => logoRef.current?.click()}
            className="h-10 px-3 rounded-lg border border-dashed border-border/60 text-xs text-muted-foreground hover:border-primary/40 hover:text-foreground transition-colors flex items-center gap-1.5"
          >
            <FileImage className="w-3.5 h-3.5" /> Logo
          </button>
        )}
        <input ref={logoRef} type="file" accept="image/*" onChange={onLogoUpload} className="hidden" />

        <select
          value={brand.font}
          onChange={e => setBrand(prev => ({ ...prev, font: e.target.value }))}
          className="h-10 bg-secondary/60 border border-border rounded-lg px-3 text-xs text-foreground focus:outline-none focus:border-primary/40"
        >
          {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
        </select>
      </div>
    </div>
  );
}

function VariantSwitcher({ variant, setVariant }: { variant: Variant; setVariant: (v: Variant) => void }) {
  return (
    <div className="fixed top-4 right-4 z-50 flex gap-1 bg-card/90 backdrop-blur-md border border-border rounded-full p-1 shadow-xl">
      {(['A', 'B', 'C', 'D'] as Variant[]).map(v => (
        <button
          key={v}
          onClick={() => setVariant(v)}
          className={`w-8 h-8 rounded-full text-xs font-bold transition-all ${
            variant === v
              ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
              : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
          }`}
        >
          {v}
        </button>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   OPTION A — Prompt-First with Toolbar
   ═══════════════════════════════════════════════ */
function OptionA(props: ReturnType<typeof useCreateState>) {
  const [openPanel, setOpenPanel] = useState<'files' | 'url' | 'brand' | null>(null);

  const toggle = (panel: 'files' | 'url' | 'brand') =>
    setOpenPanel(prev => prev === panel ? null : panel);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-2xl space-y-4">
        <h1 className="text-2xl font-heading font-semibold text-center mb-6">
          What video will you create?
        </h1>

        {/* Main prompt area */}
        <div className="rounded-2xl border border-border bg-card/60 backdrop-blur-sm overflow-hidden shadow-xl shadow-black/20">
          <textarea
            value={props.prompt}
            onChange={e => props.setPrompt(e.target.value)}
            placeholder="Describe your video — a product launch, an explainer, a social clip…"
            rows={4}
            className="w-full bg-transparent px-5 pt-5 pb-3 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none resize-none leading-relaxed"
          />

          {/* Toolbar row */}
          <div className="flex items-center gap-1 px-3 pb-3">
            <button
              onClick={() => { toggle('files'); props.fileRef.current?.click(); }}
              className={`p-2.5 rounded-xl transition-colors ${openPanel === 'files' ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'}`}
              title="Attach files"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              onClick={() => toggle('url')}
              className={`p-2.5 rounded-xl transition-colors ${openPanel === 'url' ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'}`}
              title="Add URL"
            >
              <LinkIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => toggle('brand')}
              className={`p-2.5 rounded-xl transition-colors ${openPanel === 'brand' ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'}`}
              title="Brand settings"
            >
              <Palette className="w-4 h-4" />
            </button>
            <button
              onClick={() => {}}
              className="p-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>

            <div className="flex-1" />

            <button
              onClick={props.handleGenerate}
              className="flex items-center gap-2 bg-primary text-primary-foreground text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
            >
              <Sparkles className="w-4 h-4" />
              Create
            </button>
          </div>
        </div>

        {/* File thumbnails (shown when files exist) */}
        {props.files.length > 0 && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="overflow-hidden">
            <FileThumbnails files={props.files} onRemove={props.removeFile} />
          </motion.div>
        )}

        {/* Expandable panels */}
        <AnimatePresence>
          {openPanel === 'url' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="flex items-center gap-2 bg-card/60 border border-border rounded-xl px-4 py-3">
                <Globe className="w-4 h-4 text-muted-foreground shrink-0" />
                <input
                  value={props.url}
                  onChange={e => props.setUrl(e.target.value)}
                  placeholder="Paste a URL to use as content source…"
                  className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none"
                  autoFocus
                />
                {props.url && (
                  <button onClick={() => props.setUrl('')} className="text-muted-foreground hover:text-foreground">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {openPanel === 'brand' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <BrandPanel brand={props.brand} setBrand={props.setBrand} logoRef={props.logoRef} onLogoUpload={props.handleLogoUpload} />
            </motion.div>
          )}
        </AnimatePresence>

        <input
          ref={props.fileRef}
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={e => { if (e.target.files?.length) props.addFiles(e.target.files); e.target.value = ''; }}
          className="hidden"
        />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   OPTION B — Shortcut Cards + Prompt
   ═══════════════════════════════════════════════ */
const SHORTCUTS = [
  { id: 'url', icon: LinkIcon, label: 'URL to video', desc: 'Paste a link, we do the rest' },
  { id: 'text', icon: Type, label: 'Text to video', desc: 'Write a script or description' },
  { id: 'images', icon: Image, label: 'Images to video', desc: 'Upload screenshots or photos' },
  { id: 'footage', icon: Video, label: 'Footage to video', desc: 'Bring your own clips' },
];

function OptionB(props: ReturnType<typeof useCreateState>) {
  const [activeShortcut, setActiveShortcut] = useState<string | null>(null);

  const handleShortcutClick = (id: string) => {
    setActiveShortcut(prev => prev === id ? null : id);
    if (id === 'images') props.fileRef.current?.click();
    if (id === 'footage') props.fileRef.current?.click();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-2xl space-y-8">
        <h1 className="text-2xl font-heading font-semibold text-center">Get started</h1>

        {/* Shortcut cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {SHORTCUTS.map(s => (
            <button
              key={s.id}
              onClick={() => handleShortcutClick(s.id)}
              className={`group flex flex-col items-center gap-2.5 p-4 rounded-2xl border transition-all duration-200 text-center ${
                activeShortcut === s.id
                  ? 'border-primary/40 bg-primary/10 shadow-[0_0_24px_hsla(338,72%,59%,0.12)]'
                  : 'border-border/60 bg-card/40 hover:border-border hover:bg-card/80'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                activeShortcut === s.id ? 'bg-primary/20 text-primary' : 'bg-secondary text-muted-foreground group-hover:text-foreground'
              }`}>
                <s.icon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-medium">{s.label}</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">{s.desc}</div>
              </div>
            </button>
          ))}
        </div>

        {/* URL input if shortcut selected */}
        <AnimatePresence>
          {activeShortcut === 'url' && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
              <div className="flex items-center gap-2 bg-card/60 border border-border rounded-xl px-4 py-3">
                <Globe className="w-4 h-4 text-muted-foreground shrink-0" />
                <input
                  value={props.url}
                  onChange={e => props.setUrl(e.target.value)}
                  placeholder="Paste your URL here…"
                  className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none"
                  autoFocus
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* File thumbnails */}
        {props.files.length > 0 && <FileThumbnails files={props.files} onRemove={props.removeFile} />}

        {/* Divider */}
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-border/60" />
          <span className="text-xs text-muted-foreground">or describe anything</span>
          <div className="flex-1 h-px bg-border/60" />
        </div>

        {/* Prompt field */}
        <div className="rounded-2xl border border-border bg-card/60 overflow-hidden">
          <textarea
            value={props.prompt}
            onChange={e => props.setPrompt(e.target.value)}
            placeholder="Describe your video…"
            rows={3}
            className="w-full bg-transparent px-5 pt-4 pb-2 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none resize-none leading-relaxed"
          />
          <div className="flex items-center gap-1 px-3 pb-3">
            <button
              onClick={() => props.fileRef.current?.click()}
              className="p-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button className="p-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors">
              <Palette className="w-4 h-4" />
            </button>
            <div className="flex-1" />
            <button
              onClick={props.handleGenerate}
              className="flex items-center gap-2 bg-primary text-primary-foreground text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
            >
              <Sparkles className="w-4 h-4" />
              Create
            </button>
          </div>
        </div>

        <input
          ref={props.fileRef}
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={e => { if (e.target.files?.length) props.addFiles(e.target.files); e.target.value = ''; }}
          className="hidden"
        />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   OPTION C — Single Smart Field
   ═══════════════════════════════════════════════ */
function OptionC(props: ReturnType<typeof useCreateState>) {
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Detect URL in prompt
  const urlMatch = props.prompt.match(/https?:\/\/[^\s]+/);
  const hasDetectedUrl = !!urlMatch;

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files.length) props.addFiles(e.dataTransfer.files);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-xl space-y-4">
        <h1 className="text-2xl font-heading font-semibold text-center mb-6">
          What should we make?
        </h1>

        {/* Smart field */}
        <div
          className="rounded-2xl border border-border bg-card/60 backdrop-blur-sm overflow-hidden shadow-xl shadow-black/20 transition-colors"
          onDragOver={e => e.preventDefault()}
          onDrop={handleDrop}
        >
          <textarea
            value={props.prompt}
            onChange={e => props.setPrompt(e.target.value)}
            placeholder="Paste a URL, describe your video, or drop files here…"
            rows={4}
            className="w-full bg-transparent px-5 pt-5 pb-2 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none resize-none leading-relaxed"
          />

          {/* Detected chips */}
          {(hasDetectedUrl || props.files.length > 0) && (
            <div className="flex flex-wrap items-center gap-2 px-5 pb-2">
              {hasDetectedUrl && (
                <span className="flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-medium px-3 py-1.5 rounded-full">
                  <LinkIcon className="w-3 h-3" />
                  URL detected
                  <button
                    onClick={() => props.setPrompt(props.prompt.replace(urlMatch[0], '').trim())}
                    className="ml-1 hover:text-primary/70"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {props.files.length > 0 && (
                <span className="flex items-center gap-1.5 bg-accent/10 text-accent text-xs font-medium px-3 py-1.5 rounded-full">
                  <Image className="w-3 h-3" />
                  {props.files.length} file{props.files.length > 1 ? 's' : ''}
                </span>
              )}
            </div>
          )}

          {/* Bottom bar */}
          <div className="flex items-center gap-1 px-3 pb-3">
            <button
              onClick={() => props.fileRef.current?.click()}
              className="p-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
              title="Attach files"
            >
              <Plus className="w-4 h-4" />
            </button>
            <div className="flex-1" />
            <button
              onClick={() => setSettingsOpen(!settingsOpen)}
              className={`p-2.5 rounded-xl transition-colors ${settingsOpen ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'}`}
              title="Brand & settings"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={props.handleGenerate}
              className="flex items-center gap-2 bg-primary text-primary-foreground text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 ml-1"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* File previews */}
        {props.files.length > 0 && <FileThumbnails files={props.files} onRemove={props.removeFile} />}

        {/* Settings panel */}
        <AnimatePresence>
          {settingsOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <BrandPanel brand={props.brand} setBrand={props.setBrand} logoRef={props.logoRef} onLogoUpload={props.handleLogoUpload} />
            </motion.div>
          )}
        </AnimatePresence>

        <p className="text-xs text-muted-foreground/50 text-center">
          Drop files anywhere • Paste a URL to auto-detect • Add brand settings with ⚙️
        </p>

        <input
          ref={props.fileRef}
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={e => { if (e.target.files?.length) props.addFiles(e.target.files); e.target.value = ''; }}
          className="hidden"
        />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   OPTION D — Accordion Sections
   ═══════════════════════════════════════════════ */
function OptionD(props: ReturnType<typeof useCreateState>) {
  const [openSections, setOpenSections] = useState<Set<string>>(new Set());

  const toggleSection = (id: string) => {
    setOpenSections(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const sections = [
    {
      id: 'media',
      icon: Image,
      label: 'Add media',
      summary: props.files.length > 0 ? `${props.files.length} file${props.files.length > 1 ? 's' : ''} added` : 'No files added',
    },
    {
      id: 'brand',
      icon: Palette,
      label: 'Brand & style',
      summary: props.brand.logoPreview ? 'Custom brand' : 'Default',
    },
    {
      id: 'url',
      icon: LinkIcon,
      label: 'Source URL',
      summary: props.url ? props.url : 'Optional',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-2xl space-y-4">
        <h1 className="text-2xl font-heading font-semibold text-center mb-6">
          Create your video
        </h1>

        {/* Prompt */}
        <div className="rounded-2xl border border-border bg-card/60 overflow-hidden shadow-xl shadow-black/20">
          <textarea
            value={props.prompt}
            onChange={e => props.setPrompt(e.target.value)}
            placeholder="Describe your video…"
            rows={3}
            className="w-full bg-transparent px-5 pt-5 pb-2 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none resize-none leading-relaxed"
          />
          <div className="flex items-center justify-end px-3 pb-3">
            <button
              onClick={props.handleGenerate}
              className="flex items-center gap-2 bg-primary text-primary-foreground text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
            >
              <Sparkles className="w-4 h-4" />
              Create
            </button>
          </div>
        </div>

        {/* Accordion sections */}
        <div className="space-y-1">
          {sections.map(section => {
            const isOpen = openSections.has(section.id);
            return (
              <div key={section.id} className="rounded-xl border border-border/40 bg-card/30 overflow-hidden">
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-secondary/30 transition-colors"
                >
                  <section.icon className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium flex-1 text-left">{section.label}</span>
                  <span className="text-xs text-muted-foreground/60">{section.summary}</span>
                  <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 pt-1">
                        {section.id === 'media' && (
                          <div className="space-y-3">
                            {props.files.length > 0 && <FileThumbnails files={props.files} onRemove={props.removeFile} />}
                            <button
                              onClick={() => props.fileRef.current?.click()}
                              className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border/60 p-4 hover:border-primary/40 hover:bg-primary/5 transition-all text-xs text-muted-foreground hover:text-foreground"
                            >
                              <Upload className="w-4 h-4" />
                              Upload screenshots, images, or footage
                            </button>
                          </div>
                        )}

                        {section.id === 'brand' && (
                          <BrandPanel brand={props.brand} setBrand={props.setBrand} logoRef={props.logoRef} onLogoUpload={props.handleLogoUpload} compact />
                        )}

                        {section.id === 'url' && (
                          <div className="flex items-center gap-2 bg-secondary/40 rounded-xl px-4 py-3">
                            <Globe className="w-4 h-4 text-muted-foreground shrink-0" />
                            <input
                              value={props.url}
                              onChange={e => props.setUrl(e.target.value)}
                              placeholder="https://yoursite.com/page"
                              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none"
                            />
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        <input
          ref={props.fileRef}
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={e => { if (e.target.files?.length) props.addFiles(e.target.files); e.target.value = ''; }}
          className="hidden"
        />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   Main Create Page
   ═══════════════════════════════════════════════ */
export default function Create() {
  const [variant, setVariant] = useState<Variant>('A');
  const state = useCreateState();

  return (
    <>
      <VariantSwitcher variant={variant} setVariant={setVariant} />
      {variant === 'A' && <OptionA {...state} />}
      {variant === 'B' && <OptionB {...state} />}
      {variant === 'C' && <OptionC {...state} />}
      {variant === 'D' && <OptionD {...state} />}
    </>
  );
}
