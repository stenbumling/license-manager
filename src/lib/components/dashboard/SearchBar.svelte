<script lang="ts">
	import CloseButton from '$lib/components/misc/buttons/CloseButton.svelte';
	import { filterState, searchQuery, table } from '$lib/stores/resources/table-store';
	import {
		searchQueryValidationError,
		validateSearchQuery,
	} from '$lib/validations/search-query-validation';
	import Search from 'carbon-icons-svelte/lib/Search.svelte';

	async function handleSearchQuery() {
		const isValid = await validateSearchQuery($searchQuery);
		if (isValid) {
			if ($searchQuery === '') {
				table.filterBy('All');
			} else {
				table.filterBy('Search');
			}
		}
	}

	$: isError = $searchQueryValidationError.length > 0;
	$: isActiveSearch = $filterState === 'Search';
</script>

<div class="search-bar-container">
	<input
		bind:value={$searchQuery}
		type="search"
		class={`${isError ? 'error' : ''} ${isActiveSearch ? 'active-search-query' : ''}`}
		placeholder="Search for licenses"
		maxlength="70"
		on:keydown={(e) => {
			if (e.key === 'Enter') handleSearchQuery();
		}}
	/>
	{#if isActiveSearch}
		<div class="clear-button-container">
			<CloseButton action={() => table.resetState()} color="black" />
		</div>
	{:else if isError}
		<div class="clear-button-container">
			<CloseButton action={() => table.resetState()} color="black" />
		</div>
	{:else}
		<div class="search-button-container">
			<div
				role="button"
				tabindex="0"
				on:click|preventDefault={handleSearchQuery}
				on:keydown={(e) => {
					if (e.key === 'Enter') handleSearchQuery();
				}}
				class="search-button"
			>
				<Search size={20} fill="black" aria-label="Search" />
			</div>
		</div>
	{/if}
</div>

<style>
	.search-bar-container {
		position: relative;
		width: 100%;
	}

	input {
		width: 100%;
		min-height: 3.3rem;
		padding-right: 50px;
		padding-left: 18px;
		border: 1px solid black;
		font-family: 'FK Grotesk Regular', Arial, Helvetica, sans-serif;
	}

	input:hover {
		border: 1px dashed black;
		padding-left: 18px;
		border-radius: 0;
	}

	input:focus {
		border: 2px solid var(--color-light-purple);
		border-radius: 5px;
		padding-left: 17px;
	}

	.active-search-query {
		border: 2px solid var(--color-light-purple);
		border-radius: 5px;
		padding-left: 17px;
	}

	.active-search-query:focus {
		border: 2px solid var(--color-light-purple);
		border-radius: 5px;
		padding-left: 17px;
	}

	.error {
		border: 2px solid var(--color-alert-dark);
		border-radius: 5px;
		padding-left: 17px;
	}

	.error:focus {
		border: 2px solid var(--color-alert-dark);
		border-radius: 5px;
		padding-left: 17px;
	}

	.search-button-container {
		position: absolute;
		top: 50%;
		right: 14px;
		transform: translateY(-50%);
	}

	.search-button {
		color: black;
		display: flex;
		transition: background-color 0.2s ease;
		padding: 0.325rem;
		border-radius: 6px;
		cursor: pointer;
	}

	.search-button:hover {
		background-color: rgba(0, 0, 0, 0.1);
	}

	.search-button:active {
		position: relative;
		top: 1px;
		left: 1px;
	}

	.clear-button-container {
		position: absolute;
		top: 50%;
		right: 14px;
		transform: translateY(-50%);
	}
</style>
