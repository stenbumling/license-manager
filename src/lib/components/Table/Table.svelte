<script lang="ts">
	import LicenseRow from '$lib/components/table/LicenseRow.svelte';
	import { licenseStore } from '$lib/stores/license-store.ts';
	import { tableFetchRequest } from '$lib/stores/request-state-store';
	import { Circle } from 'svelte-loading-spinners';
	import { fade, slide } from 'svelte/transition';
</script>

<div class="table-body-wrapper">
	{#if $tableFetchRequest.isLoading && !($tableFetchRequest.error.code === 418)}
		<div class="fallback-container" in:fade={{ duration: 300 }}>
			<Circle color="var(--deep-purple)" />
		</div>
	{:else if $tableFetchRequest.error.message}
		<div class="fallback-container" in:fade={{ duration: 300 }}>
			<h1>{$tableFetchRequest.error.message}</h1>
		</div>
	{:else if $licenseStore.length === 0 && !$tableFetchRequest.isLoading}
		<div class="fallback-container" in:fade={{ duration: 300 }}>
			<h1>No licenses found</h1>
		</div>
	{:else}
		<div role="rowgroup" in:slide={{ duration: 120 }}>
			{#each $licenseStore as license, index}
				<div transition:slide={{ duration: 120 }}>
					<LicenseRow {license} {index} />
				</div>
			{/each}
		</div>
	{/if}
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
</style>
