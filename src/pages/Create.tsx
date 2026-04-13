import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, Link as LinkIcon, Upload, Image, Palette, Settings,
  X, Sparkles, ChevronRight,
  Plus, Globe, FileImage, Type,
  Smartphone, Monitor, FileText, BookOpen, Newspaper,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

/* ─── Shared types & state ─── */
type Variant = 'A' | 'B' | 'C' | 'D' | 'E';
type MediaBucket = 'mobile' | 'desktop' | 'background';

interface MediaFile {
  id: string;
  file: File;
  preview: string;
  name: string;
  bucket: MediaBucket;
}

interface BrandConfig {
  primaryColor: string;
  accentColor: string;
  logo: File | null;
  logoPreview: string | null;
  font: string;
}

const FONTS = ['System Default', 'Inter', 'Raleway', 'Manrope', 'Space Grotesk'];

const CONTENT_SOURCES = [
  { id: 'blog', icon: BookOpen, label: 'Blog to video', desc: 'Paste a blog post URL' },
  { id: 'release', icon: Newspaper, label: 'Release notes to video', desc: 'Changelog or release notes' },
  { id: 'doc', icon: FileText, label: 'PDF / Doc to video', desc: 'Upload a document' },
  { id: 'url', icon: LinkIcon, label: 'URL to video', desc: 'Any webpage' },
  { id: 'text', icon: Type, label: 'Text to video', desc: 'Write or paste a script' },
];

const MEDIA_BUCKETS: { id: MediaBucket; icon: typeof Smartphone; label: string; desc: string; accept: string }[] = [
  { id: 'mobile', icon: Smartphone, label: 'Mobile Screenshots', desc: 'App or mobile web screens', accept: 'image/*' },
  { id: 'desktop', icon: Monitor, label: 'Desktop Screenshots', desc: 'Desktop or dashboard screens', accept: 'image/*' },
  { id: 'background', icon: Image, label: 'Background Media', desc: 'Video or images for backgrounds', accept: 'image/*,video/*' },
];

/* ─── Shared hooks ─── */
function useCreateState() {
  const [prompt, setPrompt] = useState('');
  const [url, setUrl] = useState('');
  const [contentSource, setContentSource] = useState<string | null>(null);
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [brand, setBrand] = useState<BrandConfig>({
    primaryColor: '#E04F8A',
    accentColor: '#3B82F6',
    logo: null,
    logoPreview: null,
    font: 'System Default',
  });
  const [docFile, setDocFile] = useState<File | null>(null);
  const logoRef = useRef<HTMLInputElement>(null);
  const docRef = useRef<HTMLInputElement>(null);
  const bucketRefs = useRef<Record<MediaBucket, HTMLInputElement | null>>({ mobile: null, desktop: null, background: null });
  const navigate = useNavigate();

  const addFiles = useCallback((bucket: MediaBucket, fileList: FileList) => {
    const newFiles: MediaFile[] = Array.from(fileList).map(f => ({
      id: crypto.randomUUID(),
      file: f,
      preview: URL.createObjectURL(f),
      name: f.name,
      bucket,
    }));
    setFiles(prev => [...prev, ...newFiles]);
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  }, []);

  const handleGenerate = useCallback(() => {
    if (!prompt.trim() && !url.trim() && !docFile && files.length === 0) {
      toast({ title: 'Add a description, URL, or media', description: 'We need something to work with.' });
      return;
    }
    toast({ title: 'Generating…', description: 'Your video is being created.' });
    setTimeout(() => navigate('/editor'), 1500);
  }, [prompt, url, docFile, files, navigate]);

  const handleLogoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setBrand(prev => ({ ...prev, logo: file, logoPreview: URL.createObjectURL(file) }));
  }, []);

  const handleDocUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setDocFile(file);
  }, []);

  return {
    prompt, setPrompt, url, setUrl,
    contentSource, setContentSource,
    files, addFiles, removeFile, bucketRefs,
    brand, setBrand, logoRef, handleLogoUpload,
    docFile, setDocFile, docRef, handleDocUpload,
    handleGenerate,
  };
}

type CreateState = ReturnType<typeof useCreateState>;

/* ─── Shared sub-components ─── */

