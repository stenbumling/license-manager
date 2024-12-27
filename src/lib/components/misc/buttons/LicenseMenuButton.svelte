<script lang="ts">
	import { getElementRect } from '$lib/actions/getElementRect';
	import ContextMenu from '$lib/components/misc/ContextMenu.svelte';
	import { contextMenu } from '$lib/stores/context-menu-store';
	import { disableButtonsDuringRequests } from '$lib/stores/request-state-store';
	import type { ContextMenuItem } from '$lib/types/misc-types';
	import OverflowMenuHorizontal from 'carbon-icons-svelte/lib/OverflowMenuHorizontal.svelte';
	import { v4 as uuidv4 } from 'uuid';

	/*
	 * This component is a three-dots-button that opens a context menu when clicked.
	 * Every button recieves a unique id to avoid conflicts with other context menus.
	 * When clicked on, its position is tracked by getElementRect, and the context menu
	 * will be positioned accordingly. The items props is used to pass menu items to the
	 * context menu.
	 */

	let menuButtonRect: DOMRect;
	const menuId = uuidv4();

	export let items: ContextMenuItem[];

	function openContextMenu(element: HTMLElement) {
		getElementRect(element, (rect) => {
			menuButtonRect = rect;
		});
		contextMenu.open(menuId);
	}
</script>

<div class="menu-button-container">
	<button
		tabindex="0"
		class="menu-button"
		class:active={$contextMenu.activeId === menuId}
		class:disabled={$disableButtonsDuringRequests}
		on:click|stopPropagation|preventDefault={(e) => {
			openContextMenu(e.currentTarget);
		}}
		on:keydown|stopPropagation={(e) => {
			if (e.key === 'Enter') {
				openContextMenu(e.currentTarget);
			}
		}}
	>
		<OverflowMenuHorizontal size={32} />
	</button>

	{#if $contextMenu.activeId === menuId}
		<ContextMenu {items} bind:referenceElementRect={menuButtonRect} />
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
		background-color: rgba(0, 0, 0, 0.05);
	}

	.menu-button:active {
		position: relative;
		top: 1px;
		left: 1px;
	}

	.menu-button.active {
		background-color: rgba(0, 0, 0, 0.1);
	}

	.disabled {
		pointer-events: none;
		opacity: 0.5;

		&:hover {
			background-color: transparent;
		}
	}
</style>
