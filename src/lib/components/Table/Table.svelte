<script lang="ts">
	import LicenseRow from '$lib/components/table/LicenseRow.svelte';
	import { licenseStore } from '$lib/stores/license-store.ts';
	import { tableFetchRequest } from '$lib/stores/request-state-store';
	import { currentSearch, filterState } from '$lib/stores/table-store';
	import { Circle } from 'svelte-loading-spinners';
	import { fade, slide } from 'svelte/transition';

	$: isLoading = $tableFetchRequest.isLoading;
	$: hasError = $tableFetchRequest.error.message;
	$: hasLicenses = $licenseStore.length > 0;
	$: isSearching = $filterState === 'Search';
	$: isAllFilter = $filterState === 'All';
	$: noResults = $licenseStore.length === 0 && !isLoading;
	$: appIsLoading = isLoading && !($tableFetchRequest.error.code === 418);
</script>

<div class="table-body-wrapper">
	{#if appIsLoading}
		<div class="fallback-container" in:fade={{ duration: 300 }}>
			<Circle color="var(--deep-purple)" />
		</div>
	{:else if hasError}
		<div class="fallback-container" in:fade={{ duration: 300 }}>
			<h1>{$tableFetchRequest.error.message}</h1>
		</div>
	{:else if noResults && isSearching}
		<div class="fallback-container" in:fade={{ duration: 300 }}>
			{#key $currentSearch}
				<h1 in:fade={{ duration: 300 }}>
					Search for <span class="search-query-text">{$currentSearch}</span> returned no results
				</h1>
			{/key}
		</div>
	{:else if noResults && isAllFilter}
		<div class="fallback-container" in:fade={{ duration: 300 }}>
			<h1>There are no licenses in the database</h1>
		</div>
	{:else if noResults && !isAllFilter}
		<div class="fallback-container" in:fade={{ duration: 300 }}>
			{#key $filterState}
				<h1 in:fade={{ duration: 300 }}>
					No licenses are {$filterState}
				</h1>
			{/key}
		</div>
	{/if}
	{#if hasLicenses}
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
		text-align: center;
		height: 100%;

		& > h1 {
			max-width: 80%;
			line-height: 1.7;
			word-wrap: break-word;
		}
	}

	.search-query-text {
		color: var(--deep-purple);
	}
</style>
