<script lang="ts">
	import { searchQuery, table } from '$lib/stores/table-store';
	import Search from 'carbon-icons-svelte/lib/Search.svelte';

	let inputField: HTMLInputElement;

	function handleSearch(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			table.applyFilter('Search', $searchQuery);
			inputField.blur();
		}
	}
</script>

<input
	bind:value={$searchQuery}
	bind:this={inputField}
	type="search"
	class="search-field"
	placeholder="Search"
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
		height: 3rem;
		padding-left: 50px;
		border: none;
		border-bottom: 1px solid var(--text-placeholder);
		box-sizing: border-box;
		font-family: 'FK Grotesk Regular', Arial, Helvetica, sans-serif;
		background-color: transparent;
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
