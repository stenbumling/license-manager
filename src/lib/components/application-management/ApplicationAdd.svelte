<script lang="ts">
	import ButtonSmall from '$lib/components/misc/buttons/ButtonSmall.svelte';
	import { applicationModalMode } from '$lib/stores/modal-store';
	import { application, applicationStore } from '$lib/stores/resources/application-store';
	import {
		applicationValidationError,
		validateApplication,
	} from '$lib/validations/application-validation';
	import Add from 'carbon-icons-svelte/lib/Add.svelte';
	import { fade } from 'svelte/transition';

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

<h3>Add new application</h3>
<div class="input-container">
	<input
		bind:value={$application.name}
		type="text"
		placeholder="Application name"
		required
		on:keyup={handleAdd}
	/>
	<ButtonSmall icon={Add} iconSize={32} action={handleAdd} />
</div>
<p class="warning-text">
	{#if $applicationValidationError.name}
		<span transition:fade={{ duration: 120 }}>{$applicationValidationError.name}</span>
	{/if}
</p>

<style>
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
