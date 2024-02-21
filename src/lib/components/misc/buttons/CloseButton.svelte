<script lang="ts">
	import CloseLarge from 'carbon-icons-svelte/lib/CloseLarge.svelte';

	export let action: (e: MouseEvent | KeyboardEvent) => void;
	export let color: string = 'black';
</script>

<div
	role="button"
	tabindex="0"
	class="close-button"
	on:click|preventDefault={action}
	on:keydown={(e) => {
		if (e.key === 'Enter') {
			action(e);
		}
	}}
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
</style>
