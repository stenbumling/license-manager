<script lang="ts">
	import { tooltip } from '$lib/actions/tooltip';
	import IconButton from '$lib/components/misc/buttons/IconButton.svelte';
	import { applicationModalMode } from '$lib/stores/modal-store';
	import { applicationFetchRequest } from '$lib/stores/request-state-store';
	import { applicationStore } from '$lib/stores/resources/application-store';
	import { currentLicense, licenseMode } from '$lib/stores/resources/license-store';
	import { licenseValidationErrors } from '$lib/validations/license-validation';
	import SettingsAdjust from 'carbon-icons-svelte/lib/SettingsAdjust.svelte';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	onMount(async () => {
		await applicationStore.fetch();
	});

	$: isLoading = $applicationFetchRequest.pendingRequests > 0 || $applicationFetchRequest.isLoading;
	$: hasError = $applicationFetchRequest.error?.message;
	$: noResults = $applicationStore.length === 0;
	$: hasApplications = $applicationStore.length > 0 && !isLoading && !hasError && !noResults;

	function handleApplicationChange(e: Event) {
		const target = e.target as HTMLSelectElement;
		const selectedAppId = target.value;
		const foundApp = $applicationStore.find((app) => app.id === selectedAppId);
		$currentLicense.application.name = foundApp ? foundApp.name : '';
		$currentLicense.application.link = foundApp ? foundApp.link : '';
	}
</script>

<div class="application-selection-container">
	<h3 class="application-selection-label">Application <span class="required">*</span></h3>
	<div class="application-selection-row">
		<select
			required
			disabled={!hasApplications}
			name="applications"
			class:select-add-mode={$licenseMode === 'add'}
			bind:value={$currentLicense.applicationId}
			on:change={handleApplicationChange}
		>
			{#if isLoading}
				<option disabled selected value="">Loading...</option>
			{:else if hasError}
				<option disabled selected value="">Error loading applications</option>
			{:else if noResults}
				<option disabled selected value="">No applications added yet</option>
			{:else if hasApplications}
				{#if $licenseMode === 'add'}
					<option disabled selected value="">Select an application</option>
				{/if}
				{#each $applicationStore as application}
					<option selected={application.id === $currentLicense.applicationId} value={application.id}
						>{application.name}</option
					>
				{/each}
			{/if}
		</select>
		<div
			use:tooltip={{
				content: 'Manage applications',
				options: { delay: [1000, 0], offset: [0, 15] },
			}}
		>
			<IconButton
				icon={SettingsAdjust}
				iconSize={20}
				action={() => applicationModalMode.set('list')}
			/>
		</div>
	</div>
	<p class="application-secondary-text">
		{#if $licenseValidationErrors.applicationId}
			<span class="warning-text" transition:fade={{ duration: 120 }}
				>{$licenseValidationErrors.applicationId}</span
			>
		{:else if $currentLicense.application.link && !isLoading && !hasError && !noResults}
			<a class="application-link" href={$currentLicense.application.link} target="_blank"
				>{$currentLicense.application.link.length > 100
					? $currentLicense.application.link.slice(0, 100) + '...'
					: $currentLicense.application.link}</a
			>
		{/if}
	</p>
</div>

<style>
	.application-selection-container {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		box-sizing: border-box;
		word-break: break-word;
		overflow-wrap: break-word;
	}

	.application-selection-label {
		margin-bottom: 0.4rem;
	}

	.application-selection-row {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.application-secondary-text {
		font-size: 0.75rem;
		min-height: 2.8rem;
		width: 90%;
		margin-left: 1px;
	}

	.application-link {
		color: var(--deep-purple);

		&:hover {
			text-decoration: underline;
		}
	}

	.required,
	.warning-text {
		color: red;
	}

	select {
		width: 100%;
		height: 3rem;
		border: none;
		border-bottom: 1px solid var(--text-placeholder);
		box-sizing: border-box;
		font-family: 'FK Grotesk Regular', Arial, Helvetica, sans-serif;
		background-color: transparent;
		appearance: none;
		margin-right: 1.4rem;
		padding-right: 1rem;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
	}

	select:hover {
		padding: 0 2.5rem 0rem 0.3rem;
		border: 1px dashed black;
		cursor: pointer;
		background-image: url('../../../images/icons/dropdown-arrow.svg');
		background-size: 1.5rem;
		background-repeat: no-repeat;
		background-position: right 10px center;
	}

	.select-add-mode {
		padding: 0 2.5rem 0rem 0.3rem;
		border: 1px dashed black;
		background-image: url('../../../images/icons/dropdown-arrow.svg');
		background-size: 1.5rem;
		background-repeat: no-repeat;
		background-position: right 10px center;
	}

	select:focus {
		padding: 0 2.5rem 0rem 0.3rem;
		border: 2px solid var(--light-purple);
		outline: none;
		background-image: url('../../../images/icons/dropdown-arrow.svg');
		background-size: 1.5rem;
		background-repeat: no-repeat;
		background-position: right 10px center;
	}

	select:required:invalid {
		color: gray;
	}

	option {
		font-style: normal;
		color: black;
	}

	option[value=''][disabled] {
		display: none;
	}
</style>
