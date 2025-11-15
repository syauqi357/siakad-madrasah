import { writable, type Writable } from 'svelte/store';

export const sidebarOpen: Writable<boolean> = writable(true);
export const activeMenu: Writable<string> = writable('dashboard');
export const isMobile: Writable<boolean> = writable(false);
export const userMenuOpen: Writable<boolean> = writable(false);