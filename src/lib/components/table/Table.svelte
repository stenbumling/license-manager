<script lang="ts">
	import LicenseRow from '$lib/components/table/LicenseRow.svelte';
	import { tableFetchRequest } from '$lib/stores/request-state-store';
	import { licenseStore } from '$lib/stores/resources/license-store';
	import { currentSearch, filterState } from '$lib/stores/resources/table-store';
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
			<Circle color="var(--deep-purple)" />
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
			{#key $currentSearch}
				<h1 in:fade={{ duration: 300 }}>
					Search for <span class="search-query-text">{$currentSearch}</span> returned no results
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
		flex-direction: column;
		height: 100%;

		& > * {
			max-width: 70%;
			line-height: 1.7;
			word-wrap: break-word;
		}
	}

	.search-query-text {
		color: var(--deep-purple);
	}

	@media (max-width: 1600px) {
		h1 {
			max-width: 30rem;
		}
	}
</style>
