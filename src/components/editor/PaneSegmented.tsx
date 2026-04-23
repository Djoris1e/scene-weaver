import React from 'react';

interface SegItem<T extends string> {
  id: T;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
}

interface PaneSegmentedProps<T extends string> {
  items: SegItem<T>[];
  active: T;
  onChange: (id: T) => void;
  size?: 'sm' | 'md';
  fullWidth?: boolean;
}

export default function PaneSegmented<T extends string>({
  items, active, onChange, size = 'md', fullWidth = false,
}: PaneSegmentedProps<T>) {
  const padY = size === 'sm' ? 'py-1' : 'py-1.5';
  const padX = size === 'sm' ? 'px-2.5' : 'px-3';
  const text = size === 'sm' ? 'text-[11px]' : 'text-xs';
  return (
    <div className={`inline-flex items-center gap-1 p-1 rounded-xl bg-secondary/60 ${fullWidth ? 'w-full' : ''}`}>
      {items.map(it => {
        const isActive = it.id === active;
        return (
          <button
            key={it.id}
            onClick={() => onChange(it.id)}
            className={`${fullWidth ? 'flex-1 justify-center' : ''} flex items-center gap-1.5 ${padX} ${padY} rounded-lg ${text} font-semibold transition-all whitespace-nowrap ${
              isActive
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {it.icon}
            <span>{it.label}</span>
            {it.badge !== undefined && (
              <span className={`ml-0.5 px-1.5 rounded-md text-[10px] ${isActive ? 'bg-secondary text-foreground' : 'bg-background/40 text-muted-foreground'}`}>
                {it.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
