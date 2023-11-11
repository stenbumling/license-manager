<script lang="ts">
	import LicenseRow from '$lib/components/table/LicenseRow.svelte';
	import { appLoad } from '$lib/stores/app-load-store';
	import { tableState } from '$lib/stores/table-store';
	import { Circle } from 'svelte-loading-spinners';

	console.log($appLoad);
</script>

<div class="table-body-wrapper">
	{#await $appLoad}
		<div class="fallback-container">
			<Circle color="var(--deep-purple)" />
		</div>
	{:then}
		{#if $tableState.length === 0}
			<div class="fallback-container">
				<h1>No licenses found</h1>
			</div>
		{:else}
			<div role="rowgroup">
				{#each $tableState as license}
					<LicenseRow {license} />
				{/each}
			</div>
		{/if}
	{:catch}
		<div class="fallback-container">
			<h1>I AM ERROR</h1>
		</div>
	{/await}
</div>

<style>
	.table-body-wrapper {
		border-bottom: 2px solid black;
		border-top: 2px solid black;
		flex-grow: 1;
		overflow-y: scroll;
	}

	.fallback-container {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
	}

	:global(.license-row-container):nth-child(even) {
		background-color: #f9f9f9;
	}
</style>
