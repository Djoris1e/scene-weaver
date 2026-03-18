import { useState } from 'react';
import { Download, Share2, Pencil, Check, Sparkles, ArrowDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

type Variant = 'A' | 'B' | 'C';

function VariantA() {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-md rounded-2xl border border-border/50 bg-card/60 backdrop-blur-xl p-8 flex flex-col items-center gap-6"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center"
      >
        <Download className="w-8 h-8 text-primary" />
      </motion.div>
      <div className="text-center space-y-1.5">
        <h1 className="text-2xl font-bold font-[Raleway] text-foreground">Ready!</h1>
        <p className="text-sm text-muted-foreground">Download or share your video</p>
      </div>
      <div className="flex items-center gap-3">
        <button className="flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold text-sm shadow-lg shadow-primary/25 hover:shadow-primary/40 active:scale-95 transition-all">
          <Download className="w-4 h-4" /> Save
        </button>
        <button className="flex items-center gap-2 px-6 py-3 rounded-full border border-border/80 text-accent font-semibold text-sm hover:bg-secondary/50 active:scale-95 transition-all">
          <Share2 className="w-4 h-4" /> Share
        </button>
      </div>
      <button onClick={() => navigate('/editor')} className="flex items-center gap-2 px-6 py-2.5 rounded-full border border-border/50 text-foreground text-sm hover:bg-secondary/40 active:scale-95 transition-all">
        <Pencil className="w-3.5 h-3.5" /> Edit & Re-export
      </button>
    </motion.div>
  );
}

function VariantB() {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-sm rounded-3xl bg-gradient-to-b from-card/80 to-background border border-border/30 p-10 flex flex-col items-center gap-8 relative overflow-hidden"
    >
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-primary/15 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 150 }}
        className="relative"
      >
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/30 to-accent/20 flex items-center justify-center ring-1 ring-primary/20">
          <motion.div
            animate={{ y: [0, 4, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          >
            <Check className="w-10 h-10 text-primary" />
          </motion.div>
        </div>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.6 }}
          className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-accent flex items-center justify-center"
        >
          <Sparkles className="w-3.5 h-3.5 text-accent-foreground" />
        </motion.div>
      </motion.div>

      <div className="text-center space-y-2 relative z-10">
        <h1 className="text-3xl font-bold font-[Raleway] text-foreground tracking-tight">All done!</h1>
        <p className="text-sm text-muted-foreground max-w-[220px] mx-auto">Your video has been exported and is ready to go</p>
      </div>

      <div className="flex flex-col gap-3 w-full relative z-10">
        <button className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-primary via-primary to-accent text-primary-foreground font-semibold text-sm shadow-xl shadow-primary/30 hover:shadow-primary/50 active:scale-[0.97] transition-all">
          <Download className="w-4 h-4" /> Save to device
        </button>
        <div className="flex gap-2.5">
          <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border border-border/60 text-foreground text-sm font-medium hover:bg-secondary/40 active:scale-[0.97] transition-all">
            <Share2 className="w-4 h-4 text-accent" /> Share
          </button>
          <button onClick={() => navigate('/editor')} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border border-border/60 text-foreground text-sm font-medium hover:bg-secondary/40 active:scale-[0.97] transition-all">
            <Pencil className="w-3.5 h-3.5 text-muted-foreground" /> Re-edit
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function VariantC() {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-lg flex flex-col items-center gap-10"
    >
      {/* Large cinematic icon */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.5 }}
        className="relative"
      >
        <div className="w-28 h-28 rounded-full border-2 border-primary/30 flex items-center justify-center relative">
          <div className="absolute inset-0 rounded-full bg-primary/10 animate-pulse" />
          <ArrowDown className="w-10 h-10 text-primary relative z-10" />
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-center space-y-3"
      >
        <h1 className="text-4xl font-bold font-[Raleway] text-foreground tracking-tight">
          Your video is <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">ready</span>
        </h1>
        <p className="text-base text-muted-foreground">Download, share, or head back to make changes</p>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.45, duration: 0.5 }}
        className="flex items-center gap-4"
      >
        <button className="group relative flex items-center gap-3 px-10 py-4 rounded-2xl bg-primary text-primary-foreground font-semibold text-base overflow-hidden active:scale-95 transition-transform">
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <Download className="w-5 h-5 relative z-10" />
          <span className="relative z-10">Save</span>
        </button>
        <button className="flex items-center gap-3 px-8 py-4 rounded-2xl border border-border text-foreground font-medium text-base hover:bg-secondary/30 active:scale-95 transition-all">
          <Share2 className="w-5 h-5 text-accent" /> Share
        </button>
      </motion.div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        onClick={() => navigate('/editor')}
        className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
      >
        <Pencil className="w-3.5 h-3.5" /> Edit & Re-export
      </motion.button>
    </motion.div>
  );
}

export default function ExportDone() {
  const [variant, setVariant] = useState<Variant>('A');

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Variant switcher */}
      <div className="flex items-center justify-center gap-2 pt-6 pb-2">
        {(['A', 'B', 'C'] as Variant[]).map(v => (
          <button
            key={v}
            onClick={() => setVariant(v)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              variant === v
                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                : 'bg-secondary/50 text-muted-foreground hover:text-foreground'
            }`}
          >
            Version {v}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <AnimatePresence mode="wait">
          {variant === 'A' && <VariantA key="a" />}
          {variant === 'B' && <VariantB key="b" />}
          {variant === 'C' && <VariantC key="c" />}
        </AnimatePresence>
      </div>
    </div>
  );
}
