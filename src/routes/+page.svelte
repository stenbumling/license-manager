<script lang="ts">
	import { urlListener } from '$lib/actions/urlListener';
	import Dashboard from '$lib/components/dashboard/Dashboard.svelte';
	import LicenseModal from '$lib/components/license/LicenseModal.svelte';
	import TableContainer from '$lib/components/table/TableContainer.svelte';
	import { modal, showLicenseModal } from '$lib/stores/modal-store';
	import { onMount } from 'svelte';

	onMount(async () => {
		// Open the license modal if the URL contains a license ID
		await modal.handleBrowserHistoryChange();
	});
</script>

<div use:urlListener class="app-container">
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
