import { writable } from 'svelte/store';

interface Notification {
	message?: string;
	id?: number;
	type?: string;
	dismissible?: boolean;
	timeout?: number;
}

export const notifications = writable<Notification[]>([]);
export const addNotification = (notification: Notification) => {
	const id = Math.floor(Math.random() * 10000);

	const defaults = {
		id,
		type: 'info',
		dismissible: true,
		timeout: 5000,
	};

	notifications.update((all) => [{ ...defaults, ...notification }, ...all]);

	if (notification.timeout) setTimeout(() => dismissNotification(id), notification.timeout);
};

export const dismissNotification = (id: number) => {
	notifications.update((all) => all.filter((t) => t.id !== id));
};
