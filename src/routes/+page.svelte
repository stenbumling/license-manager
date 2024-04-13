<script lang="ts">
	import { page } from '$app/stores';
	import Dashboard from '$lib/components/dashboard/Dashboard.svelte';
	import LicenseModal from '$lib/components/license/LicenseModal.svelte';
	import TableContainer from '$lib/components/table/TableContainer.svelte';
	import { modal, showLicenseModal } from '$lib/stores/modal-store';
	import { request, tableFetchRequest } from '$lib/stores/request-state-store';
	import { applicationStore } from '$lib/stores/resources/application-store.js';
	import { licenseCounts, licenseStore } from '$lib/stores/resources/license-store.js';
	import { userStore } from '$lib/stores/resources/user-store.js';
	import { onMount } from 'svelte';

	export let data;

	onMount(async () => {
		if (data.error) {
			console.error(`${data.error.code}: ${data.error.message}`);
		} else {
			request.startLoading(tableFetchRequest, 200);

			// Set the initial data in the stores
			licenseStore.set(data.licenses);
			applicationStore.set(data.applications);
			userStore.set(data.users);
			licenseCounts.set(data.counts);

			request.endLoading(tableFetchRequest);

			// Open the license modal if the URL contains a license ID
			if ($page.url.searchParams.has('id')) {
				modal.openLicense();
			}
		}
	});
</script>

<div class="app-container">
	<Dashboard />
	<TableContainer />

	{#if $showLicenseModal}
		<LicenseModal />
	{/if}
</div>

<style>
	.app-container {
		display: flex;
		flex-direction: row;
		width: 100%;
		max-width: 120rem;
		padding: 3rem 3rem;
	}

	@media (max-height: 850px) {
		.app-container {
			padding: 1.5rem 3rem;
		}
	}
</style>
