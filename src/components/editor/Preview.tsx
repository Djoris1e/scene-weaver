import { Scene, TEXT_COLOR_PAIRINGS, FONT_OPTIONS, GRADIENT_STYLES } from '@/types/scene';

interface PreviewProps {
  scene: Scene;
  sceneIndex: number;
  totalScenes: number;
}

export default function Preview({ scene, sceneIndex, totalScenes }: PreviewProps) {
  const color = TEXT_COLOR_PAIRINGS.find(c => c.id === scene.textColorId) || TEXT_COLOR_PAIRINGS[0];
  const fontOpt = FONT_OPTIONS.find(f => f.id === scene.fontId) || FONT_OPTIONS[0];
  const gradientStyle = GRADIENT_STYLES.find(g => g.id === scene.gradient.style) || GRADIENT_STYLES[0];
  const positionClass = { top: 'justify-start pt-8', center: 'justify-center', bottom: 'justify-end pb-8' }[scene.textPosition];

  const renderBg = () => {
    if (scene.assetType === 'media' && scene.backgroundUrl)
      return <img src={scene.backgroundUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />;
    if (scene.assetType === 'counter')
      return (
        <div className="absolute inset-0 flex items-center justify-center" style={{ background: gradientStyle.preview }}>
          <div className="text-center">
            <span className="text-5xl font-bold text-primary">{scene.counter.number}</span>
            {scene.counter.unit && <span className="text-2xl ml-1.5 text-primary">{scene.counter.unit}</span>}
            {scene.counter.label && <p className="text-sm mt-1.5 text-foreground/60">{scene.counter.label}</p>}
          </div>
        </div>
      );
    return <div className="absolute inset-0" style={{ background: gradientStyle.preview }} />;
  };

  return (
    <div className="h-[55vh] shrink-0 relative" style={{ background: 'hsl(var(--stage))' }}>
      <div className="absolute inset-0 flex items-center justify-center px-6 py-3">
        <div className="relative rounded-2xl overflow-hidden shadow-2xl" style={{ aspectRatio: '9/16', height: '100%', width: 'auto' }}>
          {renderBg()}
          {scene.text && scene.assetType !== 'counter' && (
            <div className={`absolute inset-0 flex flex-col ${positionClass} px-5 z-10`}>
              <p className="text-lg leading-snug text-center max-w-full break-words font-semibold"
                style={{ color: color.text, textShadow: color.shadow, fontFamily: fontOpt.family }}>
                {scene.text}
              </p>
            </div>
          )}
          <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{ boxShadow: 'inset 0 0 50px rgba(0,0,0,0.2)' }} />
          <div className="absolute top-3 left-3 px-2 py-1 rounded-lg bg-background/50 backdrop-blur-md z-20">
            <span className="text-[10px] font-bold text-foreground">{sceneIndex + 1} / {totalScenes}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
