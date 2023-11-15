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
	const { subscribe, set, update } = writable<Notification[]>([]);

	function addNotification(notification: NewNotification) {
		const id = uuidv4();
		const newNotification: Notification = {
			id,
			message: notification.message || 'Default toast message',
			type: notification.type || 'info',
			dismissible: notification.dismissible === undefined ? true : notification.dismissible,
			timeout: notification.timeout === undefined ? 5000 : notification.timeout,
		};

		update((all) => [newNotification, ...all]);
		console.log(newNotification.timeout);
		console.log(newNotification.dismissible);
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
