<script lang="ts">
	import FilterButton from '$lib/components/dashboard/FilterButton.svelte';
	import SearchBar from '$lib/components/dashboard/SearchBar.svelte';
	import ButtonLarge from '$lib/components/misc/buttons/ButtonLarge.svelte';
	import { licenseCounts } from '$lib/stores/license-store';
	import { modal } from '$lib/stores/modal-store';

	function handleClick(e: MouseEvent | KeyboardEvent) {
		if (e.metaKey || e.ctrlKey) {
			return;
		}
		e.preventDefault();
		modal.openLicense('add');
	}

	$: filters = [
		{
			title: 'All',
			amount: $licenseCounts.all,
			color: 'var(--filter-blue)',
		},
		{
			title: 'In use',
			amount: $licenseCounts.inUse,
			color: 'var(--filter-green)',
		},
		{
			title: 'Unassigned',
			amount: $licenseCounts.unassigned,
			color: 'var(--filter-yellow)',
		},
		{
			title: 'Near expiration',
			amount: $licenseCounts.nearExpiration,
			color: 'var(--warning)',
		},
		{
			title: 'Expired',
			amount: $licenseCounts.expired,
			color: 'var(--alert)',
		},
	];
</script>

<div class="dashboard-container">
	<div class="dashboard">
		<h1>License <br /> manager</h1>
		<SearchBar />
		<h2>Filter</h2>
		<div class="filter-list">
			{#each filters as filter}
				<FilterButton {filter} />
			{/each}
		</div>
		<a href="?modal=add" on:click={handleClick}>
			<ButtonLarge title="Add new license" />
		</a>
	</div>
</div>

<style>
	.dashboard-container {
		min-width: 28rem;
		display: flex;
		align-items: flex-start;
		flex-direction: column;
	}

	.dashboard {
		margin-right: 3rem;
		margin-top: 2.69rem;
		padding: 0.4rem 2rem 2rem 2rem;
		border: 1px solid black;
		display: flex;
		flex-direction: column;
		overflow-y: auto;
		width: 75%;
	}

	.filter-list {
		margin-bottom: 2rem;
		margin-top: 0.5rem;
		display: grid;
		grid-template-columns: 1fr;
		grid-gap: 0.3rem;
	}

	@media (max-height: 850px) {
		.filter-list {
			grid-template-columns: 1fr 1fr;
		}

		.filter-list > :global(:nth-child(1)) {
			grid-column: 1 / 3;
		}
	}
</style>
