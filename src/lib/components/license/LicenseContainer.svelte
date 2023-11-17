<script lang="ts">
	import { scrollShadow } from '$lib/actions/scrollShadow';
	import ApplicationModal from '$lib/components/application-management/ApplicationModal.svelte';
	import LicenseHeader from '$lib/components/license/LicenseHeader.svelte';
	import ApplicationSelection from '$lib/components/license/fields/ApplicationSelection.svelte';
	import AssignedUsers from '$lib/components/license/fields/AssignedUsers.svelte';
	import ExpirationField from '$lib/components/license/fields/ExpirationField.svelte';
	import SelectField from '$lib/components/license/fields/SelectField.svelte';
	import TextAreaField from '$lib/components/license/fields/TextAreaField.svelte';
	import TextField from '$lib/components/license/fields/TextField.svelte';
	import ButtonLarge from '$lib/components/misc/buttons/ButtonLarge.svelte';
	import LicenseMenu from '$lib/components/misc/buttons/LicenseMenu.svelte';
	import type { ContextMenuItem } from '$lib/stores/context-menu-store';
	import { contextMenu } from '$lib/stores/context-menu-store';
	import {
		license,
		licenseFetchError,
		licenseMode,
		licensePostError,
		licenseStore,
	} from '$lib/stores/license-store.ts';
	import { licenseFetchRequest, licensePostRequest } from '$lib/stores/loading-store';
	import { modal, showApplicationModal } from '$lib/stores/modal-store';
	import { licenseValidationErrors, validateLicense } from '$lib/validations/license-validation';
	import CloseLarge from 'carbon-icons-svelte/lib/CloseLarge.svelte';
	import Copy from 'carbon-icons-svelte/lib/Copy.svelte';
	import CopyLink from 'carbon-icons-svelte/lib/CopyLink.svelte';
	import TrashCan from 'carbon-icons-svelte/lib/TrashCan.svelte';
	import { Circle } from 'svelte-loading-spinners';
	import { fade } from 'svelte/transition';
	import WarningModal from '../misc/WarningModal.svelte';
	import CloseModalButton from '../misc/buttons/CloseModalButton.svelte';

	let showWarningModal = false;

	const contextMenuItems: ContextMenuItem[] = [
		{
			label: 'Close',
			icon: CloseLarge,
			action: () => modal.closeLicense(),
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
			action: () => handleWarningModal(),
			class: 'alert',
		},
	];

	function handleWarningModal() {
		contextMenu.close();
		showWarningModal = true;
	}

	async function handleLicense() {
		const isValid = await validateLicense($license);
		if (isValid) {
			if ($licenseMode === 'view') {
				await licenseStore.updateLicense($license);
			} else if ($licenseMode === 'add') {
				await licenseStore.add($license);
			}
			if ($licensePostError) {
				return;
			}
			modal.closeLicense();
		} else {
			return;
		}
	}
</script>

<div class="license-container">
	{#if $licenseFetchRequest.isLoading}
		<div class="fallback-container">
			<Circle color="var(--deep-purple)" />
		</div>
	{:else if $licenseFetchError}
		<div class="fallback-container">
			<div class="fallback-container-close-button">
				<CloseModalButton action={modal.closeLicense} />
			</div>
			<h1>{$licenseFetchError}</h1>
		</div>
	{:else}
		<div in:fade={{ duration: 300 }}>
			<LicenseHeader />
		</div>
		<div class="fields-grid" use:scrollShadow in:fade={{ duration: 300 }}>
			<ApplicationSelection />
			<AssignedUsers />
			<ExpirationField />
			<SelectField
				bind:value={$license.category}
				label="Category"
				options={['Development', 'Media', 'Project Management', 'Educational', 'Uncategorized']}
				defaultOption="Uncategorized"
				errorMessage={$licenseValidationErrors.category}
			/>
			<SelectField
				bind:value={$license.status}
				label="Status"
				options={['Active', 'Inactive', 'Expired']}
				defaultOption="Active"
				errorMessage={$licenseValidationErrors.status}
			/>
			<TextField
				bind:value={$license.contactPerson}
				label="Contact person"
				errorMessage={$licenseValidationErrors.contactPerson}
			>
				<TextField
					slot="secondary"
					bind:value={$license.additionalContactInfo}
					label="Additional contact information"
					type="secondary"
					errorMessage={$licenseValidationErrors.additionalContactInfo}
				/>
			</TextField>
			<TextAreaField
				bind:value={$license.comment}
				label="Comment"
				errorMessage={$licenseValidationErrors.comment}
			/>
		</div>
		<div class="bottom-container">
			{#if $licenseMode === 'view'}
				<LicenseMenu items={contextMenuItems} />
			{/if}
			<ButtonLarge
				title={$licenseMode === 'add' ? 'Add new license' : 'Save changes'}
				action={handleLicense}
				pendingRequest={$licensePostRequest.isLoading}
			/>
		</div>
	{/if}
</div>

{#if $showApplicationModal}
	<ApplicationModal />
{/if}

{#if showWarningModal}
	<WarningModal
		warningText="Are you sure you want to delete this license?"
		onConfirm={() => contextMenu.deleteLicense($license)}
		onCancel={() => (showWarningModal = false)}
	/>
{/if}

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
		margin: 0 0 2rem 0;
		padding: 4rem 1rem 0 0;
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		grid-auto-rows: min-content;
		gap: 1rem 6rem;
		overflow-y: auto;
	}

	.bottom-container {
		width: 100%;
		margin: auto 0 0 0;
		display: flex;
		align-items: center;
		justify-content: flex-end;
	}

	.fallback-container {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
	}

	.fallback-container-close-button {
		position: absolute;
		top: 2rem;
		right: 3rem;
	}

	@media (max-width: 1400px) {
		.fields-grid {
			grid-template-columns: 1fr 1fr;
		}
	}
</style>
