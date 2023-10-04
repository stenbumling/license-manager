<script>
	import Table from '$lib/components/table/Table.svelte';
	import TableHeader from '$lib/components/table/TableHeader.svelte';
</script>

<div class="table-container">
	<TableHeader />
	<Table />
</div>

<style>
	.table-container {
		display: flex;
		flex-direction: column;
		flex-grow: 1;
		min-height: 100%;
	}
</style>
