<script lang="ts">
	import LicenseMenuButton from '$lib/components/misc/buttons/LicenseMenuButton.svelte';
	import PrimaryButton from '$lib/components/misc/buttons/PrimaryButton.svelte';
	import { contextMenu } from '$lib/stores/context-menu-store';
	import { modal, warningModal } from '$lib/stores/modal-store';
	import { licensePostRequest } from '$lib/stores/request-state-store';
	import {
		currentLicense,
		fetchedLicense,
		licenseMode,
		licenseStore,
		licenseToDelete,
	} from '$lib/stores/resources/license-store';
	import { table } from '$lib/stores/resources/table-store';
	import type { ContextMenuItem } from '$lib/types/misc-types';
	import { validateLicense } from '$lib/validations/license-validation';
	import CloseLarge from 'carbon-icons-svelte/lib/CloseLarge.svelte';
	import Copy from 'carbon-icons-svelte/lib/Copy.svelte';
	import CopyLink from 'carbon-icons-svelte/lib/CopyLink.svelte';
	import TrashCan from 'carbon-icons-svelte/lib/TrashCan.svelte';

	const contextMenuItems: ContextMenuItem[] = [
		{
			label: 'Close without saving',
			icon: CloseLarge,
			action: () => handleCloseModal(),
		},
		{
			label: 'Copy link',
			icon: CopyLink,
			action: () => contextMenu.copyLicenseLink($currentLicense),
		},
		{
			label: 'Copy license data',
			icon: Copy,
			action: () => contextMenu.copyLicenseData($currentLicense),
		},
		{
			label: 'Delete license',
			icon: TrashCan,
			action: () => handleDeletionWarningModal(),
			class: 'alert',
		},
	];

	async function handleLicense() {
		console.log($currentLicense.renewalInterval)
		const isValid = await validateLicense($currentLicense);
		if (isValid) {
			let success = false;
			switch ($licenseMode) {
				case 'view':
					success = await licenseStore.updateLicense($currentLicense);
					break;
				case 'add':
					success = await licenseStore.add($currentLicense);
					break;
			}
			if (success) {
				modal.closeLicense();
				table.updateState();
				licenseStore.updateCounts();
			}
		}
	}

	function handleDeletionWarningModal() {
		contextMenu.close();
		licenseToDelete.set($currentLicense.id);
		warningModal.set('license-deletion');
	}

	function handleCloseModal() {
		contextMenu.close();
		if (JSON.stringify($currentLicense) === JSON.stringify($fetchedLicense)) {
			modal.closeLicense();
		} else {
			warningModal.set('unsaved-license-changes');
		}
	}
</script>

<div class="footer-container">
	{#if $licenseMode === 'view'}
		<LicenseMenuButton items={contextMenuItems} />
	{/if}
	<PrimaryButton
		title={$licenseMode === 'add' ? 'Add license' : 'Save changes'}
		action={handleLicense}
		pendingRequest={$licensePostRequest.isLoading}
	/>
</div>

<style>
	.footer-container {
		width: 100%;
		margin: auto 0 0 0;
		display: flex;
		align-items: center;
		justify-content: flex-end;
	}
</style>
