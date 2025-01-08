<script lang="ts">
	import FilterButton from '$lib/components/dashboard/FilterButton.svelte';
	import SearchBar from '$lib/components/dashboard/SearchBar.svelte';
	import PrimaryButton from '$lib/components/misc/buttons/PrimaryButton.svelte';
	import { modal } from '$lib/stores/modal-store';
	import { licenseCounts, licenseStore } from '$lib/stores/resources/license-store';
	import type { DashboardFilter } from '$lib/types/misc-types';
	import { onMount } from 'svelte';

	function handleOpenAddLicenseModal(e: MouseEvent | KeyboardEvent) {
		if (e.metaKey || e.ctrlKey) {
			return;
		}
		e.preventDefault();
		modal.openAddLicense();
	}

	let filters: DashboardFilter[];
	$: filters = [
		{
			title: 'All',
			amount: $licenseCounts.all,
			color: '#b6e0ff',
		},
		{
			title: 'In use',
			amount: $licenseCounts.inUse,
			color: '#a1e0ba',
		},
		{
			title: 'Unassigned',
			amount: $licenseCounts.unassigned,
			color: '#f3b3da',
		},
		{
			title: 'Inactive',
			amount: $licenseCounts.inactive,
			color: '#d4d4d4',
		},
		{
			title: 'Near expiration',
			amount: $licenseCounts.nearExpiration,
			color: 'var(--color-warning-light)',
		},
		{
			title: 'Expired',
			amount: $licenseCounts.expired,
			color: 'var(--color-alert-light)',
		},
	];

	onMount(async () => {
		await licenseStore.updateCounts();
	});
</script>

<div class="dashboard-container">
	<div class="dashboard">
		<h2>Search</h2>
		<SearchBar />
		<h2 style="margin-top:2rem;">Filter</h2>
		<div class="filter-list">
			{#each filters as filter}
				<FilterButton {filter} />
			{/each}
		</div>
		<PrimaryButton title="Add a new license" action={(e) => handleOpenAddLicenseModal(e)} />
	</div>
</div>

<style>
	.dashboard-container {
		min-width: 25rem;
		display: flex;
		align-items: flex-start;
		margin-right: 3rem;
	}

	.dashboard {
		margin-top: 2.8rem;
		padding: 2rem;
		border: 1px solid black;
		flex-grow: 1;
	}

	.filter-list {
		margin-bottom: 2rem;
		display: grid;
		grid-template-columns: 1fr;
		grid-gap: 0.3rem;
	}

	h2 {
		margin-bottom: 0.6rem;
		user-select: none;
	}

	@media (max-height: 850px) and (min-width: 1200px) {
		.filter-list {
			grid-template-columns: 1fr 1fr;
		}

		.filter-list > :global(:nth-child(1)) {
			grid-column: 1 / 3;
		}
	}

	@media (max-width: 1200px) {
		.dashboard-container {
			min-width: 20rem;
		}
	}
</style>
