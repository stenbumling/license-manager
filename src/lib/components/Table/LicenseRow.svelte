<script lang="ts">
	import LicenseMenuButton from '$lib/components/misc/buttons/LicenseMenuButton.svelte';
	import type { ContextMenuItem } from '$lib/stores/context-menu-store';
	import { contextMenu } from '$lib/stores/context-menu-store';
	import { modal } from '$lib/stores/modal-store';
	import type { License } from '$lib/stores/resources/license-store';
	import { getRelativeDate } from '$lib/utils/date-utils';
	import Copy from 'carbon-icons-svelte/lib/Copy.svelte';
	import CopyLink from 'carbon-icons-svelte/lib/CopyLink.svelte';
	import Repeat from 'carbon-icons-svelte/lib/Repeat.svelte';
	import TrashCan from 'carbon-icons-svelte/lib/TrashCan.svelte';
	import ViewFilled from 'carbon-icons-svelte/lib/ViewFilled.svelte';
	import WarningModal from '../misc/WarningModal.svelte';

	export let license: License;
	export let index: number;

	let hovered = false;
	let showWarningModal = false;

	$: expirationDate = getRelativeDate(license.expirationDate);

	export const licenseMenuItems: ContextMenuItem[] = [
		{
			label: 'View license',
			icon: ViewFilled,
			action: () => contextMenu.viewLicense(license),
		},
		{
			label: 'Copy link',
			icon: CopyLink,
			action: () => contextMenu.copyLicenseLink(license),
		},
		{
			label: 'Copy license data',
			icon: Copy,
			action: () => contextMenu.copyLicenseData(license),
		},
		{
			label: 'Delete license',
			icon: TrashCan,
			action: () => handleWarningModal(),
			class: 'alert',
		},
	];

	function handleWarningModal() {
		contextMenu.close();
		showWarningModal = true;
	}

	function handleView(license: License, e: MouseEvent | KeyboardEvent) {
		contextMenu.close();
		if (e.metaKey || e.ctrlKey) {
			return;
		}
		e.preventDefault();
		modal.openLicense(license.id);
	}
</script>

<div
	role="row"
	tabindex="-1"
	class="license-row-container"
	class:even-row={index % 2 === 1}
	class:hover={hovered}
>
	<a
		class="license-row"
		tabindex="0"
		href={`/?modal=view&id=${license.id}`}
		on:mouseover={() => (hovered = true)}
		on:mouseout={() => (hovered = false)}
		on:focus={() => (hovered = true)}
		on:blur={() => (hovered = false)}
		on:click|stopPropagation={(e) => handleView(license, e)}
	>
		<!-- Icon cell -->
		<div role="cell" tabindex="-1" class="cell status-cell">
			<div
				class="status-icon"
				class:inactive={license.status === 'Inactive'}
				class:expired={license.status === 'Expired'}
			/>
		</div>
		<!-- Application cell -->
		<div role="cell" tabindex="-1" class="cell application-cell">
			<p class="cell-text">{license.application.name}</p>
		</div>
		<!-- Contact cell -->
		<div role="cell" tabindex="-1" class="cell contact-person-cell">
			<p class="cell-text">
				{#if license.contactPerson}
					{license.contactPerson}
				{:else}
					<span style="font-style: italic">Unassigned</span>
				{/if}
			</p>
		</div>
		<!-- Users cell -->
		<div role="cell" tabindex="-1" class="cell users-cell">
			<p class="cell-text">
				{#if license.users.length === 0}
					<span style="font-style: italic">None</span>
				{:else}
					{license.users.length}
				{/if}
			</p>
		</div>
		<!-- Expiration cell -->
		<div role="cell" tabindex="-1" class="cell expiration-cell">
			<p
				class="cell-text"
				class:warning-text={expirationDate.status === 'warning'}
				class:alert-text={expirationDate.status === 'alert'}
			>
				{expirationDate.text}
			</p>
		</div>
		<!-- Renewal cell -->
		<div role="cell" tabindex="-1" class="cell renewal-cell">
			{#if license.autoRenewal}
				<div style="margin-right: 4px; margin-top: 5px;">
					<Repeat size={16} />
				</div>
			{/if}
		</div>
	</a>
	<!-- Menu cell -->
	<div class="cell menu-cell">
		<div class="vertical-line" />
		<LicenseMenuButton items={licenseMenuItems} />
	</div>
</div>

{#if showWarningModal}
	<WarningModal
		warningText="Warning! This will delete the license and all its data. Are you sure?"
		onConfirm={() => {
			showWarningModal = false;
			contextMenu.deleteLicense(license);
		}}
		onCancel={() => (showWarningModal = false)}
	/>
{/if}

<style>
	* {
		box-sizing: border-box;
	}

	.license-row-container {
		min-height: 60px;
		height: 60px;
		border-bottom: 1px solid #e6e6e6;
		display: flex;
	}

	.license-row-container.hover {
		background-color: #eeeeee;
		transition: background-color 0.1s ease;
		cursor: pointer;
	}

	.even-row {
		background-color: #f9f9f9;
	}

	.license-row {
		display: flex;
		width: 100%;
	}

	/* Cells */

	.cell {
		display: flex;
		align-items: center;
		min-width: 0;
	}

	.cell-text {
		user-select: none;
		padding: 0 0.4rem;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
		max-width: 300px;
	}

	.status-cell {
		flex: 0 0 60px;
		display: flex;
		justify-content: center;
	}

	.status-icon {
		width: 0.5rem;
		height: 0.5rem;
		border-radius: 50%;
		background-color: #6ae674;
	}

	.status-icon.inactive {
		background-color: #bfbfbf;
	}

	.status-icon.expired {
		background-color: #ff0000;
	}

	.application-cell {
		flex: 2;
	}

	.contact-person-cell {
		flex: 2;
	}

	.users-cell {
		flex: 1.5;
		justify-content: center;
	}

	.expiration-cell {
		flex: 1.5;
		justify-content: flex-end;
	}

	.expiration-cell > .warning-text {
		color: #ff9736;
	}

	.expiration-cell > .alert-text {
		color: #ff0000;
	}

	.renewal-cell {
		flex: 0 0 70px;
		justify-content: center;
	}

	.menu-cell {
		flex: 0 0 80px;
		justify-content: center;
	}

	.menu-cell > .vertical-line {
		border-right: 1px solid #d1d0d0;
		height: 60%;
	}

	@media (max-width: 1450px) {
		.renewal-cell {
			display: none;
		}

		.expiration-cell {
			padding-right: 1rem;
		}
	}
</style>
