<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Header from '$lib/components/misc/Header.svelte';
	import NotificationsContainer from '$lib/components/misc/NotificationsContainer.svelte';
	import { applicationStore } from '$lib/stores/application-store';
	import { licenseCounts, licenseStore } from '$lib/stores/license-store';
	import { modal } from '$lib/stores/modal-store';
	import { request, tableFetchRequest } from '$lib/stores/request-state-store';
	import { userStore } from '$lib/stores/user-store';
	import '$lib/styles/app.css';
	import '$lib/styles/vars.css';
	import { onMount } from 'svelte';

	export let data;

	onMount(async () => {
		if (data.error) {
			console.error(`${data.error.code}: ${data.error.message}`);
		} else {
			// Set the initial data in the stores
			request.startLoading(tableFetchRequest, 200);
			licenseStore.set(data.licenses);
			applicationStore.set(data.applications);
			userStore.set(data.users);
			licenseCounts.set(data.counts);
			request.endLoading(tableFetchRequest);

			// Open the license modal if the URL contains a license ID
			if ($page.url.searchParams.has('id')) {
				modal.openLicense();
			} else {
				await goto('/');
			}
		}
	});
</script>

<Header />

{#if data.error}
	<main class="fallback-container">
		<h1 style="font-size: 5rem">{data.error.code}</h1>
		<h1>{data.error.message}</h1>
	</main>
{:else}
	<main>
		<slot />
	</main>
{/if}

<NotificationsContainer />

<style>
	main {
		max-height: calc(100vh - 4.65rem);
		display: flex;
		justify-content: center;
	}

	.fallback-container {
		align-items: center;
		flex-grow: 1;
		flex-direction: column;
	}

	@media (max-height: 850px) {
		main {
			max-height: calc(100vh - 3.3rem);
		}
	}
</style>
