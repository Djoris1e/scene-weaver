import { useState, useCallback } from 'react';
import { Scene, createDefaultScene } from '@/types/scene';

export function useSceneStore() {
  const [scenes, setScenes] = useState<Scene[]>([createDefaultScene()]);
  const [activeIndex, setActiveIndex] = useState(0);

  const activeScene = scenes[activeIndex] || scenes[0];

  const addScene = useCallback(() => {
    if (scenes.length >= 10) return;
    const newScene = createDefaultScene();
    setScenes(prev => [...prev, newScene]);
    setActiveIndex(scenes.length);
  }, [scenes.length]);

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

  return {
    scenes, activeIndex, activeScene,
    setActiveIndex, addScene, deleteScene, updateScene, reorderScenes,
  };
}
