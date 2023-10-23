<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Dashboard from '$lib/components/dashboard/Dashboard.svelte';
	import Modal from '$lib/components/license/Modal.svelte';
	import TableContainer from '$lib/components/table/TableContainer.svelte';
	import { showLicenseModal } from '$lib/stores/modal-state';
	import { onMount } from 'svelte';

	onMount(() => {
		goto('/');
	});

	$: if ($page.url.search === '') {
		showLicenseModal.set(false);
	} else {
		showLicenseModal.set(true);
	}
</script>

<div class="main-container">
	<Dashboard />
	<TableContainer />

	{#if $showLicenseModal}
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
