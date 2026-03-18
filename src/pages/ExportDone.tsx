import { Download, Share2, Pencil } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function ExportDone() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md rounded-2xl border border-border/50 bg-card/60 backdrop-blur-xl p-8 flex flex-col items-center gap-6"
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center"
        >
          <Download className="w-8 h-8 text-primary" />
        </motion.div>

        {/* Text */}
        <div className="text-center space-y-1.5">
          <h1 className="text-2xl font-bold font-[Raleway] text-foreground">Ready!</h1>
          <p className="text-sm text-muted-foreground">Download or share your video</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 w-full justify-center">
          <button className="flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold text-sm shadow-lg shadow-primary/25 hover:shadow-primary/40 active:scale-95 transition-all">
            <Download className="w-4 h-4" />
            Save
          </button>
          <button className="flex items-center gap-2 px-6 py-3 rounded-full border border-border/80 text-accent font-semibold text-sm hover:bg-secondary/50 active:scale-95 transition-all">
            <Share2 className="w-4 h-4" />
            Share
          </button>
        </div>

        <button
          onClick={() => navigate('/editor')}
          className="flex items-center gap-2 px-6 py-2.5 rounded-full border border-border/50 text-foreground text-sm hover:bg-secondary/40 active:scale-95 transition-all"
        >
          <Pencil className="w-3.5 h-3.5" />
          Edit & Re-export
        </button>
      </motion.div>
    </div>
  );
}
