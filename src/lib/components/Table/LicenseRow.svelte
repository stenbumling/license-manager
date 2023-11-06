<script lang="ts">
	import { goto } from '$app/navigation';
	import { getElementRect } from '$lib/actions/getElementRect';
	import ContextMenu from '$lib/components/misc/ContextMenu.svelte';
	import { contextMenu } from '$lib/stores/context-menu-store';
	import type { License } from '$lib/stores/license-store';
	import { getRelativeDate } from '$lib/utils/date-utils';
	import OverflowMenuHorizontal from 'carbon-icons-svelte/lib/OverflowMenuHorizontal.svelte';
	import Repeat from 'carbon-icons-svelte/lib/Repeat.svelte';
	import { createEventDispatcher } from 'svelte';

	export let license: License;
	let menuButtonRect: DOMRect;
	$: renewalDate = getRelativeDate(license.renewalDate);

	function openContextMenu() {
		contextMenu.open(license.id);
	}

	function handleView(license: License, e: MouseEvent | KeyboardEvent) {
		contextMenu.close();
		e.stopPropagation();
		if (e.metaKey || e.ctrlKey) {
			return;
		}
		e.preventDefault();
		goto(`/?modal=edit&id=${license.id}`);
	}

	// Hover logic
	const dispatch = createEventDispatcher();
	function handleMouseHover(isHovered: boolean) {
		dispatch('hover', { hovered: isHovered });
	}
</script>

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
		</a>
	</td>
	<!-- Menu cell -->
	<td class="menu-cell-container">
		<div class="menu-cell">
			<div class="vertical-line" />
			<button
				class="menu-button"
				class:active={$contextMenu.activeId === license.id}
				on:click|stopPropagation|preventDefault={openContextMenu}
				use:getElementRect={(element) => (menuButtonRect = element)}
			>
				<OverflowMenuHorizontal size={32} />
			</button>
			{#if $contextMenu.activeId === license.id}
				<ContextMenu bind:referenceElementRect={menuButtonRect} {license} />
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
</style>
