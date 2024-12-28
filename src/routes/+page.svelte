<script lang="ts">
	import Dashboard from '$lib/components/dashboard/Dashboard.svelte';
	import LicenseModal from '$lib/components/license-management/LicenseModal.svelte';
	import TableContainer from '$lib/components/table/TableContainer.svelte';
	import { showLicenseModal } from '$lib/stores/modal-store';
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
		width: 100%;
		max-width: 100rem;
		padding: 3rem 3rem;
		overflow-x: auto;
	}

	@media (max-height: 850px) {
		.app-container {
			padding: 1.5rem 3rem;
		}
	}
</style>
