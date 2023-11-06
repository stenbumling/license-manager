<script lang="ts">
	import { goto } from '$app/navigation';
	import { clickOutside } from '$lib/actions/clickOutside';
	import { getElementRect } from '$lib/actions/getElementRect';
	import { activeContextMenu, contextMenuPosition } from '$lib/stores/context-menu-store';
	import { licenseStore, type License } from '$lib/stores/license-store';
	import Copy from 'carbon-icons-svelte/lib/Copy.svelte';
	import CopyLink from 'carbon-icons-svelte/lib/CopyLink.svelte';
	import TrashCan from 'carbon-icons-svelte/lib/TrashCan.svelte';
	import ViewFilled from 'carbon-icons-svelte/lib/ViewFilled.svelte';
	import { fly } from 'svelte/transition';

	export let license: License;
	export let referenceElementRect: DOMRect;
	let contextMenuRect: DOMRect;

	function renderContextMenu(node: DOMRect) {
		contextMenuRect = node;

		let newPosition = {
			top:
				referenceElementRect.bottom > window.innerHeight - contextMenuRect.height
					? referenceElementRect.bottom - contextMenuRect.height
					: referenceElementRect.top,
			left: referenceElementRect.left - contextMenuRect.width - 10,
		};

		contextMenuPosition.set(newPosition);
	}

	function closeMenu() {
		if ($activeContextMenu === license.id) {
			activeContextMenu.set(null);
		}
	}

	function handleView(license: License, e: MouseEvent | KeyboardEvent) {
		activeContextMenu.set(null);
		e.stopPropagation();
		if (e.metaKey || e.ctrlKey) {
			return;
		}
		e.preventDefault();
		goto(`/?modal=edit&id=${license.id}`);
	}

	function handleCopyLink() {
		activeContextMenu.set(null);
		navigator.clipboard.writeText(`${window.location.origin}/license/view/${license.id}`);
	}

	function handleDelete() {
		activeContextMenu.set(null);
		licenseStore.delete(license.id);
	}
</script>

<div
	role="menu"
	tabindex="0"
	class="context-menu"
	use:getElementRect={renderContextMenu}
	use:clickOutside={closeMenu}
	on:click|stopPropagation
	on:keydown|stopPropagation
	in:fly={{
		duration: 180,
		// y: $contextMenuPosition === 'bottom' ? '15%' : '-15%',
	}}
	style="top: {$contextMenuPosition ? $contextMenuPosition.top + 'px' : 'auto'}; 
    left: {$contextMenuPosition ? $contextMenuPosition.left + 'px' : 'auto'};"
>
	<ul>
		<li role="menuitem" on:click|stopPropagation={(e) => handleView(license, e)} on:keydown>
			<div class="context-menu-item-icon">
				<ViewFilled size={16} />
			</div>
			<span>View license</span>
		</li>
		<li role="menuitem" on:click|stopPropagation={handleCopyLink} on:keydown>
			<div class="context-menu-item-icon">
				<CopyLink size={16} />
			</div>
			<span>Copy link</span>
		</li>
		<li role="menuitem" on:click|stopPropagation={handleCopyLink} on:keydown>
			<div class="context-menu-item-icon">
				<Copy size={16} />
			</div>
			<span>Copy license data</span>
		</li>
		<li class="alert-text" role="menuitem" on:click|stopPropagation={handleDelete} on:keydown>
			<div class="context-menu-item-icon">
				<TrashCan size={16} />
			</div>
			<span>Delete license</span>
		</li>
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
		margin-bottom: 1px;
	}
</style>
