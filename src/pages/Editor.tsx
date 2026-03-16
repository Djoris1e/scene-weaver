import { useState, useEffect, useCallback } from 'react';
import { useSceneStore } from '@/hooks/useSceneStore';
import logo from '@/assets/logo.svg';
import Preview from '@/components/editor/Preview';
import Filmstrip from '@/components/editor/Filmstrip';
import SceneEditor from '@/components/editor/SceneEditor';
import ExportButton from '@/components/editor/ExportButton';
import AIPromptBar from '@/components/editor/AIPromptBar';

export default function Editor() {
  const {
    scenes, activeIndex, activeScene, totalDuration,
    setActiveIndex, addScene, deleteScene, updateScene,
    brandKit, setBrandKit, endScreen, setEndScreen,
  } = useSceneStore();

  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [editingScene, setEditingScene] = useState<number | null>(0);

  const getSceneAtTime = useCallback((time: number) => {
    let cumulative = 0;
    for (let i = 0; i < scenes.length; i++) {
      cumulative += scenes[i].endTime - scenes[i].startTime;
      if (time < cumulative) return i;
    }
    return scenes.length - 1;
  }, [scenes]);

  // Playback
  useEffect(() => {
    if (!playing) return;
    const interval = setInterval(() => {
      setCurrentTime(prev => {
        const next = +(prev + 0.1).toFixed(1);
        if (next >= totalDuration) { setPlaying(false); return 0; }
        const idx = getSceneAtTime(next);
        if (idx !== activeIndex) setActiveIndex(idx);
        return next;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [playing, totalDuration, getSceneAtTime, activeIndex, setActiveIndex]);

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-[1200px] mx-auto w-full">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm flex items-center justify-between px-4 h-12 shrink-0 border-b border-border/30">
        <img src={logo} alt="Logo" className="h-5" />
        <ExportButton />
      </div>

      {/* Preview */}
      <Preview scene={activeScene} sceneIndex={activeIndex} totalScenes={scenes.length} />

      {/* Filmstrip */}
      <Filmstrip
        scenes={scenes}
        activeIndex={activeIndex}
        currentTime={currentTime}
        totalDuration={totalDuration}
        playing={playing}
        onSetActiveIndex={setActiveIndex}
        onSetCurrentTime={setCurrentTime}
        onSetPlaying={setPlaying}
        onAddScene={addScene}
        onEditScene={setEditingScene}
        getSceneAtTime={getSceneAtTime}
      />

      {/* AI Prompt Bar (sticky) */}
      <div className="sticky bottom-0 z-20 bg-card">
        <AIPromptBar />
      </div>

      {/* Scene Editor */}
      {editingScene !== null && scenes[editingScene] && (
        <SceneEditor
          scene={scenes[editingScene]}
          index={editingScene}
          onUpdate={u => updateScene(editingScene, u)}
          onDelete={() => { deleteScene(editingScene); setEditingScene(null); }}
          onClose={() => setEditingScene(null)}
          totalScenes={scenes.length}
          brandKit={brandKit}
          setBrandKit={setBrandKit}
          endScreen={endScreen}
          setEndScreen={setEndScreen}
        />
      )}

      {/* Bottom info */}
      {editingScene === null && (
        <div className="shrink-0 flex items-center justify-between px-4 py-2.5 border-t border-border/50">
          <span className="text-[11px] text-muted-foreground">{scenes.length} scene{scenes.length !== 1 ? 's' : ''} · {totalDuration.toFixed(1)}s</span>
          <span className="text-[10px] text-muted-foreground/50">Tap a clip to edit</span>
        </div>
      )}
    </div>
  );
}
