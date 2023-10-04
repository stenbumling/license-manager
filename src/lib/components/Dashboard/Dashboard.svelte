<script>
	import ButtonLarge from '$lib/components/ButtonLarge.svelte';
	import FilterButton from '$lib/components/dashboard/FilterButton.svelte';
	import SearchBar from '$lib/components/dashboard/SearchBar.svelte';
</script>

<div class="dashboard">
	<h1>License <br /> manager</h1>
	<SearchBar />
	<h2>Filter</h2>
	<div class="filter-buttons">
		<FilterButton />
		<FilterButton />
		<FilterButton />
		<FilterButton />
		<FilterButton />
	</div>
	<ButtonLarge />
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

	.filter-buttons {
		display: grid;
		grid-template-columns: 1fr;
		grid-gap: 0.3rem;
	}

	@media (max-height: 800px) {
		.dashboard {
			height: 30.4rem;
		}
		.filter-buttons {
			grid-template-columns: 1fr 1fr;
		}

		.filter-buttons > :global(:nth-child(1)) {
			grid-column: 1 / 3;
		}
	}
</style>
