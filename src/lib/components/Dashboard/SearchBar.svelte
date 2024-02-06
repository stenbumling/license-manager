<script lang="ts">
	import { filterState, searchQuery, table } from '$lib/stores/table-store';
	import {
		searchQueryValidationError,
		validateSearchQuery,
	} from '$lib/validations/search-query-validation';
	import Search from 'carbon-icons-svelte/lib/Search.svelte';

	let inputField: HTMLInputElement;

	async function handleSearch(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			const isValid = await validateSearchQuery($searchQuery);
			if (isValid) {
				if ($searchQuery === '') {
					table.filterBy('All');
				} else {
					table.filterBy('Search');
				}
			}
			inputField.blur();
		}
	}
	$: isError = $searchQueryValidationError.length > 0;
	$: isActiveSearch = $filterState === 'Search';
</script>

<input
	bind:value={$searchQuery}
	bind:this={inputField}
	type="search"
	class={`search-field ${isError ? 'error' : ''} ${isActiveSearch ? 'active' : ''}`}
	placeholder="Search"
	maxlength=50
	on:keydown={handleSearch}
/>
<div class="search-icon">
	<Search size={20} fill="black" aria-label="Search" />
</div>

<style>
	.search-icon {
		position: relative;
		top: -35px;
		left: 14px;
		width: 20px;
	}

	.search-field {
		width: 100%;
		min-height: 3rem;
		padding-left: 50px;
		border: none;
		border-bottom: 1px solid var(--text-placeholder);
		box-sizing: border-box;
		font-family: 'FK Grotesk Regular', Arial, Helvetica, sans-serif;
		background-color: transparent;
	}

	input[type='search']::-webkit-search-cancel-button,
	input[type='search']::-webkit-search-decoration,
	input[type='search']::-webkit-search-results-button,
	input[type='search']::-webkit-search-results-decoration {
		-webkit-appearance: none;
		appearance: none;
	}

	.active {
		border-bottom: 2px solid var(--light-purple);
		padding: 0 0 0px 50px;
	}

	.error {
		border-bottom: 2px solid red;
		padding: 0 0 0px 50px;
	}

	.error:hover {
		border: 2px solid red;
		border-bottom: 2px solid red;
		padding: 0 0 1px 48px;
	}

	.error:focus {
		border: 2px solid red;
		border-bottom: 2px solid red;
		padding: 0 0 1px 48px;
	}

	input:hover {
		padding: 0 0 1px 49px;
		border: 1px dashed black;
	}

	input:focus {
		border: 2px solid var(--light-purple);
		outline: none;
		padding: 0 0 1px 48px;
	}
</style>
