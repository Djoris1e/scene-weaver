import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, Link as LinkIcon, Upload, Image, Palette, Settings,
  X, Sparkles,
  Plus, Globe, FileImage, Type,
  Smartphone, Monitor, FileText, BookOpen, Newspaper,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

/* ─── Types & constants ─── */
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
  { id: 'blog', icon: BookOpen, label: 'Blog', desc: 'Paste a blog post URL' },
  { id: 'release', icon: Newspaper, label: 'Release notes', desc: 'Changelog or release notes' },
  { id: 'doc', icon: FileText, label: 'PDF / Doc', desc: 'Upload a document' },
  { id: 'url', icon: LinkIcon, label: 'URL', desc: 'Any webpage' },
  { id: 'text', icon: Type, label: 'Text', desc: 'Write or paste a script' },
];

const MEDIA_BUCKETS: { id: MediaBucket; icon: typeof Smartphone; label: string; desc: string; accept: string }[] = [
  { id: 'mobile', icon: Smartphone, label: 'Mobile Screenshots', desc: 'App or mobile web screens', accept: 'image/*' },
  { id: 'desktop', icon: Monitor, label: 'Desktop Screenshots', desc: 'Desktop or dashboard screens', accept: 'image/*' },
  { id: 'background', icon: Image, label: 'Background Media', desc: 'Video or images for backgrounds', accept: 'image/*,video/*' },
];

/* ─── State hook ─── */
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

/* ─── Sub-components ─── */

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
  brand, setBrand, logoRef, onLogoUpload,
}: {
  brand: BrandConfig;
  setBrand: React.Dispatch<React.SetStateAction<BrandConfig>>;
  logoRef: React.RefObject<HTMLInputElement | null>;
  onLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="space-y-3">
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
   OPTION E — Unified Prompt Card
   ═══════════════════════════════════════════════ */
export default function Create() {
  const state = useCreateState();
  const [openPanel, setOpenPanel] = useState<'media' | 'brand' | null>(null);

  const toggle = (panel: 'media' | 'brand') => setOpenPanel(prev => prev === panel ? null : panel);

  // Auto-detect URL from prompt text
  const urlMatch = state.prompt.match(/https?:\/\/[^\s]+/);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files.length) state.addFiles('background', e.dataTransfer.files);
  };

  // Inline URL input for blog/release/url sources
  const showUrlInput = state.contentSource === 'blog' || state.contentSource === 'release' || state.contentSource === 'url';
  // Doc upload for doc source
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

        {/* ── Main unified card ── */}
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

          {/* Inline URL input (for blog, release, url sources) */}
          <AnimatePresence mode="wait">
            {showUrlInput && (
              <motion.div
                key="url-input"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mx-4 mb-2 flex items-center gap-2 bg-secondary/40 border border-border/60 rounded-xl px-3 py-2.5">
                  <Globe className="w-4 h-4 text-muted-foreground shrink-0" />
                  <input
                    value={state.url}
                    onChange={e => state.setUrl(e.target.value)}
                    placeholder={
                      state.contentSource === 'blog' ? 'Paste your blog post URL…'
                        : state.contentSource === 'release' ? 'Paste changelog or release notes URL…'
                        : 'Paste any URL…'
                    }
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
            )}

            {/* Inline doc upload */}
            {showDocInput && (
              <motion.div
                key="doc-input"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mx-4 mb-2">
                  {state.docFile ? (
                    <div className="flex items-center gap-3 bg-secondary/40 border border-border/60 rounded-xl px-3 py-2.5">
                      <FileText className="w-4 h-4 text-primary shrink-0" />
                      <span className="text-sm text-foreground flex-1 truncate">{state.docFile.name}</span>
                      <button onClick={() => state.setDocFile(null)} className="text-muted-foreground hover:text-foreground">
                        <X className="w-3.5 h-3.5" />
                      </button>
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

          {/* Prompt textarea — always visible */}
          <textarea
            value={state.prompt}
            onChange={e => state.setPrompt(e.target.value)}
            placeholder="Describe your video, paste a URL, or do both…"
            rows={3}
            className="w-full bg-transparent px-5 pb-2 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none resize-none leading-relaxed"
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
              <MediaFileCount files={state.files} />
            </div>
          )}

          {/* Bottom toolbar */}
          <div className="flex items-center gap-1 px-3 pb-3">
            <button
              onClick={() => state.docRef.current?.click()}
              className="p-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
              title="Upload PDF / doc"
            >
              <FileText className="w-4 h-4" />
            </button>
            <button
              onClick={() => toggle('media')}
              className={`p-2.5 rounded-xl transition-colors ${openPanel === 'media' ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'}`}
              title="Screenshots & media"
            >
              <Image className="w-4 h-4" />
            </button>
            <button
              onClick={() => toggle('brand')}
              className={`p-2.5 rounded-xl transition-colors ${openPanel === 'brand' ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'}`}
              title="Brand & style"
            >
              <Palette className="w-4 h-4" />
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

        {/* Hidden file inputs */}
        <input
          ref={state.docRef}
          type="file"
          accept=".pdf,.doc,.docx,.txt,.md"
          onChange={state.handleDocUpload}
          className="hidden"
        />

        {/* Expandable panels below the card */}
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
