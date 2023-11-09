<script lang="ts">
	import { goto } from '$app/navigation';
	import FilterButton from '$lib/components/dashboard/FilterButton.svelte';
	import SearchBar from '$lib/components/dashboard/SearchBar.svelte';
	import ButtonLarge from '$lib/components/misc/ButtonLarge.svelte';
	import { licenseCounts } from '$lib/stores/license-store';

	function handleClick(e: MouseEvent | KeyboardEvent) {
		if (e.metaKey || e.ctrlKey) {
			return;
		}
		e.preventDefault();
		goto('/?modal=add');
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
		<ButtonLarge title="Add new license"/>
	</a>
</div>

<style>
	.dashboard {
		width: 20rem;
		height: auto;
		margin-right: 3rem;
		margin-top: 2.79rem;
		padding: 0.4rem 2rem 2rem 2rem;
		border: 1px solid black;
		display: flex;
		flex-direction: column;
		overflow-y: auto;
	}

	.filter-list {
		margin-bottom: 2rem;
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
