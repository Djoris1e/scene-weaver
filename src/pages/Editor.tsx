import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSceneStore } from '@/hooks/useSceneStore';
import { Home, Plus, Sparkles, Send, Loader2, Download, X } from 'lucide-react';
import Preview from '@/components/editor/Preview';
import Filmstrip from '@/components/editor/Filmstrip';
import PlaybackControls from '@/components/editor/PlaybackControls';
import SceneEditor from '@/components/editor/SceneEditor';
import ExportButton from '@/components/editor/ExportButton';
import { toast } from '@/hooks/use-toast';

type Variant = 'A' | 'B' | 'C';

function useAIPrompt(onDone?: () => void) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const submit = () => {
    if (!prompt.trim() || loading) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setPrompt('');
      toast({ title: 'AI applied changes', description: 'Your video has been updated.' });
      onDone?.();
    }, 2000);
  };
  return { prompt, setPrompt, loading, submit };
}

export default function Editor() {
  const {
    scenes, activeIndex, activeScene, totalDuration,
    setActiveIndex, addScene, deleteScene, updateScene,
    brandKit, setBrandKit, endScreen, setEndScreen,
  } = useSceneStore();
  const navigate = useNavigate();

  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [editingScene, setEditingScene] = useState<number | null>(0);
  const [variant, setVariant] = useState<Variant>('A');
  const [aiExpanded, setAiExpanded] = useState(false);

  const ai = useAIPrompt(() => setAiExpanded(false));

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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { ai.setPrompt(''); setAiExpanded(false); }
  };

  // Shared content blocks
  const previewBlock = <Preview scene={activeScene} sceneIndex={activeIndex} totalScenes={scenes.length} />;
  const playbackBlock = (
    <PlaybackControls
      currentTime={currentTime} totalDuration={totalDuration} playing={playing}
      onSetCurrentTime={setCurrentTime} onSetPlaying={setPlaying}
    />
  );
  const filmstripBlock = (
    <div className="mx-3">
      <Filmstrip
        scenes={scenes} activeIndex={activeIndex} currentTime={currentTime}
        totalDuration={totalDuration} playing={playing}
        onSetActiveIndex={setActiveIndex} onSetCurrentTime={setCurrentTime}
        onSetPlaying={setPlaying} onAddScene={addScene} onEditScene={setEditingScene}
        getSceneAtTime={getSceneAtTime}
      />
    </div>
  );
  const sceneEditorBlock = editingScene !== null && scenes[editingScene] && (
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
  );
  const bottomInfo = editingScene === null && (
    <div className="shrink-0 flex items-center justify-between px-4 py-2.5">
      <span className="text-[11px] text-muted-foreground">{scenes.length} scene{scenes.length !== 1 ? 's' : ''} · {totalDuration.toFixed(1)}s</span>
      <span className="text-[10px] text-muted-foreground/50">Tap a clip to edit</span>
    </div>
  );

  const aiPromptInput = (
    <div className="flex-1 min-w-0 flex items-center gap-2 bg-secondary rounded-xl px-3 py-2">
      <Sparkles className="w-3.5 h-3.5 text-accent shrink-0" />
      <input
        value={ai.prompt} onChange={e => ai.setPrompt(e.target.value)}
        onKeyDown={e => { handleKeyDown(e); if (e.key === 'Enter') ai.submit(); }}
        placeholder="Describe changes…"
        className="flex-1 min-w-0 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
        disabled={ai.loading} autoFocus
      />
      {ai.prompt.trim() && (
        <button onClick={ai.submit} disabled={ai.loading}
          className="w-6 h-6 rounded-lg bg-primary/20 text-primary flex items-center justify-center hover:bg-primary/30 transition-colors disabled:opacity-40 shrink-0">
          {ai.loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
        </button>
      )}
    </div>
  );

  // ─── Version Switcher ───
  const versionSwitcher = (
    <div className="fixed top-3 right-3 z-50 flex items-center gap-1 bg-card/90 backdrop-blur-sm rounded-xl p-1 border border-border shadow-lg">
      {(['A', 'B', 'C'] as Variant[]).map(v => (
        <button key={v} onClick={() => setVariant(v)}
          className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all ${variant === v ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'}`}>
          {v}
        </button>
      ))}
    </div>
  );

  // ═══════════════════════════════════════════
  // VERSION A: Floating Action Bar
  // ═══════════════════════════════════════════
  if (variant === 'A') {
    return (
      <div className="min-h-screen bg-background flex flex-col max-w-[1200px] mx-auto w-full gap-1.5 pb-24">
        {versionSwitcher}
        {/* Minimal header */}
        <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm flex items-center gap-3 px-4 h-14 shrink-0">
          <button onClick={() => navigate('/')} className="w-8 h-8 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors shrink-0">
            <Home className="w-4.5 h-4.5" />
          </button>
          <div className="flex-1" />
          <ExportButton />
        </div>
        {previewBlock}
        {playbackBlock}
        {filmstripBlock}
        {sceneEditorBlock}
        {bottomInfo}

        {/* Floating bar */}
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-[500px]">
          {aiExpanded ? (
            <div className="flex items-center gap-2 bg-card/95 backdrop-blur-md rounded-2xl p-2 border border-border shadow-xl">
              {aiPromptInput}
              <button onClick={() => { ai.setPrompt(''); setAiExpanded(false); }}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors shrink-0">
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-card/95 backdrop-blur-md rounded-2xl p-2 border border-border shadow-xl">
              <button onClick={() => navigate('/')}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-secondary transition-colors">
                <Plus className="w-4 h-4" /> New Video
              </button>
              <button onClick={() => setAiExpanded(true)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                <Sparkles className="w-4 h-4" /> Edit with AI
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════
  // VERSION B: Split Header
  // ═══════════════════════════════════════════
  if (variant === 'B') {
    return (
      <div className="min-h-screen bg-background flex flex-col max-w-[1200px] mx-auto w-full gap-1.5 pb-2">
        {versionSwitcher}
        {/* Two-row header */}
        <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm px-4 shrink-0">
          <div className="flex items-center gap-3 h-12">
            <button onClick={() => navigate('/')} className="w-8 h-8 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors shrink-0">
              <Home className="w-4.5 h-4.5" />
            </button>
            <span className="text-sm font-semibold text-foreground truncate">My Video</span>
            <div className="flex-1" />
            <ExportButton />
          </div>
          <div className="flex items-center gap-2 pb-2">
            <button onClick={() => navigate('/')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border text-xs font-medium text-foreground hover:bg-secondary transition-colors shrink-0">
              <Plus className="w-3.5 h-3.5" /> New
            </button>
            <div className="flex-1 min-w-0 flex items-center gap-2 bg-secondary rounded-xl px-3 py-1.5">
              <Sparkles className="w-3.5 h-3.5 text-accent shrink-0" />
              <input
                value={ai.prompt} onChange={e => ai.setPrompt(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') ai.submit(); }}
                placeholder="Edit your video with AI…"
                className="flex-1 min-w-0 bg-transparent text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
                disabled={ai.loading}
              />
              {ai.prompt.trim() && (
                <button onClick={ai.submit} disabled={ai.loading}
                  className="w-5 h-5 rounded-md bg-primary/20 text-primary flex items-center justify-center hover:bg-primary/30 transition-colors disabled:opacity-40 shrink-0">
                  {ai.loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                </button>
              )}
            </div>
          </div>
        </div>
        {previewBlock}
        {playbackBlock}
        {filmstripBlock}
        {sceneEditorBlock}
        {bottomInfo}
      </div>
    );
  }

  // ═══════════════════════════════════════════
  // VERSION C: Sidebar / Bottom Tab Bar
  // ═══════════════════════════════════════════
  return (
    <div className="min-h-screen bg-background flex max-w-[1200px] mx-auto w-full">
      {versionSwitcher}

      {/* Sidebar - desktop */}
      <div className="hidden md:flex flex-col items-center gap-2 w-14 py-4 border-r border-border shrink-0">
        <button onClick={() => navigate('/')}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          title="New Video">
          <Plus className="w-5 h-5" />
        </button>
        <button onClick={() => setAiExpanded(!aiExpanded)}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${aiExpanded ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'}`}
          title="Edit with AI">
          <Sparkles className="w-5 h-5" />
        </button>
        <div className="flex-1" />
        <ExportButton />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col gap-1.5 pb-16 md:pb-2 min-w-0">
        {/* AI slide-out panel */}
        {aiExpanded && (
          <div className="mx-3 mt-3 bg-card rounded-xl border border-border p-3 flex items-center gap-2">
            {aiPromptInput}
            <button onClick={() => { ai.setPrompt(''); setAiExpanded(false); }}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors shrink-0">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        {previewBlock}
        {playbackBlock}
        {filmstripBlock}
        {sceneEditorBlock}
        {bottomInfo}
      </div>

      {/* Bottom tab bar - mobile */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-card/95 backdrop-blur-md border-t border-border flex items-center justify-around px-2 py-2">
        <button onClick={() => navigate('/')}
          className="flex flex-col items-center gap-0.5 text-muted-foreground hover:text-foreground transition-colors px-4 py-1">
          <Plus className="w-5 h-5" />
          <span className="text-[10px]">New</span>
        </button>
        <button onClick={() => setAiExpanded(!aiExpanded)}
          className={`flex flex-col items-center gap-0.5 transition-colors px-4 py-1 ${aiExpanded ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
          <Sparkles className="w-5 h-5" />
          <span className="text-[10px]">AI Edit</span>
        </button>
        <button className="flex flex-col items-center gap-0.5 text-muted-foreground hover:text-foreground transition-colors px-4 py-1">
          <Download className="w-5 h-5" />
          <span className="text-[10px]">Export</span>
        </button>
      </div>
    </div>
  );
}
