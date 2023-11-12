<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Dashboard from '$lib/components/dashboard/Dashboard.svelte';
	import LicenseModal from '$lib/components/license/LicenseModal.svelte';
	import TableContainer from '$lib/components/table/TableContainer.svelte';
	import { showLicenseModal } from '$lib/stores/modal-state';
	import { validateLicenseId } from '$lib/utils/uuid-utils';
	import { onMount } from 'svelte';

	onMount(() => {
		const urlParams = new URLSearchParams($page.url.search);
		const modal = urlParams.get('modal');
		const id = urlParams.get('id');

		if (modal === 'add') {
		} else if (modal === 'view' && id && validateLicenseId(id)) {
		} else {
			goto('/');
		}
	});

	$: if (
		$page.url.search.startsWith('?modal=add') ||
		($page.url.search.startsWith('?modal=view') && $page.url.search.includes('&id='))
	) {
		showLicenseModal.set(true);
	} else {
		showLicenseModal.set(false);
	}
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
