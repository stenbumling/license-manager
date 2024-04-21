import { writable } from 'svelte/store';
import { notifications } from '$lib/stores/notification-store';
import { table } from '$lib/stores/resources/table-store';

export const isOnline = writable(true);

function createNetworkController() {
  let offlineNotificationId: string;

  function handleOffline() {
		isOnline.set(false);
		offlineNotificationId = notifications.add({
			message:
				'You have lost connection to the network. Please check your internet connection and try again!',
			type: 'warning',
			timeout: false,
			dismissable: false,
		});
	}

  async function handleOnline() {
		isOnline.set(true);
		notifications.dismiss(offlineNotificationId);
		notifications.add({
			message: 'You are back online!',
			type: 'success',
			timeout: 5000,
			dismissable: true,
		});
		await table.updateState();
	}

  return {
    handleOffline,
    handleOnline,
  };
}

export const network = createNetworkController();