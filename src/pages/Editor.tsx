import { useState, useEffect, useCallback } from 'react';
import { useSceneStore } from '@/hooks/useSceneStore';
import EditorShell from '@/components/editor/EditorShell';
import ChatPane from '@/components/editor/ChatPane';
import PreviewPane from '@/components/editor/PreviewPane';
import { useIsMobile } from '@/hooks/use-mobile';

export default function Editor() {
  const {
    scenes, activeIndex, activeScene, totalDuration,
    setActiveIndex, addScene, deleteScene, updateScene,
    brandKit, setBrandKit, endScreen, setEndScreen,
  } = useSceneStore();

  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [aspect, setAspect] = useState<'9/16' | '16/9'>('9/16');
  const isMobile = useIsMobile();

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

  const chat = (
    <ChatPane
      scenes={scenes}
      activeIndex={activeIndex}
      onSelectScene={setActiveIndex}
      onAddScene={addScene}
      onUpdateScene={updateScene}
      onDeleteScene={deleteScene}
      brandKit={brandKit}
      setBrandKit={setBrandKit}
      endScreen={endScreen}
      setEndScreen={setEndScreen}
      compactComposer={!isMobile && false}
    />
  );

  const preview = (
    <PreviewPane
      scenes={scenes}
      activeIndex={activeIndex}
      activeScene={activeScene}
      currentTime={currentTime}
      totalDuration={totalDuration}
      playing={playing}
      aspect={aspect}
      onSetActiveIndex={setActiveIndex}
      onSetCurrentTime={setCurrentTime}
      onSetPlaying={setPlaying}
      onAddScene={addScene}
      onEditScene={setActiveIndex}
      getSceneAtTime={getSceneAtTime}
    />
  );

  return (
    <EditorShell chat={chat} preview={preview} aspect={aspect} onAspectChange={setAspect} />
  );
}
