<script>
	import Dashboard from '$lib/components/dashboard/Dashboard.svelte';
	import TableContainer from '$lib/components/table/TableContainer.svelte';
</script>

<div class="main-container">
	<Dashboard />
	<TableContainer />
</div>

<style>
	.main-container {
		display: flex;
		flex-direction: row;
		width: 100%;
		max-width: 120rem;
		padding: 3rem 3rem;
	}

	@media (max-height: 820px) {
		.main-container {
			padding: 1rem 3rem;
		}
	}
</style>
