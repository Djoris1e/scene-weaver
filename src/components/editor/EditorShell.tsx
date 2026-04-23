import { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { MessageSquare, Play } from 'lucide-react';
import EditorHeader from './EditorHeader';
import PaneSegmented from './PaneSegmented';

interface EditorShellProps {
  chat: React.ReactNode;
  preview: React.ReactNode;
}

export default function EditorShell({ chat, preview }: EditorShellProps) {
  const isMobile = useIsMobile();
  const [aspect, setAspect] = useState<'9/16' | '16/9'>('9/16');
  const [mobilePane, setMobilePane] = useState<'chat' | 'preview'>('preview');

  return (
    <div className="h-screen w-full flex flex-col bg-background overflow-hidden">
      <EditorHeader aspect={aspect} onAspectChange={setAspect} />

      {isMobile ? (
        <>
          <div className="shrink-0 px-3 py-2 border-b border-border/40 bg-background/95 backdrop-blur-md">
            <PaneSegmented
              fullWidth
              items={[
                { id: 'chat', label: 'Chat', icon: <MessageSquare className="w-3.5 h-3.5" /> },
                { id: 'preview', label: 'Preview', icon: <Play className="w-3.5 h-3.5" /> },
              ]}
              active={mobilePane}
              onChange={setMobilePane}
            />
          </div>
          <div className="flex-1 min-h-0">
            <div className="h-full" style={{ display: mobilePane === 'chat' ? 'block' : 'none' }}>
              {chat}
            </div>
            <div className="h-full" style={{ display: mobilePane === 'preview' ? 'block' : 'none' }}>
              {preview}
            </div>
          </div>
        </>
      ) : (
        <div className="flex-1 min-h-0">
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={32} minSize={24} maxSize={48} className="min-w-[340px]">
              {chat}
            </ResizablePanel>
            <ResizableHandle className="bg-border/40 hover:bg-primary/40 transition-colors w-px" />
            <ResizablePanel defaultSize={68} minSize={40}>
              {preview}
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      )}

      {/* Re-expose aspect via context-free prop drilling: stash on data attr for the preview pane */}
      <span className="hidden" data-aspect={aspect} />
    </div>
  );
}
