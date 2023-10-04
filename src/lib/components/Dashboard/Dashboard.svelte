<script>
	import ButtonLarge from '$lib/components/ButtonLarge.svelte';
	import FilterButton from '$lib/components/dashboard/FilterButton.svelte';
	import SearchBar from '$lib/components/dashboard/SearchBar.svelte';
</script>

<div class="dashboard">
	<h1>License <br /> manager</h1>
	<SearchBar />
	<h2>Filter</h2>
	<FilterButton />
	<FilterButton />
	<FilterButton />
	<FilterButton />
	<FilterButton />
	<ButtonLarge />
</div>

<style>
	.dashboard {
		display: flex;
		flex-direction: column;
		padding: 0.4rem 2rem;
		border: 1px solid black;
		width: 16rem;
		height: 38rem;
		margin-right: 3rem;
		margin-top: 3.6rem;
	}
</style>
