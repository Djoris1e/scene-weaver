import { useState } from 'react';
import { Scene } from '@/types/scene';
import { Type, Image, Sparkles } from 'lucide-react';
import TextTab from './TextTab';
import MediaTab from './MediaTab';
import MotionTab from './MotionTab';

type Tab = 'text' | 'media' | 'motion';

interface ConsoleDrawerProps {
  scene: Scene;
  onUpdate: (updates: Partial<Scene>) => void;
}

export default function ConsoleDrawer({ scene, onUpdate }: ConsoleDrawerProps) {
  const [tab, setTab] = useState<Tab>('text');

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'text', label: 'Text', icon: <Type className="w-4 h-4" /> },
    { id: 'media', label: 'Media', icon: <Image className="w-4 h-4" /> },
    { id: 'motion', label: 'Motion', icon: <Sparkles className="w-4 h-4" /> },
  ];

  return (
    <div className="bg-console border-t border-border flex flex-col overflow-hidden">
      {/* Tab bar */}
      <div className="flex border-b border-border">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors ${
              tab === t.id
                ? 'text-primary border-b-2 border-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto">
        {tab === 'text' && <TextTab scene={scene} onUpdate={onUpdate} />}
        {tab === 'media' && <MediaTab scene={scene} onUpdate={onUpdate} />}
        {tab === 'motion' && <MotionTab scene={scene} onUpdate={onUpdate} />}
      </div>
    </div>
  );
}
