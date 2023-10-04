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
		border-bottom: 2px solid black;
		min-height: 34.8rem;
		max-height: calc(100vh - 10.7rem);
	}

	@media (max-height: 850px) {
		.table-container {
			max-height: calc(100vh - 7.2rem);
		}
	}
</style>
