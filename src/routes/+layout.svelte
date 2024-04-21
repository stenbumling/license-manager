<script lang="ts">
	import NotificationsContainer from '$lib/components/misc/NotificationsContainer.svelte';
	import PageHeader from '$lib/components/misc/PageHeader.svelte';
	import { modal } from '$lib/stores/modal-store';
	import { notifications } from '$lib/stores/notification-store';
	import { table } from '$lib/stores/resources/table-store';
	import '$lib/styles/app.css';
	import '$lib/styles/vars.css';
	import { onMount } from 'svelte';

	onMount(async () => {
		await modal.handleBrowserHistoryChange();
	});

	let offlineNotificationId: string;

	function handleOffline() {
		offlineNotificationId = notifications.add({
			message:
				'You have lost connection to the network. Please check your internet connection and try again!',
			type: 'warning',
			timeout: false,
			dismissable: false,
		});
	}

	async function handleOnline() {
		notifications.dismiss(offlineNotificationId);
		notifications.add({
			message: 'You are back online!',
			type: 'success',
			timeout: 5000,
			dismissable: true,
		});
		await table.updateState();
	}
</script>

<svelte:window
	on:popstate={async () => await modal.handleBrowserHistoryChange()}
	on:offline={handleOffline}
	on:online={handleOnline}
/>

<PageHeader />
<main>
	<slot />
</main>

<NotificationsContainer />

<style>
	main {
		max-height: calc(100vh - 4.65rem);
		display: flex;
		justify-content: center;
	}

	@media (max-height: 850px) {
		main {
			max-height: calc(100vh - 3.3rem);
		}
	}
</style>
