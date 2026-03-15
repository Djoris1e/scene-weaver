import { useState, useCallback } from 'react';
import { Scene } from '@/types/scene';
import { Input } from '@/components/ui/input';
import { Search, Upload, Loader2 } from 'lucide-react';

interface MediaTabProps {
  scene: Scene;
  onUpdate: (updates: Partial<Scene>) => void;
}

interface UnsplashImage {
  id: string;
  urls: { small: string; regular: string };
  alt_description: string | null;
}

export default function MediaTab({ scene, onUpdate }: MediaTabProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<UnsplashImage[]>([]);
  const [loading, setLoading] = useState(false);

  const searchUnsplash = useCallback(async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      // Using Unsplash demo/public access
      const res = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=12&orientation=portrait`,
        { headers: { Authorization: 'Client-ID demo' } }
      );
      if (res.ok) {
        const data = await res.json();
        setResults(data.results || []);
      } else {
        // Fallback: generate placeholder images for demo
        setResults(
          Array.from({ length: 8 }, (_, i) => ({
            id: `placeholder-${i}`,
            urls: {
              small: `https://picsum.photos/seed/${query}-${i}/200/350`,
              regular: `https://picsum.photos/seed/${query}-${i}/1080/1920`,
            },
            alt_description: `${query} ${i + 1}`,
          }))
        );
      }
    } catch {
      // Fallback to picsum
      setResults(
        Array.from({ length: 8 }, (_, i) => ({
          id: `placeholder-${i}`,
          urls: {
            small: `https://picsum.photos/seed/${query}-${i}/200/350`,
            regular: `https://picsum.photos/seed/${query}-${i}/1080/1920`,
          },
          alt_description: `${query} ${i + 1}`,
        }))
      );
    } finally {
      setLoading(false);
    }
  }, [query]);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    onUpdate({ backgroundUrl: url });
  };

  return (
    <div className="space-y-3 p-4">
      {/* Search */}
      <form onSubmit={(e) => { e.preventDefault(); searchUnsplash(); }} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search images..."
            className="pl-8 h-9 bg-secondary border-border text-sm"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="h-9 px-3 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Go'}
        </button>
      </form>

      {/* Upload */}
      <label className="flex items-center gap-2 px-3 py-2 rounded-md bg-secondary text-secondary-foreground text-sm cursor-pointer hover:bg-muted transition-colors">
        <Upload className="w-4 h-4" />
        Upload image
        <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
      </label>

      {/* Results grid */}
      {results.length > 0 && (
        <div className="grid grid-cols-3 gap-1.5 max-h-40 overflow-y-auto">
          {results.map(img => (
            <button
              key={img.id}
              onClick={() => onUpdate({ backgroundUrl: img.urls.regular })}
              className={`relative aspect-[9/16] rounded overflow-hidden border-2 transition-all ${
                scene.backgroundUrl === img.urls.regular ? 'border-primary' : 'border-transparent'
              }`}
            >
              <img
                src={img.urls.small}
                alt={img.alt_description || 'Image'}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
