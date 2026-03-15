import { useState, useEffect, useRef } from 'react';
import { Scene, TEXT_COLOR_PAIRINGS, FONT_OPTIONS, GRADIENT_STYLES } from '@/types/scene';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface ScenePreviewProps {
  scene: Scene;
  totalDuration: number;
}

export default function ScenePreview({ scene, totalDuration }: ScenePreviewProps) {
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const intervalRef = useRef<number | null>(null);

  const color = TEXT_COLOR_PAIRINGS.find(c => c.id === scene.textColorId) || TEXT_COLOR_PAIRINGS[0];
  const font = FONT_OPTIONS.find(f => f.id === scene.fontId) || FONT_OPTIONS[0];
  const gradientStyle = GRADIENT_STYLES.find(g => g.id === scene.gradient.style) || GRADIENT_STYLES[0];

  useEffect(() => {
    if (playing) {
      intervalRef.current = window.setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= totalDuration) {
            setPlaying(false);
            return 0;
          }
          return +(prev + 0.1).toFixed(1);
        });
      }, 100);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [playing, totalDuration]);

  const progress = totalDuration > 0 ? (currentTime / totalDuration) * 100 : 0;

  const positionClass = {
    top: 'items-start pt-8',
    center: 'items-center',
    bottom: 'items-end pb-8',
  }[scene.textPosition];

  const renderBackground = () => {
    if (scene.assetType === 'media' && scene.backgroundUrl) {
      return <img src={scene.backgroundUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />;
    }
    if (scene.assetType === 'counter') {
      return (
        <div className="absolute inset-0 flex items-center justify-center" style={{ background: gradientStyle.preview }}>
          <div className="text-center">
            <span className="text-4xl font-bold text-primary">{scene.counter.number}</span>
            {scene.counter.unit && <span className="text-xl text-primary ml-1">{scene.counter.unit}</span>}
            {scene.counter.label && <p className="text-xs text-foreground/70 mt-1.5">{scene.counter.label}</p>}
          </div>
        </div>
      );
    }
    return <div className="absolute inset-0" style={{ background: gradientStyle.preview }} />;
  };

  return (
    <div className="relative w-full flex justify-center bg-stage px-4 py-3">
      <div className="relative rounded-2xl overflow-hidden shadow-2xl" style={{ aspectRatio: '9/16', height: '240px' }}>
        {renderBackground()}

        {/* Text overlay */}
        {scene.text && scene.assetType !== 'counter' && (
          <div className={`absolute inset-0 flex flex-col ${positionClass} justify-center px-5 z-10`}>
            <p
              className="text-base leading-snug text-center max-w-full break-words font-semibold"
              style={{ color: color.text, textShadow: color.shadow, fontFamily: font.family }}
            >
              {scene.text}
            </p>
          </div>
        )}

        {/* Vignette */}
        <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: 'inset 0 0 40px rgba(0,0,0,0.25)' }} />

        {/* Playback controls overlay */}
        <div className="absolute bottom-0 left-0 right-0 z-20">
          {/* Progress bar */}
          <div className="h-0.5 bg-foreground/10 mx-2">
            <div className="h-full bg-primary transition-all duration-100" style={{ width: `${progress}%` }} />
          </div>
          <div className="flex items-center gap-2 px-2.5 py-1.5">
            <button
              onClick={() => setPlaying(!playing)}
              className="w-6 h-6 rounded-full bg-foreground/20 backdrop-blur-sm flex items-center justify-center hover:bg-foreground/30 transition-colors"
            >
              {playing ? <Pause className="w-3 h-3 text-foreground" /> : <Play className="w-3 h-3 text-foreground ml-0.5" />}
            </button>
            <button
              onClick={() => { setCurrentTime(0); setPlaying(false); }}
              className="w-5 h-5 rounded-full flex items-center justify-center hover:bg-foreground/20 transition-colors"
            >
              <RotateCcw className="w-2.5 h-2.5 text-foreground/60" />
            </button>
            <span className="text-[9px] text-foreground/60 ml-auto tabular-nums">
              {currentTime.toFixed(1)}s / {totalDuration.toFixed(1)}s
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
