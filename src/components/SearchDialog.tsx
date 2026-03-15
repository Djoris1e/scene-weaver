import { useState, useCallback } from 'react';
import { Search, X, Loader2, Image as ImageIcon, Video } from 'lucide-react';

interface SearchDialogProps {
  open: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
}

interface PexelsResult {
  id: string;
  src: { small: string; large: string };
}

export default function SearchDialog({ open, onClose, onSelect }: SearchDialogProps) {
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState<'photo' | 'video'>('photo');
  const [results, setResults] = useState<PexelsResult[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = useCallback(async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      // Fallback to picsum for demo
      setResults(
        Array.from({ length: 12 }, (_, i) => ({
          id: `pexels-${query}-${i}`,
          src: {
            small: `https://picsum.photos/seed/${query}-${mode}-${i}/200/350`,
            large: `https://picsum.photos/seed/${query}-${mode}-${i}/1080/1920`,
          },
        }))
      );
    } finally {
      setLoading(false);
    }
  }, [query, mode]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <div className="bg-card border border-border rounded-2xl w-full max-w-lg max-h-[80vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h2 className="text-sm font-bold">Search Media</h2>
          <button onClick={onClose} className="p-1 rounded-md hover:bg-muted"><X className="w-4 h-4" /></button>
        </div>

        {/* Mode toggle */}
        <div className="flex gap-1 px-4 pt-3">
          <button
            onClick={() => setMode('photo')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              mode === 'photo' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            Photos
          </button>
          <button
            onClick={() => setMode('video')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              mode === 'video' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            Videos
          </button>
        </div>

        {/* Search */}
        <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} className="flex gap-2 px-4 py-3">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search images..."
              className="w-full bg-secondary border border-border rounded-lg pl-8 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <button type="submit" disabled={loading} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
          </button>
        </form>

        {/* Results */}
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {results.length > 0 ? (
            <div className="grid grid-cols-3 gap-2">
              {results.map(r => (
                <button
                  key={r.id}
                  onClick={() => { onSelect(r.src.large); onClose(); }}
                  className="aspect-[9/16] rounded-lg overflow-hidden hover:ring-2 hover:ring-primary transition-all"
                >
                  <img src={r.src.small} alt="" className="w-full h-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>
          ) : (
            <p className="text-center text-sm text-muted-foreground py-8">Search for {mode === 'photo' ? 'photos' : 'videos'} to use as backgrounds</p>
          )}
        </div>
      </div>
    </div>
  );
}
