import Preview from './Preview';
import PlaybackControls from './PlaybackControls';
import Filmstrip from './Filmstrip';
import { Scene } from '@/types/scene';

interface PreviewPaneProps {
  scenes: Scene[];
  activeIndex: number;
  activeScene: Scene;
  currentTime: number;
  totalDuration: number;
  playing: boolean;
  aspect: '9/16' | '16/9';
  onSetActiveIndex: (i: number) => void;
  onSetCurrentTime: (t: number) => void;
  onSetPlaying: (p: boolean) => void;
  onAddScene: () => void;
  onEditScene: (i: number) => void;
  getSceneAtTime: (t: number) => number;
}

export default function PreviewPane({
  scenes, activeIndex, activeScene, currentTime, totalDuration, playing, aspect,
  onSetActiveIndex, onSetCurrentTime, onSetPlaying, onAddScene, onEditScene, getSceneAtTime,
}: PreviewPaneProps) {
  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Stage */}
      <div className="flex-1 min-h-0 relative">
        <Preview scene={activeScene} sceneIndex={activeIndex} totalScenes={scenes.length} aspect={aspect} />
      </div>

      {/* Transport */}
      <div className="shrink-0 border-t border-border/40 bg-background/80 backdrop-blur-md">
        <PlaybackControls
          currentTime={currentTime}
          totalDuration={totalDuration}
          playing={playing}
          onSetCurrentTime={onSetCurrentTime}
          onSetPlaying={onSetPlaying}
        />
      </div>

      {/* Filmstrip dock */}
      <div className="shrink-0 px-3 pb-3 pt-1 bg-background">
        <Filmstrip
          scenes={scenes}
          activeIndex={activeIndex}
          currentTime={currentTime}
          totalDuration={totalDuration}
          playing={playing}
          onSetActiveIndex={onSetActiveIndex}
          onSetCurrentTime={onSetCurrentTime}
          onSetPlaying={onSetPlaying}
          onAddScene={onAddScene}
          onEditScene={onEditScene}
          getSceneAtTime={getSceneAtTime}
        />
      </div>
    </div>
  );
}
