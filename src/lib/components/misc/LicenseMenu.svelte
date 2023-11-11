<script lang="ts">
	import { getElementRect } from '$lib/actions/getElementRect';
	import ContextMenu from '$lib/components/misc/ContextMenu.svelte';
	import type { ContextMenuItem } from '$lib/stores/context-menu-store';
	import { contextMenu } from '$lib/stores/context-menu-store';
	import OverflowMenuHorizontal from 'carbon-icons-svelte/lib/OverflowMenuHorizontal.svelte';
	import { v4 as uuidv4 } from 'uuid';

	let menuButtonRect: DOMRect;
	const menuId = uuidv4();

	export let items: ContextMenuItem[];
</script>

<div class="menu-button-container">
	<button
		tabindex="0"
		class="menu-button"
		class:active={$contextMenu.activeId === menuId}
		on:click|stopPropagation|preventDefault={() => {
			contextMenu.open(menuId);
		}}
		on:keydown|stopPropagation={(e) => {
			if (e.key === 'Enter') {
				contextMenu.open(menuId);
			} else if (e.key === 'Escape') {
				contextMenu.close();
			}
		}}
		use:getElementRect={(element) => (menuButtonRect = element)}
	>
		<OverflowMenuHorizontal size={32} />
	</button>
	{#if $contextMenu.activeId === menuId}
		<ContextMenu bind:referenceElementRect={menuButtonRect} {items} />
	{/if}
</div>

<style>
	.menu-button-container {
		justify-content: space-between;
		position: relative;
	}

	.menu-button {
		display: flex;
		align-items: center;
		justify-content: center;
		transition: color 0.25s ease;
		transition: background-color 0.2s ease;
		border-radius: 6px;
		cursor: pointer;
		margin: 0 1.3rem;
	}

	.menu-button:hover {
		background-color: #eeeeee;
	}

	.menu-button.active {
		background-color: #dddddd;
	}
</style>
