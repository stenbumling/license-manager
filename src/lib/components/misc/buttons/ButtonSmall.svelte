<script lang="ts">
	import type { ComponentType } from 'svelte';

	export let icon: ComponentType;
	export let iconSize: 16 | 20 | 24 | 32 | undefined = 20;
	export let action: (e?: MouseEvent | KeyboardEvent) => void;
</script>

<button class="small-button" on:click={action}>
	<svelte:component this={icon} size={iconSize} fill="white" />
</button>

<style>
	.small-button {
		min-width: 36px;
		width: 36px;
		max-width: 36px;
		aspect-ratio: 1/1;
		border-radius: 6px;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: black;
		cursor: pointer;
		transition: background-color 0.2s ease;
	}

	.small-button:hover {
		background-color: var(--deep-purple);
	}

	.small-button:active {
		position: relative;
		top: 1px;
		left: 1px;
	}
</style>
