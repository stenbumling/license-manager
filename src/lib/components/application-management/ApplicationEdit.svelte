<script lang="ts">
	import { applicationModalMode } from '$lib/stores/modal-store';
	import { applicationPostRequest } from '$lib/stores/request-state-store';
	import { application, applicationStore } from '$lib/stores/resources/application-store';
	import { license, licenseMode } from '$lib/stores/resources/license-store';
	import {
		applicationValidationError,
		validateApplication,
	} from '$lib/validations/application-validation';
	import { fade } from 'svelte/transition';
	import PrimaryButton from '../misc/buttons/PrimaryButton.svelte';
	import SecondaryButton from '../misc/buttons/SecondaryButton.svelte';

	const oldAppName = $application.name;

	async function handleEdit(e?: MouseEvent | KeyboardEvent) {
		if (e instanceof KeyboardEvent && e.key !== 'Enter') return;
		const isValid = await validateApplication($application);
		if (isValid) {
			const success = await applicationStore.edit($application);
			if (success) {
				applicationStore.resetFields();
				applicationModalMode.set('list');
				await applicationStore.fetch();
				updateApplicationNameInLicenseModalHeader();
			}
		}
	}

	function updateApplicationNameInLicenseModalHeader() {
		if ($license.application.name === oldAppName && $licenseMode === 'view') {
			license.set({
				...$license,
				application: { ...$license.application, name: $application.name },
			});
		}
	}

	function handleCancel() {
		applicationStore.resetFields();
		applicationModalMode.set('list');
	}
</script>

<div class="application-edit-container">
	<h2 class="title">Editing <span style="color: var(--deep-purple)">{oldAppName}</span></h2>
	<div class="input-container">
		<h3 style="margin-bottom:0.5rem;">Name<span class="required">*</span></h3>
		<input bind:value={$application.name} type="text" placeholder="Application name" required />
		<p class="warning-text">
			{#if $applicationValidationError.name}
				<span transition:fade={{ duration: 120 }}>{$applicationValidationError.name}</span>
			{/if}
		</p>
		<h3 style="margin-bottom:0.5rem;">Link to application website</h3>
		<input
			bind:value={$application.link}
			type="text"
			placeholder="https://www.example.com"
			required
		/>
		<p class="warning-text">
			{#if $applicationValidationError.link}
				<span transition:fade={{ duration: 120 }}>{$applicationValidationError.link}</span>
			{/if}
		</p>
	</div>
	<div class="button-container">
		<SecondaryButton title={'Cancel'} action={handleCancel} />
		<PrimaryButton
			title={'Edit application'}
			action={handleEdit}
			pendingRequest={$applicationPostRequest.isLoading}
		/>
	</div>
</div>

<style>
	.application-edit-container {
		display: flex;
		flex-direction: column;
		flex-grow: 1;
		max-height: inherit;
	}

	.title {
		margin-bottom: 1.6rem;
		overflow-wrap: break-word;
	}

	.input-container {
		width: 100%;
		display: flex;
		flex-direction: column;
		overflow-y: auto;
		margin-bottom: 2rem;
	}

	.required {
		margin-left: 0.3rem;
		color: red;
	}

	.warning-text {
		font-size: 0.75rem;
		color: red;
		margin-bottom: 2rem;
	}

	.button-container {
		display: flex;
		justify-content: flex-end;
		gap: 1rem;
		margin-top: auto;
	}

	input {
		font-family: 'FK Grotesk Regular', Arial, Helvetica, sans-serif;
		width: 100%;
		height: 3rem;
		border: none;
		border-bottom: 1px solid var(--text-placeholder);
		box-sizing: border-box;
		background-color: transparent;
	}

	input:hover {
		padding-left: 0.6rem;
		border: 1px dashed black;
	}

	input:focus {
		padding-left: 0.6rem;
		border: 2px solid var(--light-purple);
		outline: none;
	}
</style>
