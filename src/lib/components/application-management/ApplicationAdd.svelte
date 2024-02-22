<script lang="ts">
	import IconButton from '$lib/components/misc/buttons/IconButton.svelte';
	import { applicationModalMode } from '$lib/stores/modal-store';
	import { application, applicationStore } from '$lib/stores/resources/application-store';
	import {
		applicationValidationError,
		validateApplication,
	} from '$lib/validations/application-validation';
	import Add from 'carbon-icons-svelte/lib/Add.svelte';
	import { fade } from 'svelte/transition';
	import SecondaryButton from '../misc/buttons/SecondaryButton.svelte';
	import PrimaryButton from '../misc/buttons/PrimaryButton.svelte';

	async function handleAdd(e?: MouseEvent | KeyboardEvent) {
		if (e instanceof KeyboardEvent && e.key !== 'Enter') return;
		const isValid = await validateApplication($application);
		if (isValid) {
			applicationStore.add($application);
			applicationStore.reset();
			applicationModalMode.set('list');
		} else {
			return;
		}
	}
</script>

<div class="application-add-container">
	<h3 style="margin-bottom:0.5rem;">Add new application</h3>
	<div class="input-container">
		<input
			bind:value={$application.name}
			type="text"
			placeholder="Application name"
			required
			on:keyup={handleAdd}
		/>
	</div>
	<p class="warning-text">
		{#if $applicationValidationError.name}
			<span transition:fade={{ duration: 120 }}>{$applicationValidationError.name}</span>
		{/if}
	</p>
	<div class="button-container">
		<SecondaryButton title={'Go back'} action={() => applicationModalMode.set('list')} />
		<PrimaryButton title={'Add application'} action={handleAdd} />
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
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}

	.warning-text {
		font-size: 0.75rem;
		color: red;
		height: 2.8rem;
		margin-left: 1px;
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
		margin-right: 1.4rem;
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
