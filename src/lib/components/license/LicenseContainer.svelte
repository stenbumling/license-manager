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
	import LicenseMenu from '$lib/components/misc/LicenseMenu.svelte';
	import type { ContextMenuItem } from '$lib/stores/context-menu-store';
	import { contextMenu } from '$lib/stores/context-menu-store';
	import { license, licenseMode, licenseStore } from '$lib/stores/license-store.ts';
	import { modal, showApplicationModal } from '$lib/stores/modal-store';
	import { licenseErrors, validateLicense } from '$lib/validations/license-validation';
	import CloseLarge from 'carbon-icons-svelte/lib/CloseLarge.svelte';
	import Copy from 'carbon-icons-svelte/lib/Copy.svelte';
	import CopyLink from 'carbon-icons-svelte/lib/CopyLink.svelte';
	import TrashCan from 'carbon-icons-svelte/lib/TrashCan.svelte';

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
			action: () => contextMenu.deleteLicense($license),
			class: 'alert',
		},
	];

	async function handleLicense() {
		const isValid = await validateLicense($license);
		if (isValid) {
			if ($licenseMode === 'view') {
				licenseStore.updateLicense($license);
			} else if ($licenseMode === 'add') {
				licenseStore.add($license);
			}
			modal.closeLicense();
		} else {
			return;
		}
	}
</script>

{#if $showApplicationModal}
	<ApplicationModal />
{/if}

<div class="license-container">
	<!-- {#await promise}
		<div class="loading"><Circle color="var(--deep-purple)" /></div>
	{:then} -->
	<LicenseHeader />
	<div class="fields-grid" use:scrollShadow>
		<ApplicationSelection />
		<AssignedUsers />
		<ExpirationField />
		<SelectField
			bind:value={$license.category}
			label="Category"
			options={['Development', 'Media', 'Project Management', 'Educational', 'Uncategorized']}
			defaultOption="Uncategorized"
			errorMessage={$licenseErrors.category}
		/>
		<SelectField
			bind:value={$license.status}
			label="Status"
			options={['Active', 'Inactive', 'Expired']}
			defaultOption="Active"
			errorMessage={$licenseErrors.status}
		/>
		<TextField
			bind:value={$license.contactPerson}
			label="Contact person"
			errorMessage={$licenseErrors.contactPerson}
		>
			<TextField
				slot="secondary"
				bind:value={$license.additionalContactInfo}
				label="Additional contact information"
				type="secondary"
				errorMessage={$licenseErrors.additionalContactInfo}
			/>
		</TextField>
		<TextAreaField
			bind:value={$license.comment}
			label="Comment"
			errorMessage={$licenseErrors.comment}
		/>
	</div>
	<div class="bottom-container">
		{#if $licenseMode === 'view'}
			<LicenseMenu items={contextMenuItems} />
		{/if}
		<button class="main-button" on:click|preventDefault={handleLicense}>
			<ButtonLarge title={$licenseMode === 'add' ? 'Add new license' : 'Save changes'} />
		</button>
	</div>
	<!-- {:catch error}
		{#if error.message === 'License not found'}
			<p>License not found</p>
		{:else}
			<p>{error.message}</p>
		{/if}
	{/await} -->
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

	/* .loading {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
	} */

	.main-button {
		width: 16rem;
	}

	@media (max-width: 1400px) {
		.fields-grid {
			grid-template-columns: 1fr 1fr;
		}
	}
</style>
