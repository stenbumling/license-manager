<script lang="ts">
	import { clickOutside } from '$lib/actions/clickOutside';
	import { getElementRect } from '$lib/actions/getElementRect';
	import { contextMenu } from '$lib/stores/context-menu-store';
	import type { ComponentType } from 'svelte';
	import { style } from 'svelte-body';
	import { fly } from 'svelte/transition';

	export let items: {
		label: string;
		action: () => void;
		icon?: ComponentType;
		classes?: string;
	}[] = [];

	export let referenceElementRect: DOMRect;
	let contextMenuRect: DOMRect;

	function renderContextMenu(node: DOMRect) {
		contextMenuRect = node;
		contextMenu.setPosition(referenceElementRect, contextMenuRect);
	}
</script>

<svelte:body use:style={$contextMenu.activeId ? 'pointer-events: none' : ''} />

<div
	role="menu"
	tabindex="0"
	class="context-menu"
	use:getElementRect={renderContextMenu}
	use:clickOutside={() => contextMenu.close()}
	on:click|stopPropagation
	on:keydown|stopPropagation
	in:fly={{
		duration: 180,
		y: '-15%',
	}}
	style="top: {$contextMenu.position ? $contextMenu.position.top + 'px' : 'auto'}; 
    left: {$contextMenu.position ? $contextMenu.position.left + 'px' : 'auto'};"
>
	<ul>
		{#each items as item}
			<li
				role="menuitem"
				class={item.classes}
				on:click|stopPropagation={() => item.action()}
				on:keydown
			>
				{#if item.icon}
					<div class="context-menu-item-icon">
						<svelte:component this={item.icon} size={16} />
					</div>
				{/if}
				<span>{item.label}</span>
			</li>
		{/each}
	</ul>
</div>

<style>
	.context-menu {
		position: fixed;
		background: white;
		border: 1px solid #ccc;
		border-radius: 4px;
		padding: 0.5rem;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
		z-index: 100000;
		pointer-events: auto;
		width: 14rem;
	}

	.context-menu ul {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.context-menu li {
		padding: 0.5rem 1rem;
		cursor: pointer;
		border-radius: 6px;
		transition: background-color 0.2s ease;
		user-select: none;
		display: flex;
		align-items: center;
	}

	.context-menu li:hover {
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

	.alert-text {
		color: #ff0000;
	}

	.warning-text {
		color: #ff9736;
	}
</style>
