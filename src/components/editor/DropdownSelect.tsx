import { ChevronDown } from 'lucide-react';

interface DropdownSelectProps<T extends string> {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}

export default function DropdownSelect<T extends string>({ label, value, options, onChange }: DropdownSelectProps<T>) {
  return (
    <div className="space-y-1.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="relative">
        <select
          value={value}
          onChange={e => onChange(e.target.value as T)}
          className="w-full appearance-none bg-secondary border border-border rounded-xl px-4 py-3 text-sm font-medium text-foreground cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary/30"
        >
          {options.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
      </div>
    </div>
  );
}
