import type { License } from './license-store';
import { writable } from 'svelte/store';

export const activeFilter = writable('All');
export const activeSort = writable('Name');
export const tableData = writable<License[]>([]);
