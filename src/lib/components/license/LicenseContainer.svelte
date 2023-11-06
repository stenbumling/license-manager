<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { getElementRect } from '$lib/actions/getElementRect';
	import ApplicationModal from '$lib/components/application-management/ApplicationModal.svelte';
	import LicenseHeader from '$lib/components/license/LicenseHeader.svelte';
	import ApplicationSelection from '$lib/components/license/fields/ApplicationSelection.svelte';
	import AssignedUsers from '$lib/components/license/fields/AssignedUsers.svelte';
	import ExpirationField from '$lib/components/license/fields/ExpirationField.svelte';
	import SelectField from '$lib/components/license/fields/SelectField.svelte';
	import TextAreaField from '$lib/components/license/fields/TextAreaField.svelte';
	import TextField from '$lib/components/license/fields/TextField.svelte';
	import ButtonLarge from '$lib/components/misc/ButtonLarge.svelte';
	import ContextMenu from '$lib/components/misc/ContextMenu.svelte';
	import { contextMenu } from '$lib/stores/context-menu-store';
	import { license, licenseMode, licenseStore } from '$lib/stores/license-store.ts';
	import { showApplicationModal, showLicenseModal } from '$lib/stores/modal-state';
	import CloseLarge from 'carbon-icons-svelte/lib/CloseLarge.svelte';
	import Copy from 'carbon-icons-svelte/lib/Copy.svelte';
	import CopyLink from 'carbon-icons-svelte/lib/CopyLink.svelte';
	import OverflowMenuHorizontal from 'carbon-icons-svelte/lib/OverflowMenuHorizontal.svelte';
	import TrashCan from 'carbon-icons-svelte/lib/TrashCan.svelte';
	import { onMount } from 'svelte';

	let loaded = false;
	let menuButtonRect: DOMRect;
	const urlId = $page.params.id || new URLSearchParams($page.url.search).get('id') || null;

	const contextMenuItems = [
		{
			label: 'Close without saving',
			icon: CloseLarge,
			action: () => handleClose(),
		},
		{
			label: 'Copy link',
			icon: CopyLink,
			action: () => contextMenu.copyLicenseLink($license),
		},
		{
			label: 'Copy license data',
			icon: Copy,
			action: () => contextMenu.copyLicenseData($license),
		},
		{
			label: 'Delete license',
			icon: TrashCan,
			action: () => contextMenu.deleteLicense($license),
			classes: 'alert-text',
		},
	];

	onMount(async () => {
		if (urlId) {
			licenseMode.set('edit');
			licenseStore.fetch(urlId);
		} else {
			licenseMode.set('add');
			licenseStore.resetFields();
		}
		loaded = true;
	});

	function handleAdd() {
		showLicenseModal.set(false);
		goto('/');
		licenseStore.add($license);
		licenseStore.resetFields();
	}

	function handleSave() {
		showLicenseModal.set(false);
		goto('/');
		licenseStore.updateLicense($license);
		licenseStore.resetFields();
	}

	function handleClose() {
		showLicenseModal.set(false);
		licenseStore.resetFields();
		goto('/');
	}
</script>

{#if $showApplicationModal}
	<ApplicationModal />
{/if}

<div class="license-container">
	{#if loaded}
		<LicenseHeader />
		<div class="fields-grid">
			<ApplicationSelection />
			<AssignedUsers />
			<ExpirationField bind:value={$license.renewalDate} />
			<SelectField
				bind:value={$license.category}
				label="Category"
				options={['Development', 'Media', 'Project Management', 'Educational', 'Uncategorized']}
				defaultOption="Uncategorized"
			/>
			<SelectField
				bind:value={$license.status}
				label="Status"
				options={['Active', 'Inactive', 'Expired']}
				defaultOption="Active"
				required
			/>
			<TextField bind:value={$license.contactPerson} label="Contact person">
				<TextField
					slot="secondary"
					bind:value={$license.additionalContactInfo}
					label="Additional contact information"
					type="secondary"
				/>
			</TextField>
			<TextAreaField bind:value={$license.comment} label="Comment" />
		</div>
		<div class="bottom-container">
			{#if $licenseMode === 'edit'}
				<button
					class="menu-button"
					class:active={$contextMenu.activeId === 'license-view'}
					on:click|stopPropagation|preventDefault={() => contextMenu.open('license-view')}
					use:getElementRect={(element) => (menuButtonRect = element)}
				>
					<OverflowMenuHorizontal size={32} />
				</button>
				{#if $contextMenu.activeId === 'license-view'}
					<ContextMenu bind:referenceElementRect={menuButtonRect} items={contextMenuItems} />
				{/if}
				<button class="main-button" on:click|preventDefault={handleSave}>
					<ButtonLarge title="Save changes" />
				</button>
			{:else}
				<button class="main-button" on:click|preventDefault={handleAdd}>
					<ButtonLarge title="Add new license" />
				</button>
			{/if}
		</div>
	{:else}
		<p>Loading...</p>
	{/if}
</div>

<style>
	.license-container {
		width: 100%;
		max-width: 100rem;
		display: flex;
		flex-direction: column;
	}

	.fields-grid {
		width: 100%;
		max-width: 100rem;
		height: auto;
		margin: 0 0 3rem 0;
		padding: 0 1rem 0 0;
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		grid-auto-rows: min-content;
		gap: 2rem 8rem;
		overflow-y: auto;
	}

	.bottom-container {
		width: 100%;
		margin: auto 0 0 0;
		display: flex;
		align-items: center;
		justify-content: flex-end;
	}

	.menu-button {
		padding: 0.2rem;
		border-radius: 6px;
		display: flex;
		align-self: center;
		cursor: pointer;
		margin: 0 2rem 0 0;
		transition: color 0.25s ease;
		transition: background-color 0.2s ease;

		&:hover {
			background-color: #eeeeee;
		}
	}

	.menu-button.active {
		background-color: #dddddd;
	}

	.main-button {
		width: 16rem;
	}

	@media (max-width: 1400px) {
		.fields-grid {
			grid-template-columns: 1fr 1fr;
		}
	}
</style>
