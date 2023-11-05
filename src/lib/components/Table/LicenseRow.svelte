<script lang="ts">
	import { goto } from '$app/navigation';
	import { licenseStore, type License } from '$lib/stores/license-store';
	import { activeContextMenu } from '$lib/stores/modal-state';
	import { getRelativeDate } from '$lib/utils/date-utils';
	import Copy from 'carbon-icons-svelte/lib/Copy.svelte';
	import CopyLink from 'carbon-icons-svelte/lib/CopyLink.svelte';
	import OverflowMenuHorizontal from 'carbon-icons-svelte/lib/OverflowMenuHorizontal.svelte';
	import Repeat from 'carbon-icons-svelte/lib/Repeat.svelte';
	import TrashCan from 'carbon-icons-svelte/lib/TrashCan.svelte';
	import ViewFilled from 'carbon-icons-svelte/lib/ViewFilled.svelte';
	import { createEventDispatcher } from 'svelte';
	import { style } from 'svelte-body';
	import { fly } from 'svelte/transition';

	export let license: License;
	export let tableRect: any;
	let contextMenuPosition: 'top' | 'bottom' = 'top';
	$: renewalDate = getRelativeDate(license.renewalDate);

	// Hover logic
	const dispatch = createEventDispatcher();
	function handleMouseHover(isHovered: boolean) {
		dispatch('hover', { hovered: isHovered });
	}

	// Context menu logic
	function toggleContextMenu(e: MouseEvent) {
		console.log(e.clientY, tableRect.bottom);
		if (e.clientY > tableRect.bottom - 200) {
			contextMenuPosition = 'bottom';
		} else {
			contextMenuPosition = 'top';
		}
		activeContextMenu.set($activeContextMenu === license.id ? null : license.id);
	}

	function handleClickOutside(event: MouseEvent) {
		if ($activeContextMenu === license.id) {
			activeContextMenu.set(null);
		}
	}

	// Menu item functions
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

	function handleDelete(e: MouseEvent) {
		activeContextMenu.set(null);
		licenseStore.delete(license.id);
	}
</script>

<svelte:window on:click={handleClickOutside} />
<svelte:body use:style={$activeContextMenu ? 'pointer-events: none' : ''} />

