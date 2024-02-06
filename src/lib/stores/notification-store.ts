import { writable } from 'svelte/store';
import { v4 as uuidv4 } from 'uuid';

/*
 * This store is used to manage notifications that are displayed to the user.
 * The container for all pushed notifications is placed inside the
 * root +layout.svelte page.
 */

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
		const maxMessageLength = 80;

		const defaultNotification = {
			message: 'Default toast message',
			type: 'info',
			dismissible: true,
			timeout: 5000,
		};

		// Truncate the message if it's longer than the value of maxMessageLength
		const truncatedMessage =
			notification.message.length > maxMessageLength
				? notification.message.slice(0, maxMessageLength) + '...'
				: notification.message;

		// The new notification will overwrite the default properties if they are provided, but will keep the default if not.
		const newNotification = {
			id,
			...defaultNotification,
			...notification,
			message: truncatedMessage,
		};

		// Add the new notification to the beginning of the array
		update((all) => [newNotification, ...all]);
		if (newNotification.timeout) {
			setTimeout(() => dismissNotification(id), newNotification.timeout);
		}
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
