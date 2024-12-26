<script lang="ts">
	import CloseFilled from 'carbon-icons-svelte/lib/CloseFilled.svelte';

	export let action: (e: MouseEvent | KeyboardEvent) => void;
	export let color: string = 'black';
	export let size: 16 | 20 | 24 | 32 | undefined = 16;
</script>

<button class="clear-button" style={`--focus-color: ${color};`} on:click|preventDefault={action}>
	<CloseFilled fill={color} {size} aria-label="Clear" />
</button>

<style>
	.clear-button {
		box-sizing: border-box;
		cursor: pointer;
		display: flex;
		height: 100%;
		align-items: center;
	}

	.clear-button:hover > :global(svg) {
		transition: fill 0.4s ease;
		opacity: 0.5;
	}

	.clear-button:active > :global(svg) {
		transform: scale(0.9);
	}

	.clear-button:focus-visible {
		box-shadow: 0 0 0 2px var(--focus-color);
		border-radius: 4px;
	}
</style>
