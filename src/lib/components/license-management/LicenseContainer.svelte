<script lang="ts">
	import { scrollShadow } from '$lib/actions/scrollShadow';
	import ApplicationModal from '$lib/components/application-management/ApplicationModal.svelte';
	import LicenseHeader from '$lib/components/license-management/LicenseHeader.svelte';
	import ApplicationSelection from '$lib/components/license-management/fields/ApplicationSelectionField.svelte';
	import AssignedUsers from '$lib/components/license-management/fields/AssignedUsersField.svelte';
	import ExpirationField from '$lib/components/license-management/fields/ExpirationField.svelte';
	import SelectField from '$lib/components/license-management/fields/SelectField.svelte';
	import TextAreaField from '$lib/components/license-management/fields/TextAreaField.svelte';
	import TextField from '$lib/components/license-management/fields/TextField.svelte';
	import CloseButton from '$lib/components/misc/buttons/CloseButton.svelte';
	import LicenseMenuButton from '$lib/components/misc/buttons/LicenseMenuButton.svelte';
	import PrimaryButton from '$lib/components/misc/buttons/PrimaryButton.svelte';
	import { contextMenu } from '$lib/stores/context-menu-store';
	import { applicationModalView, modal, warningModal } from '$lib/stores/modal-store';
	import { licenseFetchRequest, licensePostRequest } from '$lib/stores/request-state-store';
	import {
		currentLicense,
		fetchedLicense,
		licenseMode,
		licenseStore,
		licenseToDelete,
	} from '$lib/stores/resources/license-store';
	import { table } from '$lib/stores/resources/table-store';
	import type { ContextMenuItem } from '$lib/types/misc-types';
	import { licenseValidationErrors, validateLicense } from '$lib/validations/license-validation';
	import CloseLarge from 'carbon-icons-svelte/lib/CloseLarge.svelte';
	import Copy from 'carbon-icons-svelte/lib/Copy.svelte';
	import CopyLink from 'carbon-icons-svelte/lib/CopyLink.svelte';
	import TrashCan from 'carbon-icons-svelte/lib/TrashCan.svelte';
	import { Circle } from 'svelte-loading-spinners';
	import { fade } from 'svelte/transition';

	$: hasStartedRequest = $licenseFetchRequest.pendingRequests > 0 && !isLoading;
	$: isLoading = $licenseFetchRequest.isLoading;
	$: hasError = $licenseFetchRequest.error?.message && !isLoading;
	$: hasLicense = $currentLicense.id && !isLoading;

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

<div class="license-container">
	<!-- Loading -->
	{#if hasStartedRequest}
		<div class="fallback-container">
			<div class="fallback-container-close-button">
				<CloseButton action={modal.closeLicense} />
			</div>
			<!-- Prevents default state being active if loading spinner has a delay-->
		</div>
	{:else if isLoading}
		<div class="fallback-container">
			<div class="fallback-container-close-button">
				<CloseButton action={modal.closeLicense} />
			</div>
			<Circle color="var(--deep-purple)" />
		</div>

		<!-- Error fallback -->
	{:else if hasError}
		<div class="fallback-container">
			<div class="fallback-container-close-button">
				<CloseButton action={modal.closeLicense} />
			</div>
			<h1>{$licenseFetchRequest.error?.status}</h1>
			<div class="fallback-error-details">
				<h2>{$licenseFetchRequest.error?.message}</h2>
				{#if $licenseFetchRequest.error?.details}
					<p>{$licenseFetchRequest.error.details}</p>
				{/if}
			</div>
		</div>
	{:else if hasLicense}
		<!-- License header -->
		<div in:fade={{ duration: 120 }}>
			<LicenseHeader />
		</div>

		<!-- License fields -->
		<div tabIndex="-1" class="fields-grid" use:scrollShadow in:fade={{ duration: 120 }}>
			<ApplicationSelection />
			{#if $applicationModalView !== 'closed'}
				<ApplicationModal />
			{/if}
			<AssignedUsers />
			<ExpirationField />
			<SelectField
				bind:value={$currentLicense.category}
				label="Category"
				options={['Development', 'Media', 'Project Management', 'Educational', 'Uncategorized']}
				defaultOption="Uncategorized"
				errorMessage={$licenseValidationErrors.category}
			/>
			<SelectField
				bind:value={$currentLicense.status}
				label="Status"
				options={['Active', 'Inactive', 'Expired']}
				defaultOption="Active"
				errorMessage={$licenseValidationErrors.status}
			/>
			<TextField
				bind:value={$currentLicense.contactPerson}
				label="Contact person"
				errorMessage={$licenseValidationErrors.contactPerson}
			>
				<TextField
					slot="secondary"
					bind:value={$currentLicense.additionalContactInfo}
					label="Additional contact information"
					type="secondary"
					errorMessage={$licenseValidationErrors.additionalContactInfo}
				/>
			</TextField>
			<TextAreaField
				bind:value={$currentLicense.comment}
				label="Comment"
				errorMessage={$licenseValidationErrors.comment}
			/>
		</div>

		<!-- Container footer -->
		<div class="bottom-container">
			{#if $licenseMode === 'view'}
				<LicenseMenuButton items={contextMenuItems} />
			{/if}
			<PrimaryButton
				title={$licenseMode === 'add' ? 'Add license' : 'Save changes'}
				action={handleLicense}
				pendingRequest={$licensePostRequest.isLoading}
			/>
		</div>
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
		margin: 0 0 2rem 0;
		padding: 4rem 10px 0 0;
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
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		height: 100%;

		& > h1 {
			font-size: 5rem;
		}
	}

	.fallback-error-details {
		max-width: 62ch;
		word-wrap: break-word;
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

	@media (max-width: 800px) {
		.fields-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
