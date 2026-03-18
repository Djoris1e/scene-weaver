export type TextPosition = 'top' | 'center' | 'bottom';
export type TransitionType = 'default' | 'crossfade' | 'zoom-in' | 'flash' | 'slide';
export type TextEffect = 'default' | 'fade-in' | 'typewriter' | 'scale-up';
export type AnimationType = 'none' | 'ken-burns' | 'drift' | 'pulse';
export type OverlayType = 'vignette' | 'film-grain' | 'rgb-split';
export type AssetType = 'media' | 'gradient' | 'counter';
export type TemplateType = 'gradient-text' | 'fullscreen' | 'counter' | 'social-proof' | 'product-launch' | 'end-screen';

export interface SocialProofConfig {
  quote: string;
  authorName: string;
  authorRole: string;
  starRating: number;
}

export interface ProductLaunchConfig {
  headline: string;
  subheadline: string;
  ctaText: string;
}

export const TEMPLATE_OPTIONS: { value: TemplateType; label: string; description: string }[] = [
  { value: 'gradient-text', label: 'Gradient Text', description: 'Bold text over a gradient background.' },
  { value: 'fullscreen', label: 'Fullscreen', description: 'Full-bleed media with text overlay.' },
  { value: 'counter', label: 'Counter', description: 'Animated number with label and unit.' },
  { value: 'social-proof', label: 'Social Proof', description: 'Testimonial or review card with a quote, author name, and star rating.' },
  { value: 'product-launch', label: 'Product Launch', description: 'Headline, subheadline, and call-to-action.' },
  { value: 'end-screen', label: 'End Screen', description: 'Closing card with logo and slogan.' },
];

export interface GradientConfig {
  style: string;
  bgColor: string;
  fillColor: string;
  complexity: number;
  contrast: number;
  size: number;
  speed: number;
  variant: 'solid' | 'outline';
}

export interface CounterConfig {
  number: number;
  label: string;
  unit: string;
}

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

export const GRADIENT_STYLES = [
  { id: 'blob', label: 'Blob', preview: 'radial-gradient(circle at 30% 50%, #E8724A 0%, #E91E8C 100%)' },
  { id: 'wave', label: 'Wave', preview: 'linear-gradient(135deg, #E8724A 0%, #E91E8C 50%, #E8724A 100%)' },
  { id: 'blur-gradient', label: 'Blur Gradient', preview: 'radial-gradient(ellipse at 70% 30%, #E91E8C 0%, #E8724A 100%)' },
  { id: 'circle-scatter', label: 'Circle Scatter', preview: 'radial-gradient(circle at 20% 80%, #E8724A 0%, transparent 50%), radial-gradient(circle at 80% 20%, #E91E8C 0%, transparent 50%), #2a1a1a' },
  { id: 'blob-scene', label: 'Blob Scene', preview: 'radial-gradient(circle at 60% 60%, #E91E8C 0%, #E8724A 60%, #2a1a1a 100%)' },
  { id: 'layered', label: 'Layered', preview: 'linear-gradient(180deg, #E8724A 0%, #E91E8C 50%, #2a1a1a 100%)' },
  { id: 'stacked-waves', label: 'Stacked Waves', preview: 'linear-gradient(160deg, #E91E8C 0%, #E8724A 100%)' },
  { id: 'blob-scatter', label: 'Blob Scatter', preview: 'radial-gradient(circle at 40% 40%, #E8724A 0%, transparent 40%), radial-gradient(circle at 70% 70%, #E91E8C 0%, transparent 40%), #1a1018' },
  { id: 'polygon-scatter', label: 'Polygon Scatter', preview: 'conic-gradient(from 45deg, #E8724A, #E91E8C, #E8724A)' },
  { id: 'symbol-scatter', label: 'Symbol Scatter', preview: 'linear-gradient(45deg, #E91E8C 0%, #E8724A 100%)' },
  { id: 'radial-gradient', label: 'Radial Gradient', preview: 'radial-gradient(circle, #E91E8C 0%, #E8724A 50%, #1a1018 100%)' },
  { id: 'mesh-gradient', label: 'Mesh Gradient', preview: 'linear-gradient(135deg, #E8724A 0%, #E91E8C 33%, #E8724A 66%, #E91E8C 100%)' },
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
  animation: AnimationType;
  overlays: OverlayType[];
  assetType: AssetType;
  gradient: GradientConfig;
  counter: CounterConfig;
  startTime: number;
  endTime: number;
}

export const createDefaultScene = (): Scene => ({
  id: crypto.randomUUID(),
  text: '',
  textPosition: 'center',
  textColorId: 'white',
  fontId: 'sans',
  backgroundUrl: null,
  transition: 'default',
  textEffect: 'default',
  animation: 'none',
  overlays: [],
  assetType: 'gradient',
  gradient: {
    style: 'blob',
    bgColor: '#E8724A',
    fillColor: '#E91E8C',
    complexity: 50,
    contrast: 50,
    size: 50,
    speed: 25,
    variant: 'solid',
  },
  counter: {
    number: 0,
    label: 'Label',
    unit: '',
  },
  startTime: 0,
  endTime: 3,
});
