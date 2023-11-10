<script lang="ts">
	import LicenseRow from '$lib/components/table/LicenseRow.svelte';
	import { appLoad } from '$lib/stores/app-load-store';
	import { tableState } from '$lib/stores/table-store';
	import { Circle } from 'svelte-loading-spinners';

	let hoveredRowId: string | null = null;

	// Decides which row should create a hovered effect, based on license ID
	function handleHover(e: CustomEvent<any>, licenseId: string) {
		if (e.detail.hovered) {
			hoveredRowId = licenseId;
		} else {
			if (hoveredRowId === licenseId) {
				hoveredRowId = null;
			}
		}
	}
</script>

<tbody class="table">
	{#await $appLoad}
		<div class="loading"><Circle color="var(--deep-purple)" /></div>
	{:then}
		{#if $tableState.length === 0}
			<p>No licenses found</p>
		{:else}
			{#each $tableState as license}
				<div class="license-row" class:hovered={hoveredRowId === license.id}>
					<LicenseRow {license} on:hover={(event) => handleHover(event, license.id)} />
				</div>
			{/each}
		{/if}
	{:catch}
		<p>aaa</p>
	{/await}
</tbody>

<style>
	.table {
		min-height: 30.4rem;
		max-height: 100%;
		display: flex;
		flex-direction: column;
		flex-grow: 1;
		overflow-y: scroll;
	}

	.loading {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
	}

	.license-row {
		transition: background-color 0.1s ease;
	}

	.license-row:nth-child(even) {
		background-color: #f9f9f9;
	}

	.license-row.hovered {
		background-color: #eeeeee;
		transition: background-color 0.1s ease;
		cursor: pointer;
	}
</style>
