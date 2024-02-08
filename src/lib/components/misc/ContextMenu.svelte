<script lang="ts">
	import { clickOutside } from '$lib/actions/clickOutside';
	import { focusTrap } from '$lib/actions/focusTrap';
	import { getElementRect } from '$lib/actions/getElementRect';
	import type { ContextMenuItem } from '$lib/stores/context-menu-store';
	import { contextMenu } from '$lib/stores/context-menu-store';
	import { style } from 'svelte-body';
	import { fly } from 'svelte/transition';

	/*
	 * This component is a context menu that is used together with the LicenseMenuButton component.
	 */

	export let items: ContextMenuItem[];
	export let referenceElementRect: DOMRect;

	// This function is used to dynamically position the context menu according to the reference element (menu button)
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
	use:focusTrap
	use:getElementRect={renderContextMenu}
	use:clickOutside={() => contextMenu.close()}
	on:keydown|stopPropagation={(e) => {
		if (e.key === 'Escape') {
			contextMenu.close();
		}
	}}
	in:fly={{
		duration: 180,
		y: '-15%',
	}}
	style:top={$contextMenu.position ? `${$contextMenu.position.top}px` : 'auto'}
	style:left={$contextMenu.position ? `${$contextMenu.position.left}px` : 'auto'}
>
	<ul>
		{#each items as item}
			<li
				role="menuitem"
				tabindex="0"
				class={item.class}
				on:click|stopPropagation={() => item.action()}
				on:keydown|stopPropagation={(e) => {
					if (e.key === 'Enter') {
						item.action();
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
		background: white;
		border: 1px solid #ccc;
		border-radius: 4px;
		padding: 0.5rem;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
		z-index: 10000;
		pointer-events: auto;
	}

	li {
		padding: 0.5rem 2rem 0.5rem 1rem;
		height: 2rem;
		cursor: pointer;
		border-radius: 6px;
		transition: background-color 0.2s ease;
		user-select: none;
		display: flex;
		align-items: center;
	}

	li:hover {
		background-color: #eeeeee;
	}

	.context-menu-item-icon {
		box-sizing: border-box;
		display: flex;
		height: 100%;
		align-items: center;
		margin-right: 0.6rem;
		margin-bottom: 2px;
	}

	.alert {
		color: #ff0000;
	}

	.warning {
		color: #ff9736;
	}
</style>
