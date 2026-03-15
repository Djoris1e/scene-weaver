export type TextPosition = 'top' | 'center' | 'bottom';
export type TransitionType = 'fade' | 'slide' | 'zoom' | 'cut';
export type TextEffect = 'fade-in' | 'typewriter' | 'scale-up';

export interface TextColorPairing {
  id: string;
  label: string;
  text: string;
  shadow: string;
}

export const TEXT_COLOR_PAIRINGS: TextColorPairing[] = [
  { id: 'white', label: 'White', text: '#FFFFFF', shadow: '0 2px 8px rgba(0,0,0,0.8)' },
  { id: 'cream', label: 'Cream', text: '#FDF6E3', shadow: '0 2px 8px rgba(0,0,0,0.6)' },
  { id: 'neon-blue', label: 'Neon', text: '#60A5FA', shadow: '0 0 20px rgba(96,165,250,0.5)' },
  { id: 'coral', label: 'Coral', text: '#FB7185', shadow: '0 0 16px rgba(251,113,133,0.4)' },
  { id: 'mint', label: 'Mint', text: '#6EE7B7', shadow: '0 0 16px rgba(110,231,183,0.4)' },
  { id: 'gold', label: 'Gold', text: '#FCD34D', shadow: '0 2px 8px rgba(0,0,0,0.6)' },
  { id: 'lavender', label: 'Lavender', text: '#C4B5FD', shadow: '0 0 16px rgba(196,181,253,0.4)' },
  { id: 'dark', label: 'Dark', text: '#1E1E2E', shadow: '0 0 0 2px rgba(255,255,255,0.3)' },
];

export const FONT_OPTIONS = [
  { id: 'sans', label: 'Clean', family: "'Space Grotesk', sans-serif" },
  { id: 'display', label: 'Elegant', family: "'Playfair Display', serif" },
  { id: 'body', label: 'Modern', family: "'Inter', sans-serif" },
  { id: 'mono', label: 'Code', family: "'JetBrains Mono', monospace" },
];

export interface Scene {
  id: string;
  text: string;
  textPosition: TextPosition;
  textColorId: string;
  fontId: string;
  backgroundUrl: string | null;
  transition: TransitionType;
  textEffect: TextEffect;
}

export const createDefaultScene = (): Scene => ({
  id: crypto.randomUUID(),
  text: '',
  textPosition: 'center',
  textColorId: 'white',
  fontId: 'sans',
  backgroundUrl: null,
  transition: 'fade',
  textEffect: 'fade-in',
});
