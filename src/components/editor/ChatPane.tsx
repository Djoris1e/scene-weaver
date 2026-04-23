import { useState } from 'react';
import { MessageSquare, Layers, Music } from 'lucide-react';
import PaneSegmented from './PaneSegmented';
import Composer from './Composer';
import ChatMessages from './ChatMessages';
import ScenesList from './ScenesList';
import AudioPanel from './AudioPanel';
import SceneEditor from './SceneEditor';
import { Scene } from '@/types/scene';
import { BrandKit } from '@/hooks/useSceneStore';

type LeftTab = 'chat' | 'scenes' | 'audio';

interface ChatPaneProps {
  scenes: Scene[];
  activeIndex: number;
  onSelectScene: (i: number) => void;
  onAddScene: () => void;
  onUpdateScene: (i: number, u: Partial<Scene>) => void;
  onDeleteScene: (i: number) => void;
  brandKit: BrandKit;
  setBrandKit: (v: BrandKit) => void;
  endScreen: { enabled: boolean; duration: number };
  setEndScreen: (v: { enabled: boolean; duration: number }) => void;
  compactComposer?: boolean;
}

export default function ChatPane(props: ChatPaneProps) {
  const [tab, setTab] = useState<LeftTab>('chat');
  const [editingScene, setEditingScene] = useState<number | null>(null);

  const items = [
    { id: 'chat' as const, label: 'Chat', icon: <MessageSquare className="w-3.5 h-3.5" /> },
    { id: 'scenes' as const, label: 'Scenes', icon: <Layers className="w-3.5 h-3.5" />, badge: props.scenes.length },
    { id: 'audio' as const, label: 'Audio', icon: <Music className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="flex flex-col h-full min-h-0 bg-card/30">
      {/* Pane header */}
      <div className="shrink-0 px-3 py-2.5 border-b border-border/40 flex items-center justify-between gap-2">
        <PaneSegmented items={items} active={tab} onChange={setTab} size="sm" />
      </div>

      {/* Body */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        {tab === 'chat' && <ChatMessages sceneCount={props.scenes.length} />}
        {tab === 'scenes' && (
          <>
            <ScenesList
              scenes={props.scenes}
              activeIndex={props.activeIndex}
              onSelect={i => { props.onSelectScene(i); setEditingScene(i); }}
              onAdd={props.onAddScene}
            />
            {editingScene !== null && props.scenes[editingScene] && (
              <div className="px-3 pb-3">
                <SceneEditor
                  scene={props.scenes[editingScene]}
                  index={editingScene}
                  onUpdate={u => props.onUpdateScene(editingScene, u)}
                  onDelete={() => { props.onDeleteScene(editingScene); setEditingScene(null); }}
                  onClose={() => setEditingScene(null)}
                  totalScenes={props.scenes.length}
                  brandKit={props.brandKit}
                  setBrandKit={props.setBrandKit}
                  endScreen={props.endScreen}
                  setEndScreen={props.setEndScreen}
                />
              </div>
            )}
          </>
        )}
        {tab === 'audio' && <AudioPanel />}
      </div>

      {/* Composer */}
      <div className="shrink-0">
        <Composer compact={props.compactComposer} />
      </div>
    </div>
  );
}
