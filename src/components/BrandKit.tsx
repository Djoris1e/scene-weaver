import { BrandKit as BrandKitType } from '@/hooks/useSceneStore';
import { Upload, X } from 'lucide-react';

interface BrandKitProps {
  brandKit: BrandKitType;
  onUpdate: (updates: Partial<BrandKitType>) => void;
}

export default function BrandKitSection({ brandKit, onUpdate }: BrandKitProps) {
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onUpdate({ logoUrl: URL.createObjectURL(file) });
  };

  return (
    <div className="bg-card rounded-xl border border-border p-4 space-y-4">
      <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Brand Kit</h3>

      {/* Colors */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Background</span>
          <input
            type="color"
            value={brandKit.bgColor}
            onChange={(e) => onUpdate({ bgColor: e.target.value })}
            className="w-7 h-7 rounded border-0 cursor-pointer bg-transparent"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Accent</span>
          <input
            type="color"
            value={brandKit.accentColor}
            onChange={(e) => onUpdate({ accentColor: e.target.value })}
            className="w-7 h-7 rounded border-0 cursor-pointer bg-transparent"
          />
        </div>
      </div>

      {/* Logo */}
      <div>
        <span className="text-xs text-muted-foreground block mb-2">Logo</span>
        {brandKit.logoUrl ? (
          <div className="flex items-center gap-2">
            <img src={brandKit.logoUrl} alt="Logo" className="h-8 object-contain" />
            <button onClick={() => onUpdate({ logoUrl: null })} className="p-1 rounded hover:bg-muted">
              <X className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          </div>
        ) : (
          <label className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-secondary text-xs text-secondary-foreground cursor-pointer hover:bg-muted transition-colors">
            <Upload className="w-3.5 h-3.5" />
            Upload logo
            <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
          </label>
        )}
      </div>

      {/* Slogan */}
      <div>
        <span className="text-xs text-muted-foreground block mb-1.5">Slogan or call to action</span>
        <input
          type="text"
          value={brandKit.slogan}
          onChange={(e) => onUpdate({ slogan: e.target.value })}
          placeholder="e.g. Your tagline or website"
          className="w-full bg-secondary border border-border rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground"
        />
      </div>
    </div>
  );
}
