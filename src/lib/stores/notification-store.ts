import { writable } from 'svelte/store';
import { v4 as uuidv4 } from 'uuid';

interface NewNotification {
	message: string;
	type: 'success' | 'info' | 'warning' | 'alert';
	dismissible?: boolean;
	timeout?: number;
}

interface Notification extends NewNotification {
	id: string;
}

function createNotificationStore() {
	const { subscribe, update } = writable<Notification[]>([]);

	function addNotification(notification: NewNotification) {
		const id = uuidv4();

		const defaultNotification = {
			message: 'Default toast message',
			type: 'info',
			dismissible: true,
			timeout: 5000,
		};

		const newNotification = {
			id,
			...defaultNotification,
			...notification,
		};

		update((all) => [newNotification, ...all]);
		if (newNotification.timeout) setTimeout(() => dismissNotification(id), newNotification.timeout);
	}

	function dismissNotification(id: string) {
		update((all) => all.filter((t) => t.id !== id));
	}

	return {
		subscribe,
		add: addNotification,
		dismiss: dismissNotification,
	};
}

export const notifications = createNotificationStore();