<tr class="license-row-container">
	<!-- Icon cell -->
	<td
		class="status-cell-container"
		on:mouseover={() => handleMouseHover(true)}
		on:mouseout={() => handleMouseHover(false)}
		on:focus={() => handleMouseHover(true)}
		on:blur={() => handleMouseHover(false)}
	>
		<a
			class="status-cell"
			href={`/license/view/${license.id}`}
			on:click|stopPropagation={(e) => handleView(license, e)}
		>
			<div
				class="status-icon"
				class:inactive={license.status === 'Inactive'}
				class:expired={license.status === 'Expired'}
			/>
		</a>
	</td>
	<!-- Application cell -->
	<td
		class="application-cell-container"
		on:mouseover={() => handleMouseHover(true)}
		on:mouseout={() => handleMouseHover(false)}
		on:focus={() => handleMouseHover(true)}
		on:blur={() => handleMouseHover(false)}
	>
		<a
			class="application-cell"
			href={`/license/view/${license.id}`}
			on:click|stopPropagation={(e) => handleView(license, e)}
		>
			<p class="table-text">{license.application.name}</p>
		</a>
	</td>
	<!-- Contact cell -->
	<td
		class="contact-cell-container"
		on:mouseover={() => handleMouseHover(true)}
		on:mouseout={() => handleMouseHover(false)}
		on:focus={() => handleMouseHover(true)}
		on:blur={() => handleMouseHover(false)}
	>
		<a
			class="contact-cell"
			href={`/license/view/${license.id}`}
			on:click|stopPropagation={(e) => handleView(license, e)}
		>
			<p class="table-text">{license.contactPerson}</p>
		</a>
	</td>
	<!-- Assigned cell -->
	<td
		class="assigned-cell-container"
		on:mouseover={() => handleMouseHover(true)}
		on:mouseout={() => handleMouseHover(false)}
		on:focus={() => handleMouseHover(true)}
		on:blur={() => handleMouseHover(false)}
	>
		<a
			class="assigned-cell"
			href={`/license/view/${license.id}`}
			on:click|stopPropagation={(e) => handleView(license, e)}
		>
			<p class="table-text">
				{#if license.users.length === 0}
					None
				{:else}
					{license.users.length}
				{/if}
			</p>
		</a>
	</td>
	<!-- Expiration cell -->
	<td
		class="expiration-cell-container"
		on:mouseover={() => handleMouseHover(true)}
		on:mouseout={() => handleMouseHover(false)}
		on:focus={() => handleMouseHover(true)}
		on:blur={() => handleMouseHover(false)}
	>
		<a
			class="expiration-cell"
			href={`/license/view/${license.id}`}
			on:click|stopPropagation={(e) => handleView(license, e)}
		>
			<p
				class="table-text"
				class:warning-text={renewalDate.status === 'warning'}
				class:alert-text={renewalDate.status === 'alert'}
			>
				{renewalDate.text}
			</p>
		</a>
	</td>
	<!-- Renewal cell -->
	<td
		class="renewal-cell-container"
		on:mouseover={() => handleMouseHover(true)}
		on:mouseout={() => handleMouseHover(false)}
		on:focus={() => handleMouseHover(true)}
		on:blur={() => handleMouseHover(false)}
	>
		<a
			class="renewal-cell"
			href={`/license/view/${license.id}`}
			on:click|stopPropagation={(e) => handleView(license, e)}
		>
			{#if license.autoRenewal}
				<Repeat size={16} />
			{/if}
		</a></td
	>
	<!-- Menu cell -->
	<td class="menu-cell-container">
		<div class="menu-cell">
			<div class="vertical-line" />
			<button
				class="menu-button"
				class:active={$activeContextMenu === license.id}
				on:click|stopPropagation|preventDefault={toggleContextMenu}
			>
				<OverflowMenuHorizontal size={32} />
			</button>
			{#if $activeContextMenu === license.id}
				<div
					role="menu"
					tabindex="0"
					class="context-menu"
					class:bottom={contextMenuPosition === 'bottom'}
					on:click|stopPropagation
					on:keydown|stopPropagation
					in:fly={{
						duration: 180,
						y: contextMenuPosition === 'bottom' ? '15%' : '-15%',
					}}
				>
					<ul>
						<li role="menuitem" on:click|stopPropagation={(e) => handleView(license, e)} on:keydown>
							<div class="context-menu-item-icon">
								<ViewFilled size={16} />
							</div>
							<span>View license</span>
						</li>
						<li role="menuitem" on:click|stopPropagation={(e) => handleCopyLink()} on:keydown>
							<div class="context-menu-item-icon">
								<CopyLink size={16} />
							</div>
							<span>Copy link</span>
						</li>
						<li role="menuitem" on:click|stopPropagation={(e) => handleCopyLink()} on:keydown>
							<div class="context-menu-item-icon">
								<Copy size={16} />
							</div>
							<span>Copy license data</span>
						</li>
						<li class="alert-text" role="menuitem" on:click={handleDelete} on:keydown>
							<div class="context-menu-item-icon" style="margin-bottom: 1px">
								<TrashCan size={16} />
							</div>
							<span>Delete license</span>
						</li>
					</ul>
				</div>
			{/if}
		</div>
	</td>
</tr>

<style>
	* {
		box-sizing: border-box;
	}

	td {
		height: 100%;
	}

	td > * {
		height: 100%;
		display: flex;
		align-items: center;
	}

	.license-row-container {
		min-height: 60px;
		height: 60px;
		border-bottom: 1px solid #e6e6e6;
		display: flex;
	}

	.table-text {
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
	}

	/* Status cell */

	.status-cell-container {
		flex: 0 0 60px;
	}

	.status-cell {
		justify-content: center;
	}

	.status-icon {
		width: 0.5rem;
		height: 0.5rem;
		border-radius: 50%;
		background-color: #6ae674;
	}

	.inactive {
		background-color: #bfbfbf;
	}

	.expired {
		background-color: #ff0000;
	}

	/* Application cell */

	.application-cell-container {
		flex: 2;
	}

	.application-cell {
		justify-content: flex-start;
	}

	/* Contact cell */

	.contact-cell-container {
		flex: 2;
	}

	.contact-cell {
		justify-content: flex-start;
	}

	/* Assigned cell */

	.assigned-cell-container {
		flex: 1;
	}

	.assigned-cell {
		justify-content: center;
	}

	/* Expiration cell */

	.expiration-cell-container {
		flex: 2;
	}

	.expiration-cell {
		justify-content: flex-end;
	}

	.expiration-cell > * {
		height: 100%;
		display: flex;
		align-items: center;
	}

	.warning-text {
		color: #ff9736;
	}

	.alert-text {
		color: #ff0000;
	}

	/* Renewal cell */

	.renewal-cell-container {
		flex: 0 0 70px;
	}

	.renewal-cell {
		justify-content: center;
	}

	/* Menu cell */

	.menu-cell-container {
		flex: 0 0 80px;
	}

	.menu-cell {
		justify-content: space-between;
		position: relative;
	}

	.vertical-line {
		border-right: 1px solid #d1d0d0;
		height: 70%;
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

	/* Context menu */

	.context-menu {
		position: absolute;
		top: 11px;
		right: 80%;
		background: white;
		border: 1px solid #ccc;
		border-radius: 4px;
		padding: 0.5rem;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
		z-index: 100000;
		pointer-events: auto;
		width: 14rem;
	}

	.bottom {
		top: -134px;
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
	}
</style>
