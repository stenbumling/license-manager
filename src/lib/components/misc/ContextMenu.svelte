<script lang="ts">
	import { clickOutside } from '$lib/actions/clickOutside';
	import { focusTrap } from '$lib/actions/focusTrap';
	import { getElementRect } from '$lib/actions/getElementRect';
	import { contextMenu } from '$lib/stores/context-menu-store';
	import { isOnline } from '$lib/stores/network-store';
	import type { ContextMenuItem } from '$lib/types/misc-types';
	import { style } from 'svelte-body';
	import { fly } from 'svelte/transition';

	export let items: ContextMenuItem[];
	export let referenceElementRect: DOMRect;

	function renderContextMenu(contextMenuRect: DOMRect) {
		contextMenu.setPosition(referenceElementRect, contextMenuRect);
	}
</script>

<!-- This disables pointer events outside the context menu when the menu is open -->
<svelte:body use:style={$contextMenu.activeId ? 'pointer-events: none' : ''} />

<div
	role="menu"
	tabindex="-1"
	class="context-menu"
	use:clickOutside={() => contextMenu.close()}
	use:focusTrap
	use:getElementRect={renderContextMenu}
	in:fly={{
		duration: 180,
		y: '-15%',
	}}
	style:top={$contextMenu.position ? `${$contextMenu.position.adjustedTop}px` : 'auto'}
	style:left={$contextMenu.position ? `${$contextMenu.position.adjustedLeft}px` : 'auto'}
>
	<ul>
		{#each items as item}
			<li
				role="menuitem"
				tabindex="0"
				class={item.class}
				class:disabled={item.class === 'alert' && !$isOnline}
				on:click|stopPropagation={() => item.action()}
				on:keydown|stopPropagation={(e) => {
					if (e.key === 'Enter') {
						item.action();
					} else if (e.key === 'Escape') {
						contextMenu.close();
					}
				}}
			>
				{#if item.icon}
					<div class="context-menu-item-icon">
						<svelte:component this={item.icon} size={16} />
					</div>
				{/if}
				<span class="context-menu-item-label">{item.label}</span>
			</li>
		{/each}
	</ul>
</div>

<style>
	ul {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.context-menu {
		position: fixed;
		background: var(--color-white);
		border: 1px solid #ccc;
		border-radius: 4px;
		padding: 0.5rem;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
		z-index: 10000;
		pointer-events: auto;
	}

	ul {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
	}

	li {
		padding: 0.3rem 2rem 0.3rem 1rem;
		height: 2rem;
		cursor: pointer;
		border-radius: 6px;
		transition: background-color 0.2s ease;
		user-select: none;
		display: flex;
		align-items: center;
	}

	li:hover {
		background-color: rgba(0, 0, 0, 0.05);
	}

	li:active {
		position: relative;
		top: 1px;
		left: 1px;
	}

	.context-menu-item-icon {
		display: flex;
		height: 100%;
		align-items: center;
		margin-right: 0.6rem;
		margin-bottom: 2px;
	}

	.alert {
		color: #ff0000;
	}

	.alert:hover {
		color: var(--color-white);
		background-color: var(--color-alert-dark);
	}

	.warning:hover {
		color: var(--color-black);
		background-color: var(--color-warning-light);
	}

	.disabled {
		pointer-events: none;
		color: var(--color-disabled);
	}
</style>
