<script lang="ts">
	import { disableButtonsDuringRequests } from '$lib/stores/request-state-store';
	import type { ComponentType } from 'svelte';

	export let icon: ComponentType;
	export let iconSize: 16 | 20 | 24 | 32 | undefined = 20;
	export let action: (e?: MouseEvent | KeyboardEvent) => void;
</script>

<button class="icon-button" disabled={$disableButtonsDuringRequests} on:click={action}>
	<svelte:component this={icon} size={iconSize} fill="white" />
</button>

<style>
	.icon-button {
		min-width: 36px;
		width: 36px;
		max-width: 36px;
		aspect-ratio: 1/1;
		border-radius: 6px;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: var(--color-deep-black);
		cursor: pointer;
		transition: background-color 0.2s ease;
	}

	.icon-button:hover {
		background-color: var(--color-deep-purple);
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
</style>
