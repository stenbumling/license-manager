<script>
	import Dashboard from '$lib/components/dashboard/Dashboard.svelte';
	import Table from '$lib/components/table/Table.svelte';
</script>

<div class="main-container">
	<Dashboard />
	<Table />
</div>

<style>
	.main-container {
		display: flex;
		flex-direction: row;
	}
</style>
