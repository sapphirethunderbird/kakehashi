// src/lib/storage.ts
import { set, get } from 'idb-keyval';
import type { CanvasPath } from 'react-sketch-canvas';

const STORAGE_KEY = 'my-voice-sketch-paths';

export async function saveDrawing(paths: CanvasPath[]) {
  try {
    await set(STORAGE_KEY, paths);
  } catch (err) {
    console.error('Failed to save drawing:', err);
  }
}

export async function getSavedDrawing(): Promise<CanvasPath[] | undefined> {
  try {
    return await get(STORAGE_KEY);
  } catch (err) {
    console.error('Failed to load drawing:', err);
    return undefined;
  }
}