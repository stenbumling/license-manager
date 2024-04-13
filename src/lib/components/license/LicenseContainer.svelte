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
	import LicenseMenuButton from '$lib/components/misc/buttons/LicenseMenuButton.svelte';
	import PrimaryButton from '$lib/components/misc/buttons/PrimaryButton.svelte';
	import type { ContextMenuItem } from '$lib/stores/context-menu-store';
	import { contextMenu } from '$lib/stores/context-menu-store';
	import { applicationModalMode, modal } from '$lib/stores/modal-store';
	import { licenseFetchRequest, licensePostRequest } from '$lib/stores/request-state-store';
	import { applicationStore } from '$lib/stores/resources/application-store';
	import { license, licenseMode, licenseStore } from '$lib/stores/resources/license-store';
	import { licenseValidationErrors, validateLicense } from '$lib/validations/license-validation';
	import CloseLarge from 'carbon-icons-svelte/lib/CloseLarge.svelte';
	import Copy from 'carbon-icons-svelte/lib/Copy.svelte';
	import CopyLink from 'carbon-icons-svelte/lib/CopyLink.svelte';
	import TrashCan from 'carbon-icons-svelte/lib/TrashCan.svelte';
	import { onMount } from 'svelte';
	import { Circle } from 'svelte-loading-spinners';
	import { fade } from 'svelte/transition';
	import WarningModal from '../misc/WarningModal.svelte';
	import CloseModalButton from '../misc/buttons/CloseButton.svelte';
	import { userStore } from '$lib/stores/resources/user-store';

	let showWarningModal = false;

	const contextMenuItems: ContextMenuItem[] = [
		{
			label: 'Close without saving',
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

	onMount(async () => {
		await userStore.fetch();
		await applicationStore.fetch();
	});

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
			if ($licensePostRequest.error.message) {
				return;
			}
			modal.closeLicense();
		} else {
			return;
		}
	}
</script>

<div class="license-container">
	<!-- Loading -->
	{#if $licenseFetchRequest.isLoading}
		<div class="fallback-container">
			<Circle color="var(--deep-purple)" />
		</div>

		<!-- Error fallback -->
	{:else if $licenseFetchRequest.error.message}
		<div class="fallback-container">
			<div class="fallback-container-close-button">
				<CloseModalButton action={modal.closeLicense} />
			</div>
			<h1 style="font-size: 5rem">{$licenseFetchRequest.error.status}</h1>
			<h2>{$licenseFetchRequest.error.message}</h2>
		</div>
	{:else}
		<!-- License header -->
		<div in:fade={{ duration: 300 }}>
			<LicenseHeader />
		</div>

		<!-- License fields -->
		<div tabIndex="-1" class="fields-grid" use:scrollShadow in:fade={{ duration: 300 }}>
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

<!-- Modals -->

{#if $applicationModalMode !== 'closed'}
	<ApplicationModal />
{/if}

{#if showWarningModal}
	<WarningModal
		warningText="Warning! This will delete the license and all its data. Are you sure?"
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
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		height: 100%;

		& > h2 {
			max-width: 80%;
			line-height: 1.7;
			word-wrap: break-word;
		}
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
