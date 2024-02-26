<script lang="ts">
	import { filterState, searchQuery, table } from '$lib/stores/resources/table-store';
	import { searchQueryValidationError } from '$lib/validations/search-query-validation';
	import { quintOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';

	export let filter: {
		title: string;
		amount: number;
		color: string;
	};

	function handleClick() {
		searchQuery.set('');
		searchQueryValidationError.set([]);
		table.filterBy(filter.title);
	}
</script>

<button
	class="filter-container"
	class:active={$filterState === filter.title}
	style:background-color={$filterState === filter.title ? filter.color : ''}
	on:click|preventDefault={handleClick}
>
	<div class="filter-content">
		<h4 class="filter-title">{filter.title}</h4>
		<h4 class="filter-amount-container">
			{#key filter.amount}
				<div in:fly={{ duration: 500, x: -20, easing: quintOut }} class="filter-amount">
					{filter.amount}
				</div>
			{/key}
		</h4>
	</div>
	<div
		class="filter-animated-hover"
		style:background={`linear-gradient(to right, ${filter.color} 100%, transparent 100%`}
	/>
</button>

<style>
	.filter-container {
		position: relative;
		height: 3.3rem;
		width: 100%;
		border: 1px solid black;
		display: flex;
		box-sizing: border-box;
		cursor: pointer;
		user-select: none;
	}

	.filter-container .filter-animated-hover {
		position: absolute;
		top: 0;
		left: 0;
		width: 0;
		height: 100%;
		transition: width 0.25s ease;
	}

	.filter-container:hover .filter-animated-hover {
		width: 100%;
	}

	.filter-content {
		z-index: 2;
		width: 100%;
		height: 100%;
		display: flex;
		align-content: space-between;
		justify-content: space-between;
	}

	.filter-title {
		max-width: 100%;
		margin: 0.5rem 0 0 0.8rem;
		align-self: flex-start;
		overflow-wrap: break-word;
		word-break: break-word;
		text-align: left;
	}

	.filter-amount-container {
		margin: 2.5rem 0.8rem 0.1rem 0;
		display: flex;
		align-self: flex-end;
		justify-content: flex-end;
		min-width: 3rem;
		font-size: 1.5rem;
		background-color: green;
	}

	.filter-amount {
		position: absolute;
		top: 17px;
	}

	button:active {
		position: relative;
		top: 1px;
		left: 1px;
	}
</style>