function MediaBucketPanel({ files, bucketRefs, addFiles, removeFile }: {
  files: MediaFile[];
  bucketRefs: React.MutableRefObject<Record<MediaBucket, HTMLInputElement | null>>;
  addFiles: (bucket: MediaBucket, fileList: FileList) => void;
  removeFile: (id: string) => void;
}) {
  return (
    <div className="space-y-4">
      {MEDIA_BUCKETS.map(bucket => {
        const bucketFiles = files.filter(f => f.bucket === bucket.id);
        return (
          <div key={bucket.id} className="space-y-2">
            <div className="flex items-center gap-2">
              <bucket.icon className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">{bucket.label}</span>
              <span className="text-xs text-muted-foreground">— {bucket.desc}</span>
            </div>

            {bucketFiles.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {bucketFiles.map(f => (
                  <div key={f.id} className="relative group">
                    <div className="w-16 h-16 rounded-lg overflow-hidden border border-border bg-card">
                      <img src={f.preview} alt={f.name} className="w-full h-full object-cover" />
                    </div>
                    <button
                      onClick={() => removeFile(f.id)}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => bucketRefs.current[bucket.id]?.click()}
                  className="w-16 h-16 rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center gap-0.5 hover:border-primary/40 hover:bg-primary/5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              </div>
            )}

            {bucketFiles.length === 0 && (
              <button
                onClick={() => bucketRefs.current[bucket.id]?.click()}
                className="w-full flex items-center gap-3 rounded-xl border-2 border-dashed border-border/50 p-3 hover:border-primary/40 hover:bg-primary/5 transition-all text-left"
              >
                <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-secondary shrink-0">
                  <Upload className="w-4 h-4 text-muted-foreground" />
                </div>
                <span className="text-xs text-muted-foreground">Click to upload</span>
              </button>
            )}

            <input
              ref={el => { bucketRefs.current[bucket.id] = el; }}
              type="file"
              multiple
              accept={bucket.accept}
              onChange={e => { if (e.target.files?.length) addFiles(bucket.id, e.target.files); e.target.value = ''; }}
              className="hidden"
            />
          </div>
        );
      })}
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

function ContentSourceChips({ active, onSelect }: { active: string | null; onSelect: (id: string) => void }) {
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {CONTENT_SOURCES.map(s => (
          <button
            key={s.id}
            onClick={() => onSelect(active === s.id ? '' : s.id)}
            className={`group flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-medium transition-all duration-200 ${
              active === s.id
                ? 'bg-primary/15 text-primary border border-primary/30'
                : 'bg-card/50 text-muted-foreground border border-border/40 hover:border-border hover:text-foreground'
            }`}
          >
            <s.icon className={`w-3.5 h-3.5 ${active === s.id ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`} />
            {s.label}
          </button>
        ))}
      </div>
      <p className="text-xs text-muted-foreground/60">Pick one or combine — add a URL, description, and media all at once</p>
    </div>
  );
}

function ContentSourceInput({ source, state }: { source: string; state: CreateState }) {
  if (source === 'blog' || source === 'release' || source === 'url') {
    return (
      <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
        <div className="flex items-center gap-2 bg-card/60 border border-border rounded-xl px-4 py-3">
          <Globe className="w-4 h-4 text-muted-foreground shrink-0" />
          <input
            value={state.url}
            onChange={e => state.setUrl(e.target.value)}
            placeholder={source === 'blog' ? 'Paste your blog post URL…' : source === 'release' ? 'Paste your changelog or release notes URL…' : 'Paste any URL…'}
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none"
            autoFocus
          />
          {state.url && (
            <button onClick={() => state.setUrl('')} className="text-muted-foreground hover:text-foreground">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </motion.div>
    );
  }

  if (source === 'doc') {
    return (
      <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
        {state.docFile ? (
          <div className="flex items-center gap-3 bg-card/60 border border-border rounded-xl px-4 py-3">
            <FileText className="w-4 h-4 text-primary shrink-0" />
            <span className="text-sm text-foreground flex-1 truncate">{state.docFile.name}</span>
            <button onClick={() => state.setDocFile(null)} className="text-muted-foreground hover:text-foreground">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => state.docRef.current?.click()}
            className="w-full flex items-center gap-3 rounded-xl border-2 border-dashed border-border/50 p-4 hover:border-primary/40 hover:bg-primary/5 transition-all text-left"
          >
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-secondary shrink-0">
              <Upload className="w-4 h-4 text-muted-foreground" />
            </div>
            <div>
              <span className="text-sm text-foreground font-medium">Upload PDF or document</span>
              <span className="text-xs text-muted-foreground block">.pdf, .docx, .txt</span>
            </div>
          </button>
        )}
        <input
          ref={state.docRef}
          type="file"
          accept=".pdf,.doc,.docx,.txt,.md"
          onChange={state.handleDocUpload}
          className="hidden"
        />
      </motion.div>
    );
  }

  if (source === 'text') {
    return (
      <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
        <textarea
          value={state.prompt}
          onChange={e => state.setPrompt(e.target.value)}
          placeholder="Write or paste your script here…"
          rows={4}
          className="w-full bg-card/60 border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/40 resize-none leading-relaxed"
          autoFocus
        />
      </motion.div>
    );
  }


  return null;
}

function VariantSwitcher({ variant, setVariant }: { variant: Variant; setVariant: (v: Variant) => void }) {
  return (
    <div className="fixed top-4 right-4 z-50 flex gap-1 bg-card/90 backdrop-blur-md border border-border rounded-full p-1 shadow-xl">
      {(['A', 'B', 'C', 'D', 'E'] as Variant[]).map(v => (
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

function MediaFileCount({ files }: { files: MediaFile[] }) {
  const counts = MEDIA_BUCKETS.map(b => ({ ...b, count: files.filter(f => f.bucket === b.id).length })).filter(b => b.count > 0);
  if (counts.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {counts.map(b => (
        <span key={b.id} className="flex items-center gap-1 bg-accent/10 text-accent text-[11px] font-medium px-2.5 py-1 rounded-full">
          <b.icon className="w-3 h-3" />
          {b.count}
        </span>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   OPTION A — Prompt-First with Toolbar
   ═══════════════════════════════════════════════ */
function OptionA(state: CreateState) {
  const [openPanel, setOpenPanel] = useState<'media' | 'url' | 'brand' | 'source' | null>(null);
  const toggle = (panel: typeof openPanel) => setOpenPanel(prev => prev === panel ? null : panel);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-2xl space-y-4">
        <h1 className="text-2xl font-heading font-semibold text-center mb-2">
          What video will you create?
        </h1>
        <p className="text-sm text-muted-foreground text-center mb-6">
          Blog posts, release notes, docs — turn any content into video
        </p>

        {/* Content source chips */}
        <ContentSourceChips active={state.contentSource} onSelect={id => { state.setContentSource(id || null); setOpenPanel(null); }} />

        {/* Source-specific input */}
        <AnimatePresence mode="wait">
          {state.contentSource && <ContentSourceInput source={state.contentSource} state={state} />}
        </AnimatePresence>

        {/* Main prompt area */}
        <div className="rounded-2xl border border-border bg-card/60 backdrop-blur-sm overflow-hidden shadow-xl shadow-black/20">
          <textarea
            value={state.prompt}
            onChange={e => state.setPrompt(e.target.value)}
            placeholder="Describe your video, paste a URL, or do both…"
            rows={3}
            className="w-full bg-transparent px-5 pt-4 pb-2 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none resize-none leading-relaxed"
          />

          <MediaFileCount files={state.files} />

          {/* Toolbar row */}
          <div className="flex items-center gap-1 px-3 pb-3">
            <button
              onClick={() => toggle('media')}
              className={`p-2.5 rounded-xl transition-colors ${openPanel === 'media' ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'}`}
              title="Add screenshots & media"
            >
              <Image className="w-4 h-4" />
            </button>
            <button
              onClick={() => toggle('brand')}
              className={`p-2.5 rounded-xl transition-colors ${openPanel === 'brand' ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'}`}
              title="Brand settings"
            >
              <Palette className="w-4 h-4" />
            </button>
            <button className="p-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors" title="Settings">
              <Settings className="w-4 h-4" />
            </button>

            <div className="flex-1" />

            <button
              onClick={state.handleGenerate}
              className="flex items-center gap-2 bg-primary text-primary-foreground text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
            >
              <Sparkles className="w-4 h-4" />
              Create
            </button>
          </div>
        </div>

        {/* Expandable panels */}
        <AnimatePresence>
          {openPanel === 'media' && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <div className="p-4 rounded-xl bg-card/60 border border-border/40">
                <MediaBucketPanel files={state.files} bucketRefs={state.bucketRefs} addFiles={state.addFiles} removeFile={state.removeFile} />
              </div>
            </motion.div>
          )}
          {openPanel === 'brand' && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <BrandPanel brand={state.brand} setBrand={state.setBrand} logoRef={state.logoRef} onLogoUpload={state.handleLogoUpload} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   OPTION B — Shortcut Cards + Prompt
   ═══════════════════════════════════════════════ */
const SHORTCUT_CARDS = [
  { id: 'blog', icon: BookOpen, label: 'Blog to video', desc: 'Turn any blog post into a video' },
  { id: 'release', icon: Newspaper, label: 'Release notes', desc: 'Changelog or what\'s new' },
  { id: 'doc', icon: FileText, label: 'PDF / Doc', desc: 'Upload a document' },
  { id: 'url', icon: LinkIcon, label: 'URL to video', desc: 'Any webpage' },
  { id: 'text', icon: Type, label: 'Describe it', desc: 'Write a script' },
];

function OptionB(state: CreateState) {
  const [openMedia, setOpenMedia] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-2xl space-y-8">
        <h1 className="text-2xl font-heading font-semibold text-center">Get started</h1>

        {/* Shortcut cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {SHORTCUT_CARDS.map(s => (
            <button
              key={s.id}
              onClick={() => state.setContentSource(state.contentSource === s.id ? null : s.id)}
              className={`group flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all duration-200 text-center ${
                state.contentSource === s.id
                  ? 'border-primary/40 bg-primary/10 shadow-[0_0_24px_hsla(338,72%,59%,0.12)]'
                  : 'border-border/50 bg-card/40 hover:border-border hover:bg-card/80'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                state.contentSource === s.id ? 'bg-primary/20 text-primary' : 'bg-secondary text-muted-foreground group-hover:text-foreground'
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

        {/* Source-specific input */}
        <AnimatePresence mode="wait">
          {state.contentSource && <ContentSourceInput source={state.contentSource} state={state} />}
        </AnimatePresence>

        {/* Divider */}
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-border/60" />
          <span className="text-xs text-muted-foreground">and/or describe it</span>
          <div className="flex-1 h-px bg-border/60" />
        </div>

        {/* Prompt field */}
        <div className="rounded-2xl border border-border bg-card/60 overflow-hidden">
          <textarea
            value={state.prompt}
            onChange={e => state.setPrompt(e.target.value)}
            placeholder="Describe your video, paste a URL, or do both…"
            rows={3}
            className="w-full bg-transparent px-5 pt-4 pb-2 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none resize-none leading-relaxed"
          />
          <div className="flex items-center gap-1 px-3 pb-3">
            <button
              onClick={() => setOpenMedia(!openMedia)}
              className={`p-2.5 rounded-xl transition-colors ${openMedia ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'}`}
              title="Add screenshots & media"
            >
              <Image className="w-4 h-4" />
            </button>
            <button className="p-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors">
              <Palette className="w-4 h-4" />
            </button>
            <MediaFileCount files={state.files} />
            <div className="flex-1" />
            <button
              onClick={state.handleGenerate}
              className="flex items-center gap-2 bg-primary text-primary-foreground text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
            >
              <Sparkles className="w-4 h-4" />
              Create
            </button>
          </div>
        </div>

        {/* Media panel */}
        <AnimatePresence>
          {openMedia && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <div className="p-4 rounded-xl bg-card/60 border border-border/40">
                <MediaBucketPanel files={state.files} bucketRefs={state.bucketRefs} addFiles={state.addFiles} removeFile={state.removeFile} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   OPTION C — Single Smart Field
   ═══════════════════════════════════════════════ */
function OptionC(state: CreateState) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [mediaOpen, setMediaOpen] = useState(false);

  const urlMatch = state.prompt.match(/https?:\/\/[^\s]+/);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files.length) state.addFiles('background', e.dataTransfer.files);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-xl space-y-4">
        <h1 className="text-2xl font-heading font-semibold text-center mb-2">
          What should we make?
        </h1>
        <p className="text-xs text-muted-foreground text-center mb-4">
          Paste a blog URL, release notes link, drop a PDF — or just describe it
        </p>

        {/* Smart field */}
        <div
          className="rounded-2xl border border-border bg-card/60 backdrop-blur-sm overflow-hidden shadow-xl shadow-black/20"
          onDragOver={e => e.preventDefault()}
          onDrop={handleDrop}
        >
          <textarea
            value={state.prompt}
            onChange={e => state.setPrompt(e.target.value)}
            placeholder="Paste a URL, describe your video, or both…"
            rows={4}
            className="w-full bg-transparent px-5 pt-5 pb-2 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none resize-none leading-relaxed"
          />

          {/* Detected chips */}
          {(!!urlMatch || state.files.length > 0 || state.docFile) && (
            <div className="flex flex-wrap items-center gap-2 px-5 pb-2">
              {!!urlMatch && (
                <span className="flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-medium px-3 py-1.5 rounded-full">
                  <LinkIcon className="w-3 h-3" />
                  URL detected
                  <button onClick={() => state.setPrompt(state.prompt.replace(urlMatch[0], '').trim())} className="ml-1 hover:text-primary/70">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {state.docFile && (
                <span className="flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-medium px-3 py-1.5 rounded-full">
                  <FileText className="w-3 h-3" />
                  {state.docFile.name}
                  <button onClick={() => state.setDocFile(null)} className="ml-1 hover:text-primary/70">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              <MediaFileCount files={state.files} />
            </div>
          )}

          {/* Bottom bar */}
          <div className="flex items-center gap-1 px-3 pb-3">
            <button
              onClick={() => state.docRef.current?.click()}
              className="p-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
              title="Upload PDF / doc"
            >
              <FileText className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMediaOpen(!mediaOpen)}
              className={`p-2.5 rounded-xl transition-colors ${mediaOpen ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'}`}
              title="Screenshots & media"
            >
              <Image className="w-4 h-4" />
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
              onClick={state.handleGenerate}
              className="flex items-center gap-2 bg-primary text-primary-foreground text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 ml-1"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

        <input
          ref={state.docRef}
          type="file"
          accept=".pdf,.doc,.docx,.txt,.md"
          onChange={state.handleDocUpload}
          className="hidden"
        />

        {/* Expandable panels */}
        <AnimatePresence>
          {mediaOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <div className="p-4 rounded-xl bg-card/60 border border-border/40">
                <MediaBucketPanel files={state.files} bucketRefs={state.bucketRefs} addFiles={state.addFiles} removeFile={state.removeFile} />
              </div>
            </motion.div>
          )}
          {settingsOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <BrandPanel brand={state.brand} setBrand={state.setBrand} logoRef={state.logoRef} onLogoUpload={state.handleLogoUpload} />
            </motion.div>
          )}
        </AnimatePresence>

        <p className="text-xs text-muted-foreground/50 text-center">
          Drop files anywhere • Paste a URL to auto-detect • Add brand settings with ⚙️
        </p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   OPTION D — Accordion Sections
   ═══════════════════════════════════════════════ */
function OptionD(state: CreateState) {
  const [openSections, setOpenSections] = useState<Set<string>>(new Set());

  const toggleSection = (id: string) => {
    setOpenSections(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const mediaCount = state.files.length;
  const sections = [
    {
      id: 'source',
      icon: BookOpen,
      label: 'Describe & add sources',
      summary: state.contentSource ? CONTENT_SOURCES.find(s => s.id === state.contentSource)?.label || 'Selected' : 'Blog, release notes, PDF, URL…',
    },
    {
      id: 'media',
      icon: Image,
      label: 'Screenshots & media',
      summary: mediaCount > 0 ? `${mediaCount} file${mediaCount > 1 ? 's' : ''} across ${new Set(state.files.map(f => f.bucket)).size} bucket${new Set(state.files.map(f => f.bucket)).size > 1 ? 's' : ''}` : 'Mobile, desktop, background',
    },
    {
      id: 'brand',
      icon: Palette,
      label: 'Brand & style',
      summary: state.brand.logoPreview ? 'Custom brand' : 'Colors, logo, font',
    },
  ];

  const isActive = state.prompt.trim().length > 0 || state.contentSource !== null || state.files.length > 0;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-2xl space-y-4">
        <h1 className="text-2xl font-heading font-semibold text-center mb-6">
          Create your video
        </h1>

        {/* Prompt */}
        <div className="rounded-2xl border border-border bg-card/60 overflow-hidden shadow-xl shadow-black/20">
          <textarea
            value={state.prompt}
            onChange={e => state.setPrompt(e.target.value)}
            placeholder="Describe your video, paste a URL, or do both…"
            rows={3}
            className="w-full bg-transparent px-5 pt-5 pb-4 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none resize-none leading-relaxed"
          />
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
                  <section.icon className="w-4 h-4 text-muted-foreground shrink-0 self-center" />
                  <div className="flex-1 text-left min-w-0">
                    <span className="block text-sm font-medium truncate">{section.label}</span>
                    <span className="block text-xs text-muted-foreground/60 truncate">{section.summary}</span>
                  </div>
                  <ChevronRight className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }} className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 pt-1">
                        {section.id === 'source' && (
                          <div className="space-y-3">
                            <ContentSourceChips active={state.contentSource} onSelect={id => state.setContentSource(id || null)} />
                            <AnimatePresence mode="wait">
                              {state.contentSource && <ContentSourceInput source={state.contentSource} state={state} />}
                            </AnimatePresence>
                          </div>
                        )}
                        {section.id === 'media' && (
                          <MediaBucketPanel files={state.files} bucketRefs={state.bucketRefs} addFiles={state.addFiles} removeFile={state.removeFile} />
                        )}
                        {section.id === 'brand' && (
                          <BrandPanel brand={state.brand} setBrand={state.setBrand} logoRef={state.logoRef} onLogoUpload={state.handleLogoUpload} compact />
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Create button */}
        <button
          onClick={state.handleGenerate}
          disabled={!isActive}
          className={`w-full flex items-center justify-center gap-2 text-sm font-medium px-5 py-3.5 rounded-xl transition-all duration-300 shadow-lg ${
            isActive
              ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/20'
              : 'bg-muted text-muted-foreground opacity-50 cursor-not-allowed shadow-black/10'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          Create video
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   OPTION E — Unified Prompt Card (Hybrid A+C)
   ═══════════════════════════════════════════════ */
function OptionE(state: CreateState) {
  const [openPanel, setOpenPanel] = useState<'media' | 'brand' | null>(null);
  const toggle = (panel: 'media' | 'brand') => setOpenPanel(prev => prev === panel ? null : panel);

  const urlMatch = state.prompt.match(/https?:\/\/[^\s]+/);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files.length) state.addFiles('background', e.dataTransfer.files);
  };

  const showUrlInput = state.contentSource === 'blog' || state.contentSource === 'release' || state.contentSource === 'url';
  const showDocInput = state.contentSource === 'doc';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-xl space-y-4">
        <h1 className="text-2xl font-heading font-semibold text-center mb-1">
          What should we make?
        </h1>
        <p className="text-xs text-muted-foreground text-center mb-6">
          Turn blog posts, release notes, docs, or any idea into video
        </p>

        <div
          className="rounded-2xl border border-border bg-card/60 backdrop-blur-sm overflow-hidden shadow-xl shadow-black/20"
          onDragOver={e => e.preventDefault()}
          onDrop={handleDrop}
        >
          {/* Content source pills */}
          <div className="flex flex-wrap gap-1.5 px-4 pt-4 pb-2">
            {CONTENT_SOURCES.map(s => (
              <button
                key={s.id}
                onClick={() => state.setContentSource(state.contentSource === s.id ? null : s.id)}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                  state.contentSource === s.id
                    ? 'bg-primary/15 text-primary border border-primary/30'
                    : 'bg-secondary/50 text-muted-foreground border border-transparent hover:bg-secondary hover:text-foreground'
                }`}
              >
                <s.icon className="w-3 h-3" />
                {s.label}
              </button>
            ))}
          </div>

          {/* Inline URL input */}
          <AnimatePresence mode="wait">
            {showUrlInput && (
              <motion.div key="url-input" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                <div className="mx-4 mb-2 flex items-center gap-2 bg-secondary/40 border border-border/60 rounded-xl px-3 py-2.5">
                  <Globe className="w-4 h-4 text-muted-foreground shrink-0" />
                  <input
                    value={state.url}
                    onChange={e => state.setUrl(e.target.value)}
                    placeholder={state.contentSource === 'blog' ? 'Paste your blog post URL…' : state.contentSource === 'release' ? 'Paste changelog or release notes URL…' : 'Paste any URL…'}
                    className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none"
                    autoFocus
                  />
                  {state.url && (
                    <button onClick={() => state.setUrl('')} className="text-muted-foreground hover:text-foreground"><X className="w-3.5 h-3.5" /></button>
                  )}
                </div>
              </motion.div>
            )}
            {showDocInput && (
              <motion.div key="doc-input" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                <div className="mx-4 mb-2">
                  {state.docFile ? (
                    <div className="flex items-center gap-3 bg-secondary/40 border border-border/60 rounded-xl px-3 py-2.5">
                      <FileText className="w-4 h-4 text-primary shrink-0" />
                      <span className="text-sm text-foreground flex-1 truncate">{state.docFile.name}</span>
                      <button onClick={() => state.setDocFile(null)} className="text-muted-foreground hover:text-foreground"><X className="w-3.5 h-3.5" /></button>
                    </div>
                  ) : (
                    <button
                      onClick={() => state.docRef.current?.click()}
                      className="w-full flex items-center gap-3 rounded-xl border-2 border-dashed border-border/50 p-3 hover:border-primary/40 hover:bg-primary/5 transition-all text-left"
                    >
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-secondary shrink-0">
                        <Upload className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div>
                        <span className="text-sm text-foreground font-medium">Upload PDF or document</span>
                        <span className="text-xs text-muted-foreground block">.pdf, .docx, .txt</span>
                      </div>
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Prompt textarea */}
          <textarea
            value={state.prompt}
            onChange={e => state.setPrompt(e.target.value)}
            placeholder="Describe your video, paste a URL, or do both…"
            rows={3}
            className="w-full bg-transparent px-5 pb-2 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none resize-none leading-relaxed"
          />

          {/* Detected chips */}
          {(!!urlMatch || state.files.length > 0) && (
            <div className="flex flex-wrap items-center gap-2 px-5 pb-2">
              {!!urlMatch && (
                <span className="flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-medium px-3 py-1.5 rounded-full">
                  <LinkIcon className="w-3 h-3" />
                  URL detected
                  <button onClick={() => state.setPrompt(state.prompt.replace(urlMatch[0], '').trim())} className="ml-1 hover:text-primary/70"><X className="w-3 h-3" /></button>
                </span>
              )}
              <MediaFileCount files={state.files} />
            </div>
          )}

          {/* Bottom toolbar */}
          <div className="flex items-center gap-1 px-3 pb-3">
            <button onClick={() => state.docRef.current?.click()} className="p-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors" title="Upload PDF / doc">
              <FileText className="w-4 h-4" />
            </button>
            <button onClick={() => toggle('media')} className={`p-2.5 rounded-xl transition-colors ${openPanel === 'media' ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'}`} title="Screenshots & media">
              <Image className="w-4 h-4" />
            </button>
            <button onClick={() => toggle('brand')} className={`p-2.5 rounded-xl transition-colors ${openPanel === 'brand' ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'}`} title="Brand & style">
              <Palette className="w-4 h-4" />
            </button>
            <div className="flex-1" />
            <button onClick={state.handleGenerate} className="flex items-center gap-2 bg-primary text-primary-foreground text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
              <Sparkles className="w-4 h-4" />
              Create
            </button>
          </div>
        </div>

        <input ref={state.docRef} type="file" accept=".pdf,.doc,.docx,.txt,.md" onChange={state.handleDocUpload} className="hidden" />

        <AnimatePresence>
          {openPanel === 'media' && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <div className="p-4 rounded-xl bg-card/60 border border-border/40">
                <MediaBucketPanel files={state.files} bucketRefs={state.bucketRefs} addFiles={state.addFiles} removeFile={state.removeFile} />
              </div>
            </motion.div>
          )}
          {openPanel === 'brand' && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <div className="p-4 rounded-xl bg-card/60 border border-border/40">
                <BrandPanel brand={state.brand} setBrand={state.setBrand} logoRef={state.logoRef} onLogoUpload={state.handleLogoUpload} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="text-xs text-muted-foreground/50 text-center">
          Drop files anywhere · Combine sources freely · Add brand settings with 🎨
        </p>
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
      {variant === 'E' && <OptionE {...state} />}
    </>
  );
}
