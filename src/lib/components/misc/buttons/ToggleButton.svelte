<script lang="ts">
	import { disableButtonsDuringRequests } from '$lib/stores/request-state-store';
	import type { ToggleButtonItem } from '$lib/types/misc-types';

	export let items: ToggleButtonItem[];
	export let index: number = 0;

	function toggleItem() {
		items[index].action();
		index = (index + 1) % items.length;
	}
</script>

<button
	class="icon-button"
	class:active={items[index].class === 'active'}
	disabled={$disableButtonsDuringRequests}
	on:click={toggleItem}
>
	{#if items[index].icon}
		<div class="icon">
			<svelte:component this={items[index].icon} size={20} fill="white" />
		</div>
	{/if}
	<span class="text">{items[index].label}</span>
</button>

<style>
	.icon-button {
		display: flex;
		height: 80%;
		align-items: center;
		background-color: black;
		border-radius: 6px;
		cursor: pointer;
		padding: 8px 16px;
		transition: background-color 0.2s ease;
	}

	.icon-button:hover {
		background-color: var(--deep-purple);
	}

	.icon-button:active {
		position: relative;
		top: 1px;
		left: 1px;
	}

	.icon-button:disabled {
		pointer-events: none;
		opacity: 0.5;
	}

	.icon {
		display: flex;
		margin-right: 8px;
	}

	.active {
		background-color: var(--deep-purple);
	}

	.text {
		color: white;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		flex-grow: 1;
	}
</style>
