import { writable } from 'svelte/store';

export const showLicenseModal = writable(false);
export const showApplicationModal = writable(false);
export const licenseModalMode = writable<'add' | 'view'>('add');
