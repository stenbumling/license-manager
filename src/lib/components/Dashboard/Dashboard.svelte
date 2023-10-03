<script>
	import ButtonLarge from '$lib/components/ButtonLarge.svelte';
	import FilterList from '$lib/components/dashboard/FilterList.svelte';
</script>

<div class="dashboard">
	<h1>License <br /> manager</h1>
	<h2>Filter</h2>
	<FilterList />
	<ButtonLarge />
</div>

<style>
	.dashboard {
		display: flex;
		flex-direction: column;
		padding: 2rem;
		border: 1px solid black;
		width: 20rem;
		height: 37rem;
		margin-right: 3rem;
	}
</style>
