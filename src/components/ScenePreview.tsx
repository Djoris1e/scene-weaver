import { Scene, TEXT_COLOR_PAIRINGS, FONT_OPTIONS, GRADIENT_STYLES } from '@/types/scene';

interface ScenePreviewProps {
  scene: Scene;
}

export default function ScenePreview({ scene }: ScenePreviewProps) {
  const color = TEXT_COLOR_PAIRINGS.find(c => c.id === scene.textColorId) || TEXT_COLOR_PAIRINGS[0];
  const font = FONT_OPTIONS.find(f => f.id === scene.fontId) || FONT_OPTIONS[0];
  const gradientStyle = GRADIENT_STYLES.find(g => g.id === scene.gradient.style) || GRADIENT_STYLES[0];

  const positionClass = {
    top: 'items-start pt-12',
    center: 'items-center',
    bottom: 'items-end pb-12',
  }[scene.textPosition];

  const renderBackground = () => {
    if (scene.assetType === 'media' && scene.backgroundUrl) {
      return <img src={scene.backgroundUrl} alt="Scene background" className="absolute inset-0 w-full h-full object-cover rounded-xl" />;
    }
    if (scene.assetType === 'counter') {
      return (
        <div className="absolute inset-0 rounded-xl flex items-center justify-center" style={{ background: gradientStyle.preview }}>
          <div className="text-center">
            <span className="text-5xl font-bold text-primary">{scene.counter.number}</span>
            {scene.counter.unit && <span className="text-2xl text-primary ml-1">{scene.counter.unit}</span>}
            {scene.counter.label && <p className="text-sm text-foreground/70 mt-2">{scene.counter.label}</p>}
          </div>
        </div>
      );
    }
    return <div className="absolute inset-0 rounded-xl" style={{ background: gradientStyle.preview }} />;
  };

  return (
    <div className="relative w-full h-full flex justify-center bg-stage p-2">
      <div className="relative h-full rounded-xl overflow-hidden" style={{ aspectRatio: '9/16', maxWidth: '100%' }}>
        {renderBackground()}

        {/* Text overlay */}
        {scene.text && scene.assetType !== 'counter' && (
          <div className={`absolute inset-0 flex flex-col ${positionClass} justify-center px-6 z-10`}>
            <p
              className="text-lg sm:text-xl leading-snug text-center max-w-full break-words font-semibold"
              style={{ color: color.text, textShadow: color.shadow, fontFamily: font.family }}
            >
              {scene.text}
            </p>
          </div>
        )}

        {/* Vignette */}
        <div className="absolute inset-0 rounded-xl pointer-events-none" style={{ boxShadow: 'inset 0 0 60px rgba(0,0,0,0.3)' }} />

        {/* Time indicator */}
        <div className="absolute bottom-2 left-2 right-2 flex justify-between text-[9px] text-foreground/50 z-10">
          <span>{scene.assetType === 'gradient' ? 'Gradient' : scene.assetType === 'counter' ? 'Counter' : 'Media'}</span>
          <span>{scene.startTime.toFixed(1)}s – {scene.endTime.toFixed(1)}s</span>
        </div>
      </div>
    </div>
  );
}
