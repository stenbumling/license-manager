<script lang="ts">
	import Table from '$lib/components/table/Table.svelte';
	import TableHeader from '$lib/components/table/TableHeader.svelte';
	import { table } from '$lib/stores/resources/table-store';
	import { onMount } from 'svelte';

	onMount(async () => {
		await table.updateState();
	});
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
