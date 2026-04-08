import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSceneStore } from '@/hooks/useSceneStore';
import { Home } from 'lucide-react';
import Preview from '@/components/editor/Preview';
import Filmstrip from '@/components/editor/Filmstrip';
import PlaybackControls from '@/components/editor/PlaybackControls';
import SceneEditor from '@/components/editor/SceneEditor';
import ExportButton from '@/components/editor/ExportButton';

export default function Editor() {
  const {
    scenes, activeIndex, activeScene, totalDuration,
    setActiveIndex, addScene, deleteScene, updateScene,
    brandKit, setBrandKit, endScreen, setEndScreen,
  } = useSceneStore();
  const navigate = useNavigate();
  const [format, setFormat] = useState<'9:16' | '16:9'>('9:16');

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
    <div className="min-h-screen bg-background flex flex-col max-w-[1200px] mx-auto w-full gap-1.5 pb-24">
      {/* Minimal header */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm flex items-center gap-3 px-4 h-14 shrink-0">
        <button onClick={() => navigate('/')} className="w-8 h-8 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors shrink-0">
          <Home className="w-4.5 h-4.5" />
        </button>
        <div className="flex-1" />
        <ExportButton />
      </div>

      <Preview scene={activeScene} sceneIndex={activeIndex} totalScenes={scenes.length} />

      <PlaybackControls
        currentTime={currentTime} totalDuration={totalDuration} playing={playing}
        onSetCurrentTime={setCurrentTime} onSetPlaying={setPlaying}
      />

      <div className="mx-3">
        <Filmstrip
          scenes={scenes} activeIndex={activeIndex} currentTime={currentTime}
          totalDuration={totalDuration} playing={playing}
          onSetActiveIndex={setActiveIndex} onSetCurrentTime={setCurrentTime}
          onSetPlaying={setPlaying} onAddScene={addScene} onEditScene={setEditingScene}
          getSceneAtTime={getSceneAtTime}
        />
      </div>

      {editingScene !== null && scenes[editingScene] && (
        <div className="mx-3">
          <SceneEditor
            scene={scenes[editingScene]} index={editingScene}
            onUpdate={u => updateScene(editingScene, u)}
            onDelete={() => { deleteScene(editingScene); setEditingScene(null); }}
            onClose={() => setEditingScene(null)} totalScenes={scenes.length}
            brandKit={brandKit} setBrandKit={setBrandKit}
            endScreen={endScreen} setEndScreen={setEndScreen}
          />
        </div>
      )}

      {editingScene === null && (
        <div className="shrink-0 flex items-center justify-between px-4 py-2.5">
          <span className="text-[11px] text-muted-foreground">{scenes.length} scene{scenes.length !== 1 ? 's' : ''} · {totalDuration.toFixed(1)}s</span>
          <span className="text-[10px] text-muted-foreground/50">Tap a clip to edit</span>
        </div>
      )}

    </div>
  );
}
