import { Scene, TEXT_COLOR_PAIRINGS, FONT_OPTIONS } from '@/types/scene';

interface ScenePreviewProps {
  scene: Scene;
}

export default function ScenePreview({ scene }: ScenePreviewProps) {
  const color = TEXT_COLOR_PAIRINGS.find(c => c.id === scene.textColorId) || TEXT_COLOR_PAIRINGS[0];
  const font = FONT_OPTIONS.find(f => f.id === scene.fontId) || FONT_OPTIONS[0];

  const positionClass = {
    top: 'items-start pt-12',
    center: 'items-center',
    bottom: 'items-end pb-12',
  }[scene.textPosition];

  return (
    <div className="relative w-full h-full flex justify-center bg-stage">
      <div className="relative h-full" style={{ aspectRatio: '9/16', maxWidth: '100%' }}>
        {/* Background */}
        {scene.backgroundUrl ? (
          <img
            src={scene.backgroundUrl}
            alt="Scene background"
            className="absolute inset-0 w-full h-full object-cover rounded-lg"
          />
        ) : (
          <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-secondary to-muted flex items-center justify-center">
            <span className="text-muted-foreground text-sm">No background</span>
          </div>
        )}

        {/* Text overlay */}
        {scene.text && (
          <div className={`absolute inset-0 flex flex-col ${positionClass} justify-center px-6 z-10`}>
            <p
              className="text-lg sm:text-xl leading-snug text-center max-w-full break-words font-semibold"
              style={{
                color: color.text,
                textShadow: color.shadow,
                fontFamily: font.family,
              }}
            >
              {scene.text}
            </p>
          </div>
        )}

        {/* Vignette overlay */}
        <div className="absolute inset-0 rounded-lg pointer-events-none"
          style={{ boxShadow: 'inset 0 0 60px rgba(0,0,0,0.3)' }} />
      </div>
    </div>
  );
}
