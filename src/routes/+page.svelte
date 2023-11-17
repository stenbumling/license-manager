<script lang="ts">
	import Dashboard from '$lib/components/dashboard/Dashboard.svelte';
	import LicenseModal from '$lib/components/license/LicenseModal.svelte';
	import TableContainer from '$lib/components/table/TableContainer.svelte';
	import { showLicenseModal } from '$lib/stores/modal-store';
</script>

<div class="main-container">
	<Dashboard />
	<TableContainer />

	{#if $showLicenseModal}
		<LicenseModal />
	{/if}
</div>

<style>
	.main-container {
		display: flex;
		flex-direction: row;
		width: 100%;
		max-width: 120rem;
		padding: 3rem 3rem;
	}

	@media (max-height: 850px) {
		.main-container {
			padding: 1rem 3rem;
		}
	}
</style>
