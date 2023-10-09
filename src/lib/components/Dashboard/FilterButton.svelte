<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	export let title: string = 'Filter';
	export let amount: number = 0;
	export let color: string = 'var(--filter-blue)';
	export let isActive: boolean = false;

	const dispatch = createEventDispatcher();

	function handleClick() {
		dispatch('filterclicked', { title });
	}
</script>

<button
	style={isActive ? `background-color: ${color};` : ''}
	class="filter-container {isActive ? 'active' : ''}"
	on:click={handleClick}
>
	<div class="filter-content">
		<h4 class="filter-title">{title}</h4>
		<h4 class="filter-amount">{amount}</h4>
	</div>
	<div
		class="filter-animated-hover"
		style="background: linear-gradient(to right, {color} 50%, transparent 50%);"
	/>
</button>

<style>
	.filter-container {
		cursor: pointer;
		display: flex;
		border: 1px solid black;
		box-sizing: border-box;
		height: 3.3rem;
		width: 100%;
		position: relative;
		user-select: none;
	}

	.filter-container .filter-animated-hover {
		position: absolute;
		top: 0;
		left: 0;
		width: 0;
		height: 100%;
		transition: width 0.15s ease;
	}

	.filter-container:hover .filter-animated-hover {
		width: 200%;
	}

	.filter-content {
		display: flex;
		width: 100%;
		height: 100%;
		align-content: space-between;
		justify-content: space-between;
		z-index: 2;
	}

	.filter-title {
		margin: 0.5rem 0 0 0.8rem;
		align-self: flex-start;
		word-break: break-word;
		overflow-wrap: break-word;
		max-width: 100%;
		text-align: left;
	}

	.filter-amount {
		display: flex;
		align-self: flex-end;
		font-size: 1.5rem;
		margin-top: 2.5rem;
		margin: 0 0.8rem 0.1rem 0;
	}

	button:active {
		transform: scale(0.96);
	}
</style>
