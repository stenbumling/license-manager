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
		/* min-height: 35.3rem; */
		/* max-height: calc(100vh - 10.6rem); */
		/* max-width: 100%; */
		width: 70%;
		display: flex;
		flex-direction: column;
		flex-grow: 1;
	}

	/* @media (max-height: 850px) {
		.table-container {
			max-height: calc(100vh - 7.2rem);
		}
	} */
</style>
