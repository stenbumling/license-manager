<script lang="ts">
	import { isRequestActive } from '$lib/stores/request-state-store';
	import CloseLarge from 'carbon-icons-svelte/lib/CloseLarge.svelte';

	export let action: (e: MouseEvent | KeyboardEvent) => void;
	export let color: string = 'black';
	export let parentType: 'notification' | 'modal' = 'modal';

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			action(e);
		}
	}
</script>

<div
	role="button"
	tabindex="0"
	class:disabled={$isRequestActive && parentType === 'modal'}
	class="close-button"
	on:click|preventDefault={action}
	on:keydown={handleKeyDown}
>
	<CloseLarge size={24} fill={color} aria-label="Close" />
</div>

<style>
	.close-button {
		padding: 0.2rem;
		border-radius: 6px;
		display: flex;
		align-self: flex-start;
		font-size: 1rem;
		text-decoration: none;
		color: black;
		transition: color 0.25s ease;
		transition: background-color 0.2s ease;
		cursor: pointer;
	}

	.close-button:hover {
		background-color: rgba(0, 0, 0, 0.1);
	}

	.close-button:active {
		position: relative;
		top: 1px;
		left: 1px;
	}

	.disabled {
		pointer-events: none;
		opacity: 0.5;

		&:hover {
			background-color: transparent;
		}

		&:active {
			position: relative;
			top: 0;
			left: 0;
		}
	}
</style>
