import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSceneStore } from '@/hooks/useSceneStore';
import { TEXT_COLOR_PAIRINGS, FONT_OPTIONS, GRADIENT_STYLES, Scene } from '@/types/scene';
import {
  Play, Pause, Plus, X, Trash2,
  AlignVerticalJustifyStart, AlignVerticalJustifyCenter, AlignVerticalJustifyEnd,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

/* ─── Half-Sheet Editor ──────────────────────────────────────── */

function HalfSheet({
  scene, index, onUpdate, onDelete, onClose, totalScenes,
}: {
  scene: Scene; index: number;
  onUpdate: (u: Partial<Scene>) => void;
  onDelete: () => void; onClose: () => void; totalScenes: number;
}) {
  const dur = +(scene.endTime - scene.startTime).toFixed(1);

  return (
    <div className="absolute bottom-0 left-0 right-0 z-30 bg-card border-t border-border rounded-t-3xl shadow-2xl animate-in slide-in-from-bottom-4 duration-300"
      style={{ maxHeight: '55vh' }}>
      {/* Handle */}
      <div className="flex justify-center pt-2 pb-1">
        <div className="w-8 h-1 rounded-full bg-muted-foreground/20" />
      </div>
      <div className="flex items-center justify-between px-4 pb-2">
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Scene {index + 1}</span>
        <button onClick={onClose} className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center hover:bg-muted transition-colors">
          <X className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
      </div>
      <div className="px-4 pb-5 space-y-3 overflow-y-auto scrollbar-none" style={{ maxHeight: 'calc(55vh - 56px)' }}>
        <input type="text" value={scene.text} onChange={e => onUpdate({ text: e.target.value })}
          placeholder="Scene text..." className="w-full bg-secondary rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary/30" />

        <Row label="Position">
          <div className="flex gap-1">
            {([
              { val: 'top' as const, icon: <AlignVerticalJustifyStart className="w-3.5 h-3.5" /> },
              { val: 'center' as const, icon: <AlignVerticalJustifyCenter className="w-3.5 h-3.5" /> },
              { val: 'bottom' as const, icon: <AlignVerticalJustifyEnd className="w-3.5 h-3.5" /> },
            ]).map(p => (
              <button key={p.val} onClick={() => onUpdate({ textPosition: p.val })}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all
                  ${scene.textPosition === p.val ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                {p.icon}
              </button>
            ))}
          </div>
        </Row>

        <Row label="Color">
          <div className="flex gap-1.5 flex-wrap">
            {TEXT_COLOR_PAIRINGS.map(c => (
              <button key={c.id} onClick={() => onUpdate({ textColorId: c.id })}
                className={`w-7 h-7 rounded-full shadow-sm transition-all
                  ${scene.textColorId === c.id ? 'ring-2 ring-primary ring-offset-2 ring-offset-card scale-110' : ''}`}
                style={{ background: c.text }} />
            ))}
          </div>
        </Row>

        <Row label="Font">
          <div className="flex gap-1 flex-wrap">
            {FONT_OPTIONS.map(f => (
              <button key={f.id} onClick={() => onUpdate({ fontId: f.id })}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all
                  ${scene.fontId === f.id ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}
                style={{ fontFamily: f.family }}>{f.label}</button>
            ))}
          </div>
        </Row>

        <Row label="Background">
          <div className="flex gap-1">
            {(['media', 'gradient', 'counter'] as const).map(t => (
              <button key={t} onClick={() => onUpdate({ assetType: t })}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-medium capitalize transition-all
                  ${scene.assetType === t ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>{t}</button>
            ))}
          </div>
        </Row>

        {scene.assetType === 'gradient' && (
          <div className="grid grid-cols-6 gap-1.5 pl-16">
            {GRADIENT_STYLES.map(g => (
              <button key={g.id} onClick={() => onUpdate({ gradient: { ...scene.gradient, style: g.id } })}
                className={`aspect-square rounded-lg border-2 transition-all
                  ${scene.gradient.style === g.id ? 'border-primary scale-105' : 'border-transparent hover:border-border'}`}
                style={{ background: g.preview }} />
            ))}
          </div>
        )}

        <Row label="Transition">
          <div className="flex gap-1 flex-wrap">
            {(['default', 'crossfade', 'zoom-in', 'flash', 'slide'] as const).map(tr => (
              <button key={tr} onClick={() => onUpdate({ transition: tr })}
                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium capitalize transition-all
                  ${scene.transition === tr ? 'bg-accent text-accent-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                {tr === 'default' ? 'None' : tr.replace('-', ' ')}
              </button>
            ))}
          </div>
        </Row>

        <Row label={`${dur}s`}>
          <input type="range" min={0.5} max={10} step={0.1} value={dur}
            onChange={e => onUpdate({ endTime: scene.startTime + parseFloat(e.target.value) })}
            className="flex-1 accent-primary h-1.5 cursor-pointer" />
        </Row>

        {totalScenes > 1 && (
          <div className="flex justify-end pt-1">
            <button onClick={onDelete}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium text-destructive/70 hover:text-destructive bg-destructive/5 hover:bg-destructive/10 transition-all">
              <Trash2 className="w-3 h-3" /> Remove
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] text-muted-foreground/70 uppercase tracking-wider font-semibold w-16 shrink-0 text-right">{label}</span>
      {children}
    </div>
  );
}

/* ─── Main ────────────────────────────────────────────────────── */

export default function V10() {
  const navigate = useNavigate();
  const {
    scenes, activeIndex, activeScene, totalDuration,
    setActiveIndex, addScene, deleteScene, updateScene,
  } = useSceneStore();

  const [editingScene, setEditingScene] = useState<number | null>(null);

  const color = TEXT_COLOR_PAIRINGS.find(c => c.id === activeScene.textColorId) || TEXT_COLOR_PAIRINGS[0];
  const fontOpt = FONT_OPTIONS.find(f => f.id === activeScene.fontId) || FONT_OPTIONS[0];
  const gradientStyle = GRADIENT_STYLES.find(g => g.id === activeScene.gradient.style) || GRADIENT_STYLES[0];
  const positionClass = { top: 'items-start pt-8', center: 'items-center', bottom: 'items-end pb-8' }[activeScene.textPosition];

  const renderPreviewBg = () => {
    if (activeScene.assetType === 'media' && activeScene.backgroundUrl)
      return <img src={activeScene.backgroundUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />;
    if (activeScene.assetType === 'counter')
      return (
        <div className="absolute inset-0 flex items-center justify-center" style={{ background: gradientStyle.preview }}>
          <div className="text-center">
            <span className="text-4xl font-bold text-primary">{activeScene.counter.number}</span>
            {activeScene.counter.unit && <span className="text-xl ml-1 text-primary">{activeScene.counter.unit}</span>}
            {activeScene.counter.label && <p className="text-xs text-foreground/60 mt-1">{activeScene.counter.label}</p>}
          </div>
        </div>
      );
    return <div className="absolute inset-0" style={{ background: gradientStyle.preview }} />;
  };

  return (
    <div className="flex flex-col h-screen bg-background relative">
      {/* ─── Header ─── */}
      <div className="flex items-center justify-between px-4 h-11 shrink-0">
        <button onClick={() => navigate('/')} className="text-sm font-semibold text-primary">← Back</button>
        <span className="text-xs font-bold text-foreground">Storyboard</span>
        <span className="text-[11px] text-muted-foreground">{scenes.length} scenes</span>
      </div>

      {/* ─── Compact Preview ─── */}
      <div className="shrink-0 relative mx-4 mb-3 rounded-2xl overflow-hidden shadow-2xl" style={{ aspectRatio: '9/16', maxHeight: '38vh' }}>
        {renderPreviewBg()}
        {activeScene.text && activeScene.assetType !== 'counter' && (
          <div className={`absolute inset-0 flex flex-col ${positionClass} justify-center px-5 z-10`}>
            <p className="text-base leading-snug text-center max-w-full break-words font-semibold"
              style={{ color: color.text, textShadow: color.shadow, fontFamily: fontOpt.family }}>
              {activeScene.text}
            </p>
          </div>
        )}
        <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: 'inset 0 0 40px rgba(0,0,0,0.2)' }} />
        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="w-12 h-12 rounded-full bg-background/30 backdrop-blur-sm flex items-center justify-center">
            <Play className="w-5 h-5 text-foreground ml-0.5" />
          </div>
        </div>
      </div>

      {/* ─── 2-Column Grid ─── */}
      <div className="flex-1 min-h-0 overflow-y-auto px-3 pb-20 scrollbar-none">
        <div className="grid grid-cols-2 gap-2">
          {scenes.map((scene, idx) => {
            const gStyle = GRADIENT_STYLES.find(g => g.id === scene.gradient.style) || GRADIENT_STYLES[0];
            const dur = +(scene.endTime - scene.startTime).toFixed(1);
            const isActive = idx === activeIndex;

            return (
              <button
                key={scene.id}
                onClick={() => { setActiveIndex(idx); setEditingScene(idx); }}
                className={`relative rounded-2xl overflow-hidden transition-all aspect-[9/16]
                  ${isActive ? 'ring-2 ring-primary shadow-lg shadow-primary/20' : 'ring-1 ring-border hover:ring-primary/30'}`}
              >
                {/* Background */}
                {scene.assetType === 'media' && scene.backgroundUrl ? (
                  <img src={scene.backgroundUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0" style={{ background: gStyle.preview }} />
                )}

                {/* Text preview */}
                {scene.text && (
                  <div className="absolute inset-0 flex items-center justify-center px-2 z-10">
                    <p className="text-[10px] leading-tight text-center text-foreground/90 font-medium line-clamp-3"
                      style={{ textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>
                      {scene.text}
                    </p>
                  </div>
                )}

                {/* Scene number */}
                <div className="absolute top-1.5 left-1.5 w-5 h-5 rounded-lg bg-background/60 backdrop-blur-sm flex items-center justify-center z-20">
                  <span className="text-[9px] font-bold text-foreground">{idx + 1}</span>
                </div>

                {/* Duration */}
                <div className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded-md bg-background/60 backdrop-blur-sm z-20">
                  <span className="text-[9px] font-semibold text-foreground tabular-nums">{dur}s</span>
                </div>

                {/* Vignette */}
                <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: 'inset 0 0 20px rgba(0,0,0,0.15)' }} />
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── FAB Add Scene ─── */}
      <button
        onClick={() => { addScene(); toast({ title: 'Scene added' }); }}
        className="absolute bottom-5 right-5 z-20 w-12 h-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/30 hover:bg-primary/90 active:scale-95 transition-all"
      >
        <Plus className="w-5 h-5" />
      </button>

      {/* ─── Half Sheet Editor ─── */}
      {editingScene !== null && scenes[editingScene] && (
        <HalfSheet
          scene={scenes[editingScene]}
          index={editingScene}
          onUpdate={u => updateScene(editingScene, u)}
          onDelete={() => { deleteScene(editingScene); setEditingScene(null); }}
          onClose={() => setEditingScene(null)}
          totalScenes={scenes.length}
        />
      )}
    </div>
  );
}
