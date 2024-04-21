<script lang="ts">
	import NotificationsContainer from '$lib/components/misc/NotificationsContainer.svelte';
	import PageHeader from '$lib/components/misc/PageHeader.svelte';
	import { modal } from '$lib/stores/modal-store';
	import { network } from '$lib/stores/network-store';
	import '$lib/styles/app.css';
	import '$lib/styles/vars.css';
	import { onMount } from 'svelte';

	onMount(async () => {
		await modal.handleBrowserHistoryChange();
	});
</script>

<svelte:window
	on:popstate={async () => await modal.handleBrowserHistoryChange()}
	on:offline={network.handleOffline}
	on:online={network.handleOnline}
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
