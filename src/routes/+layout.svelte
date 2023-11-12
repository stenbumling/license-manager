<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Header from '$lib/components/misc/Header.svelte';
	import { applicationStore } from '$lib/stores/application-store';
	import { licenseCounts, licenseStore } from '$lib/stores/license-store';
	import { showLicenseModal } from '$lib/stores/modal-store.js';
	import { table } from '$lib/stores/table-store.js';
	import { userStore } from '$lib/stores/user-store';
	import '$lib/styles/app.css';
	import '$lib/styles/vars.css';
	import { validateLicenseId } from '$lib/utils/url-utils.js';
	import { onMount } from 'svelte';

	export let data;

	onMount(async () => {
		const modal = $page.url.searchParams.get('modal');
		const id = $page.url.searchParams.get('id');

		if (modal === 'add' || (modal === 'view' && id && validateLicenseId(id))) {
		} else {
			goto('/');
		}

		if (data.error) {
			console.log(data.error);
		} else {
			licenseStore.set(data.licenses);
			applicationStore.set(data.applications);
			userStore.set(data.users);
			licenseCounts.set(data.counts);
			table.updateState();
		}
	});

	$: if (
		$page.url.searchParams.get('modal') == 'add' ||
		($page.url.searchParams.get('modal') == 'view' && $page.url.searchParams.get('id'))
	) {
		showLicenseModal.set(true);
	} else {
		showLicenseModal.set(false);
	}
</script>

<header>
	<Header />
</header>

<main>
	<slot />
</main>

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
