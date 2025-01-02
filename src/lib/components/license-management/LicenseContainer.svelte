<script lang="ts">
	import { scrollShadow } from '$lib/actions/scrollShadow';
	import LicenseFooter from '$lib/components/license-management/LicenseFooter.svelte';
	import LicenseHeader from '$lib/components/license-management/LicenseHeader.svelte';
	import ApplicationSelection from '$lib/components/license-management/fields/ApplicationSelectionField.svelte';
	import AssignedUsers from '$lib/components/license-management/fields/AssignedUsersField.svelte';
	import CostField from '$lib/components/license-management/fields/CostField.svelte';
	import ExpirationField from '$lib/components/license-management/fields/ExpirationDateField.svelte';
	import SelectionField from '$lib/components/license-management/fields/SelectionField.svelte';
	import TextAreaField from '$lib/components/license-management/fields/TextAreaField.svelte';
	import TextField from '$lib/components/license-management/fields/TextField.svelte';
	import CloseButton from '$lib/components/misc/buttons/CloseButton.svelte';
	import { modal } from '$lib/stores/modal-store';
	import { licenseFetchRequest } from '$lib/stores/request-state-store';
	import { currentLicense } from '$lib/stores/resources/license-store';
	import { licenseValidationErrors } from '$lib/validations/license-validation';
	import { Circle } from 'svelte-loading-spinners';
	import { fade } from 'svelte/transition';

	$: hasStartedRequest = $licenseFetchRequest.pendingRequests > 0;
	$: isLoading = $licenseFetchRequest.isLoading;
	$: hasError = $licenseFetchRequest.error?.message;
	$: hasLicense = $currentLicense.id && !isLoading && !hasError;
</script>

<div class="license-container">
	<!-- Loading and error fallback -->
	{#if hasStartedRequest || hasError}
		<div class="fallback-container">
			<div class="fallback-container-close-button">
				<CloseButton action={modal.closeLicense} />
			</div>
			{#if isLoading}
				<Circle color="var(--color-deep-purple)" />
			{:else if hasError}
				<h1>{$licenseFetchRequest.error?.status}</h1>
				<div class="fallback-error-details">
					<h2>{$licenseFetchRequest.error?.message}</h2>
					{#if $licenseFetchRequest.error?.details}
						<p>{$licenseFetchRequest.error.details}</p>
					{/if}
				</div>
			{/if}
		</div>
	{:else if hasLicense}
		<!-- License header -->
		<div in:fade={{ duration: 120 }}>
			<LicenseHeader />
		</div>

		<!-- License fields -->
		<div tabIndex="-1" class="fields-grid" use:scrollShadow in:fade={{ duration: 120 }}>
			<ApplicationSelection />
			<AssignedUsers />
			<ExpirationField />
			<SelectionField
				bind:value={$currentLicense.category}
				label="Category"
				options={['Development', 'Media', 'Project Management', 'Educational', 'Uncategorized']}
				defaultOption="Uncategorized"
				errorMessage={$licenseValidationErrors.category}
			/>
			<CostField />
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

		<!-- License footer -->
		<LicenseFooter />
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
		padding: 4rem 1rem 0 0;
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		grid-auto-rows: min-content;
		gap: 2rem 6rem;
		overflow-y: auto;
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
			gap: 1rem 6rem;
			grid-template-columns: 1fr;
		}
	}
</style>
