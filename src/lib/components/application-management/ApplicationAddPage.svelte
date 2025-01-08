<script lang="ts">
	import PrimaryButton from '$lib/components/misc/buttons/PrimaryButton.svelte';
	import SecondaryButton from '$lib/components/misc/buttons/SecondaryButton.svelte';
	import { applicationModalView } from '$lib/stores/modal-store';
	import { applicationPostRequest } from '$lib/stores/request-state-store';
	import { applicationStore, currentApplication } from '$lib/stores/resources/application-store';
	import {
		applicationValidationError,
		validateApplication,
	} from '$lib/validations/application-validation';
	import { fade } from 'svelte/transition';

	async function handleAddApplication(e?: MouseEvent | KeyboardEvent) {
		if (e instanceof KeyboardEvent && e.key !== 'Enter') return;
		const isValid = await validateApplication($currentApplication);
		if (isValid) {
			const success = await applicationStore.add($currentApplication);
			if (success) {
				applicationStore.resetFields();
				applicationModalView.set('list');
				applicationStore.fetch();
			}
		}
	}

	function handleCancel() {
		applicationStore.resetFields();
		applicationModalView.set('list');
	}
</script>

<div class="application-add-container">
	<h2>Adding new application</h2>
	<div class="input-container">
		<h3 class="input-title">Name<span class="required">*</span></h3>
		<input
			bind:value={$currentApplication.name}
			type="text"
			placeholder="Application name"
			required
		/>
		<p class="warning-text">
			{#if $applicationValidationError.name}
				<span transition:fade={{ duration: 120 }}>{$applicationValidationError.name}</span>
			{/if}
		</p>
		<h3 class="input-title">Link to application website</h3>
		<input
			bind:value={$currentApplication.link}
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
			title={'Add application'}
			action={handleAddApplication}
			pendingRequest={$applicationPostRequest.isLoading}
		/>
	</div>
</div>

<style>
	.application-add-container {
		display: flex;
		flex-direction: column;
		flex-grow: 1;
		max-height: inherit;
	}

	.input-container {
		width: 100%;
		display: flex;
		flex-direction: column;
		overflow-y: auto;
		margin: 1.6rem 0 2rem 0;
	}

	.input-title {
		margin-bottom: 0.5rem;
	}

	.required {
		margin-left: 0.3rem;
		color: var(--color-alert-dark);
	}

	.warning-text {
		font-size: 0.75rem;
		color: var(--color-alert-dark);
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
		border-bottom: 1px solid var(--color-placeholder-text);
		box-sizing: border-box;
		background-color: transparent;
	}

	input:hover {
		padding-left: 0.6rem;
		border: 1px dashed black;
	}

	input:focus {
		padding-left: 0.6rem;
		border: 2px solid var(--color-secondary-purple);
		outline: none;
	}
</style>
