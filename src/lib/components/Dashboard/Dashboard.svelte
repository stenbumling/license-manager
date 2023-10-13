<script lang="ts">
	import { goto } from '$app/navigation';
	import ButtonLarge from '$lib/components/ButtonLarge.svelte';
	import FilterButton from '$lib/components/dashboard/FilterButton.svelte';
	import SearchBar from '$lib/components/dashboard/SearchBar.svelte';
	import { activeFilter } from '$lib/stores/filter.ts';
	import { showModal } from '$lib/stores/modal.ts';

	function handleClick(e: MouseEvent | KeyboardEvent) {
		if (e.metaKey || e.ctrlKey) {
			return;
		}

		e.preventDefault();
		goto('/?modal=license/add-new');
		showModal.set(true);
	}
</script>

<div class="dashboard">
	<h1>License <br /> manager</h1>
	<SearchBar />
	<h2>Filter</h2>
	<div class="filter-list">
		<FilterButton
			title="All"
			amount={0}
			color="var(--filter-blue)"
			on:filterclicked={(e) => activeFilter.set(e.detail.title)}
			isActive={$activeFilter === 'All'}
		/>
		<FilterButton
			title="In use"
			amount={23}
			color="var(--filter-green)"
			on:filterclicked={(e) => activeFilter.set(e.detail.title)}
			isActive={$activeFilter === 'In use'}
		/>
		<FilterButton
			title="Unassigned"
			amount={32}
			color="var(--filter-yellow)"
			on:filterclicked={(e) => activeFilter.set(e.detail.title)}
			isActive={$activeFilter === 'Unassigned'}
		/>
		<FilterButton
			title="Near expiration"
			amount={99}
			color="var(--warning)"
			on:filterclicked={(e) => activeFilter.set(e.detail.title)}
			isActive={$activeFilter === 'Near expiration'}
		/>
		<FilterButton
			title="Expired"
			amount={31}
			color="var(--alert)"
			on:filterclicked={(e) => activeFilter.set(e.detail.title)}
			isActive={$activeFilter === 'Expired'}
		/>
	</div>
	<a href="/license/add-new" on:click={handleClick}>
		<ButtonLarge title="Add new license" />
	</a>
</div>

<style>
	.dashboard {
		display: flex;
		flex-direction: column;
		padding: 0.4rem 2rem;
		border: 1px solid black;
		width: 20rem;
		height: 37.7rem;
		margin-right: 3rem;
		margin-top: 3.6rem;
	}

	.filter-list {
		display: grid;
		grid-template-columns: 1fr;
		grid-gap: 0.3rem;
		margin-bottom: 2rem;
	}

	@media (max-height: 850px) {
		.dashboard {
			height: 30.4rem;
		}
		.filter-list {
			grid-template-columns: 1fr 1fr;
		}

		.filter-list > :global(:nth-child(1)) {
			grid-column: 1 / 3;
		}
	}
</style>
