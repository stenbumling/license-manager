<script lang="ts">
	import TableLicenseRow from '$lib/components/table/TableLicenseRow.svelte';
	import { tableFetchRequest } from '$lib/stores/request-state-store';
	import { licenseStore } from '$lib/stores/resources/license-store';
	import { activeSearchQuery, filterState } from '$lib/stores/resources/table-store';
	import { Circle } from 'svelte-loading-spinners';
	import { fade, slide } from 'svelte/transition';

	$: isLoading = $tableFetchRequest.isLoading;
	$: hasError = $tableFetchRequest.error?.message && !isLoading;
	$: hasLicenses = $licenseStore.length > 0 && !isLoading;
	$: noResults = $licenseStore.length === 0 && !isLoading;
	$: isSearching = $filterState === 'Search' && !isLoading;
	$: isAllFilter = $filterState === 'All' && !isLoading;
</script>

<div class="table-body-wrapper">
	<!-- Loading -->
	{#if isLoading}
		<div class="fallback-container" in:fade={{ duration: 120 }}>
			<Circle color="var(--color-deep-purple)" />
		</div>

		<!-- Errors and no results -->
	{:else if hasError}
		<div class="fallback-container" in:fade={{ delay: 100, duration: 120 }}>
			<h1>{$tableFetchRequest.error?.message}</h1>
			{#if $tableFetchRequest.error?.details}
				<p>{$tableFetchRequest.error.details}</p>
			{/if}
		</div>
	{:else if noResults && isSearching}
		<div class="fallback-container" in:fade={{ delay: 100, duration: 120 }}>
			{#key $activeSearchQuery}
				<h1 in:fade={{ duration: 300 }}>
					Search for <span class="search-query-text">{$activeSearchQuery}</span> returned no results
				</h1>
			{/key}
		</div>
	{:else if noResults && isAllFilter}
		<div class="fallback-container" in:fade={{ delay: 100, duration: 120 }}>
			<h1>There are no licenses in the database</h1>
		</div>
	{:else if noResults && !isAllFilter}
		<div class="fallback-container" in:fade={{ delay: 100, duration: 120 }}>
			{#key $filterState}
				<h1 in:fade={{ delay: 100, duration: 120 }}>
					No licenses are {$filterState}
				</h1>
			{/key}
		</div>
	{/if}

	<!--  Render license rows -->
	{#if hasLicenses && !hasError}
		<div role="rowgroup" in:slide={{ duration: 120 }}>
			{#each $licenseStore as license, index}
				<div transition:slide={{ duration: 120 }}>
					<TableLicenseRow {license} {index} />
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
		min-width: 40rem;
	}

	.fallback-container {
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
		flex-direction: column;
		height: calc(100% - 4rem);
		padding: 2rem 2rem;
	}

	.search-query-text {
		color: var(--color-deep-purple);
		text-decoration: dotted underline 2px;
		text-underline-position: under;
	}

	h1 {
		line-height: 1.7;
		max-width: 40ch;
		word-wrap: break-word;
	}

	@media (max-width: 1600px) {
		h1 {
			max-width: 30ch;
		}
	}

	@media (max-width: 1250px) {
		h1 {
			max-width: 24ch;
		}
	}
</style>
