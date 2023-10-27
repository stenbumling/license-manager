<script lang="ts">
	import Table from '$lib/components/table/Table.svelte';
	import TableHeader from '$lib/components/table/TableHeader.svelte';
</script>

<table class="table-container">
	<TableHeader />
	<Table />
</table>

<style>
	.table-container {
		min-height: 34.8rem;
		max-height: calc(100vh - 10.7rem);
		max-width: 100%;
		border-bottom: 2px solid black;
		width: 70%;
		display: flex;
		flex-direction: column;
		flex-grow: 1;
	}

	@media (max-height: 850px) {
		.table-container {
			max-height: calc(100vh - 7.2rem);
		}
	}
</style>
