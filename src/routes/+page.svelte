<script lang="ts">
	import Dashboard from '$lib/components/dashboard/Dashboard.svelte';
	import TableContainer from '$lib/components/table/TableContainer.svelte';
	import Modal from '$lib/components/license/Modal.svelte';
	import { showModal } from '$lib/stores/modal.ts';
</script>

<div class="main-container">
	<Dashboard />
	<TableContainer />

	{#if $showModal}
		<Modal />
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
