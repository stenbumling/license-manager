<script lang="ts">
	import { tooltip } from '$lib/actions/tooltip';
	import LicenseMenuButton from '$lib/components/misc/buttons/LicenseMenuButton.svelte';
	import { contextMenu } from '$lib/stores/context-menu-store';
	import { modal, warningModal } from '$lib/stores/modal-store';
	import { licenseToDelete } from '$lib/stores/resources/license-store';
	import type { LicenseData } from '$lib/types/license-types';
	import type { ContextMenuItem } from '$lib/types/misc-types';
	import { getRelativeDate } from '$lib/utils/date-utils';
	import Copy from 'carbon-icons-svelte/lib/Copy.svelte';
	import CopyLink from 'carbon-icons-svelte/lib/CopyLink.svelte';
	import Repeat from 'carbon-icons-svelte/lib/Repeat.svelte';
	import TrashCan from 'carbon-icons-svelte/lib/TrashCan.svelte';
	import ViewFilled from 'carbon-icons-svelte/lib/ViewFilled.svelte';

	export let license: LicenseData;
	export let index: number;

	let isHover = false;

	$: status = license.status;
	$: applicationName = license.application.name;
	$: contactPerson = license.contactPerson;
	$: allUsers = license.users.map((user) => user.name).join(', ');
	$: expirationDate = getRelativeDate(license.expirationDate);
	$: renewalInterval = license.renewalInterval;

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
			action: () => handleDeletionWarningModal(),
			class: 'alert',
		},
	];

	function handleViewLicense(license: LicenseData, e: MouseEvent | KeyboardEvent) {
		contextMenu.close();
		if (e.metaKey || e.ctrlKey) return;
		e.preventDefault();
		modal.openViewLicense(license.id);
	}

	function handleDeletionWarningModal() {
		contextMenu.close();
		licenseToDelete.set(license.id);
		warningModal.set('license-deletion');
	}
</script>

<div
	role="row"
	tabindex="-1"
	class="license-row-container"
	class:even-row={index % 2 === 1}
	class:hover={isHover}
>
	<a
		class="license-row"
		tabindex="0"
		href={`/?modal=view&id=${license.id}`}
		on:mouseover={() => (isHover = true)}
		on:mouseout={() => (isHover = false)}
		on:focus={() => (isHover = true)}
		on:blur={() => (isHover = false)}
		on:click|stopPropagation={(e) => handleViewLicense(license, e)}
	>
		<!-- Icon cell -->
		<div
			role="cell"
			tabindex="-1"
			class="cell status-cell"
			use:tooltip={{ content: status, options: { delay: [500, 0], offset: [0, -10] } }}
		>
			<div
				class="status-icon"
				class:inactive={license.status === 'Inactive'}
				class:expired={license.status === 'Expired'}
			/>
		</div>

		<!-- Application cell -->
		<div role="cell" tabindex="-1" class="cell application-cell">
			<p class="cell-text" use:tooltip={{ content: applicationName, options: { delay: [500, 0] } }}>
				{license.application.name}
			</p>
		</div>

		<!-- Contact cell -->
		<div role="cell" tabindex="-1" class="cell contact-person-cell">
			<p use:tooltip={{ content: contactPerson, options: { delay: [500, 0] } }} class="cell-text">
				{#if license.contactPerson}
					{license.contactPerson}
				{:else}
					<span style="font-style: italic">N/A</span>
				{/if}
			</p>
		</div>

		<!-- Users cell -->
		<div role="cell" tabindex="-1" class="cell users-cell">
			<p class="cell-text" use:tooltip={{ content: allUsers, options: { delay: [500, 0] } }}>
				{#if license.users.length === 0}
					<span style="font-style: italic">None</span>
				{:else}
					{license.users.length}
				{/if}
			</p>
		</div>

		<!-- Expiration cell -->
		<div role="cell" tabindex="-1" class="cell expiration-cell">
			<div
				use:tooltip={{ content: license.expirationDate, options: { delay: [500, 0] } }}
				class="expiration-cell-badge"
				class:warning-badge={expirationDate.status === 'warning'}
				class:alert-badge={expirationDate.status === 'alert'}
			>
				<p class="cell-text">
					{expirationDate.text}
				</p>
			</div>
		</div>

		<!-- Renewal cell -->
		<div role="cell" tabindex="-1" class="cell renewal-cell">
			{#if license.renewalInterval !== 'None'}
				<div
					use:tooltip={{ content: renewalInterval, options: { delay: [500, 0] } }}
					class="renewal-cell-icon"
				>
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

	.license-row:active {
		position: relative;
		top: 1px;
		left: 1px;
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
		margin: 0;
	}

	.status-cell {
		flex: 0 0 60px;
		display: flex;
		justify-content: center;
	}

	.status-icon {
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background-color: #6bd495;
	}

	.status-icon.inactive {
		background-color: #bfbfbf;
	}

	.status-icon.expired {
		background-color: #d32d2d;
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

	.expiration-cell-badge {
		display: flex;
		background-color: transparent;
		border-radius: 6px;
	}

	.expiration-cell-badge.warning-badge {
		background-color: #ffc267;
		padding: 2px 5px;
	}

	.expiration-cell-badge.alert-badge {
		background-color: #d32d2d;
		padding: 2px 5px;

		& > * {
			color: white;
		}
	}

	.renewal-cell {
		flex: 0 0 70px;
		justify-content: center;
	}

	.renewal-cell-icon {
		margin: 5px 4px 0 0;
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
