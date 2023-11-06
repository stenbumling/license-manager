import { writable } from 'svelte/store';

export const contextMenuPosition = writable<{ top: number; left: number } | null>(null);
export const activeContextMenu = writable<string | null>(null);
