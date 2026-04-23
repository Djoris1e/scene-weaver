import { useNavigate } from 'react-router-dom';
import { Smartphone, RectangleHorizontal } from 'lucide-react';
import ExportButton from './ExportButton';

interface EditorHeaderProps {
  aspect: '9/16' | '16/9';
  onAspectChange: (a: '9/16' | '16/9') => void;
  projectName?: string;
}

export default function EditorHeader({ aspect, onAspectChange, projectName = 'Untitled video' }: EditorHeaderProps) {
  const navigate = useNavigate();
  return (
    <header className="h-14 shrink-0 flex items-center gap-3 px-4 border-b border-border/40 bg-background/95 backdrop-blur-md">
      <button onClick={() => navigate('/')} className="flex items-center gap-2 group">
        <span className="text-lg font-bold tracking-tight">
          <span className="gradient-vs-text">Vanilla</span>
          <span className="text-foreground">Sky</span>
        </span>
      </button>
      <div className="hidden md:flex items-center gap-2 ml-2 pl-3 border-l border-border/40 min-w-0">
        <span className="text-xs text-muted-foreground truncate">{projectName}</span>
      </div>
      <div className="flex-1" />
      <div className="hidden sm:flex items-center gap-1 p-1 rounded-xl bg-secondary/60">
        <button
          onClick={() => onAspectChange('9/16')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
            aspect === '9/16' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" /> 9:16
        </button>
        <button
          onClick={() => onAspectChange('16/9')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
            aspect === '16/9' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <RectangleHorizontal className="w-3.5 h-3.5" /> 16:9
        </button>
      </div>
      <ExportButton />
    </header>
  );
}
