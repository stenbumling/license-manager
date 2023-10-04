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
		height: 100%;
	}
</style>
