<script lang="ts">
	import Table from '$lib/components/table/Table.svelte';
	import TableHeader from '$lib/components/table/TableHeader.svelte';
</script>

<div role="table" class="table-container">
	<TableHeader />
	<Table />
</div>

<style>
	.table-container {
		width: 70%;
		display: flex;
		flex-direction: column;
		flex-grow: 1;
	}
</style>
