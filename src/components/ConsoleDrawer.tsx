import { useState } from 'react';
import { Scene } from '@/types/scene';
import { BrandKit } from '@/hooks/useSceneStore';
import { Type, Image, Sparkles, Palette, Settings } from 'lucide-react';
import TextTab from './TextTab';
import MediaTab from './MediaTab';
import MotionTab from './MotionTab';
import BrandKitSection from './BrandKit';
import EndScreenSettings from './EndScreenSettings';

type Tab = 'text' | 'media' | 'motion' | 'style' | 'settings';

interface ConsoleDrawerProps {
  scene: Scene;
  sceneIndex: number;
  onUpdate: (updates: Partial<Scene>) => void;
  onOpenSearch: () => void;
  brandKit: BrandKit;
  onBrandKitUpdate: (updates: Partial<BrandKit>) => void;
  endScreen: { enabled: boolean; duration: number };
  onEndScreenUpdate: (updates: { enabled?: boolean; duration?: number }) => void;
}

export default function ConsoleDrawer({ scene, sceneIndex, onUpdate, onOpenSearch, brandKit, onBrandKitUpdate, endScreen, onEndScreenUpdate }: ConsoleDrawerProps) {
  const [tab, setTab] = useState<Tab>('text');

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'text', label: 'Text', icon: <Type className="w-4 h-4" /> },
    { id: 'media', label: 'Media', icon: <Image className="w-4 h-4" /> },
    { id: 'motion', label: 'Motion', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'style', label: 'Style', icon: <Palette className="w-4 h-4" /> },
    { id: 'settings', label: 'More', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div className="bg-console border-t border-border flex flex-col overflow-hidden">
      {/* Tab bar */}
      <div className="flex border-b border-border">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 flex items-center justify-center gap-1 py-2.5 text-[11px] font-medium transition-colors ${
              tab === t.id
                ? 'text-primary border-b-2 border-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {t.icon}
            <span className="hidden sm:inline">{t.label}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto">
        {tab === 'text' && <TextTab scene={scene} onUpdate={onUpdate} />}
        {tab === 'media' && <MediaTab scene={scene} onUpdate={onUpdate} onOpenSearch={onOpenSearch} />}
        {tab === 'motion' && <MotionTab scene={scene} onUpdate={onUpdate} />}
        {tab === 'style' && (
          <div className="p-4">
            <BrandKitSection brandKit={brandKit} onUpdate={onBrandKitUpdate} />
          </div>
        )}
        {tab === 'settings' && (
          <div className="p-4">
            <EndScreenSettings enabled={endScreen.enabled} duration={endScreen.duration} onUpdate={onEndScreenUpdate} />
          </div>
        )}
      </div>
    </div>
  );
}
