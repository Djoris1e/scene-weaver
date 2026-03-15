import { useState, useCallback } from 'react';
import { Scene, createDefaultScene } from '@/types/scene';

export interface BrandKit {
  bgColor: string;
  accentColor: string;
  logoUrl: string | null;
  slogan: string;
}

export function useSceneStore() {
  const [scenes, setScenes] = useState<Scene[]>([
    { ...createDefaultScene(), text: 'Your story begins.', startTime: 0, endTime: 2.3 },
  ]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [brandKit, setBrandKit] = useState<BrandKit>({
    bgColor: '#E8724A',
    accentColor: '#E91E8C',
    logoUrl: null,
    slogan: '',
  });
  const [endScreen, setEndScreen] = useState({
    enabled: true,
    duration: 3,
  });

  const activeScene = scenes[activeIndex] || scenes[0];

  const addScene = useCallback(() => {
    if (scenes.length >= 10) return;
    const lastScene = scenes[scenes.length - 1];
    const newStart = lastScene ? lastScene.endTime : 0;
    const newScene = { ...createDefaultScene(), startTime: newStart, endTime: newStart + 2.2 };
    setScenes(prev => [...prev, newScene]);
    setActiveIndex(scenes.length);
  }, [scenes]);

  const deleteScene = useCallback((index: number) => {
    if (scenes.length <= 1) return;
    setScenes(prev => prev.filter((_, i) => i !== index));
    setActiveIndex(prev => Math.min(prev, scenes.length - 2));
  }, [scenes.length]);

  const updateScene = useCallback((index: number, updates: Partial<Scene>) => {
    setScenes(prev => prev.map((s, i) => i === index ? { ...s, ...updates } : s));
  }, []);

  const reorderScenes = useCallback((from: number, to: number) => {
    setScenes(prev => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
    setActiveIndex(to);
  }, []);

  const totalDuration = scenes.reduce((sum, s) => sum + (s.endTime - s.startTime), 0);

  return {
    scenes, activeIndex, activeScene, totalDuration,
    setActiveIndex, addScene, deleteScene, updateScene, reorderScenes,
    brandKit, setBrandKit,
    endScreen, setEndScreen,
  };
}
