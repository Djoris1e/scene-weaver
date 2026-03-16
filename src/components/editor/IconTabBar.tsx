import React from 'react';

interface Tab {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface IconTabBarProps {
  tabs: Tab[];
  active: string;
  onChange: (id: string) => void;
}

export default function IconTabBar({ tabs, active, onChange }: IconTabBarProps) {
  return (
    <div className="flex items-end justify-center gap-6 pt-2 pb-1 border-b border-border/50">
      {tabs.map(t => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className={`flex flex-col items-center gap-1 pb-2 px-2 relative transition-colors
            ${active === t.id ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
        >
          {t.icon}
          <span className="text-[11px] font-medium">{t.label}</span>
          {active === t.id && (
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
          )}
        </button>
      ))}
    </div>
  );
}
